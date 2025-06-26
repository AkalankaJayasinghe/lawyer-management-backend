const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getUserBookings,
  getLawyerBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// User booking routes
router.post('/', authorize('user'), createBooking);
router.get('/user', authorize('user'), getUserBookings);

// Lawyer booking routes
router.get('/lawyer', authorize('lawyer'), getLawyerBookings);
router.put('/:id/status', authorize('lawyer', 'admin'), updateBookingStatus);

// Admin routes
router.get('/', authorize('admin'), getBookings);
router.delete('/:id', authorize('admin'), deleteBooking);

// Common route (any authenticated user)
router.get('/:id', getBooking);

module.exports = router;