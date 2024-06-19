// src/routes/authRoutes.js
import { Router } from 'express';
import { registerUser, loginUser, getAuthenticatedUser } from './authController';
import { authenticate } from './authMiddleware';

const router = Router();

// User registration
router.post('/register', registerUser);

// User login
router.post('/login', loginUser);

// Get authenticated user
router.get('/me', authenticate, getAuthenticatedUser);

export default router;