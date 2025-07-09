const mongoose = require('mongoose');

const cifSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    match: /^\d{8}$/ 
  }
});

const notificationSchema = new mongoose.Schema({
  schemaName: { type: String, required: true },
  campaignName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String] },
  cifs: [cifSchema],
  schedule: { type: Date, required: true },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent'],
    default: 'scheduled'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


module.exports = mongoose.model('Notification', notificationSchema);
