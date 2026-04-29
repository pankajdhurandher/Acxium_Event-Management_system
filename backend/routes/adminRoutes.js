import express from 'express';
import {
  getAllUsers,
  getAllVendors,
  getAllUsersAndVendors,
  deleteUser,
  getDashboard,
} from '../controllers/adminController.js';

const router = express.Router();

/**
 * Admin Routes
 * All routes related to admin management and analytics
 * In production, these routes should be protected by admin authentication middleware
 */

/**
 * GET /api/admin/users
 * Get all regular users
 * Response: { success, message, count, users }
 */
router.get('/users', getAllUsers);

/**
 * GET /api/admin/vendors
 * Get all vendors
 * Response: { success, message, count, vendors }
 */
router.get('/vendors', getAllVendors);

/**
 * GET /api/admin/all-users
 * Get all users (admin, vendor, user)
 * Query params: ?role=vendor (optional filter by role)
 * Response: { success, message, count, users }
 */
router.get('/all-users', getAllUsersAndVendors);

/**
 * GET /api/admin/dashboard
 * Get admin dashboard with system statistics
 * Response: { success, message, dashboard }
 */
router.get('/dashboard', getDashboard);

/**
 * DELETE /api/admin/user/:id
 * Delete a user by ID (not allowed for admin users)
 * Response: { success, message, deletedUser }
 */
router.delete('/user/:id', deleteUser);

export default router;
