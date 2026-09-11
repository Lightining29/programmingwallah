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

// Dynamic Sitemap for Search Engines & AI Crawlers
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');
  
  const possibleSitemapPaths = [
    path.join(__dirname, '../dist/sitemap.xml'),
    path.join(__dirname, '../frontend/dist/sitemap.xml'),
    path.join(__dirname, '../frontend/public/sitemap.xml'),
    path.join(process.cwd(), 'dist/sitemap.xml')
  ];

  for (const p of possibleSitemapPaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }

  res.status(404).send('Sitemap not found');
});

// Robots.txt Handler
app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');

  const possibleRobotsPaths = [
    path.join(__dirname, '../dist/robots.txt'),
    path.join(__dirname, '../frontend/dist/robots.txt'),
    path.join(__dirname, '../frontend/public/robots.txt'),
    path.join(process.cwd(), 'dist/robots.txt')
  ];

  for (const p of possibleRobotsPaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }

  res.send(`User-agent: *
Allow: /
Allow: /courses/
Allow: /courses/*
Allow: /courses-in-ghaziabad
Allow: /manish-kumar
Allow: /profile/manish-kumar
Allow: /manish
Allow: /manish/*
Allow: /assets/images/courses/
Allow: /assets/images/courses/*
Allow: /careers
Allow: /careers/*
Allow: /tutorials
Allow: /practice
Allow: /verify-certificate/*

Sitemap: https://programmingwala.com/sitemap.xml`);
});

// Robots.xml Handler (for search console & bots requesting XML format)
app.get('/robots.xml', (req, res) => {
  res.header('Content-Type', 'application/xml; charset=utf-8');
  res.header('Cache-Control', 'public, max-age=86400');

  const possibleRobotsXmlPaths = [
    path.join(__dirname, '../dist/robots.xml'),
    path.join(__dirname, '../frontend/dist/robots.xml'),
    path.join(__dirname, '../frontend/public/robots.xml'),
    path.join(process.cwd(), 'dist/robots.xml')
  ];

  for (const p of possibleRobotsXmlPaths) {
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }

  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<robots>
  <sitemap>https://programmingwala.com/sitemap.xml</sitemap>
</robots>`);
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

  // 1. Explicit 301 Permanent Redirects for alias URLs (Eliminates GSC Duplicate & Redirect warnings)
  app.get(['/profile/manish-kumar', '/profile/manish-kumar/', '/manish', '/manish/'], (req, res) => {
    res.redirect(301, 'https://programmingwala.com/manish-kumar');
  });

  app.get(['/coaching-in-rdc-ghaziabad', '/coaching-in-rdc-ghaziabad/'], (req, res) => {
    res.redirect(301, 'https://programmingwala.com/courses-in-ghaziabad');
  });

  app.get(['/job-roles', '/job-roles/', '/trending-tech-jobs', '/trending-tech-jobs/'], (req, res) => {
    res.redirect(301, 'https://programmingwala.com/careers');
  });

  // 2. Direct Prerendered HTML delivery for Core Hub Pages (Zero 301, 100% Crawlable)
  const coreHubs = [
    'manish-kumar',
    'courses-in-ghaziabad',
    'careers',
    'tutorials',
    'practice',
    'verify-certificate'
  ];

  coreHubs.forEach(hub => {
    app.get([`/${hub}`, `/${hub}/`], (req, res, next) => {
      const searchDirs = [
        resolvedDistPath,
        path.join(__dirname, '../dist'),
        path.join(__dirname, '../frontend/dist'),
        path.join(__dirname, '../frontend/public')
      ];

      for (const sDir of searchDirs) {
        const directHtml = path.join(sDir, `${hub}.html`);
        const subDirHtml = path.join(sDir, hub, 'index.html');
        if (fs.existsSync(directHtml)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Link', `<https://programmingwala.com/${hub}>; rel="canonical"`);
          return res.sendFile(directHtml);
        }
        if (fs.existsSync(subDirHtml)) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Link', `<https://programmingwala.com/${hub}>; rel="canonical"`);
          return res.sendFile(subDirHtml);
        }
      }
      next();
    });
  });

  // 3. Direct Prerendered HTML delivery for 150 Course Pages (100% SEO, Googlebot & Crawler Ready)
  app.get(['/courses/:slug', '/courses/:slug/'], (req, res, next) => {
    const slug = req.params.slug;
    const searchDirs = [
      path.join(resolvedDistPath, 'courses'),
      path.join(__dirname, '../dist/courses'),
      path.join(__dirname, '../frontend/dist/courses'),
      path.join(__dirname, '../frontend/public/courses')
    ];

    for (const sDir of searchDirs) {
      const directHtml = path.join(sDir, `${slug}.html`);
      const subDirHtml = path.join(sDir, slug, 'index.html');
      if (fs.existsSync(directHtml)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Link', `<https://programmingwala.com/courses/${slug}>; rel="canonical"`);
        return res.sendFile(directHtml);
      }
      if (fs.existsSync(subDirHtml)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Link', `<https://programmingwala.com/courses/${slug}>; rel="canonical"`);
        return res.sendFile(subDirHtml);
      }
    }
    next();
  });

  app.use(express.static(resolvedDistPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      // Never cache index.html so frontend updates deploy instantly
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    }
  }));
  
  // 4. Dynamic Canonical SPA Fallback (Guarantees every page has a matching self-referential canonical)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    const cleanPath = req.path.replace(/\/+$/, '') || '';
    const canonicalUrl = `https://programmingwala.com${cleanPath}`;
    res.setHeader('Link', `<${canonicalUrl}>; rel="canonical"`);

    const indexPath = path.join(resolvedDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      let html = fs.readFileSync(indexPath, 'utf-8');
      if (html.includes('<link rel="canonical"')) {
        html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonicalUrl}"`);
      } else {
        html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
      }
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    }
    res.sendFile(indexPath);
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
