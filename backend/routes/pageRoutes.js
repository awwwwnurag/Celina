import express from 'express';
import { getPages, getPageBySlug, createOrUpdatePage, deletePage } from '../controllers/pageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPages)
  .post(protect, admin, createOrUpdatePage);

router.route('/:slug')
  .get(getPageBySlug)
  .put(protect, admin, createOrUpdatePage)
  .delete(protect, admin, deletePage);

export default router;
