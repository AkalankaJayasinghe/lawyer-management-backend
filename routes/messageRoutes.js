const express = require('express');
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to send a message
router.post('/send', protect, messageController.sendMessage);

// Route to get messages with a user
router.get('/:userId', protect, messageController.getMessages);

// Route to delete a message
router.delete('/:messageId', protect, messageController.deleteMessage);

module.exports = router;