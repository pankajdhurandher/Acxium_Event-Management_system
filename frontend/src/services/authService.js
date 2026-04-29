/**
 * Authentication Service
 * Handles all authentication-related API calls
 * 
 * This service provides functions for:
 * - User signup (registration)
 * - User login
 * - Token management
 */

// API Base URL - Update this to match your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Sign up a new user
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.role - User's role (user, vendor, admin)
 * 
 * @returns {Promise<Object>} Response containing user data and token
 * @throws {Error} If signup fails
 * 
 * @example
 * const response = await authService.signup({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   password: 'password123',
 *   role: 'user'
 * });
 * // { user: {...}, token: 'jwt-token', message: 'Signup successful' }
 */
export async function signup(userData) {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // Parse response
    const data = await response.json();

    // Handle error response
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed. Please try again.');
    }

    // Return success response
    return {
      success: true,
      user: data.user,
      token: data.token,
      message: data.message || 'Signup successful!',
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during signup',
    };
  }
}

/**
 * Log in a user
 * 
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * 
 * @returns {Promise<Object>} Response containing user data, role, and token
 * @throws {Error} If login fails
 * 
 * @example
 * const response = await authService.login({
 *   email: 'john@example.com',
 *   password: 'password123'
 * });
 * // { user: {...}, role: 'user', token: 'jwt-token', message: 'Login successful' }
 */
export async function login(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Parse response
    const data = await response.json();

    // Handle error response
    if (!response.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    // Return success response
    return {
      success: true,
      user: data.user,
      role: data.user.role,
      token: data.token,
      message: data.message || 'Login successful!',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during login',
    };
  }
}

/**
 * Save user session to localStorage
 * 
 * @param {string} token - JWT authentication token
 * @param {Object} user - User object containing email and role
 * 
 * @example
 * authService.saveSession(token, { email: 'john@example.com', role: 'user' });
 */
export function saveSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Get stored session from localStorage
 * 
 * @returns {Object|null} User session or null if not found
 * 
 * @example
 * const session = authService.getSession();
 * // { token: 'jwt-token', user: {...} }
 */
export function getSession() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return null;
  }

  try {
    return {
      token,
      user: JSON.parse(user),
    };
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Clear user session from localStorage (logout)
 * 
 * @example
 * authService.clearSession();
 */
export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Check if user is authenticated
 * 
 * @returns {boolean} True if user has valid token and user data
 * 
 * @example
 * if (authService.isAuthenticated()) {
 *   // User is logged in
 * }
 */
export function isAuthenticated() {
  const session = getSession();
  return Boolean(session && session.token && session.user);
}

/**
 * Get current user from session
 * 
 * @returns {Object|null} Current user object or null if not authenticated
 * 
 * @example
 * const user = authService.getCurrentUser();
 * console.log(user.email, user.role);
 */
export function getCurrentUser() {
  const session = getSession();
  return session?.user || null;
}

/**
 * Get current user's role
 * 
 * @returns {string|null} User role (user, vendor, admin) or null if not authenticated
 * 
 * @example
 * const role = authService.getUserRole();
 * if (role === 'admin') {
 *   // Show admin controls
 * }
 */
export function getUserRole() {
  const user = getCurrentUser();
  return user?.role || null;
}

/**
 * Verify token with backend
 * 
 * @param {string} token - JWT token to verify
 * 
 * @returns {Promise<Object>} Token verification result
 * 
 * @example
 * const result = await authService.verifyToken(token);
 * if (result.valid) {
 *   // Token is valid
 * }
 */
export async function verifyToken(token) {
  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return {
      valid: response.ok,
      message: data.message,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return {
      valid: false,
      message: 'Token verification failed',
    };
  }
}

/**
 * Export all functions as default object for easier importing
 */
export default {
  signup,
  login,
  saveSession,
  getSession,
  clearSession,
  isAuthenticated,
  getCurrentUser,
  getUserRole,
  verifyToken,
};
