const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to send a message
router.post('/send', authMiddleware.verifyToken, messageController.sendMessage);

// Route to get messages
router.get('/:userId', authMiddleware.verifyToken, messageController.getMessages);

// Route to delete a message
router.delete('/:messageId', authMiddleware.verifyToken, messageController.deleteMessage);

module.exports = router;