import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  duplicateProduct,
  bulkDeleteProducts,
  bulkUpdateProducts,
  importProducts,
  exportProducts,
  getInventoryReport,
  generateMissingSkus
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/bulk-delete')
  .post(protect, admin, bulkDeleteProducts);

router.route('/bulk-update')
  .post(protect, admin, bulkUpdateProducts);

router.route('/import')
  .post(protect, admin, importProducts);

router.route('/export')
  .get(protect, admin, exportProducts);

router.route('/inventory')
  .get(protect, admin, getInventoryReport);

router.route('/generate-skus')
  .post(protect, admin, generateMissingSkus);

router.route('/:id/duplicate')
  .post(protect, admin, duplicateProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
  .post(protect, upload.array('images', 5), createProductReview);

export default router;

