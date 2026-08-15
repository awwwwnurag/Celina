import Razorpay from 'razorpay';

// @desc    Create Razorpay Order
// @route   POST /api/payment/razorpay/order
// @access  Private
const createRazorpayOrder = async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) {
    res.status(400);
    return next(new Error('Amount is required'));
  }

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    res.status(500);
    return next(new Error('Razorpay API keys are not configured on the server'));
  }

  try {
    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise (1 INR = 100 paise)
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json(order);
  } catch (error) {
    res.status(500);
    next(error);
  }
};

// @desc    Get Razorpay Key
// @route   GET /api/payment/razorpay/key
// @access  Public
const getRazorpayKey = async (req, res, next) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID || '' });
};

export { createRazorpayOrder, getRazorpayKey };
