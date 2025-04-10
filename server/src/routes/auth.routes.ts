import express, { Router } from 'express';
import { googleCallback, getProfile } from '../controllers/auth.controller';
import auth from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.post('/google/callback', googleCallback);

// Protected routes
router.get('/profile', auth, getProfile);

export default router;
