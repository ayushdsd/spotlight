import express from 'express';
import { googleAuth, getProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/google', googleAuth);

// Protected routes
router.use(authMiddleware);
router.get('/profile', getProfile);

export default router;
