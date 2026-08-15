import ReturnRequest from '../models/ReturnRequest.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// ─────────────────────────────────────────────
// @desc    Create a return/exchange/cancellation request
// @route   POST /api/returns
// @access  Private (Customer or Admin)
// ─────────────────────────────────────────────
const createReturnRequest = async (req, res, next) => {
  const { orderId, type, items, reason, reasonDetail, exchangeForSize, exchangeForColor, pickupAddress } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }

    // Validate ownership
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      res.status(403);
      return next(new Error('Not authorized to request return for this order'));
    }

    // Validate order status for return/exchange (must be Delivered)
    if (type !== 'Cancellation' && order.status !== 'Delivered') {
      res.status(400);
      return next(new Error('Returns and exchanges can only be requested for delivered orders'));
    }

    // Validate order status for cancellation (must be Processing)
    if (type === 'Cancellation' && order.status !== 'Processing') {
      res.status(400);
      return next(new Error('Cancellations can only be requested for orders in Processing status'));
    }

    // Check for duplicate pending request
    const existingRequest = await ReturnRequest.findOne({
      order: orderId,
      user: req.user._id,
      status: 'Pending'
    });
    if (existingRequest) {
      res.status(400);
      return next(new Error('A pending request already exists for this order'));
    }

    const returnRequest = new ReturnRequest({
      order: orderId,
      user: req.user._id,
      type,
      items,
      reason,
      reasonDetail: reasonDetail || '',
      exchangeForSize: exchangeForSize || '',
      exchangeForColor: exchangeForColor || '',
      pickupAddress: pickupAddress || ''
    });

    const saved = await returnRequest.save();

    // Update order status to reflect pending request
    if (type === 'Return') {
      order.status = 'Return Requested';
    } else if (type === 'Exchange') {
      order.status = 'Exchange Requested';
    }
    // For Cancellation — keep as Processing until admin approves
    await order.save();

    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get logged-in user's return requests
