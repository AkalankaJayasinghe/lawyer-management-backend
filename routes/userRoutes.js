const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get user profile
router.get('/profile', authMiddleware.verifyToken, userController.getUserProfile);

// Route to update user information
router.put('/profile', authMiddleware.verifyToken, userController.updateUserProfile);

// Route to delete user account
router.delete('/profile', authMiddleware.verifyToken, userController.deleteUserAccount);

module.exports = router;