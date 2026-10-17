import { Router } from 'express';
import { getUserActivity } from '../controllers/userController.js';
import { authRequired } from '../middleware/auth.js';
import { requireDB } from '../config/db.js';

const router = Router();

router.get('/me/activity', authRequired, requireDB, getUserActivity);

export default router;
