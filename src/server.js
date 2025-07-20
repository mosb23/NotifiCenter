const dotenv = require('dotenv');
const express = require('express');
const swaggerUI = require('swagger-ui-express');


const config = require('./config/config');
dotenv.config();
const swaggerSpec = require('./config/swagger');


const connectDB = require('./utils/db');
require('./utils/scheduler');


const apiRoutes = require('./routes/index.routes');

const app = express();
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(express.json());
// app.use(express.static('public'));


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routes

app.use('/api', apiRoutes);


// Global error handler (catches any unhandled errors)
app.use(errorHandler);

// Connect to DB then start server
// connectDB()
//   .then(() => {
//     app.listen(config.port, () => {
//       console.log(`🚀 Server running at http://localhost:${config.port}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Failed to connect to MongoDB.');
//     console.error(err);
//     process.exit(1); 
//   });


//async function to connect to the database and start the server
// Database connection and server start
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
