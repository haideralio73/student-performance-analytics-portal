/**
 * routes/authRoutes.js — Authentication route definitions.
 *
 * Maps POST /register, POST /login, POST /refresh, POST /logout,
 * and GET /me to their controller handlers with input validation.
 */

import { Router } from 'express';
import { register, login, getMe, refresh, logout } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerRules, loginRules, handleValidation } from '../middleware/validate.js';

const router = Router();

router.post('/register', registerRules, handleValidation, register);
router.post('/login', loginRules, handleValidation, login);
router.post('/refresh', protect, refresh);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
