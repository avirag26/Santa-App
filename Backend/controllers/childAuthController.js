const Child = require('../models/Child');
const ChildAuth = require('../models/ChildAuth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new child
exports.registerChild = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, age, email, country, city, address, parentEmail, wishlist } = req.body;

    // Check if child already exists
    const existingChild = await Child.findOne({ email });
    if (existingChild) {
      return res.status(400).json({ message: 'A child with this email is already registered' });
    }

    // Create new child
    const child = new Child({
      name,
      age,
      email,
      country,
      city,
      address,
      parentEmail,
      wishlist: wishlist || [],
      behaviorScore: 75, // Default good behavior
      giftStatus: 'pending'
    });

    await child.save();

    // Generate a simple password for the child (their name + age)
    const defaultPassword = `${name.split(' ')[0].toLowerCase()}${age}`;
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create authentication record
    const childAuth = new ChildAuth({
      childId: child._id,
      email: child.email,
      password: hashedPassword,
      isVerified: true // Auto-verify for demo
    });

    await childAuth.save();

    res.status(201).json({
      message: 'Welcome to Santa\'s Nice List! 🎄',
      child: {
        id: child._id,
        name: child.name,
        email: child.email,
        behaviorScore: child.behaviorScore
      },
      loginInfo: {
        email: child.email,
        password: defaultPassword,
        note: 'Save these credentials to send letters to Santa!'
      }
    });
  } catch (error) {
    console.error('Child registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

// Child login
exports.loginChild = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find child auth record
    const childAuth = await ChildAuth.findOne({ email }).populate('childId');
    if (!childAuth) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (childAuth.isLocked) {
      return res.status(423).json({ message: 'Account temporarily locked. Please try again later.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, childAuth.password);
    if (!isMatch) {
      // Increment login attempts
      childAuth.loginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (childAuth.loginAttempts >= 5) {
        childAuth.lockUntil = Date.now() + 30 * 60 * 1000; // 30 minutes
      }
      
      await childAuth.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    childAuth.loginAttempts = 0;
    childAuth.lockUntil = undefined;
    childAuth.lastLogin = new Date();
    await childAuth.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: childAuth.childId._id,
        email: childAuth.email,
        type: 'child'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Welcome back! 🎅',
      token,
      child: {
        id: childAuth.childId._id,
        name: childAuth.childId.name,
        email: childAuth.childId.email,
        age: childAuth.childId.age,
        behaviorScore: childAuth.childId.behaviorScore,
        giftStatus: childAuth.childId.giftStatus
      }
    });
  } catch (error) {
    console.error('Child login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// Get child profile
exports.getChildProfile = async (req, res) => {
  try {
    const child = await Child.findById(req.user.id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json({
      child: {
        id: child._id,
        name: child.name,
        email: child.email,
        age: child.age,
        country: child.country,
        city: child.city,
        behaviorScore: child.behaviorScore,
        giftStatus: child.giftStatus,
        wishlist: child.wishlist,
        letters: child.letters
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update child wishlist
exports.updateWishlist = async (req, res) => {
  try {
    const { wishlist } = req.body;
    
    const child = await Child.findByIdAndUpdate(
      req.user.id,
      { wishlist },
      { new: true }
    );

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    res.json({
      message: 'Wishlist updated! 🎁',
      wishlist: child.wishlist
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};