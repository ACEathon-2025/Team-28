// This file handles user authentication (login, signup, profile)
//===

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// REGISTER - Create new user account
exports.register = async (req, res) => {
  try {
    const { email, password, userType, name, phone, location, latitude, longitude } = req.body;

    // Check if user type is valid
    if (!['restaurant', 'ngo'].includes(userType)) {
      return res.status(400).json({ error: 'User type must be restaurant or ngo' });
    }

    // Check if email already exists
    const userExists = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Encrypt password (so it's secure in database)
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new user into database
    const result = await query(
      `INSERT INTO users (email, password_hash, user_type, name, phone, location, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, user_type, name, is_verified`,
      [email, passwordHash, userType, name, phone, location, latitude, longitude]
    );

    const user = result.rows[0];

    // Create details table entry
    if (userType === 'restaurant') {
      await query(
        'INSERT INTO restaurant_details (user_id) VALUES ($1)',
        [user.id]
      );
    } else if (userType === 'ngo') {
      await query(
        'INSERT INTO ngo_details (user_id) VALUES ($1)',
        [user.id]
      );
    }

    // Generate login token
    const token = jwt.sign(
      { userId: user.id, userType: user.user_type, isVerified: user.is_verified },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send success response
    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        isVerified: user.is_verified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// LOGIN - User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', email); // Add this line

    // Find user by email
    const result = await query(
      'SELECT id, email, password_hash, user_type, name, is_verified, is_active FROM users WHERE email = $1',
      [email]
    );

    console.log('👤 User found:', result.rows.length > 0 ? result.rows[0].email : 'NOT FOUND'); // Add this

    if (result.rows.length === 0) {
      console.log('❌ User not found:', email); // Add this
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    console.log('📋 User type:', user.user_type, 'Verified:', user.is_verified, 'Active:', user.is_active); // Add this

    if (!user.is_active) {
      console.log('❌ Account inactive'); // Add this
      return res.status(403).json({ error: 'Account has been deactivated' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔑 Password valid:', validPassword); // Add this

    if (!validPassword) {
      console.log('❌ Invalid password'); // Add this
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate login token
    const token = jwt.sign(
      { userId: user.id, userType: user.user_type, isVerified: user.is_verified },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send success response
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.user_type,
        isVerified: user.is_verified
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error); // Add this
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// GET PROFILE - Get current user info
exports.getProfile = async (req, res) => {
  try {
    const result = await query(
      `SELECT u.id, u.email, u.name, u.user_type, u.phone, u.location, 
              u.address, u.latitude, u.longitude, u.is_verified, u.created_at
       FROM users u
       WHERE u.id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    // Get type-specific details
    if (user.user_type === 'restaurant') {
      const details = await query(
        `SELECT total_donations, total_food_saved_kg, impact_score
         FROM restaurant_details WHERE user_id = $1`,
        [user.id]
      );
      user.details = details.rows[0];
    } else if (user.user_type === 'ngo') {
      const details = await query(
        `SELECT total_claims, people_served
         FROM ngo_details WHERE user_id = $1`,
        [user.id]
      );
      user.details = details.rows[0];
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// UPDATE PROFILE - Update user info
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, location, address, latitude, longitude } = req.body;
    
    const result = await query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           location = COALESCE($3, location),
           address = COALESCE($4, address),
           latitude = COALESCE($5, latitude),
           longitude = COALESCE($6, longitude)
       WHERE id = $7
       RETURNING id, name, email, phone, location, address`,
      [name, phone, location, address, latitude, longitude, req.user.userId]
    );

    res.json({
      message: 'Profile updated successfully!',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
