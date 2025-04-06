import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { searchArtists, searchJobs, searchUsers } from '../controllers/search.controller';

const router = express.Router();

// All search routes require authentication
router.use(authMiddleware);

// Search routes
router.get('/artists', searchArtists);
router.get('/jobs', searchJobs);
router.get('/users', searchUsers);

export default router;
