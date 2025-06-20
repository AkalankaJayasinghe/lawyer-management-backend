const mongoose = require('mongoose');

const LawyerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization'],
  },
  bio: {
    type: String,
    required: [true, 'Please add a professional bio'],
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Please add an hourly rate'],
  },
  availability: {
    monday: [{
      startTime: String,
      endTime: String,
    }],
    tuesday: [{
      startTime: String,
      endTime: String,
    }],
    wednesday: [{
      startTime: String,
      endTime: String,
    }],
    thursday: [{
      startTime: String,
      endTime: String,
    }],
    friday: [{
      startTime: String,
      endTime: String,
    }],
    saturday: [{
      startTime: String,
      endTime: String,
    }],
    sunday: [{
      startTime: String,
      endTime: String,
    }],
  },
  education: [{
    degree: String,
    institution: String,
    year: String,
  }],
  documents: [{
    title: String,
    fileUrl: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  averageRating: {
    type: Number,
    default: 0,
  },
  totalBookings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate average rating when ratings are modified
LawyerSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    let totalRating = 0;
    this.ratings.forEach(rating => {
      totalRating += rating.rating;
    });
    this.averageRating = (totalRating / this.ratings.length).toFixed(1);
  }
  next();
});

// Virtual for bookings
LawyerSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'lawyer',
  justOne: false
});

module.exports = mongoose.model('Lawyer', LawyerSchema);