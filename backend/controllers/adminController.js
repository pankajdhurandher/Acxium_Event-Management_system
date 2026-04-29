import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Request from '../models/Request.js';

/**
 * Admin Controller
 * Handles all admin management operations and system analytics
 */

/**
 * GET /api/admin/users
 * Get all users with role "user"
 *
 * HOW ADMIN MANAGES USERS:
 * 1. Admin sends GET request to fetch all regular users
 * 2. Controller queries all users with role "user"
 * 3. Returns list of users with their details
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsers = async (req, res) => {
  try {
    // ===== FETCH ALL REGULAR USERS =====
    const users = await User.find({ role: 'user' })
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 }); // Newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'All users retrieved successfully',
      count: users.length,
      users: users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get all users error:', error);

    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/vendors
 * Get all users with role "vendor"
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllVendors = async (req, res) => {
  try {
    // ===== FETCH ALL VENDORS =====
    const vendors = await User.find({ role: 'vendor' })
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 }); // Newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'All vendors retrieved successfully',
      count: vendors.length,
      vendors: vendors.map((vendor) => ({
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        role: vendor.role,
        createdAt: vendor.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get all vendors error:', error);

    res.status(500).json({
      success: false,
      message: 'Error retrieving vendors',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/all-users
 * Get all users (admin, vendor, user)
 * Can be filtered by role via query params
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllUsersAndVendors = async (req, res) => {
  try {
    // ===== OPTIONAL: ADD FILTERING =====
    // Get role filter from query params (e.g., /api/admin/all-users?role=vendor)
    const { role } = req.query;

    let query = {};
    if (role) {
      const validRoles = ['user', 'vendor', 'admin'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: `Role must be one of: ${validRoles.join(', ')}`,
        });
      }
      query.role = role;
    }

    // ===== FETCH ALL USERS =====
    const allUsers = await User.find(query)
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 }); // Newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'All users retrieved successfully',
      count: allUsers.length,
      users: allUsers.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get all users and vendors error:', error);

    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
    });
  }
};

/**
 * DELETE /api/admin/user/:id
 * Delete a user by ID
 *
 * HOW ADMIN DELETES USER:
 * 1. Admin sends DELETE request with user ID
 * 2. Controller validates user exists
 * 3. Deletes user from database
 * 4. Returns confirmation message
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ===== VALIDATION =====
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID',
      });
    }

    // ===== VERIFY USER EXISTS =====
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting admin users (optional security check)
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users',
      });
    }

    // ===== DELETE USER =====
    await User.findByIdAndDelete(id);

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: `User ${user.name} deleted successfully`,
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Delete user error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

/**
 * GET /api/admin/dashboard
 * Get admin dashboard summary
 *
 * HOW DASHBOARD DATA IS CALCULATED:
 * 1. Admin sends GET request to dashboard endpoint
 * 2. Controller queries all collections:
 *    - Count all users (role = "user")
 *    - Count all vendors (role = "vendor")
 *    - Count all products
 *    - Count all orders
 *    - Count all requests
 * 3. Returns aggregated statistics
 * 4. Admin can see system overview at a glance
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboard = async (req, res) => {
  try {
    // ===== FETCH AGGREGATED DATA =====
    // Count total users (role = "user")
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Count total vendors (role = "vendor")
    const totalVendors = await User.countDocuments({ role: 'vendor' });

    // Count total admins (role = "admin")
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Count total products
    const totalProducts = await Product.countDocuments();

    // Count total orders
    const totalOrders = await Order.countDocuments();

    // Count total requests
    const totalRequests = await Request.countDocuments();

    // ===== ADDITIONAL ANALYTICS =====
    // Count orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to object format
    const orderStats = {};
    ordersByStatus.forEach((stat) => {
      orderStats[stat._id] = stat.count;
    });

    // Count requests by status
    const requestsByStatus = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to object format
    const requestStats = {};
    requestsByStatus.forEach((stat) => {
      requestStats[stat._id] = stat.count;
    });

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      dashboard: {
        // User counts
        users: {
          total: totalUsers,
          vendors: totalVendors,
          admins: totalAdmins,
          regularUsers: totalUsers,
        },

        // System counts
        system: {
          totalProducts,
          totalOrders,
          totalRequests,
        },

        // Order statistics
        orders: {
          total: totalOrders,
          byStatus: orderStats,
        },

        // Request statistics
        requests: {
          total: totalRequests,
          byStatus: requestStats,
        },

        // Quick stats for dashboard cards
        summary: {
          totalUsers: totalUsers + totalVendors + totalAdmins,
          totalVendors,
          totalProducts,
          totalOrders,
          totalRequests,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);

    res.status(500).json({
      success: false,
      message: 'Error retrieving dashboard data',
      error: error.message,
    });
  }
};

export { getAllUsers, getAllVendors, getAllUsersAndVendors, deleteUser, getDashboard };
