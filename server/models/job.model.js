import bookshelf from '../config/bookshelf';

export const JOB_STATUSES = {
    IN_QUEUE: 1,
    FINISHED: 2
};

export const JOB_RESULTS = {
    SUCCESS: 1,
    ERROR: 2
};

/**
 * Job model.
 */
class Job extends bookshelf.Model {

    get tableName() {
        return 'jobs';
    }

    get hasTimestamps() {
        return true;
    }
}

export default Job;
