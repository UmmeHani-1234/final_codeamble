const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/Hospital');

// Register hospital
router.post('/register', async (req, res) => {
  const { name, address, email, password } = req.body;
  try {
    const existing = await Hospital.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Hospital already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const hospital = new Hospital({ name, address, email, password: hashed });
    await hospital.save();
    res.status(201).json({ msg: 'Hospital registered' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login hospital
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hospital = await Hospital.findOne({ email });
    if (!hospital) return res.status(400).json({ msg: 'Invalid credentials' });
    const match = await bcrypt.compare(password, hospital.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });
    const token = jwt.sign({ id: hospital._id, role: 'hospital' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // update lastLogin
    hospital.lastLogin = new Date();
    await hospital.save();
    res.json({ token, hospital: { id: hospital._id, name: hospital.name, email: hospital.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
