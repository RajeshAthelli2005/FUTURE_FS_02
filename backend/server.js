const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/leads',   require('./routes/leads'));
app.use('/api/contact', require('./routes/contact'));

// Health check — also shows DB connection status
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states  = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status : dbState === 1 ? 'ok' : 'degraded',
    server : 'running',
    database: states[dbState] || 'unknown',
  });
});

// Serve React frontend in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  // All non-API routes → return React's index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    }
  });
}

// 404 handler (API routes only)
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Database + Server start ───────────────────────────────────────────────────
const PORT      = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI || MONGO_URI.includes('USERNAME:PASSWORD')) {
  console.error('');
  console.error('❌  MONGO_URI is not set in your .env file!');
  console.error('    1. Go to https://cloud.mongodb.com and create a free cluster');
  console.error('    2. Copy your connection string');
  console.error('    3. Paste it as MONGO_URI in backend/.env');
  console.error('    4. Restart the server');
  console.error('');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`✅  Server running  →  http://localhost:${PORT}`);
      console.log(`    Health check   →  http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    console.error('    Check your MONGO_URI in backend/.env');
    process.exit(1);
  });
