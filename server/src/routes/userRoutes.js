/**
 * routes/userRoutes.js — User management route definitions (admin).
 *
 * Provides CRUD endpoints for user accounts, guarded by
 * authentication and admin-role authorization.
 */

import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;
