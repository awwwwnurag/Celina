import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        mobileNumber: user.mobileNumber,
        gender: user.gender,
        birthday: user.birthday,
        altMobile: user.altMobile || {},
        addresses: user.addresses || [],
        cards: user.cards || [],
        storeCredit: user.storeCredit || 0,
        storeCreditHistory: user.storeCreditHistory || []
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      if (req.body.mobileNumber !== undefined) {
        user.mobileNumber = req.body.mobileNumber;
      }
      if (req.body.gender !== undefined) {
        user.gender = req.body.gender;
      }
      if (req.body.birthday !== undefined) {
        user.birthday = req.body.birthday;
      }
      if (req.body.altMobile) {
        user.altMobile = {
          number: req.body.altMobile.number !== undefined ? req.body.altMobile.number : user.altMobile?.number,
          hint: req.body.altMobile.hint !== undefined ? req.body.altMobile.hint : user.altMobile?.hint
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        mobileNumber: updatedUser.mobileNumber,
        gender: updatedUser.gender,
        birthday: updatedUser.birthday,
        altMobile: updatedUser.altMobile || {},
        addresses: updatedUser.addresses || [],
        cards: updatedUser.cards || [],
        storeCredit: updatedUser.storeCredit || 0,
        storeCreditHistory: updatedUser.storeCreditHistory || []
      });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add address to user profile
// @route   POST /api/users/profile/address
// @access  Private
const addUserAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { 
        name, mobile, pincode, state, houseNumber, address, locality, city, 
        addressType, openOnSaturday, openOnSunday, isDefault 
      } = req.body;
      
      if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }
      user.addresses.push({ 
        name, mobile, pincode, state, houseNumber, address, locality, city, 
        addressType, openOnSaturday, openOnSunday, isDefault 
      });
      const updatedUser = await user.save();
      res.status(201).json(updatedUser.addresses);
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address from user profile
// @route   DELETE /api/users/profile/address/:id
// @access  Private
const deleteUserAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add card to user profile
// @route   POST /api/users/profile/card
// @access  Private
const addUserCard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const { cardName, cardNumber, expiry, cardType } = req.body;
      user.cards.push({ cardName, cardNumber, expiry, cardType });
      const updatedUser = await user.save();
      res.status(201).json(updatedUser.cards);
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete card from user profile
// @route   DELETE /api/users/profile/card/:id
// @access  Private
const deleteUserCard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.cards = user.cards.filter(c => c._id.toString() !== req.params.id);
      await user.save();
      res.json(user.cards);
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    // Only get Users with role 'Customer'
    const users = await User.find({ role: 'Customer' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Disable/Delete User (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'Admin') {
        res.status(400);
        return next(new Error('Cannot delete admin user'));
      }
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'Admin' && user._id.toString() === req.user._id.toString()) {
        res.status(400);
        return next(new Error('Cannot deactivate yourself'));
      }
      user.isActive = user.isActive === undefined ? false : !user.isActive;
      await user.save();
      res.json({ message: `User status updated to ${user.isActive ? 'Active' : 'Inactive'}`, isActive: user.isActive });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !['Customer', 'Admin'].includes(role)) {
      res.status(400);
      return next(new Error('Invalid role specified'));
    }
    const user = await User.findById(req.params.id);
    if (user) {
      if (user._id.toString() === req.user._id.toString()) {
        res.status(400);
        return next(new Error('Cannot change your own role'));
      }
      user.role = role;
      await user.save();
      res.json({ message: 'User role updated successfully', role: user.role });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Admin reset user password
// @route   PUT /api/users/:id/reset-password
// @access  Private/Admin
const adminResetUserPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      res.status(400);
      return next(new Error('Password must be at least 6 characters long'));
    }
    const user = await User.findById(req.params.id);
    if (user) {
      user.password = password;
      await user.save();
      res.json({ message: 'User password reset successfully' });
    } else {
      res.status(404);
      return next(new Error('User not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user order history
// @route   GET /api/users/:id/orders
// @access  Private/Admin
const getUserOrders = async (req, res, next) => {
  try {
    const Order = (await import('../models/Order.js')).default;
    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export {
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
};
