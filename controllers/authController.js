const User = require('../models/userModel');
const Lawyer = require('../models/lawyerModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/emailService');

// Helper for JWT token
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken
    ? user.getSignedJwtToken()
    : jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, bio, experience, hourlyRate } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ success: false, message: 'User already exists' });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hash, role });

    // If lawyer, create profile
    if (role === 'lawyer') {
      if (!specialization || !bio || !experience || !hourlyRate) {
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ success: false, message: 'Please provide all required lawyer information' });
      }
      await Lawyer.create({ user: user._id, specialization, bio, experience, hourlyRate });
    }

    // Send welcome email (non-blocking)
    sendEmail({
      email: user.email,
      subject: 'Welcome to Lawyer Management System',
      message: `Dear ${user.name}, thank you for registering with our platform.`,
    }).catch(() => {});

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out' });
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'lawyer') {
      const lawyer = await Lawyer.findOne({ user: user._id });
      return res.status(200).json({ success: true, data: { user, lawyerProfile: lawyer || {} } });
    }
    return res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update user details
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {};
    ['name', 'email', 'phone', 'address'].forEach((f) => {
      if (req.body[f]) fieldsToUpdate[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });

    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};