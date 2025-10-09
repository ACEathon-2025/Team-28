// This file defines donation routes (URLs)
//===

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const donationController = require('../controllers/donationController');
const { authenticate, isRestaurant, isNGO, isVerified } = require('../middleware/auth');

// Configure file upload settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to uploads folder
  },
  filename: (req, file, cb) => {
    // Generate unique filename: food-1234567890.jpg
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'food-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Check if file is an image
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Initialize multer with settings
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Validation rules for creating donation
const createDonationValidation = [
  body('foodType').notEmpty().withMessage('Food type is required'),
  body('quantity').notEmpty().withMessage('Quantity is required'),
  body('expiryHours').isInt({ min: 1, max: 48 }).withMessage('Expiry hours must be between 1 and 48'),
  body('location').notEmpty().withMessage('Location is required')
];

// PUBLIC ROUTES (for NGOs to browse)
// GET /api/donations - Browse all available donations
router.get('/', authenticate, donationController.getDonations);

// GET /api/donations/stats - Get my statistics
router.get('/stats', authenticate, donationController.getDonationStats);

// RESTAURANT ONLY ROUTES
// POST /api/donations - Create new donation (with image upload)
router.post(
  '/', 
  authenticate, 
  isRestaurant, 
  isVerified, 
  upload.single('image'), // Handle single image upload
  createDonationValidation, 
  donationController.createDonation
);

// GET /api/donations/my-donations - Get my donations
router.get('/my-donations', authenticate, isRestaurant, donationController.getMyDonations);

// DELETE /api/donations/:donationId - Cancel donation
router.delete('/:donationId', authenticate, isRestaurant, donationController.deleteDonation);

// NGO ONLY ROUTES
// GET /api/donations/claimed - Get donations I claimed
router.get('/claimed', authenticate, isNGO, donationController.getClaimedDonations);

// POST /api/donations/:donationId/claim - Claim a donation
router.post('/:donationId/claim', authenticate, isNGO, isVerified, donationController.claimDonation);

// PUT /api/donations/:donationId/complete - Mark as picked up
router.put('/:donationId/complete', authenticate, isNGO, donationController.completeDonation);

module.exports = router;