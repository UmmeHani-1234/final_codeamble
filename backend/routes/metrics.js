const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Metric = require('../models/Metric');

// GET /api/metrics - Get all metrics for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const metrics = await Metric.find({ user: req.user.id }).sort({ recordedAt: -1 });
    res.json(metrics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/metrics - Add a new metric
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, value, unit, notes, recordedAt } = req.body;

    const newMetric = new Metric({
      user: req.user.id,
      type,
      value,
      unit,
      notes,
      recordedAt: recordedAt || Date.now(),
    });

    const metric = await newMetric.save();
    res.json(metric);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/metrics/:id - Delete a metric
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const metric = await Metric.findById(req.params.id);

    if (!metric) {
      return res.status(404).json({ message: 'Metric not found' });
    }

    // Make sure user owns metric
    if (metric.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await metric.deleteOne();
    res.json({ message: 'Metric removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Metric not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
