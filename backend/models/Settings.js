import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    default: 'global',
    unique: true
  },
  // Website Identity & SEO Settings
  websiteTitle: { type: String, default: 'Celina Clothing' },
  metaDescription: { type: String, default: 'Quality Apparel. Modern Silhouettes. Uncompromising Fits.' },
  seoKeywords: { type: String, default: 'fashion, clothing, e-commerce, celina clothing, ethnic, western' },
  contactEmail: { type: String, default: 'support@celinaclothing.com' },
  contactPhone: { type: String, default: '+91 99999 99999' },
  businessAddress: { type: String, default: 'Celina Clothing Pvt Ltd, Outer Ring Road, Bangalore, India' },
  googleMapsLink: { type: String, default: 'https://maps.google.com' },

  // Social Media Links
  socialFacebook: { type: String, default: '' },
  socialInstagram: { type: String, default: '' },
  socialWhatsapp: { type: String, default: '' },
  socialYoutube: { type: String, default: '' },
  socialTwitter: { type: String, default: '' },
  socialLinkedin: { type: String, default: '' },

  // Appearance Settings
  companyName: { type: String, default: 'Celina Clothing' },
  themeColorMain: { type: String, default: '#F2C852' }, // hex, default is yellow (#F2C852)
  themeColorBurgundy: { type: String, default: '#7D1F3C' }, // burgundy accent (#7D1F3C)
  themeColorBg: { type: String, default: '#ffffff' },
  fontStyle: { type: String, default: 'Poppins' },
  websiteWidth: { type: String, default: '1280px' },
  borderRadius: { type: String, default: '8px' },
  buttonStyle: { type: String, default: 'rounded' },
  cardStyle: { type: String, default: 'bordered' },
  homepageLayout: {
    type: [String],
    default: ['Hero', 'Sponsors', 'Arrivals', 'Young', 'App', 'Instagram', 'Footer']
  },

  // Media Settings (using secure Cloudinary object images)
  websiteLogo: {
    public_id: { type: String, default: '' },
    url: { type: String, default: '/assets/logo_icon.png' }
  },
  footerLogo: {
    public_id: { type: String, default: '' },
    url: { type: String, default: '/assets/logo_text.png' }
  },
  favicon: {
    public_id: { type: String, default: '' },
    url: { type: String, default: '/favicon.ico' }
  },
  paymentIcons: [{
    public_id: { type: String },
    url: { type: String }
  }],

  // Navigation Menu Customizer
  navigationMenu: [{
    title: { type: String, required: true },
    path: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  }],

  // Payment Options Toggle
  enableRazorpay: { type: Boolean, default: true },
  enableCOD: { type: Boolean, default: true },

  // Shipping Rules
  shippingCharges: { type: Number, default: 99 },
  freeShippingLimit: { type: Number, default: 1299 },
  deliveryTime: { type: String, default: '3-5 business days' },
  deliveryAreas: { type: String, default: 'All India' },

  // Homepage Dynamic Content Sections
  homepageHero: {
    show: { type: Boolean, default: true }
  },
  homepageSponsors: {
    show: { type: Boolean, default: true },
    images: [{
      public_id: { type: String },
      url: { type: String }
    }]
  },
  homepagePromoBanners: [{
    title: { type: String },
    subtitle: { type: String },
    image: {
      public_id: { type: String },
      url: { type: String }
    },
    link: { type: String, default: '/shop' },
    isActive: { type: Boolean, default: true }
  }],
  homepageNewsletter: {
    title: { type: String, default: 'Sign up for our newsletter' },
    subtitle: { type: String, default: 'Get the latest updates on new arrivals and offers' },
    show: { type: Boolean, default: true }
  },
  announcementText: { type: String, default: 'Flash festive edit is live. Free shipping above Rs. 1299 and extra 10% off with CELINA10.' },
  couponPopupCode: { type: String, default: 'CELINA10' },
  newsletterPopupTitle: { type: String, default: 'Private Drop Alerts' },
  exitIntentOffer: { type: String, default: 'LASTCHANCE' },
  referralBanner: { type: String, default: 'Give Rs. 250, get Rs. 250.' },
  giftCardMessage: { type: String, default: 'Digital gifts for every celebration.' },

  // Advanced no-code SEO fields
  openGraphTitle: { type: String, default: '' },
  openGraphImage: { type: String, default: '' },
  twitterCard: { type: String, default: 'summary_large_image' },
  canonicalUrl: { type: String, default: '' },
  sitemapUrl: { type: String, default: '/sitemap.xml' },
  robotsTxt: { type: String, default: 'User-agent: *\nAllow: /' },
  schemaOrg: { type: String, default: '' },

  // Admin managed operational templates and notes
  emailTemplates: { type: mongoose.Schema.Types.Mixed, default: {} },
  paymentSettings: { type: String, default: 'Razorpay enabled, COD enabled' },
  shippingRules: { type: String, default: 'Free shipping above Rs. 1299. Standard delivery 3-5 business days.' },
  reportNotes: { type: String, default: '' },
  testimonials: [{
    name: { type: String, required: true },
    role: { type: String, default: 'Customer' },
    content: { type: String, required: true },
    avatar: {
      public_id: { type: String, default: '' },
      url: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop' }
    }
  }],
  
  // Custom dynamically managed fields list for dropdown selectors in product forms
  availableSizes: { type: [String], default: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  availableColors: { type: [String], default: ['Pink', 'Gold', 'Ivory', 'Blue', 'Black', 'White', 'Beige', 'Red', 'Green', 'Navy'] },
  availableCollections: { type: [String], default: ['Ethnic Festive', 'Traditional Classics', 'Premium Silk', 'Linen Casuals', 'Royal Formal', 'Smart Casuals', 'Wedding Premium', 'Regular'] },
  availableSeasons: { type: [String], default: ['Spring', 'Summer', 'Autumn', 'Winter', 'All'] },
  availableSubcategories: { type: [String], default: ['Kurtas', 'Tees', 'Jeans', 'Jackets', 'Suits', 'Sneakers', 'Formal Shoes', 'Bags', 'Watches', 'Sarees', 'Dresses', 'Tops'] }
}, {
  timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
