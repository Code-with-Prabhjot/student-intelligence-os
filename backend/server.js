const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rvce_student_db';

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

// Health & System Info Route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const stateMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  res.status(200).json({
    status: 'online',
    system: 'RVCE Student Intelligence & Academic Lifecycle Management System',
    timestamp: new Date().toISOString(),
    database: {
      status: stateMap[dbState] || 'Unknown',
      connected: dbState === 1,
      host: mongoose.connection.host || '127.0.0.1',
      name: mongoose.connection.name || 'rvce_student_db',
      compassUri: MONGO_URI,
    },
    uptime: `${Math.floor(process.uptime())} seconds`,
    memory: process.memoryUsage(),
  });
});

// Mount Routes
app.use('/api/students', studentRoutes);

// Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to RVCE Student Intelligence & Academic Lifecycle API',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      students: '/api/students',
      analytics: '/api/students/stats/analytics',
      export: '/api/students/export/all',
    },
    compassConnectionString: MONGO_URI,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('\x1b[31m[Server Error]:\x1b[0m', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log('╔═══════════════════════════════════════════════════════════════════╗');
      console.log('║    RVCE STUDENT INTELLIGENCE & ACADEMIC LIFECYCLE MANAGEMENT      ║');
      console.log('╠═══════════════════════════════════════════════════════════════════╣');
      console.log(`║  \x1b[32m✔ Server Status:\x1b[0m       Running on Port ${PORT}                         ║`);
      console.log(`║  \x1b[36m✔ Base API URL:\x1b[0m        http://localhost:${PORT}/api                  ║`);
      console.log(`║  \x1b[35m✔ Health Check:\x1b[0m        http://localhost:${PORT}/api/health           ║`);
      console.log(`║  \x1b[33m✔ MongoDB Compass URI:\x1b[0m ${MONGO_URI}   ║`);
      console.log('╚═══════════════════════════════════════════════════════════════════╝\n');
    });
  } catch (error) {
    console.error('Fatal initialization error:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
