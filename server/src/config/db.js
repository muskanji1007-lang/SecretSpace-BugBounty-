import mongoose from 'mongoose';

// Global cache for serverless environments (prevents connection leaks across hot reloads)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let lastConnectionError = null;

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!rawUri && process.env.VERCEL) {
    lastConnectionError = 'MONGODB_URI environment variable is missing in Vercel project settings';
    console.error('[Database] ' + lastConnectionError);
    return null;
  }

  const mongoUri = rawUri || 'mongodb://localhost:27017/secretspace';

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
      lastConnectionError = null;
      console.log(`[Database] MongoDB Connected: ${m.connection.host}`);
      return m;
    }).catch((err) => {
      cached.promise = null;
      lastConnectionError = err.message;
      console.error(`[Database] MongoDB Connection Error: ${err.message}`);
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    lastConnectionError = error.message;
    console.error(`[Database] Awaiting connection failed: ${error.message}`);
  }

  return cached.conn;
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getDBDiagnostic = () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || '';
  let sanitizedHost = 'not_configured';
  if (uri) {
    try {
      const match = uri.match(/@([^/?]+)/);
      sanitizedHost = match ? match[1] : 'present_but_format_issue';
    } catch {
      sanitizedHost = 'error_parsing';
    }
  }

  return {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    configured: Boolean(uri),
    host: sanitizedHost,
    error: lastConnectionError || (mongoose.connection.readyState === 1 ? null : 'Database connection not established'),
  };
};

// Middleware to guard database-dependent endpoints with lazy connection retry
export const requireDB = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  if (!isDBConnected()) {
    return res.status(503).json({
      success: false,
      message: 'Database is currently offline or unreachable. Please verify MongoDB is running and MONGODB_URI is configured.',
      code: 'DB_UNAVAILABLE',
    });
  }
  next();
};

export default connectDB;
