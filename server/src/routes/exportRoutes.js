/**
 * routes/exportRoutes.js — CSV/JSON export routes.
 */

import { Router } from 'express';
import { exportCSV, exportJSON } from '../controllers/exportController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();
router.use(protect);

router.get('/:resource/csv', exportCSV);
router.get('/:resource/json', exportJSON);

export default router;
