const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String] },
  cifs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CIF' }], // ✅ add this
  schedule: { type: Date, required: true },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent'],
    default: 'scheduled'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
