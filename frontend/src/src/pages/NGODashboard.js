// src/pages/NGODashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { donationAPI } from '../services/api';
import './Dashboard.css';

function NGODashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [claimedDonations, setClaimedDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    foodType: '',
    maxDistance: 10
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, donationsRes, claimedRes] = await Promise.all([
        donationAPI.getStats(),
        donationAPI.getAllDonations({ status: 'active', ...filters }),
        donationAPI.getClaimedDonations()
      ]);
      setStats(statsRes.data);
      setDonations(donationsRes.data);
      setClaimedDonations(claimedRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDonation = async (donationId) => {
    const scheduledTime = prompt('Enter pickup time (YYYY-MM-DD HH:MM):');
    if (!scheduledTime) return;

    try {
      await donationAPI.claimDonation(donationId, {
        scheduledPickupTime: new Date(scheduledTime).toISOString()
      });
      alert('Donation claimed successfully!');
      fetchData();
    } catch (error) {
      alert('Error claiming donation: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleCompleteDonation = async (donationId) => {
    const rating = prompt('Rate the donation (1-5):');
    if (!rating) return;

    const feedback = prompt('Any feedback?');

    try {
      await donationAPI.completeDonation(donationId, {
        rating: parseInt(rating),
        feedback: feedback || ''
      });
      alert('Donation completed!');
      fetchData();
    } catch (error) {
      alert('Error completing donation: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🤝 {user?.name}</h1>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Claims</h3>
          <p className="stat-number">{stats?.total_claims || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Claims</h3>
          <p className="stat-number">{stats?.active_claims || 0}</p>
        </div>
        <div className="stat-card">
          <h3>People Served</h3>
          <p className="stat-number">{stats?.people_served || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-content">
        <div className="tab-navigation">
          <button 
            className={`tab ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            🗺️ Browse Donations
          </button>
          <button 
            className={`tab ${activeTab === 'claimed' ? 'active' : ''}`}
            onClick={() => setActiveTab('claimed')}
          >
            📦 My Claims ({claimedDonations.length})
          </button>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <div>
            <div className="section-header">
              <h2>Available Donations</h2>
              <button 
                onClick={fetchData}
                className="btn-primary"
              >
                🔄 Refresh
              </button>
            </div>

            <div className="donations-list">
              {donations.length === 0 ? (
                <div className="empty-state">
                  <p>🔍 No donations available in your area</p>
                </div>
              ) : (
                donations.map(donation => (
                  <div key={donation.id} className="donation-card">
                    {donation.image_url && (
                      <img 
                        src={`http://localhost:5000${donation.image_url}`} 
                        alt={donation.food_type}
                        className="donation-image"
                      />
                    )}
                    <div className="donation-info">
                      <h4>{donation.food_type}</h4>
                      <p><strong>Restaurant:</strong> {donation.restaurant_name}</p>
                      <p><strong>Quantity:</strong> {donation.quantity}</p>
                      <p><strong>Location:</strong> {donation.location}</p>
                      <p><strong>Expires:</strong> {new Date(donation.expiry_time).toLocaleString()}</p>
                      {donation.notes && <p><strong>Notes:</strong> {donation.notes}</p>}
                    </div>
                    <button 
                      onClick={() => handleClaimDonation(donation.id)}
                      className="btn-claim"
                    >
                      Claim
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Claimed Tab */}
        {activeTab === 'claimed' && (
          <div>
            <div className="section-header">
              <h2>My Claims</h2>
            </div>

            <div className="donations-list">
              {claimedDonations.length === 0 ? (
                <div className="empty-state">
                  <p>📦 You haven't claimed any donations yet</p>
                </div>
              ) : (
                claimedDonations.map(donation => (
                  <div key={donation.id} className="donation-card">
                    {donation.image_url && (
                      <img 
                        src={`http://localhost:5000${donation.image_url}`} 
                        alt={donation.food_type}
                        className="donation-image"
                      />
                    )}
                    <div className="donation-info">
                      <h4>{donation.food_type}</h4>
                      <p><strong>Restaurant:</strong> {donation.restaurant_name}</p>
                      <p><strong>Contact:</strong> {donation.restaurant_phone}</p>
                      <p><strong>Quantity:</strong> {donation.quantity}</p>
                      <p><strong>Status:</strong> <span className={`status-${donation.status}`}>{donation.status}</span></p>
                      <p><strong>Claimed At:</strong> {new Date(donation.claimed_at).toLocaleString()}</p>
                    </div>
                    {donation.status === 'claimed' && (
                      <button 
                        onClick={() => handleCompleteDonation(donation.id)}
                        className="btn-complete"
                      >
                        ✓ Completed
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NGODashboard;