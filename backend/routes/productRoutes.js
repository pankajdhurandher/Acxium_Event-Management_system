import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductsByVendor,
  getProductById,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Product Routes
 * All routes related to product management
 */

/**
 * POST /api/products
 * Create a new product (vendor only)
 * Body: { name, price, description (optional), vendorId }
 * Response: { success, message, product }
 * Protected: Vendors only
 */
router.post('/', protect, authorize('vendor', 'admin'), createProduct);

/**
 * GET /api/products
 * Retrieve all products (public)
 * Response: { success, message, count, products }
 */
router.get('/', getAllProducts);

/**
 * GET /api/products/:productId
 * Retrieve a specific product by ID
 * Response: { success, message, product }
 */
router.get('/:productId', getProductById);

/**
 * GET /api/products/vendor/:vendorId
 * Retrieve all products from a specific vendor
 * Response: { success, message, vendor, count, products }
 *
 * NOTE: This route should be defined AFTER /:productId route
 * to avoid conflict with productId parameter
 */
router.get('/vendor/:vendorId', getProductsByVendor);

export default router;
