const Lawyer = require('../models/lawyerModel');
const User = require('../models/userModel');

// Get all lawyers
exports.getLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find().populate('user', 'name email');
    res.status(200).json(lawyers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get lawyer by ID
exports.getLawyerById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id).populate('user', 'name email');
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.status(200).json(lawyer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all specializations
exports.getSpecializations = async (req, res) => {
  try {
    const specializations = await Lawyer.distinct('specialization');
    res.status(200).json(specializations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create lawyer profile
exports.createLawyerProfile = async (req, res) => {
  try {
    const existingProfile = await Lawyer.findOne({ user: req.user._id });
    if (existingProfile) return res.status(400).json({ message: 'Lawyer profile already exists' });

    const lawyerData = { user: req.user._id, ...req.body };
    const lawyer = await Lawyer.create(lawyerData);

    await User.findByIdAndUpdate(req.user._id, { role: 'lawyer' });

    res.status(201).json(lawyer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update lawyer profile
exports.updateLawyerProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true }
    );
    if (!lawyer) return res.status(404).json({ message: 'Lawyer profile not found' });
    res.status(200).json(lawyer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete lawyer profile
exports.deleteLawyerProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findOneAndDelete({ user: req.user._id });
    if (!lawyer) return res.status(404).json({ message: 'Lawyer profile not found' });

    await User.findByIdAndUpdate(req.user._id, { role: 'user' });
    res.status(200).json({ message: 'Lawyer profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};