const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// RegionalRisk — regional-level risk snapshot used by:
//   Regional page   → region, risk (score), note (disease, text)
//   Admin Overview  → region, risk (bar chart)
//   Admin Regional  → region, risk, disease, note
//
// Stored as a rolling snapshot — one document per region per date so the
// admin can query historical regional risk trends.
// ---------------------------------------------------------------------------

const regionalRiskSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    trim: true,
    enum: ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Nashik',
           'Aurangabad', 'Solapur', 'Kolhapur', 'Other'],
    index: true,
  },

  // Composite risk score 0–100 shown as a bar on the admin chart
  risk: { type: Number, required: true, min: 0, max: 100 },

  // The primary disease driving the risk score
  disease: { type: String, trim: true, default: '' },

  // Short descriptive note shown on the Regional card (e.g. "Flooding risk…")
  note: { type: String, trim: true, default: '' },

  // Environmental breakdown used by Surveillance "What changed" section
  rainfall:    { type: Number, default: 0, min: 0, max: 100 }, // relative score
  humidity:    { type: Number, default: 0, min: 0, max: 100 },

  // The date this snapshot was computed (for historical trend queries)
  snapshotDate: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

// Compound index for latest snapshot per region queries
regionalRiskSchema.index({ region: 1, snapshotDate: -1 });

module.exports = mongoose.model('RegionalRisk', regionalRiskSchema);
