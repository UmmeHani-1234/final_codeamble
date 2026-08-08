const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// NotificationUser — a hospital staff member who receives alerts/SMS.
//
// Fields used across the frontend:
//   RegisteredUsers → name, role, email  (filtered by hospitalId)
//   Notifications   → name, role, email, hospitalId
//   Overview SMS    → name, role, id     (recipient dropdown)
// ---------------------------------------------------------------------------

const notificationUserSchema = new mongoose.Schema({
  // Which hospital this staff member belongs to.
  // null → network-level user (not tied to a single hospital).
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    default: null,
    index: true,
  },

  hospitalName: {
    type: String,
    required: true,
    trim: true,
    default: '',
  },

  name:  { type: String, required: true, trim: true },
  email: {
    type: String, required: true,
    lowercase: true, trim: true,
  },

  // Staff role shown in the RegisteredUsers and Notifications tables
  role: {
    type: String,
    required: true,
    trim: true,
    // Common values from mockData — not enforced as enum so hospitals can
    // use custom role names.
    default: 'Hospital Staff',
  },

  // Avatar URL (optional — defaults handled by the UI)
  avatar: { type: String, default: '' },

  // Whether this user is currently active and should receive notifications
  isActive: { type: Boolean, default: true },

  // Preferred notification channel
  notifyVia: {
    type: [String],
    enum: ['email', 'sms', 'push'],
    default: ['email'],
  },

  // Phone number for SMS (required if notifyVia includes 'sms')
  phone: { type: String, trim: true, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('NotificationUser', notificationUserSchema);
