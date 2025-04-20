import express, { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  followUser,
  unfollowUser,
  getFollowStatus
} from '../controllers/user.controller';
import auth from '../middleware/auth';
import Post from '../models/post.model';
import upload from '../middleware/multer';

const router: Router = express.Router();

// Debug log to verify router is being hit
router.use((req, res, next) => {
  console.log(`[USER ROUTER] ${req.method} ${req.originalUrl}`);
  next();
});

// Protected routes
router.use(auth);
router.get('/profile', getUserProfile); // Get own profile
router.get('/:userId', getUserProfile); // Get other user's profile
router.put('/profile', updateUserProfile);
router.post('/profile/picture', upload.single('file'), uploadProfilePicture);

// Follow/unfollow endpoints
router.post('/:userId/follow', followUser);
router.delete('/:userId/follow', unfollowUser);
router.get('/:userId/follow-status', getFollowStatus);

// Get all posts by a specific user
router.get('/:userId/posts', async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate('author', 'name picture role firstName lastName');
    res.json({ posts });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch user posts' });
  }
});

export default router;
