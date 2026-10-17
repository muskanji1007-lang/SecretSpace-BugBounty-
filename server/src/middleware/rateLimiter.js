import rateLimit from 'express-rate-limit';

// Standard rate limit for general browsing
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

// Stricter rate limit for authentication (prevent brute-force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

// Rate limit for content creation to prevent spam
export const createLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Posting rate limit exceeded. Please wait a few minutes before posting again.',
    code: 'POST_RATE_LIMIT_EXCEEDED',
  },
});
