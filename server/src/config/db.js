import mongoose from 'mongoose';

// Global cache for serverless environments (prevents connection leaks across hot reloads)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let lastConnectionError = null;

export const sanitizeMongoUri = (rawUri) => {
  if (!rawUri || typeof rawUri !== 'string') return '';
  let clean = rawUri.trim().replace(/^["']+|["']+$/g, '');

  // Strip any accidental angle brackets < > copied from documentation templates
  const atIndex = clean.lastIndexOf('@');
  if (atIndex !== -1) {
    const credPart = clean.substring(0, atIndex);
    const hostPart = clean.substring(atIndex);
    const cleanCredPart = credPart.replace(/[<>]/g, '');
    clean = cleanCredPart + hostPart;
  }

  if (clean.startsWith('mongodb+srv://') && !clean.includes('authSource=')) {
    const sep = clean.includes('?') ? '&' : '?';
    clean = `${clean}${sep}authSource=admin`;
  }
  return clean;
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If already connecting (readyState 2), wait for it to finish
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', resolve);
      setTimeout(resolve, 4000);
    });
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }
  }

  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!rawUri && process.env.VERCEL) {
    lastConnectionError = 'MONGODB_URI environment variable is missing in Vercel project settings';
    console.error('[Database] ' + lastConnectionError);
    return null;
  }

  const mongoUri = rawUri ? sanitizeMongoUri(rawUri) : 'mongodb://localhost:27017/secretspace';

  try {
    const opts = {
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    };
    await mongoose.connect(mongoUri, opts);
    lastConnectionError = null;
    return mongoose.connection;
  } catch (error) {
    lastConnectionError = error.message;
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    return null;
  }
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

export const getDBDiagnostic = () => {
  const raw = process.env.MONGODB_URI || process.env.MONGO_URI || '';
  const uri = sanitizeMongoUri(raw);
  let sanitizedHost = 'not_configured';
  let sanitizedUser = 'not_configured';
  if (uri) {
    try {
      const match = uri.match(/@([^/?]+)/);
      sanitizedHost = match ? match[1] : 'present_but_format_issue';
      const userMatch = uri.match(/:\/\/([^:]+):/);
      sanitizedUser = userMatch ? userMatch[1] : 'present_without_user';
    } catch {
      sanitizedHost = 'error_parsing';
      sanitizedUser = 'error_parsing';
    }
  }

  return {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    configured: Boolean(raw),
    clusterHost: sanitizedHost,
    databaseUser: sanitizedUser,
    error: lastConnectionError || (mongoose.connection.readyState === 1 ? null : 'Database connection not established'),
  };
};

// Middleware to guard database-dependent endpoints with lazy connection retry
export const requireDB = async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState === 2) {
    await new Promise((r) => setTimeout(r, 500));
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
