const mongoose = require('mongoose');

const maskMongoUri = (uri) => {
  try {
    const parsed = new URL(uri);
    if (parsed.password) {
      parsed.password = '*****';
    }
    return parsed.toString();
  } catch {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:*****@');
  }
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('\n[db] MONGO_URI is not set in server/.env');
    console.error('[db] Add your MongoDB Atlas connection string and restart the server.\n');
    return false;
  }

  console.log(`\n[db] Connecting to MongoDB at: ${maskMongoUri(uri)}`);

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000, connectTimeoutMS: 10000 });
      console.log('[db] MongoDB connected. Persistent data storage is active.\n');
      return true;
    } catch (err) {
      console.error(`[db] Attempt ${attempt}/5 failed: ${err.message}`);
      if (attempt < 5) {
        console.log('[db] Retrying in 3s...');
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  console.error('\n[db] MongoDB connection failed after 5 attempts.');
  console.error("[db] Check server/.env and confirm your Atlas cluster allows this machine's IP address.");
  console.error('[db] Expected format: mongodb+srv://<user>:<password>@cluster.mongodb.net/techgear_analytics?appName=Cluster0\n');
  return false;
};

module.exports = connectDB;
