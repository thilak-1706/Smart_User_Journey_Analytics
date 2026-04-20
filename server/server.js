require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');
const connectDB = require('./config/db');
const authRoutes      = require('./routes/authRoutes');
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

app.get('/health', (_, res) => {
  const states = ['disconnected','connected','connecting','disconnecting'];
  res.json({ ok: true, mongodb: states[mongoose.connection.readyState] || 'unknown', time: new Date() });
});

// Find free port, then connect MongoDB
const configuredPort = Number(process.env.PORT);
const PORTS = Number.isInteger(configuredPort) && configuredPort > 0
  ? [configuredPort]
  : [5000, 5001, 5002, 5003, 4000, 4001];

function startServer(i) {
  if (i >= PORTS.length) { console.error('❌ All ports busy.'); process.exit(1); }
  const port = PORTS[i];
  const srv  = app.listen(port);

  srv.on('listening', () => {
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log(`║  🚀  TechGear Server  →  http://localhost:${port}       ║`);
    console.log(`║  📊  Health check    →  http://localhost:${port}/health  ║`);
    console.log('╚══════════════════════════════════════════════════════╝');
    if (port !== 5000) {
      console.log(`\n⚠️  Port is ${port}. Update BASE_URL in both apps:`);
      console.log(`   user-app/src/services/api.js  → 'http://localhost:${port}/api'`);
      console.log(`   admin-app/src/services/api.js → 'http://localhost:${port}/api'\n`);
    }
    connectDB(); // connect after server is up
  });

  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') { console.log(`   Port ${port} busy → trying ${PORTS[i+1]}...`); startServer(i + 1); }
    else { console.error('Fatal:', err.message); process.exit(1); }
  });
}

startServer(0);
