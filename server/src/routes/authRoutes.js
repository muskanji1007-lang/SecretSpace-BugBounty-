import { Router } from 'express';
import { register, login, getMe, updateProfile } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { requireDB } from '../config/db.js';

const router = Router();

router.post('/register', authLimiter, requireDB, register);
router.post('/login', authLimiter, requireDB, login);
router.get('/me', authRequired, requireDB, getMe);
router.patch('/profile', authRequired, requireDB, updateProfile);

export default router;
