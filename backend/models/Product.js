import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true,
    default: ''
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Kids', 'Unisex'],
    default: 'Women'
  },
  sizes: {
    type: [String],
    required: true,
    default: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  colors: {
    type: [String],
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0.0
  },
  discount: {
    type: Number,
    required: true,
    default: 0 // percentage discount (e.g. 20 for 20% off)
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
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    required: true,
    default: 0.0
  },
  featured: {
    type: Boolean,
    required: true,
    default: false
  },
  trending: {
    type: Boolean,
    required: true,
    default: false
  },
  bestSeller: {
    type: Boolean,
    required: true,
    default: false
  },
  newArrival: {
    type: Boolean,
    required: true,
    default: false
  },
  sale: {
    type: Boolean,
    required: true,
    default: false
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  collectionName: {
    type: String,
    required: true,
    trim: true,
    default: 'Regular'
  },
  season: {
    type: String,
    required: true,
    enum: ['Spring', 'Summer', 'Autumn', 'Winter', 'All'],
    default: 'All'
  },
  codAvailable: {
    type: Boolean,
    default: true
  },
  returnAvailable: {
    type: Boolean,
    default: true
  },
  freeDelivery: {
    type: Boolean,
    default: true
  },
  careInstructions: {
    type: String,
    default: 'Dry clean or gentle hand wash'
  },
  packContains: {
    type: String,
    default: '1 Product'
  },
  manufacturerDetails: {
    type: String,
    default: 'Celina Clothing Pvt Ltd'
  },
  countryOfOrigin: {
    type: String,
    default: 'India'
  },
  colorImages: [{
    color: { type: String, required: true },
    images: [{
      public_id: { type: String, default: '' },
      url: { type: String, required: true }
    }]
  }],
  fabric: {
    type: String,
    default: ''
  },
  fashionTrends: {
    type: String,
    default: ''
  },
  fit: {
    type: String,
    default: ''
  },
  length: {
    type: String,
    default: ''
  },
  multipackSet: {
    type: String,
    default: ''
  },
  neck: {
    type: String,
    default: ''
  },
  occasion: {
    type: String,
    default: ''
  },
  pattern: {
    type: String,
    default: ''
  },
  printPatternType: {
    type: String,
    default: ''
  },
  sleeveLength: {
    type: String,
    default: ''
  },
  sleeveStyling: {
    type: String,
    default: ''
  },
  washCare: {
    type: String,
    default: ''
  },

  // Inventory management
  sku: {
    type: String,
    trim: true,
    sparse: true,
    default: ''
  },
  barcode: {
    type: String,
    trim: true,
    default: ''
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
