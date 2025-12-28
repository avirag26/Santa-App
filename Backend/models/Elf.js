const mongoose = require('mongoose');

const elfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: String,
    required: true,
    enum: ['toy_making', 'gift_wrapping', 'reindeer_care', 'mail_sorting', 'quality_control', 'logistics', 'it_support']
  },
  specialization: [String],
  experienceLevel: {
    type: String,
    enum: ['apprentice', 'journeyman', 'expert', 'master'],
    default: 'apprentice'
  },
  avatar: String,
  currentWorkload: {
    type: Number,
    default: 0,
    max: 100
  },
  assignedGifts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gift'
  }],
  productivity: {
    type: Number,
    default: 100,
    min: 0,
    max: 200
  },
  shift: {
    type: String,
    enum: ['morning', 'afternoon', 'night', 'flexible'],
    default: 'morning'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Elf', elfSchema);