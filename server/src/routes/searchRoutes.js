/**
 * routes/searchRoutes.js — Search across collections.
 */

import { Router } from 'express';
import { search } from '../controllers/searchController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', search);

export default router;
