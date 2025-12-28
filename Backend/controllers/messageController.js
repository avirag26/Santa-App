const Message = require('../models/Message');
const Child = require('../models/Child');
const { validationResult } = require('express-validator');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const message = new Message(req.body);
    await message.save();
    
    // Emit real-time message via socket.io
    const { io } = require('../server');
    io.to(`user_${message.recipientId}`).emit('new_message', message);
    
    res.status(201).json({
      message: 'Message sent successfully! 📬',
      data: message
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages for a user
exports.getMessages = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const query = {
      $or: [
        { senderId: userId, sender: userType },
        { recipientId: userId, recipient: userType }
      ]
    };
    
    const messages = await Message.find(query)
      .populate('senderId', 'name email')
      .populate('recipientId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Message.countDocuments(query);
    
    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { user1Id, user1Type, user2Id, user2Type } = req.params;
    
    const messages = await Message.find({
      $or: [
        { senderId: user1Id, sender: user1Type, recipientId: user2Id, recipient: user2Type },
        { senderId: user2Id, sender: user2Type, recipientId: user1Id, recipient: user1Type }
      ]
    })
    .populate('senderId', 'name email')
    .populate('recipientId', 'name email')
    .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Santa's auto-reply to children
exports.santaAutoReply = async (req, res) => {
  try {
    const { childId, originalMessageId } = req.body;
    
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    // Generate personalized Santa reply
    const replies = [
      `Ho ho ho! Dear ${child.name}, I received your wonderful letter! 🎅`,
      `${child.name}, you've been ${child.behaviorScore >= 60 ? 'very good' : 'working hard to be good'} this year!`,
      `I'm checking my list twice, and I see you're from ${child.city}! The elves are excited to work on something special for you.`,
      `Keep being kind and helpful, ${child.name}! Christmas magic works best with good hearts. 🌟`
    ];
    
    const replyContent = replies[Math.floor(Math.random() * replies.length)];
    
    const santaReply = new Message({
      sender: 'santa',
      senderId: '507f1f77bcf86cd799439011', // Santa's ID
      recipient: 'child',
      recipientId: childId,
      subject: `Re: Letter from ${child.name}`,
      content: replyContent,
      messageType: 'reply',
      parentMessage: originalMessageId,
      magicSeal: true
    });
    
    await santaReply.save();
    
    // Update child's letter as replied
    await Child.findByIdAndUpdate(childId, {
      $set: { 'letters.$[elem].replied': true }
    }, {
      arrayFilters: [{ 'elem._id': originalMessageId }]
    });
    
    res.json({
      message: 'Santa replied with Christmas magic! ✨',
      reply: santaReply
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId, userType } = req.params;
    
    const count = await Message.countDocuments({
      recipientId: userId,
      recipient: userType,
      isRead: false
    });
    
    res.json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};