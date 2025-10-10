// src/pages/LandingPage.js
// This is the beautiful homepage that people see first!

import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* NAVIGATION BAR - Top of page */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">🌉 FoodBridge</div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link btn-signup">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION - Main banner with big text */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Food Donation Made Simple</h1>
          <p className="hero-subtitle">
            Connecting restaurants with NGOs to reduce waste and fight hunger
          </p>
          
          {/* Two big buttons */}
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-large btn-primary">
              I'm a Restaurant 🍽️
            </Link>
            <Link to="/register" className="btn btn-large btn-secondary">
              I'm an NGO 🤝
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - Why use FoodBridge */}
      <section className="features">
        <h2>Why Choose FoodBridge?</h2>
        
        <div className="feature-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>AI Food Recognition</h3>
            <p>Simply upload a photo and our AI automatically identifies the food type</p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Smart Matching</h3>
            <p>Algorithm matches donations with NGOs based on location and preferences</p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-Time Updates</h3>
            <p>Get instant notifications when donations are posted or claimed</p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Impact Tracking</h3>
            <p>See the real difference you're making with detailed analytics</p>
          </div>

          {/* Feature 5 */}
          <div className="feature-card">
            <div className="feature-icon">🕐</div>
            <h3>Freshness Predictor</h3>
            <p>Weather-adjusted predictions ensure food safety</p>
          </div>

          {/* Feature 6 */}
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Verified</h3>
            <p>All users are verified to ensure trust and food safety</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - Step by step explanation */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Restaurant Posts</h3>
            <p>Upload food photos and details. AI identifies the food type automatically.</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Matches</h3>
            <p>Smart algorithm finds the best NGO matches based on multiple factors.</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>NGO Claims</h3>
            <p>NGOs browse and claim donations with one click.</p>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <h3>Pickup Scheduled</h3>
            <p>Coordinate pickup time and complete the donation. Track your impact!</p>
          </div>
        </div>
      </section>

      {/* IMPACT SECTION - Show statistics */}
      <section className="impact">
        <h2>Our Impact</h2>
        
        <div className="impact-grid">
          <div className="impact-item">
            <div className="impact-number">1,247</div>
            <p>Meals Donated</p>
          </div>

          <div className="impact-item">
            <div className="impact-number">523kg</div>
            <p>Food Saved</p>
          </div>

          <div className="impact-item">
            <div className="impact-number">89</div>
            <p>Active Restaurants</p>
          </div>

          <div className="impact-item">
            <div className="impact-number">34</div>
            <p>Partner NGOs</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION - Another button section */}
      <section className="cta">
        <h2>Ready to Make a Difference?</h2>
        <p>Join FoodBridge today and be part of the solution</p>
        <Link to="/register" className="btn btn-large btn-primary">
          Get Started Now 🚀
        </Link>
      </section>

      {/* FOOTER - Bottom of page */}
      <footer className="footer">
        <p>&copy; 2025 FoodBridge. Making a difference, one meal at a time. 🌉</p>
      </footer>
    </div>
  );
}

export default LandingPage;