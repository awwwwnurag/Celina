import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false   // Google OAuth users won't have a password
  },
  googleId: {
    type: String,
    default: undefined
  },
  avatar: {
    type: String,
    default: undefined  // Google profile picture URL
  },
  role: {
    type: String,
    required: true,
    enum: ['Customer', 'Admin'],
    default: 'Customer'
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  loginHistory: [{
    timestamp: { type: Date, default: Date.now },
    ip: String,
    browser: String
  }],
  resetPasswordToken: {
    type: String,
    default: undefined
  },
  resetPasswordExpire: {
    type: Date,
    default: undefined
  },
  mobileNumber: {
    type: String,
    default: undefined
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: undefined
  },
  birthday: {
    type: String,
    default: undefined
  },
  altMobile: {
    number: { type: String, default: undefined },
    hint: { type: String, default: undefined }
  },
  addresses: [
    {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      houseNumber: { type: String, required: true },
      address: { type: String, required: true },
      locality: { type: String, required: true },
      city: { type: String, required: true },
      addressType: { type: String, enum: ['Home', 'Office'], default: 'Home' },
      openOnSaturday: { type: Boolean, default: false },
      openOnSunday: { type: Boolean, default: false },
      isDefault: { type: Boolean, default: false }
    }
  ],
  cards: [
    {
      cardName: { type: String, required: true },
      cardNumber: { type: String, required: true },
      expiry: { type: String, required: true },
      cardType: { type: String, default: 'Visa' }
    }
  ],

  // Store Credit wallet
  storeCredit: {
    type: Number,
    default: 0
  },
  storeCreditHistory: [
    {
      amount: { type: Number, required: true },
      type: { type: String, enum: ['Credit', 'Debit'], required: true },
      reason: { type: String, default: '' },
      date: { type: Date, default: Date.now },
      orderId: { type: String, default: '' }
    }
  ]
}, {
  timestamps: true
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password before saving (skip for Google OAuth users who have no password)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
