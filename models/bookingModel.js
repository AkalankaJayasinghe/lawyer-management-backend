const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lawyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lawyer',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a booking title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  date: {
    type: Date,
    required: [true, 'Please add a booking date'],
  },
  startTime: {
    type: String,
    required: [true, 'Please add a start time'],
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes'],
    default: 60,
  },
  fee: {
    type: Number,
    required: [true, 'Please add a fee'],
  },
  urgencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  documents: [{
    filename: String,
    filepath: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  }],
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for messages related to this booking
BookingSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'booking',
  justOne: false
});

// Virtual for payment related to this booking
BookingSchema.virtual('payment', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'booking',
  justOne: true
});

module.exports = mongoose.model('Booking', BookingSchema);