const express = require('express');
const router = express.Router();
const errorHandler = require('../middleware/errorHandler');
const authRoutes = require('./auth.routes');
const notificationRoutes = require('./notification.routes');
const fileRoutes = require('./upload.routes');



router.use('/auth', authRoutes);
router.use('/notifications', notificationRoutes);
router.use('/upload', fileRoutes);



router.use(errorHandler);

module.exports = router;