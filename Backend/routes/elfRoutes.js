const express = require('express');
const router = express.Router();
const Elf = require('../models/Elf');

// Get all elves
router.get('/', async (req, res) => {
  try {
    const { department, shift } = req.query;
    let query = { isActive: true };
    
    if (department) query.department = department;
    if (shift) query.shift = shift;
    
    const elves = await Elf.find(query)
      .populate('assignedGifts', 'name status')
      .sort({ productivity: -1 });
    
    res.json(elves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create elf
router.post('/', async (req, res) => {
  try {
    const elf = new Elf(req.body);
    await elf.save();
    res.status(201).json({ message: 'Elf hired! 🧝‍♀️', elf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update elf workload
router.patch('/:id/workload', async (req, res) => {
  try {
    const { workload } = req.body;
    const elf = await Elf.findByIdAndUpdate(
      req.params.id,
      { currentWorkload: workload },
      { new: true }
    );
    
    res.json({ message: 'Workload updated! 💪', elf });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;