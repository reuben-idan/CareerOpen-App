const express = require('express');
const applicationController = require('./applicationController');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

// Apply for a job
router.post('/', authMiddleware.authenticate, applicationController.applyForJob);

// Get all user's applications
router.get('/', authMiddleware.authenticate, applicationController.getApplications);

// Get a single application
router.get('/:id', authMiddleware.authenticate, applicationController.getApplicationById);

// Update an application status
router.put('/:id', authMiddleware.authenticate, applicationController.updateApplicationStatus);

module.exports = router;