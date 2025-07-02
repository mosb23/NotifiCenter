// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const jwtBarrier = require('../middleware/auth.middleware').verifyToken;


router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', jwtBarrier, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: req.user, // info from the token payload
  });
})
module.exports = router;
