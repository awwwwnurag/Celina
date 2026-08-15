import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  addUserAddress,
  deleteUserAddress,
  addUserCard,
  deleteUserCard,
  toggleUserStatus,
  updateUserRole,
  adminResetUserPassword,
  getUserOrders
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, admin, getUsers);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/profile/address')
  .post(protect, addUserAddress);

router.route('/profile/address/:id')
  .delete(protect, deleteUserAddress);

router.route('/profile/card')
  .post(protect, addUserCard);

router.route('/profile/card/:id')
  .delete(protect, deleteUserCard);

router.route('/:id')
  .delete(protect, admin, deleteUser);

router.route('/:id/status')
  .put(protect, admin, toggleUserStatus);

router.route('/:id/role')
  .put(protect, admin, updateUserRole);

router.route('/:id/reset-password')
  .put(protect, admin, adminResetUserPassword);

router.route('/:id/orders')
  .get(protect, admin, getUserOrders);

export default router;
