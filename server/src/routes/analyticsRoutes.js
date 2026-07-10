/**
 * routes/analyticsRoutes.js — Analytics route definitions.
 */

import { Router } from 'express';
import { getStudentSummary, getClassOverview } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import { scopeAnalyticsStudent } from '../middleware/scopedAccess.js';

const router = Router();

router.use(protect);

router.get('/student/:studentId', scopeAnalyticsStudent, getStudentSummary);
router.get('/class-overview', authorize('admin', 'teacher'), getClassOverview);

export default router;
