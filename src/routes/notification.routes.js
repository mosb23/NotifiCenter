const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const jwtBarrier = require('../middleware/auth.middleware').verifyToken;
const notificationController = require('../controllers/notification.controller');
const validate = require('../middleware/validate.middleware');
const { notificationSchema, updateSchema } = require('../validators/notification.validator');

router.post(
  '/upload',
  jwtBarrier,
  upload.single('file'),
  validate(notificationSchema),
  notificationController.uploadNotification
);

router.get('/search', jwtBarrier, notificationController.searchNotifications);
router.get('/', jwtBarrier, notificationController.getAllNotifications);
router.get('/:id', jwtBarrier, notificationController.getNotificationById);
router.delete('/:id', jwtBarrier, notificationController.deleteNotification);
router.put('/:id', jwtBarrier, validate(updateSchema), notificationController.updateNotification);

module.exports = router;
