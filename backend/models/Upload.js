const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  filename: { type: String, required: true }, // stored filename on server
  originalName: { type: String, required: true }, // original name from client
  mimeType: { type: String },
  size: { type: Number },
  data: { type: Buffer }, // binary buffer for file content
}, { timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);
