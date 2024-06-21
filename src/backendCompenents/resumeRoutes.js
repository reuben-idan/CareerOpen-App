// resumeRoutes.js
import express from 'express';
import { uploadResume, deleteResume, getResumeData } from './resumeController';

const router = express.Router();

router.post('/upload', uploadResume);
router.delete('/:id', deleteResume);
router.get('/:id', getResumeData);

export default router;