const jwt = require('jsonwebtoken');

const jwtBarrier = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, 'yourSecretKey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.user = decoded; // store payload info in req.user
    next();
  });
};

module.exports = jwtBarrier;
