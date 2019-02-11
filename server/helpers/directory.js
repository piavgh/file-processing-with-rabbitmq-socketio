import fs from 'fs';
import path from 'path';
import moment from 'moment';

import directory from '../config/directory';
import logger from '../config/winston';
import {
    METRON_THINKING_FILE,
    METRON_ERROR_FILE
} from '../config/constants';

/**
 * Check if directory is existed
 *
 * @param dir
 */
export function isDirectoryExist(dir) {
    return new Promise((resolve, reject) => {
        fs.access(dir, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(false);
            }

            resolve(true);
        });
    });
}

/**
 * Create directory
 *
 * @param dir
 */
export function createUploadsDirectory(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

/**
 * Will copy file from "uploads" folder into "Input" folder of the desktop service
 *
 * @param imagePath
 * @param imageName
 */
export const copyFileToInputDirectory = (imagePath, imageName) => {
    if (fs.existsSync(imagePath)) {
        fs.copyFileSync(imagePath, path.resolve(directory.inputDir, imageName));
    }
};

/**
 * Delete file
 *
 * @param imagePath
 */
export const deleteFile = (imagePath) => {
    if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

/**
 * Read files in a directory
 * 
 * @param {string} dir 
 */
export const getFilesInDirectory = (dir) => {
    return fs.readdirSync(dir);
}

/**
 * Check if file name is existed in a folder
 * 
 * @param {string} directory 
 * @param {string} fileName 
 */
export const isFileExistInDirectory = (directory, fileName) => {
    return fs.existsSync(path.resolve(directory, fileName));
};

/**
 * Move file from "Output" folder to "processed_images" folder with the original input name
 * 
 * @param {string} filePath 
 * @param {string} fileName
 * 
 * @returns Public url of image
 */
export const moveFileToProcessedImagesDirectory = (filePath, fileName) => {

    if (!fs.existsSync(filePath)) {
        return;
    }

    if (!fs.existsSync(directory.processedImagesDir)) {
        fs.mkdirSync(directory.processedImagesDir);
    }

    const currentDate = getCurrentDate();
    const currentDateDirectory = path.resolve(directory.processedImagesDir, currentDate);

    if (!fs.existsSync(currentDateDirectory)) {
        fs.mkdirSync(currentDateDirectory);
    }

    fs.renameSync(filePath, path.resolve(currentDateDirectory, fileName));

    // Create the public url
    return `${process.env.OUTPUT_IMAGE_BASE_URL}/${currentDate}/${fileName}`;
}

/**
 * Check "Output" directory to see if file in job is processed
 *
 * @return {*}
 */
export const getOutputResult = () => {

    // Desktop service is processing the image
    if (isFileExistInDirectory(directory.outputDir, METRON_THINKING_FILE)) {
        return {
            processing: true,
            processed: false
        }
    }

    // There is error when image is being processed
    if (isFileExistInDirectory(directory.outputDir, METRON_ERROR_FILE)) {
        const errorFilePath = path.resolve(directory.outputDir, METRON_ERROR_FILE);
        const error = fs.readFileSync(errorFilePath, 'utf8');
        logger.error(error);

        // Delete Error.txt file after getting the error based on the requirement from Metron's document
        deleteFile(errorFilePath);

        return {
            processing: false,
            processed: true,
            error: error
        }
    }

    const outputFiles = getFilesInDirectory(directory.outputDir);

    if (outputFiles.length > 0) { // Folder "Output" contains only 1 newest processed image
        logger.info("Image is processed");
        return {
            processing: false,
            processed: true,
            error: null,
            outputFilePath: path.resolve(directory.outputDir, outputFiles[0])
        }
    }

    // Default case
    return {
        processing: false,
        processed: false
    }
};

/**
 * Get current date
 */
const getCurrentDate = () => {
    return moment().format('YYYY-MM-DD');
};

/**
 * Clean all files related to the failed job
 * 
 * @param {int} jobId
 * @param {string} imageName 
 */
export const removeFailedJobFiles = (jobId, imageName) => {
    try {
        deleteFile(path.resolve(directory.uploadDir, imageName));
        deleteFile(path.resolve(directory.inputDir, imageName));
        deleteFile(path.resolve(directory.outputDir, METRON_THINKING_FILE));
        deleteFile(path.resolve(directory.outputDir, METRON_ERROR_FILE));

        logger.info(`Deleted files for failed job ${jobId}`);

    } catch (err) {
        logger.error(`There is an error when deleting failed job ${jobId}`);
        logger.error(err);
    }
};

/**
 * Cleanup all files/folders inside a folder
 * @param {string} dirPath 
 */
export const cleanupDirectory = dirPath => {
    try {
        var files = fs.readdirSync(dirPath);

        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var filePath = path.resolve(dirPath, files[i]);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                } else {
                    rmDirSync(filePath);
                }
            }
        }
    } catch (e) {
        logger.error(e);
        return;
    }
};