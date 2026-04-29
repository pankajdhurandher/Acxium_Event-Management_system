import express from 'express';
import { getHome, getHealth } from '../controllers/indexController.js';

const router = express.Router();

/**
 * BASIC ROUTES
 * Add your API routes here
 */

// Test route
router.get('/', getHome);

// Health check route
router.get('/health', getHealth);

/**
 * ADD MORE ROUTES BELOW
 * Example:
 * 
 * import userRoutes from './userRoutes.js';
 * import productRoutes from './productRoutes.js';
 * 
 * router.use('/api/users', userRoutes);
 * router.use('/api/products', productRoutes);
 */

export default router;
