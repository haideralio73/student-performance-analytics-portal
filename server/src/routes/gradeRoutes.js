/**
 * routes/gradeRoutes.js — Grade management route definitions.
 *
 * Teachers/admins create and update grades; students read only.
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

const router = Router();

router.use(protect);

router
  .route('/')
  .get(getGrades)
  .post(authorize('admin', 'teacher'), createGrade);

router
  .route('/:id')
  .get(getGradeById)
  .put(authorize('admin', 'teacher'), updateGrade)
  .delete(authorize('admin'), deleteGrade);

export default router;
