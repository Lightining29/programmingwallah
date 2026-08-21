import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { connectDB } from './config/db.js';
import { getMySQLStatus } from './config/mysql.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import portalRoutes from './routes/portal.js';
import adminRoutes from './routes/admin.js';
import meetingsRoutes from './routes/meetings.js';
import admissionPaymentRoutes from './routes/admissionPayment.js';
import razorpayRoutes from './routes/razorpay.js';
import lmsRoutes from './routes/lms.js';
import paymentRoutes from './routes/payment.js';

// Load environment variables from multiple possible locations (root .env and backend/.env)
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '.env') });
dotenv.config();

const app = express();

// Prevent server crash on unhandled errors (ensures 100% uptime on Hostinger)
process.on('uncaughtException', (err) => {
  console.error('\x1b[31m[CRITICAL] Uncaught Exception:\x1b[0m', err.message || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\x1b[33m[WARNING] Unhandled Promise Rejection:\x1b[0m', reason);
});

// Trust proxy for Hostinger reverse proxy / load balancer
app.set('trust proxy', 1);

// Security & Cross-Origin Configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Body parsing middleware with expanded limits for document & photo uploads
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Resolve static paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded files with cache control
app.use('/uploads', express.static(uploadDir, {
  maxAge: '7d',
  etag: true
}));

// API Health Check & Database Status
app.get('/api/health', (req, res) => {
  const mysqlInfo = getMySQLStatus();
  res.json({
    success: true,
    status: 'online',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'production',
    database: {
      driver: 'MySQL (Hostinger)',
      ...mysqlInfo
    }
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/admission-payment', admissionPaymentRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/lms', lmsRoutes);
app.use('/api', paymentRoutes);

// Candidate directories for built frontend assets
const distCandidates = [
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, '../dist'),
  path.join(__dirname, 'dist'),
  path.join(process.cwd(), 'frontend/dist'),
  path.join(process.cwd(), 'dist')
];

let resolvedDistPath = null;
for (const cand of distCandidates) {
  if (fs.existsSync(path.join(cand, 'index.html'))) {
    resolvedDistPath = cand;
    break;
  }
}

if (resolvedDistPath) {
  console.log(`\x1b[32m✔ Serving frontend production build from: ${resolvedDistPath}\x1b[0m`);
  app.use(express.static(resolvedDistPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      // Never cache index.html so frontend updates deploy instantly
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  
  app.get('*', (req, res, next) => {
    // Avoid intercepting API routes or uploads
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(resolvedDistPath, 'index.html'));
  });
} else {
  // Root Route fallback
  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to Pranidha International School Kindergarten API Server!',
      status: 'operational',
      database: 'Hostinger MySQL',
      version: '1.0.0',
      mode: process.env.NODE_ENV || 'production'
    });
  });
}

// Fallback 404 Route Handler for undefined API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API endpoint '${req.originalUrl}' not found.` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(`\x1b[32m✔ Pranidha School Backend running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}\x1b[0m`);
  
  // Connect to Hostinger MySQL Database
  try {
    await connectDB();
  } catch (err) {
    console.error('Database connection notice on startup:', err.message);
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
