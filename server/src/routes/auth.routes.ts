import express, { Router } from 'express';
import { googleAuth, getProfile } from '../controllers/auth.controller';
import auth from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.post('/google', googleAuth);

// Protected routes
router.get('/profile', auth, getProfile);

export default router;
