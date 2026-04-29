import express from 'express';
import {
  createRequest,
  getAllRequests,
  getUserRequests,
  updateRequestStatus,
  getRequestById,
} from '../controllers/requestController.js';

const router = express.Router();

/**
 * Request Routes
 * All routes related to item request management
 */

/**
 * POST /api/requests
 * Create a new request for an item
 * Body: { userId, itemName, description (optional) }
 * Response: { success, message, request }
 */
router.post('/', createRequest);

/**
 * GET /api/requests
 * Get all requests (admin/vendor view)
 * Query params: ?status=pending (optional filter by status)
 * Response: { success, message, count, requests }
 */
router.get('/', getAllRequests);

/**
 * GET /api/requests/details/:id
 * Get a specific request by ID
 * Response: { success, message, request }
 *
 * NOTE: This route should be defined BEFORE /:userId route
 * to avoid conflict with userId parameter
 */
router.get('/details/:id', getRequestById);

/**
 * GET /api/requests/:userId
 * Get all requests made by a specific user
 * Response: { success, message, user, count, requests }
 */
router.get('/:userId', getUserRequests);

/**
 * PATCH /api/requests/:id
 * Update request status (approve/reject)
 * Body: { status, comments (optional) }
 * Response: { success, message, request }
 */
router.patch('/:id', updateRequestStatus);

export default router;
