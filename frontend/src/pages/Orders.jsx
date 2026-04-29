import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as orderService from '../services/orderService';
import '../styles/Dashboard.css';

/**
 * Orders Page Component
 * Displays user's order history
 */
export default function Orders() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await orderService.getUserOrders(user._id);
      
      if (result.success) {
        setOrders(result.orders);
      } else {
        setError(result.error);
      }
      setLoading(false);
    } catch (err) {
      setError('An error occurred while loading orders');
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>My Orders</h1>
          <button onClick={() => navigate('/user')} className="btn-logout">Back to Dashboard</button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="products-section">
          <h2>Order History</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading ? (
            <div className="loading-state">
              <p>Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/user')} className="btn-primary" style={{marginTop: '15px'}}>Browse Products</button>
            </div>
          ) : (
            <div className="products-grid">
              {orders.map((order) => (
                <div key={order._id || Math.random().toString()} className="product-card">
                  <div className="product-header">
                    <h3>Order #{order._id ? order._id.substring(0,8) : 'N/A'}</h3>
                    <span className="product-price">₹{order.totalAmount}</span>
                  </div>
                  <p><strong>Status:</strong> {order.status || 'Pending'}</p>
                  <p><strong>Items:</strong> {order.items ? order.items.length : 0}</p>
                  <div className="product-description" style={{marginTop: '10px'}}>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx}>• {item.name} (x{item.quantity || 1})</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
