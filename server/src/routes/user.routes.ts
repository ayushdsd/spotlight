import express, { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from '../controllers/user.controller';
import auth from '../middleware/auth';

const router: Router = express.Router();

// Protected routes
router.use(auth);
router.get('/profile', getUserProfile); // Get own profile
router.get('/:userId', getUserProfile); // Get other user's profile
router.put('/profile', updateUserProfile);
router.post('/profile/picture', uploadProfilePicture);

export default router;
