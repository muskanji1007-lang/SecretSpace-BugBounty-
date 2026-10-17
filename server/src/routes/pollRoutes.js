import { Router } from 'express';
import { getPolls, createPoll, votePoll } from '../controllers/pollController.js';
import { authRequired, optionalAuth } from '../middleware/auth.js';
import { createLimiter } from '../middleware/rateLimiter.js';
import { requireDB } from '../config/db.js';

const router = Router();

router.get('/', optionalAuth, requireDB, getPolls);
router.post('/', authRequired, createLimiter, requireDB, createPoll);
router.post('/:id/vote', authRequired, requireDB, votePoll);

export default router;
