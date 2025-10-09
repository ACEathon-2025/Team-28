// This file defines admin routes (URLs)
//===

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, isAdmin } = require('../middleware/auth');

// ALL routes require admin authentication
router.use(authenticate, isAdmin);

// DASHBOARD & STATISTICS
// GET /api/admin/dashboard - Get overview statistics
router.get('/dashboard', adminController.getDashboardStats);

// USER MANAGEMENT
// GET /api/admin/users - Get all users (with filters)
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:userId/verify - Verify a user
router.put('/users/:userId/verify', adminController.verifyUser);

// PUT /api/admin/users/:userId/toggle-status - Activate/deactivate user
router.put('/users/:userId/toggle-status', adminController.toggleUserStatus);

// DELETE /api/admin/users/:userId - Delete user
router.delete('/users/:userId', adminController.deleteUser);

// DONATION MANAGEMENT
// GET /api/admin/donations - Get all donations
router.get('/donations', adminController.getAllDonations);

// ACTIVITY LOGS
// GET /api/admin/logs - Get activity logs
router.get('/logs', adminController.getActivityLogs);

module.exports = router;