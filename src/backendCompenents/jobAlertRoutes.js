const express = require('express');
const jobAlertController = require('./jobAlertController');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

// Create a new job alert
router.post('/', authMiddleware.authenticate, jobAlertController.createJobAlert);

// Get all job alerts for a user
router.get('/user/:userId', authMiddleware.authenticate, jobAlertController.getJobAlerts);

// Update a job alert
router.put('/:id', authMiddleware.authenticate, jobAlertController.updateJobAlert);

// Delete a job alert
router.delete('/:id', authMiddleware.authenticate, jobAlertController.deleteJobAlert);

module.exports = router;