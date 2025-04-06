import express, { Router } from 'express';
import {
  getUserPortfolio,
  getPortfolioItem,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  updatePortfolioOrder,
  toggleFeatured,
  toggleLike,
} from '../controllers/portfolio.controller';
import auth from '../middleware/auth';

const router: Router = express.Router();

// Get user's portfolio items (public)
router.get('/user/:userId', getUserPortfolio);

// Get single portfolio item (public)
router.get('/item/:itemId', getPortfolioItem);

// Protected routes (require authentication)
router.use(auth);

// Create new portfolio item
router.post('/', createPortfolioItem);

// Update portfolio item
router.put('/item/:itemId', updatePortfolioItem);

// Delete portfolio item
router.delete('/item/:itemId', deletePortfolioItem);

// Update portfolio items order
router.put('/order', updatePortfolioOrder);

// Toggle featured status
router.put('/item/:itemId/featured', toggleFeatured);

// Toggle like
router.put('/item/:itemId/like', toggleLike);

export default router;
