/**
 * Request Service
 * Handles vendor and user request API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export async function getRequests() {
  try {
    const response = await fetch(`${API_URL}/requests`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch requests');
    return { success: true, requests: data.requests || data.data || [] };
  } catch (error) {
    console.error('Fetch requests error:', error);
    return { success: false, error: error.message || 'Error fetching requests', requests: [] };
  }
}

export async function updateRequestStatus(id, status) {
  try {
    const response = await fetch(`${API_URL}/requests/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update request');
    return { success: true, request: data.request || data, message: 'Status updated successfully' };
  } catch (error) {
    console.error('Update request error:', error);
    return { success: false, error: error.message || 'Error updating request' };
  }
}
