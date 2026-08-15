import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import Brand from '../models/Brand.js';
import Banner from '../models/Banner.js';

dotenv.config();

const migrate = async () => {
  const localUri = 'mongodb://127.0.0.1:27017/evara_mern';
  const atlasUri = process.env.MONGO_URI;

  if (!atlasUri || atlasUri.includes('127.0.0.1') || atlasUri.includes('localhost')) {
    console.error('Error: Please update the MONGO_URI in your backend/.env file to your MongoDB Atlas connection string before running the migration.');
    process.exit(1);
  }

  try {
    console.log('Connecting to local MongoDB...');
    const localConn = await mongoose.createConnection(localUri).asPromise();
    console.log('Connected to local MongoDB.');

    console.log('Connecting to MongoDB Atlas...');
    const atlasConn = await mongoose.createConnection(atlasUri).asPromise();
    console.log('Connected to MongoDB Atlas.');

    // Instantiate models on connection instances
    const localUser = localConn.model('User', User.schema);
    const localProduct = localConn.model('Product', Product.schema);
    const localOrder = localConn.model('Order', Order.schema);
    const localReview = localConn.model('Review', Review.schema);
    const localCategory = localConn.model('Category', Category.schema);
    const localBrand = localConn.model('Brand', Brand.schema);
    const localBanner = localConn.model('Banner', Banner.schema);

    const atlasUser = atlasConn.model('User', User.schema);
    const atlasProduct = atlasConn.model('Product', Product.schema);
    const atlasOrder = atlasConn.model('Order', Order.schema);
    const atlasReview = atlasConn.model('Review', Review.schema);
    const atlasCategory = atlasConn.model('Category', Category.schema);
    const atlasBrand = atlasConn.model('Brand', Brand.schema);
    const atlasBanner = atlasConn.model('Banner', Banner.schema);

    const collections = [
      { name: 'Category', local: localCategory, atlas: atlasCategory },
      { name: 'Brand', local: localBrand, atlas: atlasBrand },
      { name: 'Banner', local: localBanner, atlas: atlasBanner },
      { name: 'User', local: localUser, atlas: atlasUser },
      { name: 'Product', local: localProduct, atlas: atlasProduct },
      { name: 'Review', local: localReview, atlas: atlasReview },
      { name: 'Order', local: localOrder, atlas: atlasOrder }
    ];

    for (const col of collections) {
      console.log(`Migrating collection: ${col.name}...`);
      const docs = await col.local.find({});
      console.log(`Found ${docs.length} documents in local ${col.name}.`);

      if (docs.length > 0) {
        // Clear Atlas collection first
        await col.atlas.deleteMany({});
        // Insert docs
        await col.atlas.insertMany(docs);
        console.log(`Successfully migrated ${docs.length} documents to Atlas.`);
      } else {
        console.log(`Skipped ${col.name} (no local documents found).`);
      }
    }

    console.log('Data migration to MongoDB Atlas completed successfully!');
    await localConn.close();
    await atlasConn.close();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed with error:', err.message);
    process.exit(1);
  }
};

migrate();
