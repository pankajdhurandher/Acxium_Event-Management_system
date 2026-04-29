import Request from '../models/Request.js';
import User from '../models/User.js';

/**
 * Request Controller
 * Handles all request-related operations (item requests from users)
 */

/**
 * POST /api/requests
 * Create a new request for an item
 *
 * HOW USER CREATES REQUEST:
 * 1. User sends POST request with userId, itemName, and description
 * 2. Controller validates all required fields
 * 3. Controller checks if user exists
 * 4. Creates request with "pending" status
 * 5. Returns request confirmation with request ID
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createRequest = async (req, res) => {
  try {
    const { userId, itemName, description } = req.body;

    // ===== VALIDATION =====
    // Check if all required fields are provided
    if (!userId || !itemName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and itemName',
      });
    }

    // Validate itemName is a non-empty string
    if (typeof itemName !== 'string' || itemName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Item name must be a non-empty string',
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

    // ===== CREATE REQUEST =====
    const newRequest = new Request({
      userId,
      itemName: itemName.trim(),
      description: description ? description.trim() : '',
      status: 'pending', // Default status
    });

    // Save request to database
    await newRequest.save();

    // ===== POPULATE USER DETAILS =====
    await newRequest.populate('userId', 'name email');

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      request: {
        id: newRequest._id,
        userId: newRequest.userId._id,
        userName: newRequest.userId.name,
        itemName: newRequest.itemName,
        description: newRequest.description,
        status: newRequest.status,
        createdAt: newRequest.createdAt,
      },
    });
  } catch (error) {
    console.error('Create request error:', error);

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
      message: 'Error creating request',
      error: error.message,
    });
  }
};

/**
 * GET /api/requests
 * Get all requests (admin/vendor view)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllRequests = async (req, res) => {
  try {
    // ===== OPTIONAL: ADD FILTERING =====
    // Get status filter from query params (e.g., /api/requests?status=pending)
    const { status } = req.query;

    let query = {};
    if (status) {
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Status must be one of: ${validStatuses.join(', ')}`,
        });
      }
      query.status = status;
    }

    // ===== FETCH ALL REQUESTS =====
    // In a real app, you'd check if user is admin before allowing this
    const requests = await Request.find(query)
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 }); // Newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'All requests retrieved successfully',
      count: requests.length,
      requests: requests.map((request) => ({
        id: request._id,
        user: {
          id: request.userId._id,
          name: request.userId.name,
          email: request.userId.email,
        },
        itemName: request.itemName,
        description: request.description,
        status: request.status,
        comments: request.comments,
        createdAt: request.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get all requests error:', error);

    res.status(500).json({
      success: false,
      message: 'Error retrieving requests',
      error: error.message,
    });
  }
};

/**
 * GET /api/requests/:userId
 * Get all requests made by a specific user
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserRequests = async (req, res) => {
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

    // ===== FETCH USER REQUESTS =====
    const requests = await Request.find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 }); // Newest first

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: `Requests for user ${user.name} retrieved successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      count: requests.length,
      requests: requests.map((request) => ({
        id: request._id,
        itemName: request.itemName,
        description: request.description,
        status: request.status,
        comments: request.comments,
        createdAt: request.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get user requests error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error retrieving user requests',
      error: error.message,
    });
  }
};

/**
 * PATCH /api/requests/:id
 * Update request status (approve/reject)
 *
 * HOW ADMIN/VENDOR UPDATES REQUEST:
 * 1. Admin/Vendor sends PATCH request with request ID and new status
 * 2. Controller validates status is valid enum value
 * 3. Updates request status and optionally adds comments
 * 4. Returns updated request with new status
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    // ===== VALIDATION =====
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status',
      });
    }

    // Validate status is one of allowed values
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // ===== FIND AND UPDATE REQUEST =====
    const updateData = {
      status,
      updatedAt: Date.now(),
    };

    // Add comments if provided
    if (comments) {
      updateData.comments = comments.trim();
    }

    const request = await Request.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: `Request status updated to ${status}`,
      request: {
        id: request._id,
        userId: request.userId._id,
        userName: request.userId.name,
        itemName: request.itemName,
        description: request.description,
        status: request.status,
        comments: request.comments,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update request status error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating request status',
      error: error.message,
    });
  }
};

/**
 * GET /api/requests/details/:id
 * Get a single request by ID (optional but useful)
 */
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    // ===== FETCH REQUEST =====
    const request = await Request.findById(id).populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found',
      });
    }

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'Request retrieved successfully',
      request: {
        id: request._id,
        user: {
          id: request.userId._id,
          name: request.userId.name,
          email: request.userId.email,
        },
        itemName: request.itemName,
        description: request.description,
        status: request.status,
        comments: request.comments,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get request error:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error retrieving request',
      error: error.message,
    });
  }
};

export { createRequest, getAllRequests, getUserRequests, updateRequestStatus, getRequestById };
