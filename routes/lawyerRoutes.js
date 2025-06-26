const express = require('express');
const lawyerController = require('../controllers/lawyerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public GET routes
router.get('/lawyers', lawyerController.getLawyers);
router.get('/lawyers/:id', lawyerController.getLawyerById);
router.get('/specializations', lawyerController.getSpecializations);

// Protected Lawyer profile routes
router.post('/profile', protect, lawyerController.createLawyerProfile);
router.put('/profile/:id', protect, lawyerController.updateLawyerProfile);
router.delete('/profile/:id', protect, lawyerController.deleteLawyerProfile);

module.exports = router;