const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// SurveillanceSubmission — one daily data upload from a hospital.
//
// Fields from SubmitData.jsx form:
//   date, disease, suspectedCases, confirmedCases, admissions,
//   testsConducted, positiveTests, icuAdmissions, bedOccupancy (%)
//
// Also used by:
//   History page   → list of past submissions per hospital
//   Surveillance   → lastActivity + completeness derived from latest record
//   RiskHistory    → evidenceFactors (admissions, positiveTests)
// ---------------------------------------------------------------------------

const surveillanceSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    index: true,
  },

  // The date the clinical data was collected (may differ from submission date)
  reportDate: { type: Date, required: true },

  disease: { type: String, required: true, trim: true },

  // Case counts
  suspectedCases:  { type: Number, default: 0, min: 0 },
  confirmedCases:  { type: Number, default: 0, min: 0 },
  admissions:      { type: Number, default: 0, min: 0 },
  testsConducted:  { type: Number, default: 0, min: 0 },
  positiveTests:   { type: Number, default: 0, min: 0 },
  icuAdmissions:   { type: Number, default: 0, min: 0 },

  // Bed occupancy percentage shown on SubmitData form
  bedOccupancy: { type: Number, default: 0, min: 0, max: 100 },

  // Validation status set by the backend after checking the data
  validationStatus: {
    type: String,
    enum: ['Pending', 'Good', 'Flagged'],
    default: 'Pending',
  },

  // Notes field for any free-text the submitter wants to add
  notes: { type: String, trim: true },
}, { timestamps: true });

// Compound index: one submission per hospital per report date per disease
surveillanceSchema.index({ hospitalId: 1, reportDate: -1 });

module.exports = mongoose.model('SurveillanceSubmission', surveillanceSchema);
