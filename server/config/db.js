const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techgear_analytics';
  console.log('\n📦 Connecting to MongoDB at:', uri);

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000, connectTimeoutMS: 10000 });
      console.log('✅ MongoDB connected — all accounts & data will persist permanently\n');
      return true;
    } catch (err) {
      console.error(`❌ Attempt ${attempt}/5 failed: ${err.message}`);
      if (attempt < 5) { console.log('   Retrying in 3s...'); await new Promise(r => setTimeout(r, 3000)); }
    }
  }

  console.error('\n╔══════════════════════════════════════════════════════════╗');
  console.error('║  ⛔  MONGODB NOT RUNNING                                 ║');
  console.error('║  Accounts created NOW will be LOST when server restarts ║');
  console.error('║                                                          ║');
  console.error('║  FIX: Open a new terminal and run:  mongod              ║');
  console.error('║  Then restart this server.                              ║');
  console.error('║  Download: mongodb.com/try/download/community           ║');
  console.error('╚══════════════════════════════════════════════════════════╝\n');
  return false;
};

module.exports = connectDB;
