const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Alert — an AI-generated early-warning signal for a specific hospital.
//
// Fields used across the frontend:
//   Alerts list   → disease, probability, risk, window, status, date
//   Alert detail  → id, disease, probability, risk, window, date,
//                   evidenceFactors, aiExplanation
//   Admin Alerts  → hospitalId (ref), hospitalName (virtual), region (via ref)
//   Admin Overview→ disease, risk, status, probability, window, hospitalName
// ---------------------------------------------------------------------------

const evidenceFactorSchema = new mongoose.Schema({
  label: { type: String, required: true },   // e.g. "Recent disease activity"
  score: { type: Number, required: true, min: 0, max: 100 },
}, { _id: false });

const alertSchema = new mongoose.Schema({
  // Short human-readable ID shown in the UI (e.g. "AL-1042")
  alertCode: { type: String, required: true, unique: true, trim: true },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    index: true,
  },

  disease:     { type: String, required: true, trim: true },
  probability: { type: Number, required: true, min: 0, max: 100 },
  risk:        { type: String, required: true, enum: ['High', 'Medium', 'Low'] },

  // Detection window shown in the table, e.g. "7–14 days"
  window: { type: String, required: true, trim: true },

  // Workflow state
  status: {
    type: String,
    required: true,
    enum: ['Needs review', 'Monitoring', 'Normal', 'Confirmed', 'Dismissed'],
    default: 'Needs review',
  },

  // ISO date the alert was first detected (displayed in Alert Detail quick-facts)
  detectedOn: { type: Date, default: Date.now },

  // AI-generated narrative (AlertDetail "AI explanation" card)
  aiExplanation: { type: String, trim: true },

  // Array of evidence bars shown on the Alert Detail page
  evidenceFactors: { type: [evidenceFactorSchema], default: [] },

  // Who last acted on this alert and when
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  resolvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
