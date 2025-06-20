const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to process a payment
router.post('/process', authMiddleware.verifyToken, paymentController.processPayment);

// Route to get payment details
router.get('/:paymentId', authMiddleware.verifyToken, paymentController.getPaymentDetails);

// Route to list all payments
router.get('/', authMiddleware.verifyToken, paymentController.listPayments);

module.exports = router;