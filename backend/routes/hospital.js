const express = require('express');
const router  = express.Router();
const hospitalAuth = require('../middleware/hospitalAuth');

const Hospital              = require('../models/Hospital');
const Alert                 = require('../models/Alert');
const SurveillanceSubmission = require('../models/SurveillanceSubmission');
const NotificationUser      = require('../models/NotificationUser');
const RegionalRisk          = require('../models/RegionalRisk');
const RiskSnapshot          = require('../models/RiskSnapshot');
const Notification          = require('../models/Notification');
// Twilio client (optional) — only initialised when env vars are present
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  try {
    twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  } catch (err) {
    console.error('Twilio client init failed', err);
    twilioClient = null;
  }
}

async function trySendSms(to, body) {
  if (!twilioClient) return null;
  if (!to) return null;
  try {
    const msg = await twilioClient.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to,
    });
    return msg;
  } catch (err) {
    console.error('Twilio send error', err);
    return null;
  }
}

// Nodemailer transporter (optional) — initialise when SMTP env vars are present
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  try {
    const nodemailer = require('nodemailer');
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: (process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } catch (err) {
    console.error('Nodemailer init failed', err);
    transporter = null;
  }
}

async function trySendEmail(to, subject, text) {
  if (!transporter) return null;
  if (!to) return null;
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    // Try to get a preview URL (Ethereal) when available
    let preview = null;
    try {
      const nodemailer = require('nodemailer');
      preview = nodemailer.getTestMessageUrl(info) || null;
    } catch (err) {
      preview = null;
    }
    return { info, preview };
  } catch (err) {
    console.error('Email send error', err);
    return null;
  }
}

