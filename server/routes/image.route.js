import express from 'express';

import checkUploadExist from '../middlewares/checkUploadsExist';
import checkUploadRequest from '../middlewares/checkUploadRequest';
import * as imageCtrl from '../controllers/image.controller';

const router = express.Router();

router.route('/upload')
    .post(checkUploadExist, checkUploadRequest, (req, res) => {
        imageCtrl.upload(req, res);
    });

export default router;
