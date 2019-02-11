import { SUPPORTED_FILE_EXTENSIONS } from '../config/constants';

/**
 * Check if upload POST request is valid
 *
 * @param req
 * @param res
 * @param next
 */
export default (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({
            success: false,
            error: 'No files were uploaded.'
        });
    }

    // Handle case when client sends blob data instead of file object
    // Client will send a "fileName" attribute
    if (req.files.image.name === 'blob') {
        req.files.image.name = req.body.fileName;
    }

    // Get uploaded file extension
    const fileExtension = req.files.image.name
        .split('.')
        .pop()
        .toLowerCase();

    if (!SUPPORTED_FILE_EXTENSIONS.includes(fileExtension)) {
        return res.status(400).json({
            success: false,
            error:
                'Only support .jpg, .jpeg, .png, .bmp, .tif, tiff'
        });
    }

    next();
};