// ─── GET /api/hospital/me ─────────────────────────────────────────────────────
// Current hospital profile
router.get('/me', hospitalAuth, async (req, res) => {
  try {
    const h = await Hospital.findById(req.hospital.id).select('-password');
    if (!h) return res.status(404).json({ msg: 'Hospital not found' });
    res.json(h);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── GET /api/hospital/alerts ─────────────────────────────────────────────────
router.get('/alerts', hospitalAuth, async (req, res) => {
  try {
    const alerts = await Alert.find({ hospitalId: req.hospital.id }).sort({ detectedOn: -1 });
    res.json(alerts);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── GET /api/hospital/alerts/:id ────────────────────────────────────────────
router.get('/alerts/:id', hospitalAuth, async (req, res) => {
  try {
    const alert = await Alert.findOne({ _id: req.params.id, hospitalId: req.hospital.id });
    if (!alert) return res.status(404).json({ msg: 'Alert not found' });
    res.json(alert);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── PATCH /api/hospital/alerts/:id/status ───────────────────────────────────
router.patch('/alerts/:id/status', hospitalAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Needs review', 'Monitoring', 'Normal', 'Confirmed', 'Dismissed'];
    if (!allowed.includes(status)) return res.status(400).json({ msg: 'Invalid status' });
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, hospitalId: req.hospital.id },
      { status, resolvedBy: req.hospital.id, resolvedAt: new Date() },
      { new: true }
    );
    if (!alert) return res.status(404).json({ msg: 'Alert not found' });
    res.json(alert);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── GET /api/hospital/submissions ───────────────────────────────────────────
// Submission history (most recent first)
router.get('/submissions', hospitalAuth, async (req, res) => {
  try {
    const subs = await SurveillanceSubmission
      .find({ hospitalId: req.hospital.id })
      .sort({ reportDate: -1 })
      .limit(30);
    res.json(subs);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── POST /api/hospital/submissions ──────────────────────────────────────────
router.post('/submissions', hospitalAuth, async (req, res) => {
  try {
    const {
      reportDate,
      disease,
      suspectedCases,
      confirmedCases,
      admissions,
      testsConducted,
      positiveTests,
      icuAdmissions,
      bedOccupancy,
      notes
    } = req.body;

    if (!reportDate || !disease) {
      return res.status(400).json({ msg: 'reportDate and disease are required' });
    }

    const parsedValues = {
      suspectedCases: Number(suspectedCases) || 0,
      confirmedCases: Number(confirmedCases) || 0,
      admissions: Number(admissions) || 0,
      testsConducted: Number(testsConducted) || 0,
      positiveTests: Number(positiveTests) || 0,
      icuAdmissions: Number(icuAdmissions) || 0,
      bedOccupancy: Number(bedOccupancy) || 0,
    };

    const normalizedCompleteness = Math.min(100, Math.max(0, Math.round((Object.values(parsedValues).filter((value) => Number(value) > 0).length / 7) * 100)));

    const sub = await SurveillanceSubmission.create({
      hospitalId: req.hospital.id,
      reportDate,
      disease,
      ...parsedValues,
      notes,
      validationStatus: parsedValues.confirmedCases > 0 || parsedValues.positiveTests > 0 ? 'Good' : 'Pending',
    });

    const completeness = normalizedCompleteness;

    const hospital = await Hospital.findByIdAndUpdate(
      req.hospital.id,
      {
        lastActivity: 'Just now',
        completeness,
        status: completeness >= 80 ? 'Reporting' : 'Delayed',
      },
      { new: true }
    ).select('-password');

    await RiskSnapshot.create({
      hospitalId: req.hospital.id,
      snapshotDate: new Date(reportDate),
      riskScore: Math.max(10, Math.min(100, completeness)),
      completeness,
      factors: {
        recentDiseaseActivity: Math.max(10, Math.min(100, completeness + 8)),
        hospitalAdmissions: Math.max(10, Math.min(100, parsedValues.admissions > 0 ? 70 : 35)),
        regionalActivity: Math.max(10, Math.min(100, parsedValues.confirmedCases > 0 ? 64 : 42)),
        rainfall: 45,
        humidity: 50,
      },
      source: 'manual',
    });

    res.status(201).json({ submission: sub, hospital });
  } catch (e) { console.error(e); res.status(500).json({ msg: 'Server error' }); }
});

// ─── GET /api/hospital/users ──────────────────────────────────────────────────
router.get('/users', hospitalAuth, async (req, res) => {
  try {
    const users = await NotificationUser.find({
      hospitalId: req.hospital.id,
      hospitalName: req.hospital.name || { $exists: true },
      isActive: true,
    });
    res.json(users);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── GET /api/hospital/notifications ─────────────────────────────────────────
router.get('/notifications', hospitalAuth, async (req, res) => {
  try {
    const notifs = await Notification
      .find({ hospitalId: req.hospital.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifs);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── POST /api/hospital/notifications/send ───────────────────────────────────
// Send a manual SMS/notification to a NotificationUser
router.post('/notifications/send', hospitalAuth, async (req, res) => {
  try {
    const { recipientId, recipientType, recipientName, recipientEmail, message, channel, patientRecipients } = req.body;
    const hospitalProfile = await Hospital.findById(req.hospital.id).select('email name');
    if (!message) return res.status(400).json({ msg: 'message required' });

    if (recipientType === 'all_patients') {
      const recipients = Array.isArray(patientRecipients) && patientRecipients.length
        ? patientRecipients
        : [];

      if (!recipients.length) {
        return res.status(400).json({ msg: 'No registered patients were provided' });
      }

      // Create notifications with queued status, then attempt to send via Twilio
      const created = await Promise.all(recipients.map((patient) =>
        Notification.create({
          hospitalId: req.hospital.id,
          recipientId: null,
          recipientName: patient.name || 'Registered patient',
          recipientEmail: patient.email || '',
          message,
          channel: channel || 'sms',
          status: 'queued',
          sentAt: null,
        })
      ));

      // Attempt to send SMS for each created notification when possible
      if (twilioClient && (channel || 'sms') === 'sms') {
        await Promise.all(created.map(async (n, idx) => {
          const patient = recipients[idx];
          const to = (patient && (patient.phone || patient.mobile || patient.msisdn)) || null;
          if (!to) {
            await Notification.findByIdAndUpdate(n._id, { status: 'failed' });
            return;
          }
          const resMsg = await trySendSms(to, message);
          if (resMsg && resMsg.sid) {
            await Notification.findByIdAndUpdate(n._id, { status: 'sent', sentAt: new Date(), twilioSid: resMsg.sid });
            // Send a copy to the hospital's registered email (if configured) and persist email metadata
            if (hospitalProfile && hospitalProfile.email) {
              const emailBody = `SMS to ${patient.name || 'patient'} (${to}):\n\n${message}`;
              const emailResult = await trySendEmail(hospitalProfile.email, `Notification sent — ${hospitalProfile.name}`, emailBody);
              if (emailResult && emailResult.info) {
                await Notification.findByIdAndUpdate(n._id, {
                  emailMessageId: emailResult.info.messageId || '',
                  emailPreviewUrl: emailResult.preview || '',
                });
              }
            }
          } else {
            await Notification.findByIdAndUpdate(n._id, { status: 'failed' });
            if (hospitalProfile && hospitalProfile.email) {
              const emailBody = `Failed SMS to ${patient.name || 'patient'} (${to}). Message:\n\n${message}`;
              const emailResult = await trySendEmail(hospitalProfile.email, `Notification failed — ${hospitalProfile.name}`, emailBody);
              if (emailResult && emailResult.info) {
                await Notification.findByIdAndUpdate(n._id, {
                  emailMessageId: emailResult.info.messageId || '',
                  emailPreviewUrl: emailResult.preview || '',
                });
              }
            }
          }
        }));
      }

      return res.status(201).json({ sentCount: created.length, notifications: created });
    }

    let notifPayload = {
      hospitalId: req.hospital.id,
      message,
      channel: channel || 'sms',
      status: 'queued',
      sentAt: null,
    };

    if (recipientType === 'patient') {
      notifPayload.recipientId = null;
      notifPayload.recipientName = recipientName || 'Registered patient';
      notifPayload.recipientEmail = recipientEmail || '';
    } else {
      if (!recipientId) return res.status(400).json({ msg: 'recipientId required' });

      const recipient = await NotificationUser.findOne({ _id: recipientId, hospitalId: req.hospital.id });
      if (!recipient) return res.status(404).json({ msg: 'Recipient not found' });

      notifPayload.recipientId = recipient._id;
      notifPayload.recipientName = recipient.name;
      notifPayload.recipientEmail = recipient.email;
    }

    const notif = await Notification.create(notifPayload);

    // If SMS channel and Twilio configured, attempt to send immediately
    if (notif.channel === 'sms' && twilioClient) {
      let to = null;
      if (recipientType === 'patient') {
        to = req.body.recipientPhone || req.body.recipientPhoneNumber || req.body.recipientMobile || null;
      } else if (recipientType === 'staff' || recipientType === 'user' || recipientType === 'notification_user') {
        // recipientId was set above and recipient fetched
        const r = await NotificationUser.findById(notif.recipientId);
        to = r ? (r.phone || null) : null;
      }

      if (to) {
        const result = await trySendSms(to, message);
        if (result && result.sid) {
          notif.status = 'sent';
          notif.sentAt = new Date();
          notif.twilioSid = result.sid;
          await notif.save();
          if (hospitalProfile && hospitalProfile.email) {
            const emailBody = `SMS to ${notif.recipientName || 'recipient'} (${to}):\n\n${message}`;
            const emailResult = await trySendEmail(hospitalProfile.email, `Notification sent — ${hospitalProfile.name}`, emailBody);
            if (emailResult && emailResult.info) {
              notif.emailMessageId = emailResult.info.messageId || '';
              notif.emailPreviewUrl = emailResult.preview || '';
              await notif.save();
            }
          }
        } else {
          notif.status = 'failed';
          await notif.save();
          if (hospitalProfile && hospitalProfile.email) {
            const emailBody = `Failed SMS to ${notif.recipientName || 'recipient'} (${to}):\n\n${message}`;
            const emailResult = await trySendEmail(hospitalProfile.email, `Notification failed — ${hospitalProfile.name}`, emailBody);
            if (emailResult && emailResult.info) {
              notif.emailMessageId = emailResult.info.messageId || '';
              notif.emailPreviewUrl = emailResult.preview || '';
              await notif.save();
            }
          }
        }
      } else {
        notif.status = 'failed';
        await notif.save();
        if (hospitalProfile && hospitalProfile.email) {
          const emailBody = `No phone number provided for recipient ${notif.recipientName || 'recipient'} when attempting SMS. Message:\n\n${message}`;
          const emailResult = await trySendEmail(hospitalProfile.email, `Notification failed — ${hospitalProfile.name}`, emailBody);
          if (emailResult && emailResult.info) {
            notif.emailMessageId = emailResult.info.messageId || '';
            notif.emailPreviewUrl = emailResult.preview || '';
            await notif.save();
          }
        }
      }
    }

    res.status(201).json(notif);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── GET /api/hospital/regional ──────────────────────────────────────────────
// Latest regional risk snapshot for all regions
router.get('/regional', hospitalAuth, async (req, res) => {
  try {
    // Get most recent snapshot per region
    const regions = await RegionalRisk.aggregate([
      { $sort: { snapshotDate: -1 } },
      { $group: { _id: '$region', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sort: { risk: -1 } },
    ]);
    res.json(regions);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── GET /api/hospital/risk-history ──────────────────────────────────────────
// Last 5 risk snapshots for this hospital (for the trend chart)
router.get('/risk-history', hospitalAuth, async (req, res) => {
  try {
    const snapshots = await RiskSnapshot
      .find({ hospitalId: req.hospital.id })
      .sort({ snapshotDate: 1 })
      .limit(5);
    res.json(snapshots);
  } catch (e) { res.status(500).json({ msg: 'Server error' }); }
});

// ─── POST /api/hospital/users ────────────────────────────────────────────────
// Create a new NotificationUser for this hospital
router.post('/users', hospitalAuth, async (req, res) => {
  try {
    const { name, email, role, phone, notifyVia } = req.body;
    if (!name || !email) return res.status(400).json({ msg: 'Name and email are required' });

    // Check duplicate email within the same hospital only
    const existing = await NotificationUser.findOne({
      hospitalId: req.hospital.id,
      email: email.toLowerCase(),
    });
    if (existing) return res.status(400).json({ msg: 'A user with this email already exists for this hospital' });

    const user = await NotificationUser.create({
      hospitalId: req.hospital.id,
      hospitalName: req.hospital.name || '',
      name,
      email: email.toLowerCase(),
      role: role || 'Hospital Staff',
      phone: phone || '',
      notifyVia: notifyVia || ['email'],
      isActive: true,
    });
    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    if (e.code === 11000) return res.status(400).json({ msg: 'A user with this email already exists' });
    res.status(500).json({ msg: 'Server error' });
  }
});

// ─── PUT /api/hospital/users/:id ─────────────────────────────────────────────
// Update an existing NotificationUser belonging to this hospital
router.put('/users/:id', hospitalAuth, async (req, res) => {
  try {
    const { name, email, role, phone, notifyVia } = req.body;
    const update = {};
    if (name)     update.name = name;
    if (email)    update.email = email.toLowerCase();
    if (role)     update.role = role;
    if (phone !== undefined) update.phone = phone;
    if (notifyVia) update.notifyVia = notifyVia;

    const user = await NotificationUser.findOneAndUpdate(
      { _id: req.params.id, hospitalId: req.hospital.id },
      update,
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (e) {
    console.error(e);
    if (e.code === 11000) return res.status(400).json({ msg: 'A user with this email already exists' });
    res.status(500).json({ msg: 'Server error' });
  }
});

// ─── DELETE /api/hospital/users/:id ──────────────────────────────────────────
// Remove a NotificationUser from this hospital
router.delete('/users/:id', hospitalAuth, async (req, res) => {
  try {
    const user = await NotificationUser.findOneAndDelete({
      _id: req.params.id,
      hospitalId: req.hospital.id,
    });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User removed', id: req.params.id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ─── PATCH /api/hospital/users/:id/toggle ────────────────────────────────────
// Toggle a user's active/inactive status
router.patch('/users/:id/toggle', hospitalAuth, async (req, res) => {
  try {
    const user = await NotificationUser.findOne({
      _id: req.params.id,
      hospitalId: req.hospital.id,
    });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ─── PUT /api/hospital/me ────────────────────────────────────────────────────
// Update hospital's own profile
router.put('/me', hospitalAuth, async (req, res) => {
  try {
    const { name, address, region } = req.body;
    const update = {};
    if (name)    update.name = name;
    if (address !== undefined) update.address = address;
    if (region)  update.region = region;

    const hospital = await Hospital.findByIdAndUpdate(
      req.hospital.id,
      update,
      { new: true, runValidators: true }
    ).select('-password');
    if (!hospital) return res.status(404).json({ msg: 'Hospital not found' });
    res.json(hospital);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
