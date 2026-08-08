const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');

const Hospital              = require('../models/Hospital');
const Alert                 = require('../models/Alert');
const RegionalRisk          = require('../models/RegionalRisk');
const NotificationUser      = require('../models/NotificationUser');
const Notification          = require('../models/Notification');
const SurveillanceSubmission = require('../models/SurveillanceSubmission');

// Bearer-compatible admin auth (frontend sends Authorization: Bearer <token>)
function adminBearerAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.header('x-auth-token');

  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.admin) return res.status(403).json({ message: 'Access denied: admin token required' });
    req.admin = decoded.admin;
    next();
  } catch (e) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// GET /api/admin/hospitals
router.get('/hospitals', adminBearerAuth, async (req, res) => {
  try {
    const hospitals = await Hospital.find().select('-password').sort({ createdAt: -1 });
    res.json(hospitals);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/admin/alerts — all alerts across the network
router.get('/alerts', adminBearerAuth, async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('hospitalId', 'name region')
      .sort({ detectedOn: -1 });

    const shaped = alerts.map(a => ({
      _id: a._id,
      alertCode: a.alertCode,
      disease: a.disease,
      probability: a.probability,
      risk: a.risk,
      window: a.window,
      status: a.status,
      detectedOn: a.detectedOn,
      hospitalId: a.hospitalId?._id,
      hospitalName: a.hospitalId?.name || 'Unknown',
      region: a.hospitalId?.region || '—',
    }));
    res.json(shaped);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// PATCH /api/admin/alerts/:id/status
router.patch('/alerts/:id/status', adminBearerAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Needs review', 'Monitoring', 'Normal', 'Confirmed', 'Dismissed'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const alert = await Alert.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/admin/regional
router.get('/regional', adminBearerAuth, async (req, res) => {
  try {
    const regions = await RegionalRisk.aggregate([
      { $sort: { snapshotDate: -1 } },
      { $group: { _id: '$region', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $sort: { risk: -1 } },
    ]);
    res.json(regions);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/admin/notifications
router.get('/notifications', adminBearerAuth, async (req, res) => {
  try {
    const notifs = await Notification.find()
      .populate('hospitalId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(notifs);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// POST /api/admin/notifications/send
router.post('/notifications/send', adminBearerAuth, async (req, res) => {
  try {
    const { hospitalId, recipientId, message, channel = 'sms' } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ message: 'A message is required' });

    let recipients = [];
    if (recipientId) {
      const recipient = await NotificationUser.findById(recipientId);
      if (!recipient) return res.status(404).json({ message: 'Recipient not found' });
      recipients = [recipient];
    } else if (hospitalId) {
      recipients = await NotificationUser.find({ hospitalId, isActive: true });
      if (!recipients.length) return res.status(404).json({ message: 'No active recipients for this hospital' });
    } else {
      recipients = await NotificationUser.find({ isActive: true });
      if (!recipients.length) return res.status(404).json({ message: 'No active recipients found' });
    }

    const trimmedMessage = message.trim();
    const normalizedMessage = trimmedMessage.toLowerCase();
    const severity = /urgent|critical|emergency|immediate|action/i.test(normalizedMessage) ? 'High' : /review|follow|update/i.test(normalizedMessage) ? 'Medium' : 'Low';
    const probability = severity === 'High' ? 84 : severity === 'Medium' ? 68 : 54;
    const disease = /dengue|chikungunya|malaria|influenza|covid|measles|outbreak/i.test(normalizedMessage)
      ? 'Administrative Alert'
      : 'Administrative Alert';

    const alertTargets = [...new Set(recipients
      .map((recipient) => recipient.hospitalId)
      .filter(Boolean))];

    const createdAlerts = await Promise.all(alertTargets.map((targetHospitalId) => Alert.create({
      alertCode: `AL-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      hospitalId: targetHospitalId,
      disease,
      probability,
      risk: severity,
      window: 'Immediate action',
      status: 'Needs review',
      detectedOn: new Date(),
      aiExplanation: trimmedMessage,
      evidenceFactors: [
        { label: 'Admin message', score: 100 },
        { label: 'Hospital follow-up', score: severity === 'High' ? 78 : severity === 'Medium' ? 62 : 44 },
      ],
    })));

    const created = await Notification.insertMany(recipients.map((recipient) => ({
      hospitalId: recipient.hospitalId || hospitalId || null,
      recipientId: recipient._id,
      recipientName: recipient.name,
      recipientEmail: recipient.email,
      message: trimmedMessage,
      channel,
      status: 'sent',
      sentAt: new Date(),
    })));

    res.status(201).json({ notifications: created, alerts: createdAlerts });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
});

// GET /api/admin/submissions
router.get('/submissions', adminBearerAuth, async (req, res) => {
  try {
    const subs = await SurveillanceSubmission.find()
      .populate('hospitalId', 'name region')
      .sort({ reportDate: -1 })
      .limit(100);
    res.json(subs);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/admin/users
router.get('/users', adminBearerAuth, async (req, res) => {
  try {
    const users = await NotificationUser.find()
      .populate('hospitalId', 'name region')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
