import app from './express';
import * as jobHelper from '../helpers/job';
import logger from '../config/winston';
import {SOCKET_EVENTS, UNKNOWN_ERROR} from '../config/constants';
import {JOB_STATUSES, JOB_RESULTS} from '../models/job.model';

const http = require('http').Server(app);
const io = require('socket.io')(http);

let clients = {};

io.on(SOCKET_EVENTS.CONNECTION, function (socket) {
    logger.info(`a user connected: ${socket.id}`);

    socket.on(SOCKET_EVENTS.RECEIVE_JOB_ID, (jobId) => handleReceiveJobId(socket, jobId));

    socket.on(SOCKET_EVENTS.DISCONNECT, () => handleClientDisconnect(socket));
});

/**
 * Handle when client sends jobId
 * Also handle case when client reconnects
 * 
 * @param {*} socket 
 * @param {*} jobId 
 */
const handleReceiveJobId = async (socket, jobId) => {

    const job = await jobHelper.getJobResult(jobId);

    // If job is finished, return back the result to client
    if (job && job.attributes.status === JOB_STATUSES.FINISHED) {
        switch (job.attributes.result) {
            case JOB_RESULTS.SUCCESS:
                return socket.emit(SOCKET_EVENTS.IMAGE_PROCESSED, job.attributes.output_image_path);
            case JOB_RESULTS.ERROR:
                return socket.emit(SOCKET_EVENTS.IMAGE_PROCESSED_ERROR, job.attributes.error);
            default:
                return socket.emit(SOCKET_EVENTS.IMAGE_PROCESSED_ERROR, UNKNOWN_ERROR);
        }
    }

    // Store mapping between socket and jobId
    clients[jobId] = socket;

    // Get total remaining jobs before client's job
    const result = await jobHelper.getRemainingJobs(jobId);
    if (result.success) {
        socket.emit(SOCKET_EVENTS.REMAINING_JOBS, result.totalRemainingJobs);
    } else {
        socket.emit(SOCKET_EVENTS.REMAINING_JOBS, result.error);
    }
};

/**
 * Handle client disconnection
 * 
 * @param {*} socket 
 */
const handleClientDisconnect = (socket) => {
    logger.info(`user disconnected ${socket.id}`);
    const jobId = getKeyByValue(clients, socket);
    delete clients[jobId];
};

/**
 * Find object key by value
 * 
 * @param object 
 * @param {string} value 
 */
const getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
};

/**
 * This function is used to send the output image path to frontend from queue consumer
 * 
 * @param {int} jobId 
 * @param {string} outputFilePath 
 * @param {object} error 
 */
export const sendToClient = (jobId, outputFilePath = null, error = null) => {
    // Find socket based on JobId sent from client
    const socket = clients[jobId];
    if (socket) {
        if (!error) {
            socket.emit(SOCKET_EVENTS.IMAGE_PROCESSED, outputFilePath);
        } else {
            socket.emit(SOCKET_EVENTS.IMAGE_PROCESSED_ERROR, error);
            logger.error(error);
        }

        // Notify all other clients so they know and update progress about number of waiting jobs
        socket.broadcast.emit(SOCKET_EVENTS.IMAGE_JOB_FINISH);
    } else {
        io.emit(SOCKET_EVENTS.IMAGE_JOB_FINISH);
    }
};

/**
 * Tell client that it's job is being retried
 * 
 * @param {int} jobId 
 */
export const sendRetryStatus = (jobId) => {
    // Find socket based on JobId sent from client
    const socket = clients[jobId];

    if (socket) {
        socket.emit(SOCKET_EVENTS.JOB_RETRYING);
    }
};

export {http};