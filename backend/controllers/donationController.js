// This file handles all donation operations
//===

const { query } = require('../config/database');

// CREATE DONATION - Restaurant posts food donation
exports.createDonation = async (req, res) => {
  try {
    const { foodType, foodCategory, quantity, quantityKg, expiryHours, location, latitude, longitude, notes } = req.body;
    
    // Get image URL if image was uploaded
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // Calculate when food expires (current time + expiry hours)
    const expiryTime = new Date(Date.now() + expiryHours * 60 * 60 * 1000);

    // Insert donation into database
    const result = await query(
      `INSERT INTO donations 
       (restaurant_id, food_type, food_category, quantity, quantity_kg, 
        expiry_hours, expiry_time, location, latitude, longitude, notes, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [req.user.userId, foodType, foodCategory, quantity, quantityKg, 
       expiryHours, expiryTime, location, latitude, longitude, notes, imageUrl]
    );

    // Update restaurant statistics
    await query(
      `UPDATE restaurant_details 
       SET total_donations = total_donations + 1,
           total_food_saved_kg = total_food_saved_kg + $1
       WHERE user_id = $2`,
      [quantityKg || 0, req.user.userId]
    );

    // Notify all NGOs about new donation
    await query(
      `INSERT INTO notifications (user_id, title, message, type, reference_id)
       SELECT id, 'New Donation Available', 
              'A new ' || $1 || ' donation is available!',
              'new_donation', $2
       FROM users WHERE user_type = 'ngo' AND is_active = true`,
      [foodType, result.rows[0].id]
    );

    res.status(201).json({
      message: 'Donation created successfully!',
      donation: result.rows[0]
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ error: 'Failed to create donation. Please try again.' });
  }
};

// GET ALL DONATIONS - NGO views available donations
exports.getDonations = async (req, res) => {
  try {
    const { status, foodType, maxDistance, latitude, longitude } = req.query;

    // Build SQL query with filters
    let queryText = `
      SELECT d.*, u.name as restaurant_name, u.phone as restaurant_phone,
             u.location as restaurant_location
      FROM donations d
      JOIN users u ON d.restaurant_id = u.id
      WHERE d.status = COALESCE($1, d.status)
    `;
    
    const params = [status || 'active'];

    // Filter by food type if provided
    if (foodType) {
      queryText += ` AND d.food_type = $${params.length + 1}`;
      params.push(foodType);
    }

    // Calculate distance if coordinates provided (finds donations within X km)
    if (latitude && longitude && maxDistance) {
      queryText += ` AND (
        6371 * acos(
          cos(radians($${params.length + 1})) * cos(radians(d.latitude)) *
          cos(radians(d.longitude) - radians($${params.length + 2})) +
          sin(radians($${params.length + 1})) * sin(radians(d.latitude))
        )
      ) <= $${params.length + 3}`;
      params.push(latitude, longitude, maxDistance);
    }

    queryText += ' ORDER BY d.created_at DESC';

    const result = await query(queryText, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

// GET MY DONATIONS - Restaurant views their donations
exports.getMyDonations = async (req, res) => {
  try {
    const result = await query(
      `SELECT d.*, u.name as claimed_by_name
       FROM donations d
       LEFT JOIN users u ON d.claimed_by = u.id
       WHERE d.restaurant_id = $1
       ORDER BY d.created_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get my donations error:', error);
    res.status(500).json({ error: 'Failed to fetch your donations' });
  }
};

// GET CLAIMED DONATIONS - NGO views donations they claimed
exports.getClaimedDonations = async (req, res) => {
  try {
    const result = await query(
      `SELECT d.*, u.name as restaurant_name, u.phone as restaurant_phone,
              u.location as restaurant_location
       FROM donations d
       JOIN users u ON d.restaurant_id = u.id
       WHERE d.claimed_by = $1
       ORDER BY d.claimed_at DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get claimed donations error:', error);
    res.status(500).json({ error: 'Failed to fetch claimed donations' });
  }
};

// CLAIM DONATION - NGO claims a donation
exports.claimDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { scheduledPickupTime } = req.body;

    // Check if donation exists and is available
    const donationCheck = await query(
      'SELECT * FROM donations WHERE id = $1 AND status = $2',
      [donationId, 'active']
    );

    if (donationCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Donation not available or already claimed' });
    }

    // Update donation status to claimed
    await query(
      `UPDATE donations 
       SET status = 'claimed', claimed_by = $1, claimed_at = NOW()
       WHERE id = $2`,
      [req.user.userId, donationId]
    );

    // Create pickup record
    const pickup = await query(
      `INSERT INTO donation_pickups (donation_id, ngo_id, scheduled_pickup_time)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [donationId, req.user.userId, scheduledPickupTime]
    );

    // Update NGO statistics
    await query(
      'UPDATE ngo_details SET total_claims = total_claims + 1 WHERE user_id = $1',
      [req.user.userId]
    );

    // Notify restaurant
    await query(
      `INSERT INTO notifications (user_id, title, message, type, reference_id)
       VALUES ($1, 'Donation Claimed', 'Your donation has been claimed by an NGO!', 'donation_claimed', $2)`,
      [donationCheck.rows[0].restaurant_id, donationId]
    );

    res.json({
      message: 'Donation claimed successfully!',
      pickup: pickup.rows[0]
    });
  } catch (error) {
    console.error('Claim donation error:', error);
    res.status(500).json({ error: 'Failed to claim donation' });
  }
};

// COMPLETE DONATION - NGO marks donation as picked up
exports.completeDonation = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { rating, feedback } = req.body;

    // Update donation to completed
    await query(
      `UPDATE donations 
       SET status = 'completed', completed_at = NOW()
       WHERE id = $1`,
      [donationId]
    );

    // Update pickup record
    await query(
      `UPDATE donation_pickups 
       SET status = 'picked_up', actual_pickup_time = NOW(), rating = $2, feedback = $3
       WHERE donation_id = $1`,
      [donationId, rating, feedback]
    );

    // Update restaurant impact score (give points for rating)
    await query(
      `UPDATE restaurant_details 
       SET impact_score = impact_score + $1
       WHERE user_id = (SELECT restaurant_id FROM donations WHERE id = $2)`,
      [rating || 5, donationId]
    );

    res.json({ message: 'Donation marked as completed!' });
  } catch (error) {
    console.error('Complete donation error:', error);
    res.status(500).json({ error: 'Failed to complete donation' });
  }
};

