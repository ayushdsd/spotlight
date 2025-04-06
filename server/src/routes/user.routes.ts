import express from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from '../controllers/user.controller';

const router = express.Router();

// Protected routes
router.use(authMiddleware);
router.get('/profile', getUserProfile); // Get own profile
router.get('/:userId', getUserProfile); // Get other user's profile
router.put('/profile', updateUserProfile);
router.post('/profile/picture', uploadProfilePicture);

export default router;
