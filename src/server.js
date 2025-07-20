const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const config = require('./config/config');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./utils/db');
require('./utils/scheduler');
dotenv.config();

const apiRoutes = require('./routes/index.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ✅ Move CORS before any other middleware or routes
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use('/api', apiRoutes);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`🚀 Server running at http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

startServer();
