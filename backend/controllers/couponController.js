import Coupon from '../models/Coupon.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minPurchaseAmount, expiryDate, usageLimit, isActive } = req.body;
    
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
      res.status(400);
      return next(new Error('Coupon code already exists'));
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchaseAmount: minPurchaseAmount || 0,
      expiryDate,
      usageLimit: usageLimit === '' ? null : usageLimit,
      isActive: isActive !== undefined ? isActive : true
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
  try {
    const { discountType, discountValue, minPurchaseAmount, expiryDate, usageLimit, isActive } = req.body;
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      coupon.discountType = discountType || coupon.discountType;
      coupon.discountValue = discountValue !== undefined ? discountValue : coupon.discountValue;
      coupon.minPurchaseAmount = minPurchaseAmount !== undefined ? minPurchaseAmount : coupon.minPurchaseAmount;
      coupon.expiryDate = expiryDate || coupon.expiryDate;
      coupon.usageLimit = usageLimit !== undefined ? (usageLimit === '' ? null : usageLimit) : coupon.usageLimit;
      coupon.isActive = isActive !== undefined ? isActive : coupon.isActive;

      const updatedCoupon = await coupon.save();
      res.json(updatedCoupon);
    } else {
      res.status(404);
      return next(new Error('Coupon not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await Coupon.findByIdAndDelete(req.params.id);
      res.json({ message: 'Coupon removed' });
    } else {
      res.status(404);
      return next(new Error('Coupon not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res, next) => {
  const { code, cartTotal } = req.body;
  if (!code) {
    res.status(400);
    return next(new Error('Coupon code is required'));
  }

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    
    if (!coupon) {
      res.status(404);
      return next(new Error('Invalid coupon code'));
    }

    if (!coupon.isActive) {
      res.status(400);
      return next(new Error('Coupon code has been deactivated'));
    }

    // Check expiry
    if (new Date(coupon.expiryDate) < new Date()) {
      res.status(400);
      return next(new Error('Coupon code has expired'));
    }

    // Check usage limit
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      res.status(400);
      return next(new Error('Coupon code usage limit has been reached'));
    }

    // Check minimum purchase amount
    if (cartTotal && cartTotal < coupon.minPurchaseAmount) {
      res.status(400);
      return next(new Error(`Minimum purchase amount of ₹${coupon.minPurchaseAmount} is required for this coupon`));
    }

    res.json({
      success: true,
      message: 'Coupon code validated successfully',
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchaseAmount: coupon.minPurchaseAmount
    });
  } catch (error) {
    next(error);
  }
};
