import express from 'express';
import { signup, login, getMe } from '../controllers/authController.js';

const router = express.Router();

/**
 * Authentication Routes
 * All routes related to user authentication
 */

/**
 * POST /api/auth/signup
 * Register a new user
 * Body: { name, email, password, role (optional) }
 * Response: { success, message, user }
 */
router.post('/signup', signup);

/**
 * POST /api/auth/login
 * Login with email and password
 * Body: { email, password }
 * Response: { success, message, user }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Get current user details (protected - implement middleware later)
 * Response: { success, message, user }
 */
router.get('/me', getMe);

export default router;
