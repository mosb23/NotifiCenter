const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NotifiCenter API',
      version: '1.0.0',
      description: 'API documentation for your JWT authentication and notification system',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis:[
    // path.join(__dirname, '../routes/*.js'),       // Route-level annotations
    path.join(__dirname, '../docs/*.docs.js'),
  ], 

};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
