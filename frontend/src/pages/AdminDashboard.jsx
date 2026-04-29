import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as adminService from '../services/adminService';
import '../styles/Dashboard.css';

/**
 * Admin Dashboard Component
 * Displays admin overview with system data
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all required data concurrently
      const [usersRes, vendorsRes, ordersRes, requestsRes] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllVendors(),
        adminService.getAllOrders(),
        adminService.getAllRequests()
      ]);

      if (!usersRes.success) throw new Error(usersRes.error);
      
      setUsers(usersRes.users || []);
      setVendors(vendorsRes.vendors || []);
      setOrders(ordersRes.orders || []);
      setRequests(requestsRes.requests || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, Admin!</h2>
          <p>System overview and management controls.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading system data...</div>
        ) : (
          <>
            {/* Summary Section */}
            <section className="stats-section" style={{ marginTop: 0, marginBottom: '40px', animation: 'none' }}>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-number">{users.length}</span>
                  <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{vendors.length}</span>
                  <span className="stat-label">Total Vendors</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{orders.length}</span>
                  <span className="stat-label">Total Orders</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">{requests.length}</span>
                  <span className="stat-label">Total Requests</span>
                </div>
              </div>
            </section>

            {/* Tables Section */}
            <div className="dashboard-grid" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Users Table */}
              <div className="form-card" style={{ maxWidth: '100%' }}>
                <h3>👥 Users List</h3>
                <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '10px' }}>Name</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? <tr><td colSpan="3" style={{padding: '10px'}}>No users found.</td></tr> : users.slice(0, 10).map((u) => (
                        <tr key={u._id || Math.random().toString()} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px' }}>{u.name || 'N/A'}</td>
                          <td style={{ padding: '10px' }}>{u.email}</td>
                          <td style={{ padding: '10px' }}>{u.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Orders Table */}
              <div className="form-card" style={{ maxWidth: '100%' }}>
                <h3>📦 Recent Orders</h3>
                <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '10px' }}>Order ID</th>
                        <th style={{ padding: '10px' }}>User ID</th>
                        <th style={{ padding: '10px' }}>Total Amount</th>
                        <th style={{ padding: '10px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? <tr><td colSpan="4" style={{padding: '10px'}}>No orders found.</td></tr> : orders.slice(0, 10).map((o) => (
                        <tr key={o._id || Math.random().toString()} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px' }}>{o._id ? o._id.substring(0,8) : 'N/A'}</td>
                          <td style={{ padding: '10px' }}>{o.userId ? o.userId.substring(0,8) : 'N/A'}</td>
                          <td style={{ padding: '10px' }}>₹{o.totalAmount}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: o.status === 'Completed' ? '#efe' : '#f0f0f0', color: o.status === 'Completed' ? '#3c3' : '#333', fontSize: '12px' }}>
                              {o.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Requests Table */}
              <div className="form-card" style={{ maxWidth: '100%' }}>
                <h3>📨 Recent Requests</h3>
                <div style={{ overflowX: 'auto', marginTop: '15px' }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #eee' }}>
                        <th style={{ padding: '10px' }}>Request ID</th>
                        <th style={{ padding: '10px' }}>Item Name</th>
                        <th style={{ padding: '10px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.length === 0 ? <tr><td colSpan="3" style={{padding: '10px'}}>No requests found.</td></tr> : requests.slice(0, 10).map((r) => (
                        <tr key={r._id || Math.random().toString()} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '10px' }}>{r._id ? r._id.substring(0,8) : 'N/A'}</td>
                          <td style={{ padding: '10px' }}>{r.itemName || r.name || 'N/A'}</td>
                          <td style={{ padding: '10px' }}>{r.status || 'Pending'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
}
