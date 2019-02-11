const amqp = require('amqplib/callback_api');

import * as directoryHelper from '../helpers/directory';
import directory from '../config/directory';
import logger from '../config/winston';
import {sendToClient, sendRetryStatus} from '../config/socket';
import * as jobHelper from '../helpers/job';
import {JOB_STATUSES, JOB_RESULTS} from '../models/job.model';

const RABBITMQ_CONNECTION = process.env.RABBITMQ_CONNECTION;
const {
    QUEUE_NAME,
    REPLY_QUEUE_NAME,
    CHECK_RESULT_RETRY_PERIOD,
    MAXIMUM_NUMBER_RETRY_JOB,
    TIMEOUT_JOB_EXECUTION,
    UNKNOWN_ERROR
} = require('../config/constants');

let queueConnection, queueChannel;

/**
 * Sleep for {duration} milliseconds
 * 
 * @param {*} duration 
 */
const sleep = (duration) => {
    return new Promise(resolve => setTimeout(resolve, duration));
};

/**
 * Connect to queue
 */
export const connectToQueue = () => {
    return new Promise((resolve, reject) => {
        return amqp.connect(RABBITMQ_CONNECTION, function (err, conn) {
            if (err) {
                return reject(err);
            }

            logger.info(`Connected to RabbitMQ at: ${RABBITMQ_CONNECTION}`);
            queueConnection = conn;

            return conn.createChannel(function (err, ch) {
                if (err) {
                    reject(err);
                }

                queueChannel = ch;

                resolve();
            });
        });
    });
};

/**
 * Handle queue job: move file from "uploads" to "Input"
 * Checking for image processing is finished and notify queue job status
 *
 */
export const consumeMainQueue = () => {
    const mainQueue = QUEUE_NAME;

    queueChannel.assertQueue(mainQueue, {
        durable: true
    });

    // Only receive 1 job from the queue at a time
    queueChannel.prefetch(1);

    logger.info('Awaiting queue job requests');

    queueChannel.consume(mainQueue, processJob, {
        noAck: false
    });
};

/**
 * Handler for job coming from main queue
 *
 * @param msg
 * @return {Promise<void>}
 */
const processJob = async (msg) => {
    if (!msg) {
        return;
    }

    // Cleanup everything inside "Output" folder before processing a job
    directoryHelper.cleanupDirectory(directory.outputDir);

    let numberRetry = 0;
    let data;
    let jobId, job;

    try {
        job = JSON.parse(msg.content);
        jobId = parseInt(msg.properties.correlationId, 10);
    } catch (err) {
        logger.error(err);
        return;
    }

    // Get started time of job execution
    const startedTime = Date.now();

    while (numberRetry <= MAXIMUM_NUMBER_RETRY_JOB) {
        try {
            // Copy file from "uploads" folder into "Input" folder
            directoryHelper.copyFileToInputDirectory(job.imagePath, job.imageName);

            while (true) {
                // Get current time of job execution
                const currentTime = Date.now();
                let result;

                if (currentTime - startedTime > TIMEOUT_JOB_EXECUTION) {
                    result = {
                        processing: false,
                        processed: true,
                        error: UNKNOWN_ERROR
                    }
                } else {
                    // Listen on image processing result here
                    result = directoryHelper.getOutputResult();
                }

                if (!result.processing && result.processed) {

                    if (!result.error) {

                        // Move file from "Output" folder to "processed_images/{date}" folder
                        // And return public url of image
                        const outputFilePath = directoryHelper.moveFileToProcessedImagesDirectory(result.outputFilePath, job.imageName);

                        // Get output image path
                        data = {
                            success: true,
                            outputFilePath
                        };

                    } else {
                        data = {
                            success: false,
                            error: result.error,
                            job,
                            failedFlag: false
                        };
                    }

                    queueChannel.sendToQueue(
                        msg.properties.replyTo,
                        new Buffer(JSON.stringify(data)), {
                            correlationId: msg.properties.correlationId
                        }
                    );

                    queueChannel.ack(msg);

                    // Delete file in "uploads" folder
                    directoryHelper.deleteFile(job.imagePath);

                    return;
                }

                await sleep(CHECK_RESULT_RETRY_PERIOD);
            }
        } catch (err) {
            logger.error(err.message);

            numberRetry++;

            // Send retry status to client through socket
            sendRetryStatus(jobId);

            if (numberRetry > MAXIMUM_NUMBER_RETRY_JOB) {

                data = {
                    success: false,
                    error: err.message,
                    job,
                    failedFlag: true
                };

                queueChannel.sendToQueue(
                    msg.properties.replyTo,
                    new Buffer(JSON.stringify(data)),
                    {
                        correlationId: msg.properties.correlationId
                    }
                );

                queueChannel.ack(msg);

                return;
            }
        }
    }
};

