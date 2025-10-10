// src/App.js
// Main component that controls the entire app

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';


// Import pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDashboard from './pages/RestaurantDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';

// Create a Context to share user data across the entire app
// Think of it like a shared storage
export const AuthContext = React.createContext();

function App() {
  // State variables
  const [user, setUser] = useState(null);           // Current logged in user
  const [loading, setLoading] = useState(true);     // Is app loading?

  // When app first loads, check if user is already logged in
  useEffect(() => {
    // Check if token exists in browser storage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // User is already logged in
      setUser(JSON.parse(userData));
    }
    
    // Stop loading
    setLoading(false);
  }, []);

  // Function to login user
  const login = (token, userData) => {
    // Save to browser storage (persists after page refresh)
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Update state
    setUser(userData);
  };

  // Function to logout user
  const logout = () => {
    // Remove from browser storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Update state
    setUser(null);
  };

  // Protected Route - only logged in users can visit
  const ProtectedRoute = ({ children, allowedTypes }) => {
    // If not logged in, send to login page
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    // If user type not allowed, send to home
    if (allowedTypes && !allowedTypes.includes(user.userType)) {
      return <Navigate to="/" replace />;
    }
    
    // Allow access
    return children;
  };

  // While checking if user is logged in, show loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading FoodBridge...</p>
      </div>
    );
  }

  return (
    // Provide user data to all components
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES - Anyone can visit */}
          <Route path="/" element={<LandingPage />} />
          
          {/* If already logged in, don't let them visit login/register */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login />} 
          />
          
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" /> : <Register />} 
          />

          {/* PROTECTED ROUTES - Only logged in users */}
          <Route 
            path="/restaurant" 
            element={
              <ProtectedRoute allowedTypes={['restaurant']}>
                <RestaurantDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/ngo" 
            element={
              <ProtectedRoute allowedTypes={['ngo']}>
                <NGODashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedTypes={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;