export const QUEUE_NAME = 'metron_cloud_file_upload_queue';
export const REPLY_QUEUE_NAME = 'metron_cloud_reply_queue';
export const CHECK_RESULT_RETRY_PERIOD = 500;
export const MAXIMUM_NUMBER_RETRY_JOB = 3;

export const SUPPORTED_FILE_EXTENSIONS = [
    'jpg',
    'jpeg',
    'bmp',
    'tif',
    'tiff',
    'png'
];

export const SOCKET_EVENTS = {
    CONNECTION: 'connection',
    RECEIVE_JOB_ID: 'receive_job_id',
    REMAINING_JOBS: 'remaining_jobs',
    IMAGE_PROCESSED: 'image_processed',
    IMAGE_PROCESSED_ERROR: 'image_processed_error',
    IMAGE_JOB_FINISH: 'image_job_finish',
    JOB_RETRYING: 'job_retrying',
    DISCONNECT: 'disconnect'
};

export const UNKNOWN_ERROR = 'Something went wrong on our server. Please try again later!';

export const CRON_SCHEDULE = '0 2 * * *';
export const CLEANUP_DURATION = 1; //Check and only delete jobs that older than {CLEANUP_DURATION} hours ago

export const METRON_THINKING_FILE = 'Thinking.txt';
export const METRON_ERROR_FILE = 'Error.txt';

export const TIMEOUT_JOB_EXECUTION = 60 * 1000; // = 60s => Maximum time to execute a job
