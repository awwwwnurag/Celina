import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Banner from '../models/Banner.js';
import Settings from '../models/Settings.js';
import Page from '../models/Page.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

const productsData = [
  {
    name: "Classic Sky Cotton Kurta Set",
    description: "A premium straight-fit cotton kurta styled in our signature sky blue palette. Features subtle white thread work, comfortable regular fit, three-quarter sleeves, and straight pants bottom wear.",
    category: "Kurtis",
    subcategory: "Kurta Sets",
    brand: "Label Celina",
    gender: "Women",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "White"],
    price: 1899.00,
    discount: 15,
    images: [
      { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop" },
      { url: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop" }
    ],
    stock: 45,
    rating: 4.8,
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    sale: false,
    isActive: true,
    collectionName: "Office Wear Collection",
    season: "Summer",
    fabric: "100% Pure Cotton",
    occasion: "Office Wear",
    sleeveLength: "3/4 Sleeves",
    neck: "Mandarin Collar",
    pattern: "Solid Stripes",
    washCare: "Hand wash cold separately",
    fit: "Straight Fit",
    length: "Calf Length"
  },
  {
    name: "Vibrant Indigo A-Line Printed Kurti",
    description: "Charming daily wear flared A-line kurti made with premium breathable cotton fabric. Handblock style abstract print details with sleeveless cutouts.",
    category: "Kurtis",
    subcategory: "Printed Kurtis",
    brand: "Zara Ethnic",
    gender: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blue", "Ivory"],
    price: 1299.00,
    discount: 10,
    images: [
      { url: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&auto=format&fit=crop" }
    ],
    stock: 30,
    rating: 4.6,
    featured: true,
    trending: false,
    bestSeller: false,
    newArrival: true,
    sale: false,
    isActive: true,
    collectionName: "Summer Collection",
    season: "Summer",
    fabric: "Premium Cotton",
    occasion: "Casual Wear",
    sleeveLength: "Sleeveless",
    neck: "Round Neck",
    pattern: "Geometric Printed",
    washCare: "Machine wash cold",
    fit: "A-Line Flared",
    length: "Knee Length"
  },
  {
    name: "Classic Ivory Anarkali Festive Gown",
    description: "A breathtaking flared festive Anarkali suit set featuring heavy block printed border, custom round neck style, and flowy silhouette ideal for summer weddings or festive gatherings.",
    category: "Kurtis",
    subcategory: "Anarkali Kurtis",
    brand: "Sanskriti",
    gender: "Women",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Gold"],
    price: 2999.00,
    discount: 20,
    images: [
      { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop" }
    ],
    stock: 15,
    rating: 4.9,
    featured: true,
    trending: true,
    bestSeller: true,
    newArrival: false,
    sale: true,
    isActive: true,
    collectionName: "Festive Collection",
    season: "All",
    fabric: "Georgette Silk Blend",
    occasion: "Festive Wear",
    sleeveLength: "Full Sleeves",
    neck: "Deep Round Neck",
    pattern: "Floral Zari Border",
    washCare: "Dry clean only",
    fit: "Anarkali Flared",
    length: "Ankle Length"
  },
  {
    name: "Summer Pastel Mint Co-ord Set",
    description: "Luxurious linen-cotton fusion matching tunic and trousers set. Styled with structured side cuts, comfortable straight sleeves, and soft functional pocket details.",
    category: "Co-ord Sets",
    subcategory: "Co-ord Sets",
    brand: "Rivaaz",
    gender: "Women",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Green", "White"],
    price: 2199.00,
    discount: 15,
    images: [
      { url: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&auto=format&fit=crop" }
    ],
    stock: 22,
    rating: 4.7,
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: true,
    sale: false,
    isActive: true,
    collectionName: "Summer Collection",
    season: "Summer",
    fabric: "Linen Cotton Blend",
    occasion: "Casual Wear",
    sleeveLength: "3/4 Sleeves",
    neck: "V-Neck Collar",
    pattern: "Solid Pastels",
    washCare: "Gentle cold cycle hand wash",
    fit: "Relaxed Fit",
    length: "Tunic Style"
  },
  {
    name: "Premium Organza Embroidered Dupatta",
    description: "An elegant, lightweight soft sky-blue organza dupatta scarf featuring detailed floral embroidery and scalloped border trims.",
    category: "Dupattas",
    subcategory: "Dupatta",
    brand: "Aura Handlooms",
    gender: "Women",
    sizes: ["Unisex"],
    colors: ["Blue", "Gold"],
    price: 799.00,
    discount: 5,
    images: [
      { url: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop" }
    ],
    stock: 50,
    rating: 4.5,
    featured: false,
    trending: false,
    bestSeller: true,
    newArrival: false,
    sale: false,
    isActive: true,
    collectionName: "Festive Collection",
    season: "All",
    fabric: "Organza Silk",
    occasion: "Festive Wear",
    sleeveLength: "No Sleeves",
    neck: "No Collar",
    pattern: "Embroidered Floral",
    washCare: "Dry clean suggested",
    fit: "Free Flowing Scarf",
    length: "2.5 Meters"
  },
  {
    name: "Comfort Straight Palazzo Pants",
    description: "Super soft, stretchable bottom wear trousers crafted with lightweight premium rayon cotton. Elasticated waistband with adjustable drawstring.",
    category: "Bottom Wear",
    subcategory: "Bottom Wear",
    brand: "Label Celina",
    gender: "Women",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Beige"],
    price: 899.00,
    discount: 10,
    images: [
      { url: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop" }
    ],
    stock: 40,
    rating: 4.7,
    featured: false,
    trending: true,
    bestSeller: false,
    newArrival: false,
    sale: false,
    isActive: true,
    collectionName: "Office Wear Collection",
    season: "All",
    fabric: "Rayon Cotton",
    occasion: "Casual Wear",
    sleeveLength: "No Sleeves",
    neck: "No Neck",
    pattern: "Solid Cream",
    washCare: "Wash inside out",
    fit: "Wide Leg Flared",
    length: "Ankle Length"
  }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/celenia');
    console.log(`MongoDB Connected for ethnic store seeding: ${conn.connection.host}`);

    // Clear prior records
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Banner.deleteMany({});
    await Settings.deleteMany({});
    await Page.deleteMany({});
    await Coupon.deleteMany({});

    // Seed Categories
    await Category.create([
      { name: 'Kurtis', description: 'Cotton, Printed, Straight, and flared Anarkali silhouettes.', image: { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop' }, order: 1, isActive: true },
      { name: 'Co-ord Sets', description: 'Modern fusion coordination wear, matching tunics & bottoms.', image: { url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&auto=format&fit=crop' }, order: 2, isActive: true },
      { name: 'Bottom Wear', description: 'Palazzos, trousers, pants, salwar, and ethnic skirts.', image: { url: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop' }, order: 3, isActive: true },
      { name: 'Dupattas', description: 'Beautiful printed, embroidered, silk, and organza dupatta scarves.', image: { url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&auto=format&fit=crop' }, order: 4, isActive: true }
    ]);
    console.log('Seeded Category entities.');

    // Seed Brands
    await Brand.create([
      { name: 'Label Celina', description: 'Premium signature ethnic line by Celina.' },
      { name: 'Zara Ethnic', description: 'Fusion print styling.' },
      { name: 'Sanskriti', description: 'Traditional festive classics.' },
      { name: 'Rivaaz', description: 'Crafted wedding premium wear.' },
      { name: 'Aura Handlooms', description: 'Natural hand-woven details.' }
    ]);
    console.log('Seeded Brand partners.');

    // Seed Banners
    await Banner.create([
      {
        title: "The Sky Blue Collection",
        subtitle: "Minimal, elegant, luxurious ethnic fashion curated with soft pastel shades and lightweight pure cotton prints.",
        buttonText: "Explore Now",
        image: { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop" },
        link: "/shop",
        isActive: true
      },
      {
        title: "Modern Ethnic Co-ord Sets",
        subtitle: "Redefining everyday comfort with matching tunic & trouser coordinate collections designed for modern women.",
        buttonText: "Shop Co-ords",
        image: { url: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=1600&auto=format&fit=crop" },
        link: "/shop?category=Co-ord Sets",
        isActive: true
      }
    ]);
    console.log('Seeded Hero Banners.');

    // Seed Products
    await Product.create(productsData);
    console.log('Seeded Product list.');

    // Seed Settings (with sky blue color tokens)
    await Settings.create({
      key: 'global',
      websiteTitle: 'Celina Ethnic',
      companyName: 'Celina Ethnic Fashion Pvt Ltd',
      metaDescription: 'A premium women\'s ethnic fashion store inspired by luxurious traditional details and modern comfort styling.',
      themeColorMain: '#38BDF8', // Sky Blue
      themeColorBurgundy: '#0369A1', // Dark Blue
      themeColorBg: '#FFFFFF',
      fontStyle: 'Poppins',
      contactEmail: 'support@celinaethnic.com',
      contactPhone: '+91 99999 99999',
      businessAddress: 'Celina Ethnic HQ, Inner Ring Road, Bangalore, India',
      codAvailable: true,
      prepaidAvailable: true,
      deliveryCharge: 99,
      shippingCharges: 99,
      freeShippingLimit: 1499,
      homepageLayout: ['Hero', 'Arrivals', 'Trending', 'BestSellers', 'Categories', 'Occasions', 'Instagram', 'Story', 'Footer'],
      navigationMenu: [
        { title: 'Home', path: '/', order: 1, isActive: true },
        { title: 'Shop All', path: '/shop', order: 2, isActive: true },
        { title: 'Kurtis', path: '/shop?category=Kurtis', order: 3, isActive: true },
        { title: 'Co-ord Sets', path: '/shop?category=Co-ord Sets', order: 4, isActive: true },
        { title: 'Bottom Wear', path: '/shop?category=Bottom Wear', order: 5, isActive: true },
        { title: 'Dupattas', path: '/shop?category=Dupattas', order: 6, isActive: true }
      ],
      availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      availableColors: ['Blue', 'White', 'Ivory', 'Gold', 'Green', 'Beige'],
      availableCollections: ['Cotton Collection', 'Office Wear Collection', 'Festive Collection', 'Summer Collection'],
      homepagePromoBanners: [
        { title: 'Cotton Collection', subtitle: 'Breathable pure cotton prints.', image: { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop' }, link: '/shop?collection=Cotton Collection' },
        { title: 'Office Wear Collection', subtitle: 'Refined structural silhouettes.', image: { url: 'https://images.unsplash.com/photo-1608748010899-18f300247112?w=800&auto=format&fit=crop' }, link: '/shop?collection=Office Wear Collection' },
        { title: 'Festive Collection', subtitle: 'Celebrate in royal traditional suits.', image: { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop' }, link: '/shop?collection=Festive Collection' }
      ]
    });
    console.log('Seeded default Settings configuration.');

    // Seed dynamic Pages
    await Page.create([
      {
        slug: 'about',
        title: 'Brand Story',
        content: `<div>
          <h2 class="text-xl font-bold font-Poppins mb-4">Our Heritage & Craft</h2>
          <p class="text-sm text-gray-600 leading-relaxed mb-3">Celina Ethnic was founded on the principles of celebrating traditional Indian silhouettes with a modern minimalist twist. Inspired by clean cuts, fine hand block prints, and natural textiles, we craft premium garments that make everyday dressing look elegant and feel comfortable.</p>
          <p class="text-sm text-gray-600 leading-relaxed">Each kurti, co-ord set, and dupatta represents our artisans' dedication to natural fabrics, breathing ease and premium luxury into modern ethnic fashion.</p>
        </div>`
      },
      {
        slug: 'faqs',
        title: 'Frequently Asked Questions',
        content: `<div>
          <h3 class="font-bold text-sm">1. What fabrics do you use?</h3>
          <p class="text-xs text-gray-500 mt-1">We utilize 100% pure premium cotton, linen-cotton blends, georgette, and handcrafted fabrics sourced directly from weavers.</p>
          <h3 class="font-bold text-sm mt-4">2. Do you ship across India?</h3>
          <p class="text-xs text-gray-500 mt-1">Yes, we ship nationwide across India with free delivery on all orders above ₹1499.</p>
        </div>`
      },
      {
        slug: 'privacy',
        title: 'Privacy Policy',
        content: `<div>
          <p class="text-sm text-gray-600">At Celina Ethnic, we value client data safety. All transactional credentials are encrypted, and we process your contact data strictly for tracking order delivery.</p>
        </div>`
      },
      {
        slug: 'terms',
        title: 'Terms of Use',
        content: `<div>
          <p class="text-sm text-gray-600">By visiting Celina Ethnic Store, you agree to our fair usage policies, non-reproduction of our premium catalog styles, and standard shipping SLA timelines.</p>
        </div>`
      },
      {
        slug: 'contact',
        title: 'Contact Customer Support',
        content: `<div>
          <p class="text-sm text-gray-600">Have questions about sizes, customization, or delivery? Reach out to support at <strong>support@celinaethnic.com</strong> or call us at <strong>+91 99999 99999</strong>.</p>
        </div>`
      }
    ]);
    console.log('Seeded text Pages.');

    // Seed Coupons
    await Coupon.create([
      { code: 'FLAT10', discountType: 'Percentage', discountValue: 10, minPurchaseAmount: 500, expiryDate: new Date('2028-12-31') },
      { code: 'FREESHIP', discountType: 'FreeShipping', discountValue: 0, minPurchaseAmount: 100, expiryDate: new Date('2028-12-31') },
      { code: 'WELCOME500', discountType: 'Fixed', discountValue: 500, minPurchaseAmount: 2000, expiryDate: new Date('2028-12-31') }
    ]);
    console.log('Seeded database Coupons.');

    console.log('Seeding successfully completed!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeding encountered error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
