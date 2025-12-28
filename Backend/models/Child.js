const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 18
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  behaviorScore: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },
  wishlist: [{
    item: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    category: String,
    dateAdded: {
      type: Date,
      default: Date.now
    }
  }],
  letters: [{
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    replied: {
      type: Boolean,
      default: false
    }
  }],
  giftStatus: {
    type: String,
    enum: ['pending', 'approved', 'in_production', 'ready', 'delivered'],
    default: 'pending'
  },
  specialNotes: String,
  parentEmail: String,
  avatar: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for nice/naughty status
childSchema.virtual('niceStatus').get(function() {
  if (this.behaviorScore >= 80) return 'Very Nice';
  if (this.behaviorScore >= 60) return 'Nice';
  if (this.behaviorScore >= 40) return 'Okay';
  return 'Needs Improvement';
});

module.exports = mongoose.model('Child', childSchema);