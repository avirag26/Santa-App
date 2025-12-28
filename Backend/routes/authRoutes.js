const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// Mock admin user (in production, use proper user model)
const adminUser = {
  id: '507f1f77bcf86cd799439011',
  email: 'santa@northpole.com',
  password: 'santa123', // Plain text for development - will be hashed in production
  role: 'santa',
  name: 'Santa Claus'
};

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    console.log('🎅 Login attempt:', { email, passwordLength: password.length });

    // Check if user exists (simplified for demo)
    if (email !== adminUser.email) {
      console.log('❌ Email not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password - simple comparison for development
    if (password !== adminUser.password) {
      console.log('❌ Password mismatch. Expected:', adminUser.password, 'Got:', password);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    console.log('✅ Login successful for:', email);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: adminUser.id, 
        email: adminUser.email, 
        role: adminUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful! 🎅',
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get current user
router.get('/me', verifyToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      name: adminUser.name
    }
  });
});

// Test endpoint to check credentials
router.get('/test', (req, res) => {
  res.json({
    message: 'Auth endpoint working! 🎅',
    credentials: {
      email: adminUser.email,
      password: adminUser.password,
      note: 'Use these exact credentials to login'
    }
  });
});

module.exports = router;