// @route   GET /api/returns/my
// @access  Private
// ─────────────────────────────────────────────
const getMyReturnRequests = async (req, res, next) => {
  try {
    const requests = await ReturnRequest.find({ user: req.user._id })
      .populate('order', 'status totalPrice createdAt')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get all return requests (admin)
// @route   GET /api/returns
// @access  Private/Admin
// ─────────────────────────────────────────────
const getAllReturnRequests = async (req, res, next) => {
  const { status, type, page = 1, limit = 20 } = req.query;

  try {
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const total = await ReturnRequest.countDocuments(query);
    const requests = await ReturnRequest.find(query)
      .populate('user', 'name email storeCredit')
      .populate('order', 'status totalPrice paymentMethod createdAt orderItems')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ requests, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get single return request by ID
// @route   GET /api/returns/:id
// @access  Private (owner or admin)
// ─────────────────────────────────────────────
const getReturnById = async (req, res, next) => {
  try {
    const request = await ReturnRequest.findById(req.params.id)
      .populate('user', 'name email storeCredit')
      .populate('order', 'status totalPrice paymentMethod orderItems')
      .populate('resolvedBy', 'name');

    if (!request) {
      res.status(404);
      return next(new Error('Return request not found'));
    }

    if (request.user._id.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
      res.status(403);
      return next(new Error('Not authorized'));
    }

    res.json(request);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Admin: update return request status + issue refund/credit
// @route   PUT /api/returns/:id
// @access  Private/Admin
// ─────────────────────────────────────────────
const updateReturnRequest = async (req, res, next) => {
  const { status, adminNote, refundMethod, refundAmount, returnTrackingNumber } = req.body;

  try {
    const request = await ReturnRequest.findById(req.params.id);
    if (!request) {
      res.status(404);
      return next(new Error('Return request not found'));
    }

    const prevStatus = request.status;
    request.status = status || request.status;
    request.adminNote = adminNote !== undefined ? adminNote : request.adminNote;
    request.refundMethod = refundMethod || request.refundMethod;
    request.refundAmount = refundAmount !== undefined ? Number(refundAmount) : request.refundAmount;
    if (returnTrackingNumber !== undefined) request.returnTrackingNumber = returnTrackingNumber;

    // ── When approving ──────────────────────────────────────────────
    if (status === 'Approved' && prevStatus !== 'Approved') {
      const order = await Order.findById(request.order);

      if (request.type === 'Cancellation' && order) {
        // Restore stock for cancelled order items
        for (const item of request.items) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.quantity;
            await product.save();
          }
        }
        order.status = 'Cancelled';
        await order.save();
      }

      if (request.type === 'Return' && order) {
        order.status = 'Returned';
        await order.save();
        // Restore stock
        for (const item of request.items) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.quantity;
            await product.save();
          }
        }
      }
    }

    // ── When completing + issuing refund ─────────────────────────
    if (status === 'Completed' && prevStatus !== 'Completed') {
      if (refundMethod === 'StoreCredit' && refundAmount > 0) {
        const customer = await User.findById(request.user);
        if (customer) {
          customer.storeCredit = (customer.storeCredit || 0) + Number(refundAmount);
          customer.storeCreditHistory.push({
            amount: Number(refundAmount),
            type: 'Credit',
            reason: `Refund for ${request.type} request #${request._id}`,
            orderId: request.order.toString(),
            date: new Date()
          });
          await customer.save();
          request.storeCreditIssued = Number(refundAmount);
        }
      }

      if (refundMethod === 'OriginalPayment') {
        // Mark original order as refunded
        const order = await Order.findById(request.order);
        if (order) {
          order.isRefunded = true;
          order.refundedAt = Date.now();
          await order.save();
        }
      }

      request.resolvedAt = new Date();
      request.resolvedBy = req.user._id;
    }

    if (status === 'Rejected' && prevStatus !== 'Rejected') {
      // Revert order status if we're rejecting a return/exchange request
      const order = await Order.findById(request.order);
      if (order && (order.status === 'Return Requested' || order.status === 'Exchange Requested')) {
        order.status = 'Delivered';
        await order.save();
      }
      request.resolvedAt = new Date();
      request.resolvedBy = req.user._id;
    }

    const updated = await request.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Admin: issue store credit manually to a user
// @route   POST /api/returns/store-credit
// @access  Private/Admin
// ─────────────────────────────────────────────
const issueStoreCredit = async (req, res, next) => {
  const { userId, amount, reason } = req.body;
  try {
    if (!userId || !amount || Number(amount) <= 0) {
      res.status(400);
      return next(new Error('userId and a positive amount are required'));
    }

    const customer = await User.findById(userId);
    if (!customer) {
      res.status(404);
      return next(new Error('User not found'));
    }

    customer.storeCredit = (customer.storeCredit || 0) + Number(amount);
    customer.storeCreditHistory.push({
      amount: Number(amount),
      type: 'Credit',
      reason: reason || 'Manual store credit by admin',
      date: new Date()
    });

    await customer.save();
    res.json({ message: `₹${amount} store credit issued to ${customer.name}`, storeCredit: customer.storeCredit });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get store credit stats (admin overview)
// @route   GET /api/returns/store-credit/stats
// @access  Private/Admin
// ─────────────────────────────────────────────
const getStoreCreditStats = async (req, res, next) => {
  try {
    const users = await User.find({ storeCredit: { $gt: 0 } }).select('name email storeCredit storeCreditHistory');
    const totalOutstanding = users.reduce((sum, u) => sum + (u.storeCredit || 0), 0);
    res.json({ totalOutstanding, usersWithCredit: users.length, users });
  } catch (error) {
    next(error);
  }
};

export {
  createReturnRequest,
  getMyReturnRequests,
  getAllReturnRequests,
  getReturnById,
  updateReturnRequest,
  issueStoreCredit,
  getStoreCreditStats
};
