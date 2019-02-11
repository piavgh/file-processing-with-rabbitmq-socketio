import path from 'path';
import uuidv4 from 'uuid/v4';
import * as HttpStatus from 'http-status-codes';

import directory from '../config/directory';
import Job, {JOB_STATUSES} from '../models/job.model';
import {addJobToQueue} from '../helpers/queue';
import bookshelf from '../config/bookshelf';
import logger from '../config/winston';

export const upload = async (req, res) => {
    const uploadsDir = directory.uploadDir;

    // "image" is the input field at frontend
    let image = req.files.image;

    // Prevent image loss in case 2 users upload a same file name in a same period.
    const randomString = uuidv4();
    const newFilename = `${randomString}_${image.name}`;

    let imagePath = path.resolve(uploadsDir, newFilename);

    // Use the mv() method to place the file in the "uploads" folder
    const err = await image.mv(imagePath);
    if (err) {
        logger.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: err
        });
    }

    try {
        const job = await bookshelf.transaction(async function (t) {
            // Create new record in "jobs" table
            const job = await Job.forge({
                input_image_path: imagePath,
                status: JOB_STATUSES.IN_QUEUE
            }, {
                hasTimestamps: true
            }).save(null, {transacting: t});

            // Create job and push into queue
            await addJobToQueue(
                job.id,
                newFilename,
                imagePath
            );

            return job;
        });

        res.json({
            success: true,
            data: {
                jobId: job.id // Return back the jobId to client
            }
        });

    } catch (err) {
        logger.error(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: err
        });
    }
};
