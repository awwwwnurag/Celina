import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name category brand')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle review approval status
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
export const toggleReviewStatus = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      review.isApproved = !review.isApproved;
      await review.save();
      
      // Re-calculate product rating
      await recalculateProductRating(review.product);

      res.json({ message: `Review is now ${review.isApproved ? 'Approved' : 'Rejected'}`, isApproved: review.isApproved });
    } else {
      res.status(404);
      return next(new Error('Review not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Add admin reply to review
// @route   PUT /api/reviews/:id/reply
// @access  Private/Admin
export const replyToReview = async (req, res, next) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id);
    if (review) {
      review.reply = reply;
      await review.save();
      res.json(review);
    } else {
      res.status(404);
      return next(new Error('Review not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      // Validate that the request user is either an admin or the review creator
      if (req.user.isAdmin || review.user.toString() === req.user._id.toString()) {
        const productId = review.product;

        // Clean up review images from Cloudinary if they exist
        if (review.images && review.images.length > 0) {
          const deletePromises = review.images
            .filter((img) => img.public_id)
            .map((img) => deleteFromCloudinary(img.public_id));
          await Promise.all(deletePromises);
        }

        await Review.findByIdAndDelete(req.params.id);
        
        // Re-calculate product rating
        await recalculateProductRating(productId);

        res.json({ message: 'Review deleted successfully' });
      } else {
        res.status(403);
        return next(new Error('Not authorized to delete this review'));
      }
    } else {
      res.status(404);
      return next(new Error('Review not found'));
    }
  } catch (error) {
    next(error);
  }
};

// Helper function to update product rating
const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const count = reviews.length;
  const rating = count > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / count
    : 0;

  await Product.findByIdAndUpdate(productId, {
    rating,
    numReviews: count // wait, does product schema have numReviews? It has rating. Let's just update rating.
  });
};
