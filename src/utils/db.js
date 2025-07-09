const mongoose = require('mongoose');
const config = require('../config/config'); // load env

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('✅ MongoDB Atlas Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


