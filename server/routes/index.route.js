import express from 'express';

import imageRoutes from '../routes/image.route';

const router = express.Router();

router.use('/image', imageRoutes);

export default router;
