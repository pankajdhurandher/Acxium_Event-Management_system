/**
 * Order Service
 * Handles all order-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Create a new order
 * @param {Object} orderData - Data for the new order { userId, items, totalAmount }
 */
export async function createOrder(orderData) {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }
    
    return { success: true, order: data.order || data, message: 'Order placed successfully' };
  } catch (error) {
    console.error('Create order error:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}

/**
 * Get all orders for a user
 * @param {string} userId - User ID
 */
export async function getUserOrders(userId) {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/orders/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }
    
    return { success: true, orders: data.orders || data.data || [] };
  } catch (error) {
    console.error('Fetch orders error:', error);
    return { success: false, error: error.message || 'An error occurred', orders: [] };
  }
}
