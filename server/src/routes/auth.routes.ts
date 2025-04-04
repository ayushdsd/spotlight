import express from 'express';
import { googleAuth, getProfile } from '../controllers/auth.controller';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/google', googleAuth);
router.get('/profile', auth, getProfile);

export default router;
