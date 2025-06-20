const Booking = require('../models/bookingModel');
const Lawyer = require('../models/lawyerModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/emailService');
const generatePDF = require('../utils/pdfGenerator');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res, next) => {
  try {
    // Add user to req body
    req.body.user = req.user.id;

    // Check if lawyer exists
    const lawyer = await Lawyer.findById(req.body.lawyer);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer not found',
      });
    }

    // Create booking
    const booking = await Booking.create(req.body);

    // Send email notifications
    const user = await User.findById(req.user.id);
    const lawyerUser = await User.findById(lawyer.user);

    // Email to user
    await sendEmail({
      email: user.email,
      subject: 'Booking Confirmation',
      message: `Your booking with ${lawyerUser.name} has been created and is pending approval.`,
    });

    // Email to lawyer
    await sendEmail({
      email: lawyerUser.email,
      subject: 'New Booking Request',
      message: `You have a new booking request from ${user.name}. Please login to accept or decline.`,
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'lawyer',
        populate: {
          path: 'user',
          select: 'name email',
        },
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private (User)
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'lawyer',
        populate: {
          path: 'user',
          select: 'name email',
        },
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get lawyer bookings
// @route   GET /api/bookings/lawyer
// @access  Private (Lawyer)
exports.getLawyerBookings = async (req, res, next) => {
  try {
    // Find lawyer profile for current user
    const lawyer = await Lawyer.findOne({ user: req.user.id });

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: 'Lawyer profile not found',
      });
    }

    const bookings = await Booking.find({ lawyer: lawyer._id })
      .populate({
        path: 'user',
        select: 'name email phone',
      });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email phone',
      })
      .populate({
        path: 'lawyer',
        populate: {
          path: 'user',
          select: 'name email',
        },
      })
      .populate('messages')
      .populate('payment');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is owner of booking or lawyer assigned to booking or admin
    const lawyer = await Lawyer.findOne({ user: req.user.id });
    
    if (
      booking.user._id.toString() !== req.user.id &&
      (lawyer ? lawyer._id.toString() !== booking.lawyer._id.toString() : true) &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Lawyer & Admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is the lawyer assigned to this booking or admin
    const lawyer = await Lawyer.findOne({ user: req.user.id });
    
    if (
      (lawyer ? lawyer._id.toString() !== booking.lawyer.toString() : true) &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this booking',
      });
    }

    booking.status = status;
    await booking.save();

    // Send email notification
    const user = await User.findById(booking.user);
    const lawyerUser = await User.findById(req.user.id);

    await sendEmail({
      email: user.email,
      subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your booking has been ${status} by ${lawyerUser.name}.`,
    });

    // If completed, generate PDF summary
    if (status === 'completed') {
      const pdfBuffer = await generatePDF({
        title: booking.title,
        clientName: user.name,
        lawyerName: lawyerUser.name,
        date: booking.date,
        duration: booking.duration,
        fee: booking.fee,
        description: booking.description,
      });

      // Add PDF to booking documents
      booking.documents.push({
        filename: `summary_${booking._id}.pdf`,
        filepath: `/uploads/summaries/summary_${booking._id}.pdf`,
        uploadDate: Date.now(),
      });

      await booking.save();
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin only)
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    await booking.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};