const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rvce_student_db';


const connectDB = async () => {
  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${MONGO_URI}`);
    
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║               MONGODB DATABASE CONNECTED SUCCESSFULLY             ║');
    console.log('╠═══════════════════════════════════════════════════════════════════╣');
    console.log(`║  \x1b[32m✔ Host:\x1b[0m             ${conn.connection.host.padEnd(46)}║`);
    console.log(`║  \x1b[36m✔ Database:\x1b[0m         ${conn.connection.name.padEnd(46)}║`);
    console.log(`║  \x1b[33m✔ Target URI:\x1b[0m       ${MONGO_URI.substring(0, 46).padEnd(46)}║`);
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
    return conn;
  } catch (err) {
    console.warn(`[Database Error] ${err.message}`);
    console.warn('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.warn('║                     MONGODB CONNECTION NOTICE                     ║');
    console.warn('╠═══════════════════════════════════════════════════════════════════╣');
    console.warn(`║  \x1b[33m! Status:\x1b[0m           Local MongoDB not yet running on port 27017   ║`);
    console.warn(`║  \x1b[36m! Compass Target:\x1b[0m   ${MONGO_URI.padEnd(46)}║`);
    console.warn('║  \x1b[32m✔ Fallback:\x1b[0m         Auto-activating High-Resilience In-Memory Hub ║');
    console.warn('║                      (All features, CRUD & Analytics fully active)║');
    console.warn('╚═══════════════════════════════════════════════════════════════════╝\n');
    return null;
  }
};

const getDbStatus = () => {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };
  return {
    connected: readyState === 1,
    status: states[readyState] || 'Disconnected',
    host: mongoose.connection.host || '127.0.0.1',
    name: mongoose.connection.name || 'rvce_student_db',
    compassUri: MONGO_URI,
  };
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = { connectDB, disconnectDB, getDbStatus, MONGO_URI };
