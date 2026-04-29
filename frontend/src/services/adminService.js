/**
 * Admin Service
 * Handles all admin-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export async function getAllUsers() {
  try {
    const response = await fetch(`${API_URL}/admin/all-users`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return { success: true, users: data.users || data.data || [] };
  } catch (error) {
    console.error('Fetch all users error:', error);
    return { success: false, error: error.message || 'Error fetching users', users: [] };
  }
}

export async function getAllVendors() {
  try {
    const response = await fetch(`${API_URL}/admin/vendors`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch vendors');
    return { success: true, vendors: data.vendors || data.data || [] };
  } catch (error) {
    console.error('Fetch all vendors error:', error);
    return { success: false, error: error.message || 'Error fetching vendors', vendors: [] };
  }
}

export async function getAllOrders() {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');
    return { success: true, orders: data.orders || data.data || [] };
  } catch (error) {
    console.error('Fetch all orders error:', error);
    return { success: false, error: error.message || 'Error fetching orders', orders: [] };
  }
}

export async function getAllRequests() {
  try {
    const response = await fetch(`${API_URL}/requests`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch requests');
    return { success: true, requests: data.requests || data.data || [] };
  } catch (error) {
    console.error('Fetch all requests error:', error);
    return { success: false, error: error.message || 'Error fetching requests', requests: [] };
  }
}
