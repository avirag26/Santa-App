const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const messageController = require('../controllers/messageController');

// Validation middleware
const validateMessage = [
  body('content').trim().isLength({ min: 1 }).withMessage('Message content is required'),
  body('sender').isIn(['santa', 'child', 'elf', 'parent']).withMessage('Invalid sender type'),
  body('recipient').isIn(['santa', 'child', 'elf', 'parent']).withMessage('Invalid recipient type')
];

// Routes
router.post('/', validateMessage, messageController.sendMessage);
router.get('/:userType/:userId', messageController.getMessages);
router.get('/conversation/:user1Type/:user1Id/:user2Type/:user2Id', messageController.getConversation);
router.patch('/:id/read', messageController.markAsRead);
router.post('/santa-reply', messageController.santaAutoReply);
router.get('/unread/:userType/:userId', messageController.getUnreadCount);

module.exports = router;