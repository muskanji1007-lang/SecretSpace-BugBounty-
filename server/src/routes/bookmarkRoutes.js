import { Router } from 'express';
import { getBookmarks, toggleBookmark } from '../controllers/bookmarkController.js';
import { authRequired } from '../middleware/auth.js';
import { requireDB } from '../config/db.js';

const router = Router();

router.get('/', authRequired, requireDB, getBookmarks);
router.post('/:postId', authRequired, requireDB, toggleBookmark);

export default router;
