// src/pages/RestaurantDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { donationAPI } from '../services/api';
import './Dashboard.css';

function RestaurantDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    quantityKg: '',
    expiryHours: 4,
    location: user?.location || '',
    notes: '',
    image: null
  });

  // Load data when component loads
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, donationsRes] = await Promise.all([
        donationAPI.getStats(),
        donationAPI.getMyDonations()
      ]);
      setStats(statsRes.data);
      setDonations(donationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      await donationAPI.createDonation(formDataToSend);
      alert('Donation created successfully!');
      setShowForm(false);
      fetchData();
      setFormData({
        foodType: '',
        quantity: '',
        quantityKg: '',
        expiryHours: 4,
        location: user?.location || '',
        notes: '',
        image: null
      });
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Cancel this donation?')) return;
    
    try {
      await donationAPI.deleteDonation(id);
      alert('Donation cancelled');
      fetchData();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍽️ {user?.name}</h1>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      {/* STATS */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Donations</h3>
          <p className="stat-number">{stats?.total_donations || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Listings</h3>
          <p className="stat-number">{stats?.active_donations || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Food Saved</h3>
          <p className="stat-number">{stats?.total_food_saved || 0} kg</p>
        </div>
        <div className="stat-card">
          <h3>Impact Score</h3>
          <p className="stat-number">{stats?.impact_score || 0}</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <div className="section-header">
          <h2>My Donations</h2>
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add New Donation'}
          </button>
        </div>

        {/* ADD DONATION FORM */}
        {showForm && (
          <div className="donation-form-card">
            <h3>Create New Donation</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Food Type *</label>
                  <select 
                    name="foodType" 
                    value={formData.foodType} 
                    onChange={handleInputChange} 
                    required
                  >
                    <option value="">Select type</option>
                    <option value="rice">Rice Dishes</option>
                    <option value="bread">Bread & Bakery</option>
                    <option value="curry">Curry & Gravy</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="desserts">Desserts</option>
                    <option value="mixed">Mixed Meal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input 
                    type="text" 
                    name="quantity" 
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 kg or 20 servings"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Quantity (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    name="quantityKg" 
                    value={formData.quantityKg}
                    onChange={handleInputChange}
                    placeholder="Numeric value"
                  />
                </div>

                <div className="form-group">
                  <label>Expiry Hours *</label>
                  <input 
                    type="number" 
                    name="expiryHours" 
                    value={formData.expiryHours}
                    onChange={handleInputChange}
                    min="1"
                    max="48"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Location *</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Food Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea 
                    name="notes" 
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit">Create Donation</button>
            </form>
          </div>
        )}

        {/* DONATIONS LIST */}
        <div className="donations-list">
          {donations.length === 0 ? (
            <div className="empty-state">
              <p>📦 No donations yet. Create your first donation!</p>
            </div>
          ) : (
            donations.map(donation => (
              <div key={donation.id} className="donation-card">
                {donation.image_url && (
                  <img 
                    src={`http://localhost:5000${donation.image_url}`} 
                    alt={donation.food_type}
                    className="donation-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="donation-info">
                  <h4>{donation.food_type}</h4>
                  <p><strong>Quantity:</strong> {donation.quantity}</p>
                  <p><strong>Status:</strong> <span className={`status-${donation.status}`}>{donation.status}</span></p>
                  <p><strong>Expires:</strong> {new Date(donation.expiry_time).toLocaleString()}</p>
                  {donation.claimed_by_name && (
                    <p><strong>Claimed by:</strong> {donation.claimed_by_name}</p>
                  )}
                </div>
                {donation.status === 'active' && (
                  <button 
                    onClick={() => handleDelete(donation.id)}
                    className="btn-delete"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;