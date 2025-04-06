import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/payment.model';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR' } = req.body;

    const options = {
      amount: amount * 100, // Convert to smallest currency unit (paise)
      currency,
      receipt: `order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Error creating order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign)
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Save payment record
    const payment = await Payment.create({
      userId: req.user?._id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: req.body.amount,
      status: 'completed'
    });

    res.json({
      message: 'Payment verified successfully',
      payment
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find({ userId: req.user?._id })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error('Get payment history error:', err);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
};
