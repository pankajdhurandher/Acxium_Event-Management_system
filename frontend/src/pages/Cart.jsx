import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as orderService from '../services/orderService';
import '../styles/Dashboard.css';

/**
 * Cart Page Component
 * Allows users to view their cart, remove items, and place an order.
 */
export default function Cart() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [cartItems, setCartItems] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Load cart from localStorage on mount
  // Cart logic using localStorage: we store products array as a JSON string under the 'cart' key
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);
  }, []);

  // Handle removing item from cart
  const handleRemove = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate total amount
  const totalAmount = cartItems.reduce((total, item) => total + (Number(item.price) * (item.quantity || 1)), 0);

  // Handle order creation flow
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    
    setIsPlacingOrder(true);
    setError('');
    setMessage('');
    
    const orderData = {
      userId: user._id,
      items: cartItems,
      totalAmount
    };
    
    const result = await orderService.createOrder(orderData);
    
    if (result.success) {
      // Clear cart on success
      localStorage.removeItem('cart');
      setCartItems([]);
      setMessage('Order placed successfully!');
      // Optional: redirect to orders page after short delay
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } else {
      setError(result.error);
    }
    
    setIsPlacingOrder(false);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Your Cart</h1>
          <button onClick={() => navigate('/user')} className="btn-logout">Back to Dashboard</button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="products-section">
          <h2>Shopping Cart</h2>
          
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}
          
          {cartItems.length === 0 ? (
            <div className="empty-state">
              <p>Your cart is empty.</p>
              <button onClick={() => navigate('/user')} className="btn-primary" style={{marginTop: '15px'}}>Browse Products</button>
            </div>
          ) : (
            <div>
              <div className="products-grid">
                {cartItems.map((item, index) => (
                  <div key={`${item._id || item.id}-${index}`} className="product-card">
                    <div className="product-header">
                      <h3>{item.name}</h3>
                      <span className="product-price">₹{item.price}</span>
                    </div>
                    <p className="product-description">Quantity: {item.quantity || 1}</p>
                    <button onClick={() => handleRemove(index)} className="btn-add-to-cart" style={{background: '#c33'}}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="form-card" style={{marginTop: '40px', marginLeft: 'auto', marginRight: 'auto'}}>
                <h3>Order Summary</h3>
                <h2 style={{color: '#667eea', marginBottom: '20px'}}>Total: ₹{totalAmount.toFixed(2)}</h2>
                <button 
                  onClick={handlePlaceOrder} 
                  className="btn-primary" 
                  disabled={isPlacingOrder}
                  style={{width: '100%'}}
                >
                  {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
