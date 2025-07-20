/**
 * @swagger
 * /notifications/upload:
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
 *               - title
 *               - content
 *               - schedule
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file containing 8-digit CIFs
 
 *                 example: PromotionList2025
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


/**
 * @swagger
 * /notifications:
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
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: "Items per page (default: 10)"
 *     responses:
 *       200:
 *         description: Paginated list of notifications
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /notifications/{id}:
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



/**
 * @swagger
 * /notifications/{id}:
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



/**
 * @swagger
 * /notifications/{id}:
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


/**
 * @swagger
 * /notifications/search:
 *   get:
 *     summary: Search notifications by tag, schema name, campaign name, or title
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query to match against  title, or tags
 *     responses:
 *       200:
 *         description: Array of matching notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Missing or invalid query
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
