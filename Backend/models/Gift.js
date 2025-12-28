const mongoose = require('mongoose');

const giftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['toys', 'books', 'games', 'electronics', 'clothes', 'sports', 'art', 'music', 'other']
  },
  description: String,
  image: String,
  ageRange: {
    min: Number,
    max: Number
  },
  productionTime: {
    type: Number, // in hours
    default: 24
  },
  materials: [String],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  },
  assignedElf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Elf'
  },
  status: {
    type: String,
    enum: ['design', 'in_production', 'quality_check', 'completed', 'shipped'],
    default: 'design'
  },
  recipientChild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child'
  },
  magicLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  specialInstructions: String,
  completionDate: Date,
  shippingDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Gift', giftSchema);