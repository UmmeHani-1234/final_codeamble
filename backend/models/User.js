const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Hospital profile fields
    region: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Reporting', 'Delayed', 'Inactive'],
      default: 'Reporting',
    },
    completeness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lastActivity: {
      type: String,
      default: 'Just now',
    },
    registeredAt: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
