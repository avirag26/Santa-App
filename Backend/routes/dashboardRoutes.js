const express = require('express');
const router = express.Router();
const Child = require('../models/Child');
const Gift = require('../models/Gift');
const Elf = require('../models/Elf');
const Message = require('../models/Message');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalChildren,
      totalGifts,
      totalElves,
      totalMessages,
      giftsByStatus,
      childrenByBehavior,
      elvesByDepartment
    ] = await Promise.all([
      Child.countDocuments({ isActive: true }),
      Gift.countDocuments(),
      Elf.countDocuments({ isActive: true }),
      Message.countDocuments(),
      Gift.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Child.aggregate([
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $gte: ['$behaviorScore', 80] }, then: 'Very Nice' },
                  { case: { $gte: ['$behaviorScore', 60] }, then: 'Nice' },
                  { case: { $gte: ['$behaviorScore', 40] }, then: 'Okay' }
                ],
                default: 'Needs Improvement'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]),
      Elf.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      overview: {
        totalChildren,
        totalGifts,
        totalElves,
        totalMessages
      },
      giftsByStatus,
      childrenByBehavior,
      elvesByDepartment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent activities
router.get('/activities', async (req, res) => {
  try {
    const recentMessages = await Message.find()
      .populate('senderId', 'name')
      .populate('recipientId', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentGifts = await Gift.find()
      .populate('recipientChild', 'name')
      .populate('assignedElf', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      recentMessages,
      recentGifts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;