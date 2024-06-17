const express = require('express');
const jobController = require('./jobController');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

// Create a new job
router.post('/', authMiddleware.authenticate, jobController.createJob);

// Get all jobs
router.get('/', jobController.getJobs);

// Get a single job
router.get('/:id', jobController.getJobById);

// Update a job
router.put('/:id', authMiddleware.authenticate, jobController.updateJob);

// Delete a job
router.delete('/:id', authMiddleware.authenticate, jobController.deleteJob);

module.exports = router;