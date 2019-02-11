import cron from 'node-cron';
import moment from 'moment';

import Job, {JOB_STATUSES} from '../models/job.model';
import logger from '../config/winston';
import {CRON_SCHEDULE, CLEANUP_DURATION} from '../config/constants';

cron.schedule(CRON_SCHEDULE, () => cleanDatabaseJobs());

const cleanDatabaseJobs = async () => {
    logger.info('Start cleaning up finished jobs daily at 2am!');

    const durationAgo = moment().subtract(CLEANUP_DURATION, 'hours')
                          .format('YYYY-MM-DD HH:mm:ss');

    try {
        await Job.forge().query((qb) => {
            qb.where('status', '=', JOB_STATUSES.FINISHED)
                .andWhere('updated_at', '<', durationAgo)
        }).destroy();

        logger.info("Clearning up finished jobs is completed");

    } catch (err) {
        logger.error("There is an error when clearning up finished jobs");
        logger.error(err);
    }
};