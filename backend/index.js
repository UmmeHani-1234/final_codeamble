const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow configuring CORS origins via env vars: FRONTEND_URL and/or CORS_ORIGINS.
const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
if (process.env.FRONTEND_URL) {
  defaultOrigins.push(process.env.FRONTEND_URL.trim());
}
const configuredOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
  : [];
const corsOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json());

// Routes
const authRoutes        = require('./routes/auth');
const metricsRoutes     = require('./routes/metrics');
const adminAuthRoutes   = require('./routes/adminAuth');
const hospitalAuthRoutes = require('./routes/hospitalAuth');
const hospitalRoutes    = require('./routes/hospital');
const adminRoutes       = require('./routes/admin');

app.use('/api/auth',          authRoutes);
app.use('/api/metrics',       metricsRoutes);
app.use('/api/admin/auth',    adminAuthRoutes);
app.use('/api/hospital/auth', hospitalAuthRoutes);
app.use('/api/hospital',      hospitalRoutes);
app.use('/api/admin',         adminRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Pulse Health API is running');
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
