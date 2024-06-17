const express = require('express');
const authController = require('./authController');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

// User registration
router.post('/register', authController.registerUser);

// User login
router.post('/login', authController.loginUser);

// Get authenticated user
router.get('/me', authMiddleware.authenticate, authController.getAuthenticatedUser);

module.exports = router;