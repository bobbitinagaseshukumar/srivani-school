import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cron from 'node-cron';

// Load Environment Configuration
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Security and Logging Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate Limiter to prevent brute force attacks on portals
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', apiLimiter);

// Optional database connection
const LOCAL_MONGODB_URI = 'mongodb://127.0.0.1:27017/gravity_school';
const rawMongoUri = (process.env.MONGODB_URI || '').trim();
const hasConfiguredRemoteDb =
  process.env.ENABLE_MONGODB === 'true' &&
  rawMongoUri.length > 0 &&
  !rawMongoUri.includes('<db_password>');

const MONGODB_URI = hasConfiguredRemoteDb ? rawMongoUri : LOCAL_MONGODB_URI;

const connectDatabase = async () => {
  if (!hasConfiguredRemoteDb) {
    console.log('ℹ️ MongoDB is disabled or not configured for remote access. Using local data layers.');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB database connected successfully.');
  } catch (err) {
    console.log('⚠️ MongoDB connection error:', err.message);
    console.log('ℹ️ Running backend server in standby mode with local data layers.');
  }
};

connectDatabase();

// Socket.io connection setup for real-time notifications
io.on('connection', (socket) => {
  console.log(`🔌 New client socket connection established: ${socket.id}`);
  
  socket.on('join_role_channel', (role) => {
    socket.join(role);
    console.log(`👤 Client joined notification channel for role: ${role}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client socket disconnected: ${socket.id}`);
  });
});

// Database Auto Backup Scheduler via Cron
// Runs daily at 12:00 AM (0 0 * * *)
cron.schedule('0 0 * * *', () => {
  console.log('⏰ Initializing scheduled system backup: backup-' + new Date().toISOString().split('T')[0] + '.json');
  // In a production environment, you would use child_process 'mongodump' or write database documents to AWS S3 buckets.
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), service: 'Gravity School Core Backend' });
});

// Simulated Auth Endpoint
app.post('/api/auth/login', (req, res) => {
  const { emailOrId, password, role } = req.body;
  
  // Return mock token and profile details
  if (emailOrId && password) {
    res.json({
      success: true,
      token: 'jwt_mock_token_gravity_' + Date.now(),
      profile: {
        id: emailOrId,
        name: role + ' User',
        role: role
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid payload credentials.' });
  }
});

// Simulated CRUD endpoints for fallback support
app.get('/api/students', (req, res) => {
  res.json({ success: true, count: 0, data: [] });
});

app.post('/api/students', (req, res) => {
  res.status(201).json({ success: true, message: 'Student profile created on DB cluster' });
});

app.get('/api/teachers', (req, res) => {
  res.json({ success: true, count: 0, data: [] });
});

app.get('/api/circulars', (req, res) => {
  res.json({ success: true, count: 0, data: [] });
});

app.post('/api/support/ticket', (req, res) => {
  res.json({ success: true, message: 'Helpdesk ticket pushed to database collection.' });
});

// Static directories serving for notes uploads and homework files
app.use('/uploads', express.static('uploads'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server error log: ', err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server exception occurred.',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start Server Listener
const DEFAULT_PORT = 5000;
const PORT_RETRY_LIMIT = 10;

const parsePort = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const initialPort = parsePort(process.env.PORT, DEFAULT_PORT);
const canRetryPort =
  process.env.NODE_ENV !== 'production' &&
  process.env.AUTO_PORT_RETRY !== 'false';

let currentPort = initialPort;
let remainingPortRetries = canRetryPort ? PORT_RETRY_LIMIT : 0;

const startServer = (port) => {
  server.listen(port, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    console.log(`Gravity School Backend listening on port ${actualPort}`);
  });
};

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    if (remainingPortRetries > 0) {
      const nextPort = currentPort + 1;
      remainingPortRetries -= 1;
      console.warn(`Port ${currentPort} is already in use. Trying port ${nextPort}...`);
      currentPort = nextPort;
      startServer(currentPort);
      return;
    }

    console.error(`Server failed to start: port ${currentPort} is already in use.`);
    console.error('Stop the existing backend process or set PORT to another free port.');
    process.exit(1);
  }

  console.error('Server failed to start:', err.message);
  process.exit(1);
});

startServer(currentPort);
