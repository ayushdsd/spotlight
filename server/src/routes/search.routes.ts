import express, { Router } from 'express';
import { searchArtists, searchJobs, searchUsers } from '../controllers/search.controller';
import auth from '../middleware/auth';

const router: Router = express.Router();

// All search routes require authentication
router.use(auth);

// Search routes
router.get('/artists', searchArtists);
router.get('/jobs', searchJobs);
router.get('/users', searchUsers);

export default router;