/**
 * Handle image processing status from the consumer
 */
export const consumeReplyQueue = () => {
    // Create the reply queue
    queueChannel.assertQueue(REPLY_QUEUE_NAME, {durable: false});

    logger.info('Awaiting reply requests');

    queueChannel.consume(REPLY_QUEUE_NAME, processResult, {
        noAck: true
    });
};

/**
 * Handler for data returned back into reply queue
 *
 * @param msg
 * @return {Promise<void>}
 */
const processResult = async (msg) => {
    if (!msg) {
        return;
    }

    const jobId = parseInt(msg.properties.correlationId, 10); // We get back the processed job here

    const result = JSON.parse(msg.content);

    logger.info(`Job ${jobId} is processed`);

    if (result.success) {
        await handleSuccessJob(jobId, result.outputFilePath);

        sendToClient(jobId, result.outputFilePath, null);
    } else {
        // Mean that image is processed, but Metron returns error
        if (!result.failedFlag) {
            await handleErrorJob(jobId, result.job, result.error);
        } else { // Mean that image is failed to be processed
            await cleanupFailedJob(jobId, result.job);
        }
        
        sendToClient(jobId, null, result.error);
    }
};

/**
 * Add a new job to queue
 *
 * @param jobId
 * @param imageName
 * @param imagePath
 * @return {Promise<any>}
 */
export const addJobToQueue = (jobId, imageName, imagePath) => {
    return new Promise((resolve, reject) => {

        const mainQueue = QUEUE_NAME;

        const job = {
            jobId,
            imageName,
            imagePath
        };

        queueChannel.assertQueue(mainQueue, {
            durable: true
        });

        queueChannel.sendToQueue( // This function doesn't return anything in case of error
            mainQueue,
            new Buffer(JSON.stringify(job)),
            {
                persistent: true,
                correlationId: jobId.toString(), // correlation_id must be a string, if it's an integer, the sendToQueue function will fail without error
                replyTo: REPLY_QUEUE_NAME
            }
        );

        resolve();
    });
};

/**
 * Handle processed success jobs
 * @param {*} jobId 
 * @param {*} outputFilePath 
 */
const handleSuccessJob = async (jobId, outputFilePath) => {
    // Update job status in database
    const updateJobStatusResult = await jobHelper.updateJobStatus(
        jobId,
        outputFilePath,
        JOB_STATUSES.FINISHED,
        JOB_RESULTS.SUCCESS,
        null
    );

    if (!updateJobStatusResult.success) {
        logger.error(updateJobStatusResult.error);
    }
}

/**
 * Handle processed jobs, but the result is error
 * @param {*} jobId 
 * @param {*} job 
 * @param {*} error
 */
const handleErrorJob = async (jobId, job, error) => {
    // Update job status in database
    const updateJobStatusResult = await jobHelper.updateJobStatus(
        jobId,
        null,
        JOB_STATUSES.FINISHED,
        JOB_RESULTS.ERROR,
        error
    );

    if (!updateJobStatusResult.success) {
        logger.error(updateJobStatusResult.error);
    }

    // Remove unnecessary files in "uploads", "Input", "Output" folders if exist
    directoryHelper.removeFailedJobFiles(jobId, job.imageName);
};

/**
 * Cleanup failed job
 * 
 * @param {int} jobId 
 * @param {*} job 
 */
const cleanupFailedJob = async (jobId, job) => {
    // Remove job from database
    await jobHelper.removeJob(jobId);

    // Remove unnecessary files in "uploads", "Input", "Output" folders if exist
    directoryHelper.removeFailedJobFiles(jobId, job.imageName);
};