import { Router } from 'express';
import { getReports, resolveReport, getStats } from '../controllers/adminController.js';
import { authRequired, adminRequired } from '../middleware/auth.js';
import { requireDB } from '../config/db.js';

const router = Router();

router.get('/reports', authRequired, adminRequired, requireDB, getReports);
router.patch('/reports/:id', authRequired, adminRequired, requireDB, resolveReport);
router.get('/stats', authRequired, adminRequired, requireDB, getStats);

export default router;
