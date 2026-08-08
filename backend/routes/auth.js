const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, region, address, contactEmail } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check duplicate
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'A hospital with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
      region: region || '',
      address: address || '',
      contactEmail: contactEmail || email,
      status: 'Reporting',
      completeness: 0,
      lastActivity: 'Just now',
      registeredAt: new Date().toISOString().slice(0, 10),
    });

    await user.save();

    const payload = { user: { id: user.id, role: 'hospital' } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({
        token,
        hospital: {
          id: user.id,
          name: user.name,
          email: user.email,
          region: user.region,
          address: user.address,
          contactEmail: user.contactEmail,
          status: user.status,
          completeness: user.completeness,
          lastActivity: user.lastActivity,
          registeredAt: user.registeredAt,
        },
      });
    });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last activity
    user.lastActivity = 'Just now';
    await user.save();

    const payload = { user: { id: user.id, role: 'hospital' } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        hospital: {
          id: user.id,
          name: user.name,
          email: user.email,
          region: user.region,
          address: user.address,
          contactEmail: user.contactEmail,
          status: user.status,
          completeness: user.completeness,
          lastActivity: user.lastActivity,
          registeredAt: user.registeredAt,
        },
      });
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      region: user.region,
      address: user.address,
      contactEmail: user.contactEmail,
      status: user.status,
      completeness: user.completeness,
      lastActivity: user.lastActivity,
      registeredAt: user.registeredAt,
    });
  } catch (err) {
    console.error('Me error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
