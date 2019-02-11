import Job, {JOB_STATUSES, JOB_RESULTS} from '../models/job.model';
import logger from '../config/winston';

/**
 * Get remaining jobs before client's job
 * 
 * @param {*} jobId 
 */
export const getRemainingJobs = async (jobId) => {
    try {
        let totalRemainingJobs = await Job.query(function (qb) {
            qb.where('status', JOB_STATUSES.IN_QUEUE)
                .andWhere('id', '<=', jobId);
        }).count('id');

        return {
            success: true,
            totalRemainingJobs
        };
    } catch (err) {
        logger.error(err);
        return {
            success: false,
            error: err
        }
    }
};

/**
 * Get job result from database
 * 
 * @param {*} jobId 
 */
export const getJobResult = async (jobId) => {
    try {
        const job = await Job.forge({
            id: jobId
        }).fetch();

        if (!job) {
            return null;
        }

        return job;

    } catch (err) {
        logger.error(err);
        return null;
    }
};

/**
 * Update job status and output image path when image is processed
 *
 * @param jobId
 * @param outputImagePath
 * @param status
 * @param result
 * @param error
 * @returns {Promise<*>}
 */
export const updateJobStatus = async (
    jobId,
    outputImagePath,
    status,
    result,
    error
) => {
    try {
        let job = await Job.forge({id: jobId}).fetch({require: true});
        await job.save({
                output_image_path: outputImagePath,
                status: status,
                result: result,
                error: error
            });

        return {
            success: true
        }
    } catch(err) {
        return {
            success: false,
            error: err
        }
    }
};

/**
 * Remove non-processed job from database
 * 
 * @param {int} jobId 
 */
export const removeJob = async (jobId) => {
    try {
        await Job.forge().query((qb) => {
            qb.where('id', '=', jobId)
        }).destroy();

        logger.info(`Deleted job ${jobId}`);

    } catch (err) {
        logger.error(`There is an error when deleting non-processed job ${jobId}`);
        logger.error(err);
    }
};