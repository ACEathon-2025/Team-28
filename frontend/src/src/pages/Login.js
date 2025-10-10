// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { authAPI } from '../services/api';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.data.token) {
        // Save to context
        login(response.data.token, response.data.user);
        
        // Redirect based on user type
        const userType = response.data.user.userType;
        if (userType === 'restaurant') {
          navigate('/restaurant');
        } else if (userType === 'ngo') {
          navigate('/ngo');
        } else if (userType === 'admin') {
          navigate('/admin');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.error || 
        'Login failed. Please check your email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Navigation */}
      <nav className="auth-navbar">
        <Link to="/" className="auth-logo">🌉 FoodBridge</Link>
      </nav>

      {/* Login Form */}
      <div className="auth-container">
        <div className="auth-card">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Login to your FoodBridge account</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
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

            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>

          {/* Demo Credentials */}
          <div className="demo-section">
            <h4>Demo Credentials:</h4>
            <div className="demo-card">
              <p><strong>Admin:</strong></p>
              <p>📧 admin@foodbridge.com</p>
              <p>🔑 admin123</p>
            </div>
            <div className="demo-card">
              <p><strong>Restaurant:</strong></p>
              <p>📧 restaurant@test.com</p>
              <p>🔑 admin123</p>
            </div>
            <div className="demo-card">
              <p><strong>NGO:</strong></p>
              <p>📧 ngo@test.com</p>
              <p>🔑 admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;