const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/db'); 

connectDB(); 

app.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
});
