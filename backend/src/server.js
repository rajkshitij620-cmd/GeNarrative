import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import performanceRoutes from './routes/performanceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import publishRoutes from './routes/publishRoutes.js';
import audienceRoutes from './routes/audienceRoutes.js';
import qrRoutes from './routes/qrRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded video and thumbnail assets
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Mount API routes (TWO ROLES: Artist & Audience, plus Public Guest accessibility)
app.use('/api/auth', authRoutes);
app.use('/api/artist', authRoutes);
app.use('/api/performances', performanceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/approval', approvalRoutes);
app.use('/api/publish', publishRoutes);
app.use('/api/public', audienceRoutes);
app.use('/api/audience', audienceRoutes);
app.use('/api/qr', qrRoutes);

// Base healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'RASA CUE - Performance Accessibility Platform',
    version: '2.0.0',
    supportedRoles: ['artist', 'audience'],
    guestAccess: 'enabled (unrestricted public QR / link viewing)',
    philosophy: 'AI proposes. The artist approves. Everyone experiences the art.',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Backend Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Start server immediately and connect DB asynchronously
const startServer = () => {
  connectDB().catch(err => console.warn('[MongoDB] Connection check:', err.message));
  app.listen(PORT, () => {
    console.log(`[RASA CUE Backend] Server running on http://localhost:${PORT}`);
    console.log(`[RASA CUE Backend] API documentation & health: http://localhost:${PORT}/api/health`);
  });
};

startServer();
