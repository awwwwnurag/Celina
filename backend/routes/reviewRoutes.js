import express from 'express';
import { getReviews, toggleReviewStatus, replyToReview, deleteReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getReviews);

router.route('/:id')
  .delete(protect, deleteReview);

router.route('/:id/status')
  .put(protect, admin, toggleReviewStatus);

router.route('/:id/reply')
  .put(protect, admin, replyToReview);

export default router;