// DELETE/CANCEL DONATION - Restaurant cancels donation
exports.deleteDonation = async (req, res) => {
  try {
    const { donationId } = req.params;

    // Check if donation belongs to this restaurant
    const check = await query(
      'SELECT status FROM donations WHERE id = $1 AND restaurant_id = $2',
      [donationId, req.user.userId]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Can't delete if already claimed
    if (check.rows[0].status === 'claimed') {
      return res.status(400).json({ error: 'Cannot cancel claimed donation. Contact NGO first.' });
    }

    // Cancel donation
    await query(
      'UPDATE donations SET status = $1 WHERE id = $2',
      ['cancelled', donationId]
    );

    res.json({ message: 'Donation cancelled successfully' });
  } catch (error) {
    console.error('Delete donation error:', error);
    res.status(500).json({ error: 'Failed to cancel donation' });
  }
};

// GET STATISTICS - Get user's donation stats for dashboard
exports.getDonationStats = async (req, res) => {
  try {
    let stats = {};

    if (req.user.userType === 'restaurant') {
      // Restaurant statistics
      const result = await query(
        `SELECT 
          COUNT(*) FILTER (WHERE status = 'active') as active_donations,
          COUNT(*) as total_donations,
          COALESCE(SUM(quantity_kg), 0) as total_food_saved,
          rd.impact_score
         FROM donations d
         LEFT JOIN restaurant_details rd ON rd.user_id = d.restaurant_id
         WHERE d.restaurant_id = $1
         GROUP BY rd.impact_score`,
        [req.user.userId]
      );
      stats = result.rows[0] || { 
        active_donations: 0, 
        total_donations: 0, 
        total_food_saved: 0, 
        impact_score: 0 
      };
    } else if (req.user.userType === 'ngo') {
      // NGO statistics
      const result = await query(
        `SELECT 
          COUNT(*) FILTER (WHERE status = 'claimed') as active_claims,
          COUNT(*) as total_claims,
          nd.people_served
         FROM donations d
         LEFT JOIN ngo_details nd ON nd.user_id = d.claimed_by
         WHERE d.claimed_by = $1
         GROUP BY nd.people_served`,
        [req.user.userId]
      );
      stats = result.rows[0] || { 
        active_claims: 0, 
        total_claims: 0, 
        people_served: 0 
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};