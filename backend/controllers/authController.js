import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Authentication Controller
 * Handles user signup and login logic
 */

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'acxium_event_management_secret_2024',
    { expiresIn: '7d' }
  );
};

/**
 * POST /api/auth/signup
 * Register a new user with email, password, name, and role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ===== VALIDATION =====
    // Check if all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Validate email format
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Validate role if provided
    const validRoles = ['user', 'vendor', 'admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${validRoles.join(', ')}`,
      });
    }

    // ===== CHECK FOR EXISTING USER =====
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // ===== CREATE NEW USER =====
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password, // Will be hashed by the pre-save middleware
      role: role || 'user', // Default role is 'user'
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);

    // Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists',
      });
    }

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

    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ===== VALIDATION =====
    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Validate email format
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email',
      });
    }

    // ===== FIND USER =====
    // Note: select('+password') overrides the default select: false in schema
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // ===== VERIFY PASSWORD =====
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // ===== RETURN SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

/**
 * GET /api/auth/me
 * Get current user details (protected route - requires authentication)
 * This is optional but useful for verifying user identity
 */
const getMe = async (req, res) => {
  try {
    // This would be protected by middleware in a real app
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Current user retrieved',
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
    });
  }
};

export { signup, login, getMe };
