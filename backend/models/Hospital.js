const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Hospital — extended to include all fields the frontend reads
//
// Fields used across the frontend:
//   Overview        → name, region, lastActivity, completeness
//   Regional        → region
//   Surveillance    → completeness, lastActivity
//   Organizations   → name, region, status, lastActivity, completeness, createdAt
//   Admin sidebar   → name, id
//   SubmitData      → id, name, lastActivity, completeness
//   RegisteredUsers → id (to filter users)
// ---------------------------------------------------------------------------

function clampCompleteness(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, numeric));
}

const hospitalSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  address: { type: String, default: '',    trim: true },
  email:   {
    type: String, required: true, unique: true,
    lowercase: true, trim: true, index: true,
  },
  password: { type: String, required: true },

  // Region — used on Overview, Regional, RiskHistory, Admin Organizations
  region: {
    type: String,
    trim: true,
    default: 'Other',
    enum: ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune', 'Nashik',
           'Aurangabad', 'Solapur', 'Kolhapur', 'Other'],
  },

  // Reporting workflow status shown in Admin Organizations + sidebar badge
  status: {
    type: String,
    enum: ['Reporting', 'Delayed', 'Inactive'],
    default: 'Reporting',
  },

  // Data completeness percentage shown in Surveillance + SubmitData
  completeness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    set: (value) => clampCompleteness(value),
  },

  // Human-readable "last submission" shown in Surveillance + SubmitData
  lastActivity: { type: String, default: 'Never' },

  // Timestamps for "Registered" column in Admin Organizations
  lastLogin: { type: Date },

  // Blockchain-style identity issued for each hospital registration.
  blockchainId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
}, { timestamps: true });

hospitalSchema.methods.normalizeCompleteness = function normalizeCompleteness() {
  this.completeness = clampCompleteness(this.completeness);
  return this.completeness;
};

module.exports = mongoose.model('Hospital', hospitalSchema);
