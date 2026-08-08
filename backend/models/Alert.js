const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['info','warning','critical'], default: 'info' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
