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

// Security and utility middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/', generalLimiter);

// Health check endpoint with database status reporting
app.get('/api/health', (req, res) => {
  const dbConnected = isDBConnected();
  res.json({
    status: 'ok',
    service: 'SecretSpace API',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

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

// Start server and initialize database connection
app.listen(PORT, async () => {
  console.log(`[Server] SecretSpace backend running on http://localhost:${PORT}`);
  await connectDB();
});

export default app;
