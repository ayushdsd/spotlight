import express, { Router } from 'express';
import jwt from 'jsonwebtoken';
import { googleCallback, getProfile } from '../controllers/auth.controller';
import auth from '../middleware/auth';

const router: Router = express.Router();

// Public routes
router.post('/google/callback', googleCallback);

// Token verification endpoint for frontend auth persistence
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.status(200).json({ valid: true, decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Protected routes
router.get('/profile', auth, getProfile);

export default router;
