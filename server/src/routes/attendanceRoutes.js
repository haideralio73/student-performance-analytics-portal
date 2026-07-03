/**
 * routes/attendanceRoutes.js — Attendance route definitions.
 *
 * Endpoints for recording, querying, and bulk-importing
 * attendance data. Teachers/admins write; students read.
 */

import { Router } from 'express';
import {
  getAttendance,
  createAttendance,
  bulkCreateAttendance,
  updateAttendance,
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(getAttendance)
  .post(authorize('admin', 'teacher'), createAttendance);

router.route('/bulk').post(authorize('admin', 'teacher'), bulkCreateAttendance);
router.route('/:id').put(authorize('admin', 'teacher'), updateAttendance);

export default router;
