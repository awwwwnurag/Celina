import express from 'express';
import { createRazorpayOrder, getRazorpayKey } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/razorpay/order', protect, createRazorpayOrder);
router.get('/razorpay/key', getRazorpayKey);

export default router;
