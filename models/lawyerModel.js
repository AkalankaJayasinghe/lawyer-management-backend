const mongoose = require('mongoose');

const LawyerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please add a license number'],
    unique: true,
    trim: true
  },
  specializations: [{
    type: String,
    required: [true, 'Please add at least one specialization']
  }],
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio']
  },
  education: [{
    institution: String,
    degree: String,
    year: Number
  }],
  rates: {
    hourly: Number,
    consultation: Number
  },
  availability: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  availableTimeSlots: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  languages: [String],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    rating: Number,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lawyer', LawyerSchema);