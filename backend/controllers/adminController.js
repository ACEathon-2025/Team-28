// This file handles admin operations
//===

const { query } = require('../config/database');

// GET DASHBOARD STATS - Admin sees overview
exports.getDashboardStats = async (req, res) => {
  try {
    // Get overall statistics
    const stats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE user_type = 'restaurant' AND is_active = true) as total_restaurants,
        (SELECT COUNT(*) FROM users WHERE user_type = 'ngo' AND is_active = true) as total_ngos,
        (SELECT COUNT(*) FROM donations) as total_donations,
        (SELECT COUNT(*) FROM donations WHERE status = 'active') as active_donations,
        (SELECT COUNT(*) FROM donations WHERE status = 'completed') as completed_donations,
        (SELECT COALESCE(SUM(quantity_kg), 0) FROM donations WHERE status = 'completed') as total_food_saved,
        (SELECT COUNT(*) FROM users WHERE is_verified = false) as pending_verifications
    `);

    // Get recent donations
    const recentDonations = await query(`
      SELECT d.*, u.name as restaurant_name
      FROM donations d
      JOIN users u ON d.restaurant_id = u.id
      ORDER BY d.created_at DESC
      LIMIT 10
    `);

    // Get monthly trends (last 6 months)
    const monthlyTrends = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as donation_count,
        COALESCE(SUM(quantity_kg), 0) as food_saved_kg
      FROM donations
      WHERE created_at >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month
    `);

    res.json({
      stats: stats.rows[0],
      recentDonations: recentDonations.rows,
      monthlyTrends: monthlyTrends.rows
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

// GET ALL USERS - Admin views all users
exports.getAllUsers = async (req, res) => {
  try {
    const { userType, isVerified, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT u.id, u.email, u.name, u.user_type, u.phone, u.location,
             u.is_verified, u.is_active, u.created_at
      FROM users u
      WHERE u.user_type != 'admin'
    `;
    const params = [];

    // Filter by user type if specified
    if (userType) {
      params.push(userType);
      queryText += ` AND u.user_type = $${params.length}`;
    }

    // Filter by verification status if specified
    if (isVerified !== undefined) {
      params.push(isVerified === 'true');
      queryText += ` AND u.is_verified = $${params.length}`;
    }

    queryText += ` ORDER BY u.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    // Get total count for pagination
    const countResult = await query(
      'SELECT COUNT(*) FROM users WHERE user_type != $1',
      ['admin']
    );

    res.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// VERIFY USER - Admin verifies restaurant/NGO
exports.verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Mark user as verified
    await query(
      'UPDATE users SET is_verified = true WHERE id = $1',
      [userId]
    );

    // Notify user
    await query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'Account Verified', 'Your account has been verified! You can now use all features.', 'verification')`,
      [userId]
    );

    res.json({ message: 'User verified successfully' });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({ error: 'Failed to verify user' });
  }
};

// TOGGLE USER STATUS - Admin activates/deactivates user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    await query(
      'UPDATE users SET is_active = $1 WHERE id = $2',
      [isActive, userId]
    );

    res.json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

// DELETE USER - Admin deletes user account
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user has active donations
    const check = await query(
      'SELECT COUNT(*) FROM donations WHERE restaurant_id = $1 AND status = $2',
      [userId, 'active']
    );

    if (parseInt(check.rows[0].count) > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete user with active donations' 
      });
    }

    // Delete user (cascades to related tables)
    await query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// GET ALL DONATIONS - Admin views all donations
exports.getAllDonations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT d.*, 
             r.name as restaurant_name, r.email as restaurant_email,
             n.name as ngo_name, n.email as ngo_email
      FROM donations d
      JOIN users r ON d.restaurant_id = r.id
      LEFT JOIN users n ON d.claimed_by = n.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      queryText += ` AND d.status = $${params.length}`;
    }

    queryText += ` ORDER BY d.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    const countResult = await query('SELECT COUNT(*) FROM donations');

    res.json({
      donations: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (error) {
    console.error('Get all donations error:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

// GET ACTIVITY LOGS - Admin views activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await query(
      `SELECT al.*, u.name as user_name, u.email as user_email
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json({
      logs: result.rows,
      page: parseInt(page)
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ error: 'Failed to fetch activity logs' });
  }
};