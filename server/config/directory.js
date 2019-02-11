require('dotenv').config();
const path = require('path');
const rootPath = path.normalize(__dirname + '/../..');

const directory = {
    root: rootPath,
    distDir: rootPath + '/dist',
    assetsDir: rootPath + '/public',
    uploadDir: path.isAbsolute(process.env.UPLOAD_PATH)
        ?
        process.env.UPLOAD_PATH
        :
        path.resolve(rootPath, process.env.UPLOAD_PATH),
    inputDir: path.isAbsolute(process.env.INPUT_FOLDER)
        ?
        process.env.INPUT_FOLDER
        :
        path.resolve(rootPath, process.env.INPUT_FOLDER),
    outputDir: path.isAbsolute(process.env.OUTPUT_FOLDER)
        ?
        process.env.OUTPUT_FOLDER
        :
        path.resolve(rootPath, process.env.OUTPUT_FOLDER),
    processedImagesDir: path.isAbsolute(process.env.PROCESSED_IMAGES_FOLDER)
        ?
        process.env.PROCESSED_IMAGES_FOLDER
        :
        path.resolve(rootPath, process.env.PROCESSED_IMAGES_FOLDER)
};

export default directory;

