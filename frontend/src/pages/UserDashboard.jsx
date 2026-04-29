import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as productService from '../services/productService';
import '../styles/Dashboard.css';

/**
 * User Dashboard Component
 * 
 * Features:
 * - Display user-specific features (events, orders, etc.)
 * - Fetch and display all available products from vendors
 * - Display products in card format with details
 * - "Add to Cart" button for each product (placeholder)
 * 
 * Flow:
 * 1. Component mounts, useEffect is called
 * 2. Calls productService.getAllProducts() to fetch products
 * 3. Products are displayed in a grid/card layout
 * 4. Shows loading state while fetching
 * 5. Shows error message if fetch fails
 * 6. Add to Cart button is ready for cart implementation
 */
export default function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  /**
   * useEffect Hook
   * Fetch all products when component mounts
   * Called once on component load to retrieve available products
   */
  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Fetch all products from backend
   * Called on component mount to display available products
   */
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError('');

      // Call backend API to get all products
      const result = await productService.getAllProducts();

      // Handle error
      if (!result.success) {
        setProductsError(result.error);
        setProducts([]);
        setProductsLoading(false);
        return;
      }

      // Set products in state
      setProducts(result.products || []);
      setProductsLoading(false);
    } catch (err) {
      setProductsError('An error occurred while loading products');
      console.error('Fetch products error:', err);
      setProductsLoading(false);
    }
  };

  /**
   * Handle logout - clear localStorage and navigate to login
   */
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  /**
   * Handle Add to Cart button click
   * Cart logic using localStorage
   * @param {Object} product - Product object to add to cart
   */
  const handleAddToCart = (product) => {
    // Get existing cart or initialize empty array
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add product to cart with default quantity of 1
    const productToAdd = { ...product, quantity: 1 };
    existingCart.push(productToAdd);
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show quick feedback
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="dashboard">
      {/* Header with logout */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>User Dashboard</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={() => navigate('/cart')} className="btn-logout">
              Cart
            </button>
            <button onClick={() => navigate('/orders')} className="btn-logout">
              Orders
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user.email}!</h2>
          <p>Manage your events and orders from here.</p>
        </div>

        {/* Dashboard grid */}
        <div className="dashboard-grid">
          {/* My Events Card */}
          <div className="dashboard-card">
            <div className="card-icon">📅</div>
            <h3>My Events</h3>
            <p>View and manage your events</p>
            <button className="btn-card">View Events</button>
          </div>

          {/* Browse Vendors Card */}
          <div className="dashboard-card">
            <div className="card-icon">🏪</div>
            <h3>Browse Vendors</h3>
            <p>Find vendors for your events</p>
            <button className="btn-card">Browse</button>
          </div>

          {/* My Orders Card */}
          <div className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>My Orders</h3>
            <p>Track your orders and payments</p>
            <button className="btn-card">View Orders</button>
          </div>

          {/* Profile Settings Card */}
          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Profile Settings</h3>
            <p>Update your profile information</p>
            <button className="btn-card">Settings</button>
          </div>
        </div>

        {/* Browse Products Section */}
        <section className="products-section">
          <h2>🛍️ Available Products</h2>
          <p>Discover products and services from our trusted vendors</p>

          {/* Error Message */}
          {productsError && (
            <div className="error-message">{productsError}</div>
          )}

          {/* Loading State */}
          {productsLoading && (
            <div className="loading-state">
              <p>Loading products...</p>
            </div>
          )}

          {/* No Products Message */}
          {!productsLoading && products.length === 0 && !productsError && (
            <div className="empty-state">
              <p>No products available yet. Check back soon!</p>
            </div>
          )}

          {/* Products Grid */}
          {!productsLoading && products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id || product.id} className="product-card">
                  {/* Product Info */}
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className="product-price">₹{product.price}</span>
                  </div>

                  {/* Product Description */}
                  <p className="product-description">{product.description}</p>

                  {/* Vendor Info (if available) */}
                  {product.vendorId && (
                    <p className="product-vendor">Vendor: {product.vendorId}</p>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-add-to-cart"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-number">5</span>
              <span className="stat-label">Total Events</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">12</span>
              <span className="stat-label">Active Orders</span>
            </div>
            <div className="stat-box">
              <span className="stat-number">₹50,000</span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
