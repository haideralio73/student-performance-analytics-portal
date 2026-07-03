/**
 * routes/analyticsRoutes.js — Analytics route definitions.
 *
 * Read-only endpoints that return aggregated performance and
 * attendance data for dashboards and reports.
 */

import { Router } from 'express';
import { getStudentSummary, getClassOverview } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/student/:studentId', getStudentSummary);
router.get('/class-overview', getClassOverview);

export default router;
