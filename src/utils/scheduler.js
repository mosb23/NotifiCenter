const cron = require('node-cron');
const Notification = require('../models/notification.model');

function printNotificationDetails(notification) {
  console.log(`📄 Title: ${notification.title}`);
  console.log(`📝 Content: ${notification.content}`);
  console.log(`🏷️ Tags: ${notification.tags}`);
  console.log(`📅 Scheduled At: ${notification.schedule}`);
  console.log(`📦 Status: ${notification.status}`);
  console.log('---');
}




cron.schedule('* * * * *', async () => {
  try {
    console.log('🔍 Checking for scheduled notifications...');

    const now = new Date();

    const notifications = await Notification.find({
      schedule: { $lte: now },
      status: 'scheduled' 
    });

    if (notifications.length > 0) {
      console.log(`🔔 Found ${notifications.length} notification(s) due:`);

      for (const notification of notifications) {
        console.log(`📤 Notification: "${notification.title}" scheduled at ${notification.schedule}`);
        printNotificationDetails(notification);

        notification.status = 'sent';
        await notification.save();
      }
    } else {
      console.log('✅ No notifications due right now.');
    }

    console.log('⏱️ Notification check complete.\n');
  } catch (error) {
    console.error('❌ Error in cron job:', error.message);
  }
});
