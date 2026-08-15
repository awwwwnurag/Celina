import express from 'express';
import {
  createReturnRequest,
  getMyReturnRequests,
  getAllReturnRequests,
  getReturnById,
  updateReturnRequest,
  issueStoreCredit,
  getStoreCreditStats
} from '../controllers/returnController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer routes
router.route('/')
  .post(protect, createReturnRequest)
  .get(protect, admin, getAllReturnRequests);

router.route('/my')
  .get(protect, getMyReturnRequests);

// Admin — store credit management
router.route('/store-credit')
  .post(protect, admin, issueStoreCredit);

router.route('/store-credit/stats')
  .get(protect, admin, getStoreCreditStats);

// Individual return request (owner or admin)
router.route('/:id')
  .get(protect, getReturnById)
  .put(protect, admin, updateReturnRequest);

export default router;
