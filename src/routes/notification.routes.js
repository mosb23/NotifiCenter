const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const jwtBarrier = require('../middleware/auth.middleware').verifyToken;
const notificationController = require('../controllers/notification.controller');
const validate = require('../middleware/validate.middleware');
const { notificationSchema, updateSchema } = require('../validators/notification.validator');




router.post(
  '/notifications/upload',
  jwtBarrier,
  upload.single('file'),
  validate(notificationSchema),
  notificationController.uploadNotification
);

router.get('/notifications/search', jwtBarrier, notificationController.searchNotifications);
router.get('/notifications', jwtBarrier, notificationController.getAllNotifications);
router.get('/notifications/:id', jwtBarrier, notificationController.getNotificationById);
router.delete('/notifications/:id', jwtBarrier, notificationController.deleteNotification);
router.put('/notifications/:id', jwtBarrier, validate(updateSchema), notificationController.updateNotification);



module.exports = router;




