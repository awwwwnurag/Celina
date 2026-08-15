import mongoose from 'mongoose';

const returnItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true, default: 0 },
  size: { type: String, default: '' },
  color: { type: String, default: '' }
});

const returnRequestSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Return', 'Exchange', 'Cancellation'],
    default: 'Return'
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Refunded'],
    default: 'Pending'
  },
  items: [returnItemSchema],

  // Customer-provided reason
  reason: {
    type: String,
    required: true,
    enum: [
      'Wrong size',
      'Damaged / Defective item',
      'Wrong item delivered',
      'Not as described',
      'Changed my mind',
      'Ordered by mistake',
      'Quality not as expected',
      'Other'
    ]
  },
  reasonDetail: {
    type: String,
    default: ''
  },

  // Exchange-specific
  exchangeForSize: {
    type: String,
    default: ''
  },
  exchangeForColor: {
    type: String,
    default: ''
  },

  // Admin handling
  adminNote: {
    type: String,
    default: ''
  },
  refundMethod: {
    type: String,
    enum: ['StoreCredit', 'OriginalPayment', 'Manual', 'None'],
    default: 'None'
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  storeCreditIssued: {
    type: Number,
    default: 0
  },
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Pickup / return shipping
  pickupAddress: {
    type: String,
    default: ''
  },
  returnTrackingNumber: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const ReturnRequest = mongoose.model('ReturnRequest', returnRequestSchema);
export default ReturnRequest;
