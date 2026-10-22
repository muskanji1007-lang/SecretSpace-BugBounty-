import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB, isDBConnected } from './config/db.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import pollRoutes from './routes/pollRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration allowing localhost, Vercel frontend, and preview deployments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://secret-space-psi.vercel.app',
  ...(process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((s) => s.trim().replace(/\/$/, ''))
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const normalized = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(normalized) ||
        normalized.endsWith('.vercel.app') ||
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized)
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', generalLimiter);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'SecretSpace API Server',
    status: 'online',
    health: '/health',
    apiHealth: '/api/health',
    timestamp: new Date().toISOString(),
  });
});

// Ensure MongoDB is connected for incoming API requests in serverless environments
app.use('/api', async (req, res, next) => {
  if (!isDBConnected()) {
    try {
      await connectDB();
    } catch {
      // Continue and let endpoint-level guards handle DB unavailability
    }
  }
  next();
});

// Health check endpoint with database status reporting (supports both /health and /api/health)
const handleHealthCheck = (req, res) => {
  const dbConnected = isDBConnected();
  res.json({
    status: 'ok',
    service: 'SecretSpace API',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};

app.get('/health', handleHealthCheck);
app.get('/api/health', handleHealthCheck);

// Mount modular API routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

// Fallback 404 and centralized error handler
app.use(notFoundHandler);
app.use(errorHandler);

// Start server locally or initialize database connection on serverless
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`[Server] SecretSpace backend running on http://localhost:${PORT}`);
    await connectDB();
  });
} else {
  connectDB();
}

export default app;
