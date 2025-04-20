import express from 'express';
import { getCompanyProfile, upsertCompanyProfile } from '../controllers/company.controller';
import auth from '../middleware/auth';

const router = express.Router();

// Get current recruiter's company profile
router.get('/', auth, getCompanyProfile);

// Create or update company profile
router.post('/', auth, upsertCompanyProfile);

export default router;
