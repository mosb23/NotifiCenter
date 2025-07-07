const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const jwtBarrier = require('../middleware/auth.middleware').verifyToken;
const notificationController = require('../controllers/notification.controller');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { notificationSchema, updateSchema } = require('../validators/notification.validator');


/**
 * @swagger
 * /api/notifications/upload:
 *   post:
 *     summary: Upload an Excel file with CIFs and create a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - schemaName
 *               - campaignName
 *               - title
 *               - content
 *               - schedule
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file containing 8-digit CIFs
 *               schemaName:
 *                 type: string
 *                 example: PromotionList2025
 *               campaignName:
 *                 type: string
 *                 example: Summer Promo
 *               title:
 *                 type: string
 *                 example: Big Summer Discounts!
 *               content:
 *                 type: string
 *                 example: Enjoy 30% off all services this month.
 *               tags:
 *                 type: string
 *                 example: promo,sms,july
 *               schedule:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-15T14:00:00Z
 *               status:
 *                 type: string
 *                 enum: [draft, scheduled, sent]
 *                 example: scheduled
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Bad request or missing fields
 *       500:
 *         description: Server error
 */
router.post(
  '/notifications/upload',
  jwtBarrier,
  upload.single('file'),
  validate(notificationSchema),
  notificationController.uploadNotification
);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications for the logged-in user (paginated)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default: 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page (default: 10)
 *     responses:
 *       200:
 *         description: Paginated list of notifications
 *       401:
 *         description: Unauthorized
 */
router.get('/notifications', jwtBarrier, notificationController.getAllNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get a specific notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification data
 *       404:
 *         description: Notification not found
 */
router.get('/notifications/:id', jwtBarrier, notificationController.getNotificationById);

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Update a notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               schedule:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, scheduled, sent]
 *     responses:
 *       200:
 *         description: Notification updated
 *       404:
 *         description: Notification not found
 */
router.put('/notifications/:id', jwtBarrier, validate(updateSchema), notificationController.updateNotification);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted
 *       404:
 *         description: Notification not found
 */
router.delete('/notifications/:id', jwtBarrier, notificationController.deleteNotification);

module.exports = router;
