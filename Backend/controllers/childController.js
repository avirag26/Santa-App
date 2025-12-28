const Child = require('../models/Child');
const Message = require('../models/Message');
const { validationResult } = require('express-validator');

// Get all children
exports.getAllChildren = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, country, behaviorScore } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (country) query.country = country;
    if (behaviorScore) query.behaviorScore = { $gte: parseInt(behaviorScore) };
    
    const children = await Child.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ behaviorScore: -1, createdAt: -1 });
    
    const total = await Child.countDocuments(query);
    
    res.json({
      children,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get child by ID
exports.getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.json(child);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new child
exports.createChild = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const child = new Child(req.body);
    await child.save();
    
    res.status(201).json({
      message: 'Child registered successfully! 🎄',
      child
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update child
exports.updateChild = async (req, res) => {
  try {
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.json({
      message: 'Child updated successfully! ✨',
      child
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update behavior score
exports.updateBehaviorScore = async (req, res) => {
  try {
    const { score, reason } = req.body;
    
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      { 
        behaviorScore: score,
        $push: {
          letters: {
            content: `Behavior update: ${reason}`,
            date: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.json({
      message: 'Behavior score updated! 🌟',
      child
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { item, priority, category } = req.body;
    
    const child = await Child.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          wishlist: { item, priority, category }
        }
      },
      { new: true }
    );
    
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.json({
      message: 'Added to wishlist! 🎁',
      child
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get nice/naughty statistics
exports.getNiceNaughtyStats = async (req, res) => {
  try {
    const stats = await Child.aggregate([
      {
        $group: {
          _id: null,
          veryNice: { $sum: { $cond: [{ $gte: ['$behaviorScore', 80] }, 1, 0] } },
          nice: { $sum: { $cond: [{ $and: [{ $gte: ['$behaviorScore', 60] }, { $lt: ['$behaviorScore', 80] }] }, 1, 0] } },
          okay: { $sum: { $cond: [{ $and: [{ $gte: ['$behaviorScore', 40] }, { $lt: ['$behaviorScore', 60] }] }, 1, 0] } },
          needsImprovement: { $sum: { $cond: [{ $lt: ['$behaviorScore', 40] }, 1, 0] } },
          total: { $sum: 1 }
        }
      }
    ]);
    
    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};