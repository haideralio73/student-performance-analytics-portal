/**
 * routes/attendanceRoutes.js — Attendance route definitions.
 *
 * Protected routes with role-based scoping:
 * - Students: read-only (own attendance enforced by controller).
 * - Teachers: mark attendance for their courses.
 * - Admins: full access.
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
import {
  scopeStudentRead,
  verifyTeacherCourse,
} from '../middleware/scopedAccess.js';
import { handleValidation } from '../middleware/validate.js';
import { body } from 'express-validator';

const attendanceValidation = [
  body('student').notEmpty().withMessage('Student reference is required'),
  body('course').optional(),
  body('date').notEmpty().withMessage('Date is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid status'),
];

const router = Router();

router.use(protect);

router
  .route('/')
  .get(scopeStudentRead, getAttendance)
  .post(authorize('admin', 'teacher'), attendanceValidation, handleValidation, verifyTeacherCourse, createAttendance);

router.route('/bulk').post(authorize('admin', 'teacher'), bulkCreateAttendance);
router.route('/:id').put(authorize('admin', 'teacher'), updateAttendance);

export default router;
