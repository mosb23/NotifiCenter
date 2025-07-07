const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const config = require('./config/config');
const authRoutes = require('./routes/auth.routes');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

dotenv.config();          
connectDB();              

const app = express();    

app.use(express.json());  
app.use('/api/auth', authRoutes);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const fileRoutes = require('./routes/upload.routes');
app.use('/api', fileRoutes);

const notificationRoutes = require('./routes/notification.routes');
app.use('/api', notificationRoutes);

app.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
});
