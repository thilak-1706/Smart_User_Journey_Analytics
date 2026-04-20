require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

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
