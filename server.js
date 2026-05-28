require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/insights', require('./routes/insights'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'EngageIQ',
    version: '1.0.0',
    dataSource: process.env.USE_REAL_DATA === 'true' ? 'Microsoft Graph API' : 'Mock data',
    timestamp: new Date().toISOString()
  });
});

// Catch-all: serve frontend for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   EngageIQ Server running            ║
  ║   http://localhost:${PORT}              ║
  ║   Data: ${process.env.USE_REAL_DATA === 'true' ? 'Microsoft Graph API  ' : 'Mock data            '} ║
  ╚══════════════════════════════════════╝
  `);
});
