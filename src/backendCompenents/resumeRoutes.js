const express = require('express');
const resumeController = require('./resumeController');
const authMiddleware = require('../auth/authMiddleware');

const router = express.Router();

// Create a new resume
router.post('/', authMiddleware.authenticate, resumeController.createResume);

// Get all user's resumes
router.get('/', authMiddleware.authenticate, resumeController.getResumes);

// Get a single resume
router.get('/:id', authMiddleware.authenticate, resumeController.getResumeById);

// Update a resume
router.put('/:id', authMiddleware.authenticate, resumeController.updateResume);

// Delete a resume
router.delete('/:id', authMiddleware.authenticate, resumeController.deleteResume);

module.exports = router;