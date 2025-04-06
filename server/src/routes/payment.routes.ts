import express, { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory
} from '../controllers/payment.controller';
import auth from '../middleware/auth';

const router: Router = express.Router();

// All payment routes require authentication
router.use(auth);

// Payment routes
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

export default router;
