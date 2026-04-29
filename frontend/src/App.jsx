import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import './App.css';

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 * Can be extended to check user role
 */
function ProtectedRoute({ children, requiredRole }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');

  // If no user or token, redirect to login
  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  // If specific role is required, check if user has that role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

/**
 * App Component
 * Main application component with all routes
 * 
 * Routes:
 * - "/" → Login page
 * - "/signup" → Signup page
 * - "/user" → User Dashboard (Protected)
 * - "/vendor" → Vendor Dashboard (Protected)
 * - "/admin" → Admin Dashboard (Protected)
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes - User Dashboard */}
        <Route
          path="/user"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Cart */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute requiredRole="user">
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Orders */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute requiredRole="user">
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Vendor Dashboard */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute requiredRole="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
