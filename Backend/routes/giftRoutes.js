const express = require('express');
const router = express.Router();
const Gift = require('../models/Gift');

// Get all gifts
router.get('/', async (req, res) => {
  try {
    const { status, category, childId, page = 1, limit = 10 } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (childId) query.recipientChild = childId;
    
    const gifts = await Gift.find(query)
      .populate('assignedElf', 'name department')
      .populate('recipientChild', 'name age')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Gift.countDocuments(query);
    
    res.json({
      gifts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create gift
router.post('/', async (req, res) => {
  try {
    const gift = new Gift(req.body);
    await gift.save();
    res.status(201).json({ message: 'Gift created! 🎁', gift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update gift status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const gift = await Gift.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('assignedElf recipientChild');
    
    if (!gift) {
      return res.status(404).json({ message: 'Gift not found' });
    }
    
    res.json({ message: 'Gift status updated! ✨', gift });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;