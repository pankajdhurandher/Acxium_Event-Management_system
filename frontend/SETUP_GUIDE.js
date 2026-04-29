/**
 * MERN Event Management System - Frontend Setup Guide
 * 
 * This document provides a comprehensive overview of the React frontend setup
 */

// ============================================
// PROJECT STRUCTURE OVERVIEW
// ============================================

/**
 * frontend/
 * ├── src/
 * │   ├── components/          // Reusable React components (add new components here)
 * │   ├── pages/               // Page components
 * │   │   ├── Login.jsx        // Public login page
 * │   │   ├── Signup.jsx       // Public signup page
 * │   │   ├── UserDashboard.jsx    // Protected user dashboard
 * │   │   ├── VendorDashboard.jsx  // Protected vendor dashboard
 * │   │   └── AdminDashboard.jsx   // Protected admin dashboard
 * │   ├── services/            // API and utility services
 * │   │   └── api.js           // Centralized API calls
 * │   ├── context/             // React Context for state management
 * │   │   └── AuthContext.jsx  // Authentication context
 * │   ├── styles/              // CSS stylesheets
 * │   │   ├── Auth.css         // Login/Signup page styles
 * │   │   └── Dashboard.css    // Dashboard page styles
 * │   ├── App.jsx              // Main app component with routing
 * │   ├── App.css              // Global app styles
 * │   ├── index.css            // Global styles and CSS variables
 * │   └── main.jsx             // Application entry point
 * ├── package.json             // Dependencies and scripts
 * ├── vite.config.js           // Vite configuration
 * ├── index.html               // HTML template
 * └── FRONTEND_README.md       // Frontend documentation
 */

// ============================================
// QUICK START COMMANDS
// ============================================

/*
1. Install dependencies:
   npm install

2. Start development server:
   npm run dev
   
3. Build for production:
   npm run build

4. Preview production build:
   npm run preview

5. Run linter:
   npm run lint
*/

// ============================================
// ROUTING CONFIGURATION
// ============================================

/**
 * App.jsx contains React Router configuration:
 * 
 * PUBLIC ROUTES:
 * - GET /                 → Login page (with role selector)
 * - GET /signup          → Signup page
 * 
 * PROTECTED ROUTES (require authentication + role):
 * - GET /user            → User Dashboard (role: "user")
 * - GET /vendor          → Vendor Dashboard (role: "vendor")
 * - GET /admin           → Admin Dashboard (role: "admin")
 * 
 * ALL OTHER ROUTES:
 * - Redirect to login page
 */

// ============================================
// AUTHENTICATION FLOW
// ============================================

/**
 * 1. User visits "/" (Login page)
 * 
 * 2. User enters credentials:
 *    - Email
 *    - Password
 *    - Selects Role (User / Vendor / Admin)
 * 
 * 3. Login.jsx validates input and submits form
 * 
 * 4. TODO: Replace mock auth with API call:
 *    - Send POST request to http://localhost:5000/api/auth/login
 *    - Backend validates credentials and returns user data + token
 * 
 * 5. Data is stored in localStorage:
 *    - localStorage.setItem('user', JSON.stringify({ email, role }))
 *    - localStorage.setItem('token', 'jwt-token')
 * 
 * 6. User is redirected to dashboard based on role:
 *    - role === "user" → /user
 *    - role === "vendor" → /vendor
 *    - role === "admin" → /admin
 * 
 * 7. ProtectedRoute component verifies:
 *    - User data exists in localStorage
 *    - Token exists in localStorage
 *    - User role matches required role
 */

// ============================================
// CONNECTING TO BACKEND
// ============================================

/**
 * UPDATE THE API ENDPOINT:
 * 
 * File: src/services/api.js
 * Line: const API_URL = 'http://localhost:5000/api'
 * 
 * Replace with your backend API URL
 * 
 * IMPLEMENT API CALLS:
 * 
 * In Login.jsx (around line 44):
 * Replace:
 *   // Mock authentication
 *   localStorage.setItem('user', JSON.stringify({ email, role }));
 * 
 * With:
 *   const response = await authAPI.login(email, password, role);
 *   localStorage.setItem('user', JSON.stringify(response.user));
 *   localStorage.setItem('token', response.token);
 * 
 * In Signup.jsx (around line 65):
 * Replace:
 *   // Mock signup
 *   setTimeout(() => navigate('/'), 2000);
 * 
 * With:
 *   const response = await authAPI.signup({ name, email, password, role });
 *   // Show success message and redirect
 */

