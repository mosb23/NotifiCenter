const { parentPort } = require('worker_threads');
const mongoose = require('mongoose');
const User = require('../models/user.model'); 
const { mongoURI } = require('../config/config'); 

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoURI);
  }
}

parentPort.on('message', async (batch) => {
  try {
    await connectDB();
    await User.insertMany(batch);
    parentPort.postMessage({ success: true, count: batch.length });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
});
