const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const adminAuth = require('../middleware/adminAuth');

// Admin creates an alert for a hospital
router.post('/alerts', adminAuth, async (req, res) => {
  const { hospitalId, message, severity } = req.body;
  try {
    const alert = new Alert({ hospital: hospitalId, message, severity });
    await alert.save();
    res.status(201).json({ msg: 'Alert created', alert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
