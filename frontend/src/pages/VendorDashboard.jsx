import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as productService from '../services/productService';
import * as requestService from '../services/requestService';
import '../styles/Dashboard.css';

/**
 * Vendor Dashboard Component
 * 
 * Features:
 * - Display vendor-specific features (orders, services, analytics, etc.)
 * - Add new products to inventory via form
 * - Form submission calls POST /api/products with vendor ID
 * - Fetch and display vendor products
 * - Fetch and display customer requests with ability to update status
 */
export default function VendorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [productError, setProductError] = useState('');
  const [productSuccess, setProductSuccess] = useState('');
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  // Vendor Data State
  const [myProducts, setMyProducts] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    setDataLoading(true);
    try {
      const [prodRes, reqRes] = await Promise.all([
        productService.getVendorProducts(user._id),
        requestService.getRequests()
      ]);

      if (prodRes.success) setMyProducts(prodRes.products || []);
      if (reqRes.success) setMyRequests(reqRes.requests || []);
    } catch (err) {
      setDataError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateRequest = async (id, status) => {
    const res = await requestService.updateRequestStatus(id, status);
    if (res.success) {
      // Update local state
      setMyRequests(prev => prev.map(req => req._id === id ? { ...req, status } : req));
    } else {
      alert(res.error || 'Failed to update request');
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
   * Handle product form input changes
   */
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Validate product form input
   */
  const validateProductForm = () => {
    if (!productForm.name.trim()) {
      setProductError('Product name is required');
      return false;
    }

    if (!productForm.price) {
      setProductError('Price is required');
      return false;
    }

    if (isNaN(productForm.price) || parseFloat(productForm.price) <= 0) {
      setProductError('Price must be a valid positive number');
      return false;
    }

    if (!productForm.description.trim()) {
      setProductError('Description is required');
      return false;
    }

    if (productForm.description.trim().length < 10) {
      setProductError('Description must be at least 10 characters long');
      return false;
    }

    return true;
  };

  /**
   * Handle product form submission
   * Calls backend API to add product
   */
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductError('');
    setProductSuccess('');

    // Validate form input
    if (!validateProductForm()) {
      return;
    }

    setIsLoadingProduct(true);

    try {
      // Call backend API to add product
      const result = await productService.addProduct(productForm, user._id);

      // Handle error
      if (!result.success) {
        setProductError(result.error);
        setIsLoadingProduct(false);
        return;
      }

      // Show success message
      setProductSuccess(result.message);

      // Clear form
      setProductForm({
        name: '',
        price: '',
        description: '',
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setProductSuccess('');
      }, 3000);

      // Refresh vendor products list
      fetchVendorData();

      setIsLoadingProduct(false);
    } catch (err) {
      setProductError('An unexpected error occurred. Please try again.');
      console.error('Add product error:', err);
      setIsLoadingProduct(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Header with logout */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Vendor Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user.email}!</h2>
          <p>Manage your services and customer requests.</p>
        </div>

        {/* Product Addition Form Section */}
        <section className="product-form-section">
          <div className="form-card">
            <h3>📦 Add New Product</h3>
            <p>Add products to your inventory</p>

            {/* Error Message */}
            {productError && (
              <div className="error-message">{productError}</div>
            )}

            {/* Success Message */}
            {productSuccess && (
              <div className="success-message">{productSuccess}</div>
            )}

            {/* Product Form */}
            <form onSubmit={handleAddProduct} className="product-form">
              {/* Product Name Input */}
              <div className="form-group">
                <label htmlFor="productName">Product Name:</label>
                <input
                  id="productName"
                  type="text"
                  name="name"
                  placeholder="e.g., Wedding Catering, Decoration Service"
                  value={productForm.name}
                  onChange={handleProductFormChange}
                  disabled={isLoadingProduct}
                  required
                />
              </div>

              {/* Product Price Input */}
              <div className="form-group">
                <label htmlFor="productPrice">Price (₹):</label>
                <input
                  id="productPrice"
                  type="number"
                  name="price"
                  placeholder="e.g., 5000"
                  value={productForm.price}
                  onChange={handleProductFormChange}
                  disabled={isLoadingProduct}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* Product Description Input */}
              <div className="form-group">
                <label htmlFor="productDescription">Description:</label>
                <textarea
                  id="productDescription"
                  name="description"
                  placeholder="Describe your product/service in detail (min 10 characters)"
                  value={productForm.description}
                  onChange={handleProductFormChange}
                  disabled={isLoadingProduct}
                  rows="4"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoadingProduct}
              >
                {isLoadingProduct ? 'Adding Product...' : 'Add Product'}
              </button>
            </form>
          </div>
        </section>

        {dataError && <div className="error-message">{dataError}</div>}
        
        {dataLoading ? (
          <div className="loading-state">Loading dashboard data...</div>
        ) : (
          <div className="dashboard-grid" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {/* Vendor Products Table */}
            <div className="form-card" style={{ maxWidth: '100%' }}>
              <h3>🛍️ My Products</h3>
              <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee' }}>
                      <th style={{ padding: '10px' }}>Name</th>
                      <th style={{ padding: '10px' }}>Price</th>
                      <th style={{ padding: '10px' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProducts.length === 0 ? <tr><td colSpan="3" style={{padding: '10px'}}>No products added yet.</td></tr> : myProducts.map((p) => (
                      <tr key={p._id || Math.random().toString()} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{p.name}</td>
                        <td style={{ padding: '10px' }}>₹{p.price}</td>
                        <td style={{ padding: '10px' }}>{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendor Requests Table */}
            <div className="form-card" style={{ maxWidth: '100%' }}>
              <h3>📋 Customer Requests</h3>
              <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee' }}>
                      <th style={{ padding: '10px' }}>Request ID</th>
                      <th style={{ padding: '10px' }}>Item Name</th>
                      <th style={{ padding: '10px' }}>Status</th>
                      <th style={{ padding: '10px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myRequests.length === 0 ? <tr><td colSpan="4" style={{padding: '10px'}}>No requests found.</td></tr> : myRequests.map((r) => (
                      <tr key={r._id || Math.random().toString()} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{r._id ? r._id.substring(0,8) : 'N/A'}</td>
                        <td style={{ padding: '10px' }}>{r.itemName || r.name || 'N/A'}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: r.status === 'Approved' ? '#efe' : r.status === 'Rejected' ? '#fee' : '#f0f0f0', color: r.status === 'Approved' ? '#3c3' : r.status === 'Rejected' ? '#c33' : '#333', fontSize: '12px' }}>
                            {r.status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ padding: '10px', display: 'flex', gap: '10px' }}>
                          {r.status !== 'Approved' && r.status !== 'Rejected' ? (
                            <>
                              <button onClick={() => handleUpdateRequest(r._id, 'Approved')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>Approve</button>
                              <button onClick={() => handleUpdateRequest(r._id, 'Rejected')} className="btn-logout" style={{ background: '#c33', padding: '6px 12px', fontSize: '12px', color: 'white', border: 'none', borderColor: 'transparent' }}>Reject</button>
                            </>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#999' }}>Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
