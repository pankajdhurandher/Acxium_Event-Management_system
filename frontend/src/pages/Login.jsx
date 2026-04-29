import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../services/authService';
import '../styles/Auth.css';

/**
 * Login Page Component
 * Handles user authentication with backend API integration
 * 
 * Flow:
 * 1. User enters email and password
 * 2. Form validates input (non-empty fields)
 * 3. Calls authService.login() to authenticate with backend
 * 4. On success:
 *    - Stores user session in localStorage
 *    - Redirects to appropriate dashboard based on user role
 * 5. On error:
 *    - Displays error message
 * 6. Shows loading state during API call
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Validates form input
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   * Calls backend API to authenticate user
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form input
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API to login
      const result = await authService.login({
        email: email.trim(),
        password,
      });

      // Handle login error
      if (!result.success) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      // Save session to localStorage
      authService.saveSession(result.token, result.user);

      // Redirect based on user role
      const redirectPath = {
        admin: '/admin',
        vendor: '/vendor',
        user: '/user',
      }[result.role] || '/user';

      navigate(redirectPath);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
      setIsLoading(false);
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Event Management System</h1>
        <h2>Login</h2>

        {/* Display error message if login failed */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email Input Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address:</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Password Input Field */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Link to Signup Page */}
        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
