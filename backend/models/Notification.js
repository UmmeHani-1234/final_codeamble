const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Notification — a push/email/SMS notification sent to a NotificationUser.
//
// Fields used by the frontend:
//   Notifications page → recipient name, role, email, message, sentAt, channel
//   Overview SMS panel → message sent confirmation
//   SendAlert page     → alertId, recipients, message, channel
// ---------------------------------------------------------------------------

const notificationSchema = new mongoose.Schema({
  // The hospital that triggered this notification
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
    index: true,
  },

  // The alert that triggered this notification (optional — can be a manual SMS)
  alertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert',
    default: null,
  },

  // Who received this notification
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotificationUser',
    default: null,
    index: true,
  },

  // Denormalised name + email so the Notifications table still renders if the
  // recipient record is later deleted
  recipientName:  { type: String, trim: true, default: '' },
  recipientEmail: { type: String, trim: true, default: '' },

  // Notification body shown in the Compose/Send alert flow
  message: { type: String, required: true, trim: true },

  // Delivery channel
  channel: {
    type: String,
    enum: ['email', 'sms', 'push'],
    default: 'email',
  },

  // Delivery outcome
  status: {
    type: String,
    enum: ['queued', 'sent', 'failed'],
    default: 'queued',
  },

  // Whether the recipient has opened/read the notification
  readAt: { type: Date, default: null },

  // Timestamp when the notification was actually dispatched
  sentAt: { type: Date, default: null },
}, { timestamps: true });

notificationSchema.index({ hospitalId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
