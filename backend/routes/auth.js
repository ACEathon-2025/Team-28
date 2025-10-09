// This file defines authentication routes (URLs)
//===

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Validation rules for registration
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('userType').isIn(['restaurant', 'ngo']).withMessage('User type must be restaurant or ngo')
];

// Validation rules for login
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// PUBLIC ROUTES (anyone can access)
// POST /api/auth/register - Register new account
router.post('/register', registerValidation, authController.register);

// POST /api/auth/login - Login to account
router.post('/login', loginValidation, authController.login);

// PROTECTED ROUTES (must be logged in)
// GET /api/auth/profile - Get my profile
router.get('/profile', authenticate, authController.getProfile);

// PUT /api/auth/profile - Update my profile
router.put('/profile', authenticate, authController.updateProfile);

// Export router so server.js can use it
module.exports = router;
