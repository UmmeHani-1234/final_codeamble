const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  lastLogin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
