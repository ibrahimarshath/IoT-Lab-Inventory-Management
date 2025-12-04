// server.js
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Utility to conditionally require route files (so missing files won't crash server)
function tryRequire(relativePath) {
  const fullPath = path.resolve(__dirname, relativePath + '.js');
  if (fs.existsSync(fullPath)) {
    return require(fullPath);
  }
  return null;
}

/*
  1) JWT middleware: try to load ./middleware/jwtAuth.js
     If available, use jwtAuth globally so req.user is set for all routes.
     If not available, fall back to a no-op middleware (so routes still work).
*/
let jwtAuth;
try {
  const jwtModule = tryRequire('./middleware/jwtAuth');
  if (jwtModule && typeof jwtModule.jwtAuth === 'function') {
    jwtAuth = jwtModule.jwtAuth;
    app.use(jwtAuth); // attach req.user if a Bearer token is provided
    console.log('JWT middleware loaded and enabled globally.');
  } else {
    jwtAuth = (req, res, next) => next();
    console.log('No jwtAuth middleware found; continuing without global auth parsing.');
  }
} catch (err) {
  console.warn('Error loading jwtAuth middleware:', err);
  jwtAuth = (req, res, next) => next();
}

/*
  2) Mount route modules if they exist.
     Each route file should export an Express Router (module.exports = router).
*/
const routeMap = [
  { mount: '/api/auth', file: './routes/auth' },
  { mount: '/api/components', file: './routes/components' },
  { mount: '/api/categories', file: './routes/categories' },
  { mount: '/api/tags', file: './routes/tags' },
  { mount: '/api/borrow', file: './routes/borrow' },
  { mount: '/api/borrow-records', file: './routes/borrowRecords' },
  { mount: '/api/iot', file: './routes/iot' },
  { mount: '/api/logs', file: './routes/logs' },
  { mount: '/api/admin', file: './routes/admin' }
];

routeMap.forEach(({ mount, file }) => {
  const router = tryRequire(file);
  if (router) {
    app.use(mount, router);
    console.log(`Mounted router: ${file} -> ${mount}`);
  } else {
    console.log(`Router not found (skipping): ${file}`);
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ ok: true, msg: 'Server running' });
});

// Debug route to show the current user (useful while developing)
// Remove in production if you want
app.get('/debug-whoami', (req, res) => {
  res.json({ user: req.user || null });
});

/*
  Error handler:
  Try to load a custom error handler middleware; otherwise use a simple one.
*/
const customErrorHandler = tryRequire('./middleware/errorHandler');
if (customErrorHandler) {
  app.use(customErrorHandler);
} else {
  // default handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err && err.status ? err.status : 500).json({
      message: err && err.message ? err.message : 'Server error'
    });
  });
}

/*
  MongoDB connection + start server
*/
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/iot_lab_inventory';

async function start() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
}

start();

/*
  Graceful shutdown handlers (optional but helpful)
*/
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
