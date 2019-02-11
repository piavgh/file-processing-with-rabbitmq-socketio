import directory from '../config/directory';
import {isDirectoryExist, createUploadsDirectory} from '../helpers/directory';

/**
 * Check if "uploads" folder is existed. If not, create new folder "uploads"
 *
 * @param req
 * @param res
 * @param next
 * @return {Promise<void>}
 */
export default async (req, res, next) => {
    const uploadsDir = directory.uploadDir;

    // Check if folder "uploads" existed
    const result = await isDirectoryExist(uploadsDir);
    if (!result) {
        createUploadsDirectory(uploadsDir);
    }

    next();
};
