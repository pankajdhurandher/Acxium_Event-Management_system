import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from '../controllers/orderController.js';

const router = express.Router();

/**
 * Order Routes
 * All routes related to order management
 */

/**
 * POST /api/orders
 * Create a new order
 * Body: { userId, items (array), totalAmount }
 * Response: { success, message, order }
 */
router.post('/', createOrder);

/**
 * GET /api/orders
 * Get all orders (admin/vendor view)
 * Response: { success, message, count, orders }
 */
router.get('/', getAllOrders);

/**
 * GET /api/orders/details/:id
 * Get a specific order by ID
 * Response: { success, message, order }
 *
 * NOTE: This route should be defined BEFORE /:userId route
 * to avoid conflict with userId parameter
 */
router.get('/details/:id', getOrderById);

/**
 * GET /api/orders/:userId
 * Get all orders for a specific user
 * Response: { success, message, user, count, orders }
 */
router.get('/:userId', getUserOrders);

/**
 * PATCH /api/orders/:id
 * Update order status (admin/vendor)
 * Body: { status }
 * Response: { success, message, order }
 */
router.patch('/:id', updateOrderStatus);

export default router;