// ============================================
// USING AUTHCONTEXT (Optional but Recommended)
// ============================================

/**
 * For better state management, use AuthContext:
 * 
 * 1. Wrap your app in AuthProvider:
 *    In main.jsx or App.jsx:
 *    
 *    <AuthProvider>
 *      <App />
 *    </AuthProvider>
 * 
 * 2. Use the useAuth hook in components:
 *    
 *    import { useAuth } from './context/AuthContext';
 *    
 *    function MyComponent() {
 *      const { user, login, logout, isAuthenticated } = useAuth();
 *      
 *      // Use auth data in component
 *    }
 * 
 * 3. AuthContext provides:
 *    - user: Current user object
 *    - token: Auth token
 *    - isLoading: Loading state
 *    - isAuthenticated: Boolean check
 *    - login(userData, token): Login function
 *    - logout(): Logout function
 *    - hasRole(role): Check if user has role
 */

// ============================================
// STYLING AND DESIGN
// ============================================

/**
 * COLOR PALETTE (CSS Variables):
 * - --primary: #667eea (Purple)
 * - --primary-dark: #764ba2 (Dark Purple)
 * - --secondary: #f093fb (Pink)
 * - --bg-primary: #ffffff (White)
 * - --bg-secondary: #f5f7fa (Light Gray)
 * - --text-primary: #333333 (Dark Gray)
 * - --text-secondary: #666666 (Gray)
 * - --text-light: #999999 (Light Gray)
 * 
 * DESIGN PATTERNS:
 * - Gradient backgrounds: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
 * - Card-based layouts with box-shadow
 * - Smooth transitions and animations (0.3s - 0.5s)
 * - Responsive grid layouts (auto-fill, minmax)
 * - Mobile-first design with media queries
 * 
 * CSS FILES:
 * - index.css: Global variables and reset
 * - App.css: Global app styles
 * - styles/Auth.css: Authentication page styles
 * - styles/Dashboard.css: Dashboard page styles
 */

// ============================================
// ADDING NEW FEATURES
// ============================================

/**
 * 1. NEW ROUTES:
 *    Add to App.jsx Routes section:
 *    <Route path="/new-page" element={<NewPage />} />
 * 
 * 2. NEW PAGES:
 *    Create file: src/pages/NewPage.jsx
 *    Extend component structure with comments
 * 
 * 3. NEW COMPONENTS:
 *    Create file: src/components/NewComponent.jsx
 *    Keep components reusable and single-responsibility
 * 
 * 4. NEW STYLES:
 *    Create or extend CSS files in src/styles/
 *    Use CSS variables for colors
 *    Follow responsive design patterns
 * 
 * 5. NEW API CALLS:
 *    Add to src/services/api.js
 *    Follow existing patterns and error handling
 */

// ============================================
// COMMON TASKS
// ============================================

/**
 * TASK: Add a new dashboard feature
 * 
 * 1. Create component in src/components/
 * 2. Import in dashboard page (e.g., UserDashboard.jsx)
 * 3. Add styling in src/styles/Dashboard.css
 * 4. Import and render component in dashboard
 * 
 * TASK: Update authentication logic
 * 
 * 1. Update API call in src/services/api.js
 * 2. Update Login.jsx or Signup.jsx to use new API
 * 3. Update AuthContext if using context-based auth
 * 
 * TASK: Add protected routes
 * 
 * 1. Add route in App.jsx with ProtectedRoute wrapper
 * 2. Specify required role in requiredRole prop
 * 3. Create corresponding page component
 * 
 * TASK: Change color scheme
 * 
 * 1. Update CSS variables in index.css :root
 * 2. Update gradient values in Auth.css and Dashboard.css
 * 3. Test on all pages to ensure consistency
 */

// ============================================
// TROUBLESHOOTING
// ============================================

/**
 * ISSUE: Blank page on refresh
 * SOLUTION: Ensure BrowserRouter is in App.jsx, not in components
 * 
 * ISSUE: Routes not working
 * SOLUTION: Check that react-router-dom is installed: npm list react-router-dom
 * 
 * ISSUE: Styles not applying
 * SOLUTION: Verify CSS import paths are correct, check browser dev tools
 * 
 * ISSUE: Authentication not persisting
 * SOLUTION: Check if browser allows localStorage, clear cache and retry
 * 
 * ISSUE: API calls failing
 * SOLUTION: Ensure backend is running, check CORS settings, verify API_URL
 */

export default {
  message: "This file contains setup guide and documentation for the React frontend"
};
