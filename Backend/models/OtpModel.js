const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  contactNumber: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['signup', 'reset-password'], // Can be extended
    required: true
  },
  name: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // 5 minutes
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  }
});

module.exports = mongoose.model('OTP', otpSchema);