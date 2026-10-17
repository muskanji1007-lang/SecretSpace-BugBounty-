import { Router } from 'express';
import {
  getPosts,
  createPost,
  getPostById,
  votePost,
  deletePost,
} from '../controllers/postController.js';
import { authRequired, optionalAuth } from '../middleware/auth.js';
import { createLimiter } from '../middleware/rateLimiter.js';
import { requireDB } from '../config/db.js';

const router = Router();

router.get('/', optionalAuth, requireDB, getPosts);
router.post('/', authRequired, createLimiter, requireDB, createPost);
router.get('/:id', optionalAuth, requireDB, getPostById);
router.post('/:id/vote', authRequired, requireDB, votePost);
router.delete('/:id', authRequired, requireDB, deletePost);

export default router;
