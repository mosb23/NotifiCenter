const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const jwtBarrier = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Token expired. Please login again.'
          : 'Invalid token.';

      return res.status(403).json({ message, error: err.message });
    }

    req.user = decoded;
    next();
  });
};

module.exports = jwtBarrier;
