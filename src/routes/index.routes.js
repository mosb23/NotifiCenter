const express = require('express');
const router = express.Router();
const errorHandler = require('../middleware/errorHandler');
const authRoutes = require('./auth.routes');
const notificationRoutes = require('./notification.routes');
const fileRoutes = require('./upload.routes');

router.use('/', (req, res, next) => {
  // Optional: Add base API response or middleware
  //API Health Check
  //Rate Limiting
  // Common Headers
  next();
});

router.use('/auth', authRoutes);
router.use('/notification', notificationRoutes);
router.use('/upload', fileRoutes);
// You can add more routes here as your app grows



// Add error handler as the last middleware
router.use(errorHandler);

module.exports = router;