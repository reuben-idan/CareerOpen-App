const express = require('express');
const authRoutes = require('../auth/authRoutes');
const userRoutes = require('../user/userRoutes');
const jobAlertRoutes = require('../jobAlert/jobAlertRoutes');
const applicationRoutes = require('../application/applicationRoutes');
const paymentRoutes = require('../payment/paymentRoutes');
const analyticsRoutes = require('../analytics/analyticsRoutes');

const router = express.Router();

// Authentication routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Job alert routes
router.use('/job-alerts', jobAlertRoutes);

// Application routes
router.use('/applications', applicationRoutes);

// Payment routes
router.use('/payments', paymentRoutes);

// Analytics routes
router.use('/analytics', analyticsRoutes);

// Other API routes can be added here

module.exports = router;