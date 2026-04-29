import Order from '../models/Order.js';
import User from '../models/User.js';

/**
 * Order Controller
 * Handles all order-related operations
 */

/**
 * POST /api/orders
 * Create a new order
 *
 * HOW USER PLACES ORDER:
 * 1. User sends POST request with userId, items array, and totalAmount
 * 2. Controller validates all required fields
 * 3. Controller checks if user exists
 * 4. Creates order with "placed" status
 * 5. Returns order confirmation with order ID and details
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    // ===== VALIDATION =====
    // Check if all required fields are provided
    if (!userId || !items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId, items, and totalAmount',
      });
    }

    // Validate items is an array
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array',
      });
    }

    // Validate items array is not empty
    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // Validate each item has required fields
    for (let item of items) {
      if (!item.productId || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message:
            'Each item must have productId, name, price, and quantity',
        });
      }

      if (item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1',
        });
      }
    }

    // Validate totalAmount is a positive number
    if (typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Total amount must be a positive number',
      });
    }

    // ===== VERIFY USER EXISTS =====
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ===== CREATE ORDER =====
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      status: 'placed', // Default status
    });

    // Save order to database
    await newOrder.save();

    // ===== POPULATE USER DETAILS =====
    await newOrder.populate('userId', 'name email');

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: {
        id: newOrder._id,
        userId: newOrder.userId._id,
        userName: newOrder.userId.name,
        items: newOrder.items,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(', ');
      return res.status(400).json({
        success: false,
        message,
      });
    }

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};

/**
 * GET /api/orders/:userId
 * Get all orders for a specific user
 *
 * HOW USER VIEWS THEIR ORDERS:
 * 1. User sends GET request with their userId
 * 2. Controller retrieves all orders for that user
 * 3. Returns orders sorted by newest first
 * 4. Each order shows items, total, and status
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    // ===== VALIDATION =====
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID',
      });
    }

    // ===== VERIFY USER EXISTS =====
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // ===== FETCH USER ORDERS =====
    const orders = await Order.find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: `Orders for user ${user.name} retrieved successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      count: orders.length,
      orders: orders.map((order) => ({
        id: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get user orders error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error retrieving user orders',
      error: error.message,
    });
  }
};

/**
 * GET /api/orders
 * Get all orders (admin/vendor view)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllOrders = async (req, res) => {
  try {
    // ===== FETCH ALL ORDERS =====
    // In a real app, you'd check if user is admin before allowing this
    const orders = await Order.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 }); // Newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'All orders retrieved successfully',
      count: orders.length,
      orders: orders.map((order) => ({
        id: order._id,
        user: {
          id: order.userId._id,
          name: order.userId.name,
          email: order.userId.email,
        },
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get all orders error:', error);

    res.status(500).json({
      success: false,
      message: 'Error retrieving orders',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/orders/:id
 * Update order status
 *
 * HOW ADMIN/VENDOR UPDATES ORDER:
 * 1. Admin/Vendor sends PATCH request with order ID and new status
 * 2. Controller validates status is valid enum value
 * 3. Updates order status in database
 * 4. Returns updated order with new status
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ===== VALIDATION =====
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status',
      });
    }

    // Validate status is one of allowed values
    const validStatuses = ['placed', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // ===== FIND AND UPDATE ORDER =====
    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true } // new: true returns updated document
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        id: order._id,
        userId: order.userId._id,
        userName: order.userId.name,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update order status error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

/**
 * GET /api/orders/details/:id
 * Get a single order by ID (optional but useful)
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // ===== FETCH ORDER =====
    const order = await Order.findById(id).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      order: {
        id: order._id,
        user: {
          id: order.userId._id,
          name: order.userId.name,
          email: order.userId.email,
        },
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get order error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error retrieving order',
      error: error.message,
    });
  }
};

export { createOrder, getUserOrders, getAllOrders, updateOrderStatus, getOrderById };
