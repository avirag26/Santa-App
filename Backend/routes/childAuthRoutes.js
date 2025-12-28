const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const childAuthController = require('../controllers/childAuthController');
const jwt = require('jsonwebtoken');

// Validation middleware for child registration
const validateChildRegistration = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('age').isInt({ min: 1, max: 18 }).withMessage('Age must be between 1 and 18'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('address').trim().notEmpty().withMessage('Address is required')
];

// Validation middleware for child login
const validateChildLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required')
];

// Child authentication middleware
const authenticateChild = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if this is a child token
    if (decoded.type !== 'child') {
      return res.status(403).json({ message: 'Access denied. Child authentication required.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
router.post('/register', validateChildRegistration, childAuthController.registerChild);
router.post('/login', validateChildLogin, childAuthController.loginChild);
router.get('/profile', authenticateChild, childAuthController.getChildProfile);
router.put('/wishlist', authenticateChild, childAuthController.updateWishlist);

// Test endpoint
router.get('/test', (req, res) => {
  res.json({
    message: 'Child auth endpoint working! 🧒',
    endpoints: {
      register: 'POST /api/child-auth/register',
      login: 'POST /api/child-auth/login',
      profile: 'GET /api/child-auth/profile',
      wishlist: 'PUT /api/child-auth/wishlist'
    }
  });
});

module.exports = router;