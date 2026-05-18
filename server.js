// ============================================
// server.js — Main Entry Point
// Bajrang Realty Backend API
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ── Route Imports ──
const enquiryRoutes = require('./routes/enquiryRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ── Connect to MongoDB ──
connectDB();

// ── Initialize Express App ──
const app = express();

// ── Global Middlewares ──

// CORS — Allow requests from your frontend
app.use(
  cors({
 origin: [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Serve Uploaded Images Statically ──
// Images accessible at: http://localhost:5000/uploads/properties/filename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ──
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);

// ── Health Check Route ──
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🏠 Bajrang Realty API is running!',
    version: '1.0.0',
    endpoints: {
      enquiries: '/api/enquiries',
      properties: '/api/properties',
      admin: '/api/admin',
      uploads: '/uploads/properties/<filename>',
    },
  });
});

// ── 404 Handler — Unknown Routes ──
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// ── Global Error Handler (must be last middleware) ──
app.use(errorHandler);

// ── Start Server ──
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('🏠 ================================');
  console.log('   BAJRANG REALTY API SERVER');
  console.log('🏠 ================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
  console.log('🏠 ================================');
  console.log('');
});

// ── Handle Unhandled Promise Rejections ──
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

// ── Handle Uncaught Exceptions ──
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

module.exports = app;
