const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const config = require('./config/config');
const authRoutes = require('./routes/auth.routes');

dotenv.config();          
connectDB();              

const app = express();    

app.use(express.json());  
app.use('/api/auth', authRoutes);  

app.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
});
