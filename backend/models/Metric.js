const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['heart_rate', 'blood_pressure', 'weight', 'steps', 'sleep'],
  },
  value: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  recordedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Metric', metricSchema);
