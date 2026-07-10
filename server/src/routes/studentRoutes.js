/**
 * routes/studentRoutes.js — Student profile route definitions.
 */

import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(getStudents)
  .post(authorize('admin'), createStudent);

router
  .route('/:id')
  .get(getStudentById)
  .put(authorize('admin', 'teacher'), updateStudent)
  .delete(authorize('admin'), deleteStudent);

export default router;
