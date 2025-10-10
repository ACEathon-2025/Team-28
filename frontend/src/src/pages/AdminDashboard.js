// src/pages/AdminDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { adminAPI } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await adminAPI.getDashboard();
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await adminAPI.getAllUsers({ page: 1, limit: 50 });
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllDonations = async () => {
    try {
      const res = await adminAPI.getAllDonations({ page: 1, limit: 50 });
      setDonations(res.data.donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await adminAPI.verifyUser(userId);
      alert('User verified successfully!');
      fetchAllUsers();
    } catch (error) {
      alert('Error verifying user: ' + error.message);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await adminAPI.toggleUserStatus(userId, !isActive);
      alert(`User ${isActive ? 'deactivated' : 'activated'} successfully!`);
      fetchAllUsers();
    } catch (error) {
      alert('Error updating user status: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure? This will delete all their data!')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      alert('User deleted successfully!');
      fetchAllUsers();
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  };

  if (loading && activeTab === 'dashboard') {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>👨‍💼 Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>{user?.name}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => { setActiveTab('dashboard'); fetchDashboardData(); }}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => { setActiveTab('users'); fetchAllUsers(); }}
        >
          👥 Users
        </button>
        <button 
          className={`tab ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => { setActiveTab('donations'); fetchAllDonations(); }}
        >
          🍽️ Donations
        </button>
      </div>

      {/* Dashboard View */}
      {activeTab === 'dashboard' && stats && (
        <div className="admin-content">
          <h2>Platform Statistics</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3>🏪 Total Restaurants</h3>
              <p className="stat-number">{stats.stats.total_restaurants}</p>
            </div>
            <div className="stat-card">
              <h3>🤝 Total NGOs</h3>
              <p className="stat-number">{stats.stats.total_ngos}</p>
            </div>
            <div className="stat-card">
              <h3>📦 Total Donations</h3>
              <p className="stat-number">{stats.stats.total_donations}</p>
            </div>
            <div className="stat-card">
              <h3>⚡ Active Donations</h3>
              <p className="stat-number">{stats.stats.active_donations}</p>
            </div>
            <div className="stat-card">
              <h3>✅ Completed Donations</h3>
              <p className="stat-number">{stats.stats.completed_donations}</p>
            </div>
            <div className="stat-card">
              <h3>⚖️ Food Saved</h3>
              <p className="stat-number">{stats.stats.total_food_saved} kg</p>
            </div>
            <div className="stat-card">
              <h3>⏳ Pending Verification</h3>
              <p className="stat-number">{stats.stats.pending_verifications}</p>
            </div>
          </div>

          {/* Recent Donations */}
          <div className="recent-section">
            <h3>📋 Recent Donations</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Restaurant</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentDonations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.food_type}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.restaurant_name}</td>
                    <td><span className={`status-${donation.status}`}>{donation.status}</span></td>
                    <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Management View */}
      {activeTab === 'users' && (
        <div className="admin-content">
          <h2>User Management</h2>
          
          <div className="users-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Verified</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.user_type}</td>
                    <td>
                      {user.is_verified ? (
                        <span className="badge verified">✅ Verified</span>
                      ) : (
                        <span className="badge unverified">⏳ Pending</span>
                      )}
                    </td>
                    <td>
                      {user.is_active ? (
                        <span className="badge active">Active</span>
                      ) : (
                        <span className="badge inactive">Inactive</span>
                      )}
                    </td>
                    <td className="action-buttons">
                      {!user.is_verified && (
                        <button 
                          onClick={() => handleVerifyUser(user.id)}
                          className="btn-small btn-verify"
                        >
                          Verify
                        </button>
                      )}
                      <button 
                        onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                        className={`btn-small ${user.is_active ? 'btn-deactivate' : 'btn-activate'}`}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn-small btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Donations View */}
      {activeTab === 'donations' && (
        <div className="admin-content">
          <h2>All Donations</h2>
          
          <div className="donations-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Food Type</th>
                  <th>Quantity</th>
                  <th>Restaurant</th>
                  <th>NGO (Claimed By)</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(donation => (
                  <tr key={donation.id}>
                    <td>{donation.food_type}</td>
                    <td>{donation.quantity}</td>
                    <td>{donation.restaurant_name}</td>
                    <td>{donation.ngo_name || 'Not claimed'}</td>
                    <td><span className={`status-${donation.status}`}>{donation.status}</span></td>
                    <td>{new Date(donation.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;