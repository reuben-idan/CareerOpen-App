import { Router } from 'express';
import authRoutes from '../auth/authRoutes';
import userRoutes from '../user/userRoutes';
import jobAlertRoutes from '../jobAlert/jobAlertRoutes';
import applicationRoutes from '../application/applicationRoutes';
import paymentRoutes from '../payment/paymentRoutes';
import analyticsRoutes from '../analytics/analyticsRoutes';

const router = Router();

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

export default router;