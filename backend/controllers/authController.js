import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!password || password.length < 6) {
    res.status(400);
    return next(new Error('Password must be at least 6 characters'));
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      return next(new Error('User already exists'));
    }

    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (user.isActive === false) {
        res.status(403);
        return next(new Error('Your account is deactivated. Please contact support.'));
      }

      // Record login history
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
      const browser = req.headers['user-agent'] || 'unknown';
      user.loginHistory = user.loginHistory || [];
      user.loginHistory.push({ timestamp: new Date(), ip, browser });
      if (user.loginHistory.length > 10) {
        user.loginHistory = user.loginHistory.slice(-10);
      }
      await user.save();

      const token = generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = req.user;
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};

// @desc    Send password reset email with secure token link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      return next(new Error('No account found with that email address'));
    }

    // Generate a raw random token (sent in email link)
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Store the SHA-256 hash of the token in DB (never store the raw token)
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    // Token expires in 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${rawToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #700d23; font-size: 28px; letter-spacing: 4px; margin: 0;">CELINA</h1>
          <p style="color: #666; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Clothing</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1a1a1a; margin-top: 0;">Password Reset Request</h2>
          <p style="color: #555; line-height: 1.6;">
            Hello <strong>${user.name}</strong>,
          </p>
          <p style="color: #555; line-height: 1.6;">
            We received a request to reset the password for your Celina Clothing account. Click the button below to set a new password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #700d23; color: white; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; display: inline-block;">
              Reset My Password
            </a>
          </div>
          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            This link is valid for <strong>10 minutes</strong> only. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 11px;">
            If the button above doesn't work, copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color: #700d23; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        <p style="text-align: center; color: #bbb; font-size: 11px; margin-top: 20px;">
          © ${new Date().getFullYear()} Celina Clothing. All rights reserved.
        </p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Celina Clothing — Password Reset Request',
      html
    });

    res.json({ message: `Password reset email sent to ${user.email}` });
  } catch (error) {
    // If email fails, clear the reset token so user can retry
    if (error.message && error.message.includes('sendMail')) {
      try {
        const userToClean = await User.findOne({ email });
        if (userToClean) {
          userToClean.resetPasswordToken = undefined;
          userToClean.resetPasswordExpire = undefined;
          await userToClean.save({ validateBeforeSave: false });
        }
      } catch (_) { /* ignore cleanup errors */ }
    }
    next(error);
  }
};

// @desc    Reset password using the token from the email link
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    return next(new Error('Password must be at least 6 characters'));
  }

  try {
    // Hash the raw token from the URL to compare with the stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find a user with this hashed token whose expiry hasn't passed
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      return next(new Error('Password reset token is invalid or has expired'));
    }

    // Set the new password and clear the reset token fields
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth Sign In / Sign Up
// @route   POST /api/auth/google
// @access  Public
// Accepts: { googleId, email, name, picture } — fetched from Google userinfo endpoint on frontend
const googleAuth = async (req, res, next) => {
  const { googleId, email, name, picture } = req.body;

  if (!googleId || !email) {
    res.status(400);
    return next(new Error('Google user info (googleId and email) is required'));
  }

  try {
    // Find existing user by googleId or email (handles account linking)
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Existing user — link Google ID if not already set
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = user.avatar || picture;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // New user — create account without a password
      user = await User.create({ name, email, googleId, avatar: picture, role: 'Customer' });
    }

    const token = generateToken(res, user._id);
    res.json({
      _id:    user._id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      avatar: user.avatar,
      token
    });
  } catch (error) {
    res.status(401);
    next(new Error('Google authentication failed: ' + error.message));
  }
};

export { registerUser, loginUser, logoutUser, getMe, googleAuth, forgotPassword, resetPassword };
