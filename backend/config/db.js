const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rvce_student_db';
const mongoRequired = process.env.MONGODB_REQUIRED === 'true';

const getSafeMongoUri = () => {
  try {
    const url = new URL(MONGO_URI);
    if (url.username || url.password) {
      url.username = '***';
      url.password = '***';
    }
    return url.toString();
  } catch {
    return '[configured MongoDB URI]';
  }
};


const connectDB = async () => {
  try {
    console.log(`[Database] Connecting to MongoDB at ${getSafeMongoUri()}`);
    
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[Database] Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[Database] Connection failed: ${err.message}`);
    if (mongoRequired) throw err;
    console.warn('[Database] Starting with the in-memory fallback. Set MONGODB_REQUIRED=true to fail fast instead.');
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
    uri: getSafeMongoUri(),
  };
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = { connectDB, disconnectDB, getDbStatus, MONGO_URI, getSafeMongoUri };
