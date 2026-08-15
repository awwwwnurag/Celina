import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  buttonText: {
    type: String,
    required: true,
    trim: true,
    default: 'Shop Now'
  },
  image: {
    public_id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      required: true
    }
  },
  link: {
    type: String,
    required: true,
    default: '/shop'
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
}, {
  timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
