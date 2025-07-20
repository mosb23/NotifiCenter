const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const jwtBarrier = require('../middleware/auth.middleware').verifyToken;

// Routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', jwtBarrier, authController.profile);

module.exports = router;