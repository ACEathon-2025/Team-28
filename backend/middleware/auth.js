// This file checks if users are logged in and have permission
//===

const jwt = require('jsonwebtoken');

// Main security function - checks if user is logged in
const authenticate = (req, res, next) => {
  try {
    // Get the token from request header
    // Format: "Bearer <token>"
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. Please login.' });
    }

    // Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request so other functions can use it
    req.user = decoded;
    
    // Allow the request to continue
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Check if user is a restaurant
const isRestaurant = (req, res, next) => {
  if (req.user.userType !== 'restaurant') {
    return res.status(403).json({ error: 'Only restaurants can do this.' });
  }
  next();
};

// Check if user is an NGO
const isNGO = (req, res, next) => {
  if (req.user.userType !== 'ngo') {
    return res.status(403).json({ error: 'Only NGOs can do this.' });
  }
  next();
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.userType !== 'admin') {
    return res.status(403).json({ error: 'Only admins can do this.' });
  }
  next();
};

// Check if account is verified
const isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ error: 'Please verify your account first.' });
  }
  next();
};

// Export functions so routes can use them
module.exports = {
  authenticate,
  isRestaurant,
  isNGO,
  isAdmin,
  isVerified
};