const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-payment', protect, paymentController.createPayment);
router.get('/payments', protect, paymentController.getUserPayments);
router.get('/payments/:id', protect, paymentController.getPaymentById);
router.get('/payment-history', protect, paymentController.getPaymentHistory);

module.exports = router;