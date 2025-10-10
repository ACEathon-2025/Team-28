// src/pages/Register.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { authAPI } from '../services/api';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userType: 'restaurant',
    phone: '',
    location: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        userType: formData.userType,
        phone: formData.phone || undefined,
        location: formData.location || undefined,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
      };

      const response = await authAPI.register(registrationData);
      
      if (response.data.token) {
        login(response.data.token, response.data.user);
        alert('Registration successful! Your account is pending admin verification.');
        navigate('/');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError(
        err.response?.data?.error || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <nav className="auth-navbar">
        <Link to="/" className="auth-logo">🌉 FoodBridge</Link>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <h1>Join FoodBridge</h1>
          <p className="auth-subtitle">Create an account to get started</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div className="form-group">
              <label>Account Type</label>
              <div className="user-type-select">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="restaurant"
                    checked={formData.userType === 'restaurant'}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>🍽️ Restaurant</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="userType"
                    value="ngo"
                    checked={formData.userType === 'ngo'}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>🤝 NGO</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;