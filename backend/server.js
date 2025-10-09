// =========================================
// FoodBridge Backend Server
// This is the main entry point
// =========================================
//===

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const adminRoutes = require('./routes/admin');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// =========================================
// MIDDLEWARE (Things that run for every request)
// =========================================

// Security headers
app.use(helmet());

// Allow cross-origin requests (so frontend can talk to backend)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Log requests to console (for debugging)
app.use(morgan('dev'));

// Parse JSON in request body
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images (so they can be viewed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting (prevent spam/attacks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// =========================================
// ROUTES (URL endpoints)
// =========================================

// Authentication routes (login, signup, profile)
app.use('/api/auth', authRoutes);

// Donation routes (create, view, claim donations)
app.use('/api/donations', donationRoutes);

// Admin routes (manage users, view stats)
app.use('/api/admin', adminRoutes);

// =========================================
// SPECIAL ROUTES
// =========================================

// Health check endpoint (to verify server is running)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FoodBridge API is running!',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to FoodBridge API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      donations: '/api/donations',
      admin: '/api/admin'
    }
  });
});

// =========================================
// ERROR HANDLING
// =========================================

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler (when URL doesn't exist)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path 
  });
});

// =========================================
// START SERVER
// =========================================

app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🌉 FoodBridge Backend Server');
  console.log('========================================');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}`);
  console.log('========================================\n');
  console.log('📡 API Endpoints:');
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log(`   Auth: http://localhost:${PORT}/api/auth`);
  console.log(`   Donations: http://localhost:${PORT}/api/donations`);
  console.log(`   Admin: http://localhost:${PORT}/api/admin`);
  console.log('\n✅ Server is ready! Press Ctrl+C to stop.\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});