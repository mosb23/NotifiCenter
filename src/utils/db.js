const mongoose = require('mongoose');
const { mongoURI } = require('../config/config');

const connectDB = async (retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connected successfully');
      return; // ✅ exit if successful
    } catch (error) {
      console.error(`❌ Attempt ${attempt} - MongoDB connection failed:`, error.message);

      if (attempt < retries) {
        console.log(`🔁 Retrying in ${delay / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('❌ All connection attempts failed. Exiting...');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
