import { Router } from 'express';
import { getCommentsByPost, createComment } from '../controllers/commentController.js';
import { authRequired, optionalAuth } from '../middleware/auth.js';
import { createLimiter } from '../middleware/rateLimiter.js';
import { requireDB } from '../config/db.js';

const router = Router();

router.get('/:postId', optionalAuth, requireDB, getCommentsByPost);
router.post('/:postId', authRequired, createLimiter, requireDB, createComment);

export default router;
