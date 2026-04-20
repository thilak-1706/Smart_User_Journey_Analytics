require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

const parseOrigins = (value) =>
  (value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const configuredOrigins = parseOrigins(process.env.CLIENT_ORIGINS);

if (configuredOrigins.length > 0) {
  const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    ...configuredOrigins,
  ]);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }));
} else {
  app.use(cors());
}

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', analyticsRoutes);

app.get(['/health', '/api/health'], (_, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ ok: true, mongodb: states[mongoose.connection.readyState] || 'unknown', time: new Date() });
});

module.exports = app;
