const Payment = require('../models/paymentModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

// Process a payment
exports.processPayment = async (req, res) => {
    const { userId, bookingId, amount } = req.body;

    try {
        // Validate user and booking
        const user = await User.findById(userId);
        const booking = await Booking.findById(bookingId);

        if (!user || !booking) {
            return res.status(404).json({ message: 'User or Booking not found' });
        }

        // Create a new payment record
        const payment = new Payment({
            user: userId,
            booking: bookingId,
            amount,
            status: 'completed', // Assuming payment is successful
        });

        await payment.save();

        res.status(201).json({ message: 'Payment processed successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get payment details
exports.getPaymentDetails = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await Payment.findById(paymentId).populate('user booking');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Refund a payment
exports.refundPayment = async (req, res) => {
    const { paymentId } = req.params;

    try {
        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Update payment status to refunded
        payment.status = 'refunded';
        await payment.save();

        res.status(200).json({ message: 'Payment refunded successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};