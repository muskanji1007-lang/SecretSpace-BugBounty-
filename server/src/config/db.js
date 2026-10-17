import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/secretspace';
    
    // Connect with a reasonable timeout so requests fail fast if MongoDB is down
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000,
      autoIndex: true,
    });
    
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    isConnected = false;
    console.error(`[Database] MongoDB Connection Error: ${error.message}`);
    console.warn('[Database] Backend running without active MongoDB connection. Configure MONGODB_URI in .env');
    return null;
  }
};

export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Middleware to guard database-dependent endpoints
export const requireDB = (req, res, next) => {
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
