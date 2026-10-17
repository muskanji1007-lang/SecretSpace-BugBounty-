import { Router } from 'express';
import { createReport } from '../controllers/reportController.js';
import { authRequired } from '../middleware/auth.js';
import { requireDB } from '../config/db.js';

const router = Router();

router.post('/', authRequired, requireDB, createReport);

export default router;
