import fs from 'fs';
import winston, {format} from 'winston';
import 'winston-daily-rotate-file';

const LOG_DIR = process.env.LOG_DIR || 'logs';
const LOG_LEVEL_INFO = process.env.LOG_LEVEL_INFO || 'info';
const LOG_LEVEL_ERROR = process.env.LOG_LEVEL_ERROR || 'error';

// Create logs directory if it does not exist
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: format.combine(format.colorize(), format.simple()),
            level: LOG_LEVEL_INFO
        }),
        new winston.transports.DailyRotateFile({
            format: format.combine(format.timestamp(), format.json()),
            maxFiles: '14d',
            dirname: LOG_DIR,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            filename: 'info-log-%DATE%.log',
            level: LOG_LEVEL_INFO
        }),
        new winston.transports.DailyRotateFile({
            format: format.combine(format.timestamp(), format.json()),
            maxFiles: '14d',
            dirname: LOG_DIR,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            filename: 'error-log-%DATE%.log',
            level: LOG_LEVEL_ERROR
        })
    ]
});

export default logger;
