const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const adminAuth = require('../middleware/adminAuth');

// Get list of hospitals that have logged in (lastLogin exists)
router.get('/hospitals', adminAuth, async (req, res) => {
  try {
    const hospitals = await Hospital.find({ lastLogin: { $exists: true } }, 'name address email lastLogin');
    res.json({ hospitals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
