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
import http from 'http';
import lmsRoutes from './routes/lms.js';
import paymentRoutes from './routes/payment.js';
import musicRoutes from './routes/music.js';
import { setupGameSocket } from './socket/gameSocket.js';

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
app.use('/api/music', musicRoutes);

// Dynamic Sitemap for Search Engines & AI Crawlers
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.afshaenterprises.com/manish-kumar</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://www.afshaenterprises.com/manish/manish_3.jpg</image:loc>
      <image:title>Manish Kumar - Best Java Full Stack Developer &amp; AWS DevOps Engineer</image:title>
    </image:image>
  </url>
  <url>
    <loc>https://programmingwala.com/manish-kumar</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/careers</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/careers/java-full-stack-developer</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/careers/aws-devops-engineer</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/careers/python-developer</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/careers/react-frontend-developer</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/careers/mern-stack-developer</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/careers/data-engineer-ai</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/practice</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/programs</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/tutorials</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://programmingwala.com/verify-certificate</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
</urlset>`;
  res.send(sitemapXml.trim());
});

// Robots.txt Handler
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');
  res.send(`User-agent: *
Allow: /
Allow: /careers
Allow: /careers/*
Allow: /jobs/*
Allow: /manish-kumar
Allow: /profile/manish-kumar
Allow: /manish
Allow: /manish/*
Allow: /verify-certificate/*

Sitemap: https://programmingwala.com/sitemap.xml
Sitemap: https://www.afshaenterprises.com/sitemap.xml`);
});

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
const httpServer = http.createServer(app);

// Initialize Real-time Multiplayer Gaming Socket Hub
try {
  setupGameSocket(httpServer);
  console.log(`\x1b[35m✔ Real-time Multiplayer Gaming Socket Server initialized\x1b[0m`);
} catch (socketErr) {
  console.warn('Socket initialization notice:', socketErr.message);
}

const server = httpServer.listen(PORT, async () => {
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
