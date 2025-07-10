const mongoose = require('mongoose');

const cifSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
    match: /^\d{8}$/
  },
  hash: {
    type: String,
    required: true,
    unique: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('CIF', cifSchema);
