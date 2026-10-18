import mongoose from 'mongoose';

// Global cache for serverless environments (prevents connection leaks across hot reloads)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secretspace';

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    };

    cached.promise = mongoose.connect(mongoUri, opts).then((m) => {
      console.log(`[Database] MongoDB Connected: ${m.connection.host}`);
      return m;
    }).catch((err) => {
      cached.promise = null;
      console.error(`[Database] MongoDB Connection Error: ${err.message}`);
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`[Database] Awaiting connection failed: ${error.message}`);
  }

  return cached.conn;
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
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
