/**
 * routes/gradeRoutes.js — Grade management route definitions.
 *
 * Protected routes with role-based scoping:
 * - Students: read-only (own grades enforced by controller).
 * - Teachers: create/update grades for their courses.
 * - Admins: full CRUD access.
 */

import { Router } from 'express';
import {
  getGrades,
  getGradeById,
  createGrade,
  updateGrade,
  deleteGrade,
} from '../controllers/gradeController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';
import {
  scopeStudentRead,
  verifyTeacherCourse,
  verifyStudentInTeachersCourse,
} from '../middleware/scopedAccess.js';
import { handleValidation } from '../middleware/validate.js';
import { body } from 'express-validator';

const gradeValidation = [
  body('student').notEmpty().withMessage('Student reference is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('score').isNumeric().withMessage('Score must be a number'),
  body('maxScore').isNumeric().withMessage('Max score must be a number'),
  body('assessmentType').isIn(['exam', 'quiz', 'assignment', 'project']).withMessage('Invalid assessment type'),
];

const router = Router();

router.use(protect);

router
  .route('/')
  .get(scopeStudentRead, getGrades)
  .post(authorize('admin', 'teacher'), gradeValidation, handleValidation, verifyTeacherCourse, verifyStudentInTeachersCourse, createGrade);

router
  .route('/:id')
  .get(getGradeById)
  .put(authorize('admin', 'teacher'), updateGrade)
  .delete(authorize('admin'), deleteGrade);

export default router;
