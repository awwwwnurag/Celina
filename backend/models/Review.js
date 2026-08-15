import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    public_id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      required: true
    }
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  reply: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can review a product only once
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
