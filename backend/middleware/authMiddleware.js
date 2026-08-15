import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
const protect = async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret12345');
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, account no longer exists'));
      }

      if (user.isActive === false) {
        res.status(403);
        return next(new Error('Your account is deactivated. Please contact support.'));
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403);
    return next(new Error('Not authorized as an admin'));
  }
};

export { protect, admin };
