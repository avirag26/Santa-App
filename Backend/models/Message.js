const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    enum: ['santa', 'child', 'elf', 'parent']
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  recipient: {
    type: String,
    required: true,
    enum: ['santa', 'child', 'elf', 'parent']
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  subject: String,
  content: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['letter', 'reply', 'notification', 'gift_update', 'behavior_report'],
    default: 'letter'
  },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  tags: [String],
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  magicSeal: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);