const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const childController = require('../controllers/childController');

// Validation middleware
const validateChild = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('age').isInt({ min: 1, max: 18 }).withMessage('Age must be between 1 and 18'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('address').trim().notEmpty().withMessage('Address is required')
];

// Routes
router.get('/', childController.getAllChildren);
router.get('/stats', childController.getNiceNaughtyStats);
router.get('/:id', childController.getChildById);
router.post('/', validateChild, childController.createChild);
router.put('/:id', childController.updateChild);
router.patch('/:id/behavior', childController.updateBehaviorScore);
router.post('/:id/wishlist', childController.addToWishlist);

module.exports = router;