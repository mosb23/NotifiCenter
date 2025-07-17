const dotenv = require('dotenv');
const express = require('express');
const config = require('./config/config');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./utils/db');
require('./utils/scheduler');

dotenv.config();

const app = express();

app.use(express.static('public'));

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const notificationRoutes = require('./routes/notification.routes');
app.use('/api', notificationRoutes);

const fileRoutes = require('./routes/upload.routes');
app.use('/api', fileRoutes);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Connect to DB then start server
connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`🚀 Server running at http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB.');
    console.error(err);
    process.exit(1); 
  });
