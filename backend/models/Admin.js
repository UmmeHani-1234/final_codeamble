const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: 'admin',
      enum: ['admin', 'superadmin'],
    },
    permissions: {
      viewAllHospitals: { type: Boolean, default: true },
      manageOrganizations: { type: Boolean, default: true },
      viewAllAlerts: { type: Boolean, default: true },
      viewRegionalData: { type: Boolean, default: true },
      manageUsers: { type: Boolean, default: false },    // only superadmin
      manageAdmins: { type: Boolean, default: false },   // only superadmin
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Admin', adminSchema);
