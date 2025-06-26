const Booking = require('../models/bookingModel');
const Lawyer = require('../models/lawyerModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/emailService');
const generatePDF = require('../utils/pdfGenerator');

// Create new booking
exports.createBooking = async (req, res) => {
  try {
    req.body.user = req.user._id;
    const lawyer = await Lawyer.findById(req.body.lawyer);
    if (!lawyer) return res.status(404).json({ success: false, message: 'Lawyer not found' });

    const booking = await Booking.create(req.body);

    // Email notifications
    const user = await User.findById(req.user._id);
    const lawyerUser = await User.findById(lawyer.user);

    sendEmail({
      email: user.email,
      subject: 'Booking Confirmation',
      message: `Your booking with ${lawyerUser.name} has been created and is pending approval.`,
    }).catch(() => {});

    sendEmail({
      email: lawyerUser.email,
      subject: 'New Booking Request',
      message: `You have a new booking request from ${user.name}. Please login to accept or decline.`,
    }).catch(() => {});

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all bookings (admin)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate({ path: 'lawyer', populate: { path: 'user', select: 'name email' } });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings for current user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'lawyer', populate: { path: 'user', select: 'name email' } });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get bookings for lawyer (current)
exports.getLawyerBookings = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ user: req.user._id });
    if (!lawyer) return res.status(404).json({ success: false, message: 'Lawyer profile not found' });

    const bookings = await Booking.find({ lawyer: lawyer._id })
      .populate('user', 'name email phone');

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate({ path: 'lawyer', populate: { path: 'user', select: 'name email' } })
      .populate('messages')
      .populate('payment');

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Authorization: user, lawyer, or admin
    const lawyer = await Lawyer.findOne({ user: req.user._id });

    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      (!lawyer || lawyer._id.toString() !== booking.lawyer._id.toString()) &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this booking' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    let booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Authorization
    const lawyer = await Lawyer.findOne({ user: req.user._id });
    if ((!lawyer || lawyer._id.toString() !== booking.lawyer.toString()) && req.user.role !== 'admin')
      return res.status(401).json({ success: false, message: 'Not authorized to update this booking' });

    booking.status = status;
    await booking.save();

    // Email notification
    const user = await User.findById(booking.user);
    const lawyerUser = await User.findById(lawyer ? lawyer.user : req.user._id);

    sendEmail({
      email: user.email,
      subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking has been ${status} by ${lawyerUser.name}.`,
    }).catch(() => {});

    // PDF generation if completed
    if (status === 'completed') {
      await generatePDF({
        title: booking.title,
        clientName: user.name,
        lawyerName: lawyerUser.name,
        date: booking.date,
        duration: booking.duration,
        fee: booking.fee,
        description: booking.description,
      });
      // You may want to attach/save PDF reference here
    }
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};