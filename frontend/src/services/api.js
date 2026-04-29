/**
 * API Service Module
 * Centralized API calls for the frontend application
 * 
 * Replace API_URL with your backend server URL
 */

const API_URL = 'http://localhost:5001/api';

/**
 * Authentication API calls
 */
export const authAPI = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (user, vendor, admin)
   * @returns {Promise<object>} User data and token
   */
  login: async (email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Registration response
   */
  signup: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  /**
   * Verify token
   * @param {string} token - Auth token
   * @returns {Promise<object>} Token verification response
   */
  verifyToken: async (token) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },
};

/**
 * User API calls
 */
export const userAPI = {
  /**
   * Get user profile
   * @param {string} token - Auth token
   * @returns {Promise<object>} User profile data
   */
  getProfile: async (token) => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param {string} token - Auth token
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} Updated user data
   */
  updateProfile: async (token, userData) => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

/**
 * Admin API calls
 */
export const adminAPI = {
  /**
   * Get all users
   * @param {string} token - Auth token
   * @returns {Promise<array>} Array of users
   */
  getUsers: async (token) => {
    try {
      const response = await fetch(`${API_URL}/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  },

  /**
   * Get dashboard statistics
   * @param {string} token - Auth token
   * @returns {Promise<object>} Dashboard statistics
   */
  getStats: async (token) => {
    try {
      const response = await fetch(`${API_URL}/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },
};

/**
 * Product API calls
 */
export const productAPI = {
  /**
   * Get all products
   * @returns {Promise<array>} Array of products
   */
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      return await response.json();
    } catch (error) {
      console.error('Get products error:', error);
      throw error;
    }
  },

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Promise<object>} Product data
   */
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      return await response.json();
    } catch (error) {
      console.error('Get product error:', error);
      throw error;
    }
  },
};

/**
 * Order API calls
 */
export const orderAPI = {
  /**
   * Get user orders
   * @param {string} token - Auth token
   * @returns {Promise<array>} Array of user orders
   */
  getOrders: async (token) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  /**
   * Create new order
   * @param {string} token - Auth token
   * @param {object} orderData - Order data
   * @returns {Promise<object>} Created order
   */
  create: async (token, orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },
};
