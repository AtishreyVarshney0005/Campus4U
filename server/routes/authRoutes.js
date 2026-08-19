import express from 'express';
import { registerStudent, loginStudent, getMe, logoutStudent } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/me', protect, getMe);
router.post('/logout', protect, logoutStudent);

export default router;
