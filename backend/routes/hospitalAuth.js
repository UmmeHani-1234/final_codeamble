const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Hospital = require('../models/Hospital');
const Alert = require('../models/Alert');
const NotificationUser = require('../models/NotificationUser');
const RegionalRisk = require('../models/RegionalRisk');
const RiskSnapshot = require('../models/RiskSnapshot');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateBlockchainId(hospitalName, email) {
  const seed = `${hospitalName || 'hospital'}:${email || 'unknown'}:${Date.now()}`;
  const hash = require('crypto').createHash('sha256').update(seed).digest('hex');
  return `BID-${hash.slice(0, 16).toUpperCase()}`;
}

// Register hospital
router.post('/register', async (req, res) => {
  const { name, address, email, password, region } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Name, email and password are required' });
  }

  try {
    const existing = await Hospital.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Hospital already exists' });

    const regionName = region || 'Other';
    const hashed = await bcrypt.hash(password, 10);
    const blockchainId = generateBlockchainId(name, email);
    const hospital = new Hospital({
      name,
      address: address || '',
      email,
      password: hashed,
      region: regionName,
      status: 'Reporting',
      completeness: 72,
      lastActivity: 'Just now',
      blockchainId,
    });
    hospital.normalizeCompleteness();
    await hospital.save();

    const regionRiskMap = {
      Mumbai: { risk: 78, disease: 'Dengue', note: 'Newly registered hospital has entered the active surveillance network.' },
      Thane: { risk: 63, disease: 'Chikungunya', note: 'Newly registered hospital is now part of regional monitoring.' },
      'Navi Mumbai': { risk: 58, disease: 'Leptospirosis', note: 'Newly registered hospital is now part of regional monitoring.' },
      Pune: { risk: 24, disease: 'Influenza A', note: 'Newly registered hospital is now part of regional monitoring.' },
      Nashik: { risk: 12, disease: 'Cholera', note: 'Newly registered hospital is now part of regional monitoring.' },
      Aurangabad: { risk: 72, disease: 'Dengue', note: 'Newly registered hospital is now part of regional monitoring.' },
      Solapur: { risk: 55, disease: 'Malaria', note: 'Newly registered hospital is now part of regional monitoring.' },
      Kolhapur: { risk: 38, disease: 'Chikungunya', note: 'Newly registered hospital is now part of regional monitoring.' },
      Other: { risk: 40, disease: 'Influenza A', note: 'Newly registered hospital is now part of regional monitoring.' },
    };
    const regionalSeed = regionRiskMap[regionName] || regionRiskMap.Other;

    await Promise.all([
      Alert.create({
        alertCode: `AL-${Date.now().toString().slice(-6)}`,
        hospitalId: hospital._id,
        disease: regionalSeed.disease,
        probability: Math.max(35, Math.min(82, regionalSeed.risk - 5)),
        risk: regionalSeed.risk >= 70 ? 'High' : regionalSeed.risk >= 45 ? 'Medium' : 'Low',
        window: '7–14 days',
        status: 'Monitoring',
        detectedOn: new Date(),
        aiExplanation: `${hospital.name} is now live in Pulse. Initial monitoring signals are being seeded for the first reporting cycle.`,
        evidenceFactors: [
          { label: 'Recent disease activity', score: Math.max(20, Math.min(90, regionalSeed.risk + 10)) },
          { label: 'Hospital admissions', score: 55 },
          { label: 'Regional activity', score: Math.max(20, Math.min(90, regionalSeed.risk)) },
        ],
      }),
      NotificationUser.create({
        hospitalId: hospital._id,
        name: `${hospital.name.split(' ')[0] || 'Hospital'} Operations Lead`,
        email: `${slugify(hospital.name)}+${hospital._id.toString().slice(-4)}@pulsehealth.local`,
        role: 'Hospital Admin',
        phone: '',
        notifyVia: ['email', 'sms'],
        isActive: true,
      }),
      RegionalRisk.create({
        region: regionName,
        risk: regionalSeed.risk,
        disease: regionalSeed.disease,
        note: regionalSeed.note,
        rainfall: 48,
        humidity: 55,
        snapshotDate: new Date(),
      }),
      RiskSnapshot.create({
        hospitalId: hospital._id,
        snapshotDate: new Date(),
        riskScore: regionalSeed.risk,
        completeness: hospital.completeness,
        factors: {
          recentDiseaseActivity: Math.max(15, Math.min(95, regionalSeed.risk + 5)),
          hospitalAdmissions: 55,
          regionalActivity: Math.max(15, Math.min(95, regionalSeed.risk)),
          rainfall: 48,
          humidity: 55,
        },
      }),
    ]);

    // Issue token immediately so the client can auto-login after registration
    const token = jwt.sign(
      { id: hospital._id, role: 'hospital', name: hospital.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        region: hospital.region,
        address: hospital.address,
        status: hospital.status,
        completeness: hospital.completeness,
        lastActivity: hospital.lastActivity,
        blockchainId: hospital.blockchainId,
      },
    });
  } catch (err) {
    console.error(err);
    // Surface Mongoose validation errors clearly
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ msg: message });
    }
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
    const token = jwt.sign({ id: hospital._id, role: 'hospital', name: hospital.name }, process.env.JWT_SECRET, { expiresIn: '1d' });
    // update lastLogin
    hospital.lastLogin = new Date();
    hospital.normalizeCompleteness();
    await hospital.save();
    res.json({ token, hospital: { id: hospital._id, name: hospital.name, email: hospital.email, blockchainId: hospital.blockchainId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
