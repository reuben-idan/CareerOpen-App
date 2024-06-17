const express = require('express');
const analyticsController = require('./analyticsController');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

// Get dashboard data
router.get('/dashboard/:userId', authMiddleware.authenticate, analyticsController.getDashboardData);

// Get application analytics
router.get('/applications/:userId', authMiddleware.authenticate, analyticsController.getApplicationAnalytics);

// Other analytics-related routes...

module.exports = router;