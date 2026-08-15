import mongoose from 'mongoose';
import dotenv from 'dotenv';
import './models/User.js';
import './models/Product.js';
import './models/Order.js';
import './models/Category.js';
import './models/Brand.js';
import './models/Banner.js';
import './models/Settings.js';
import './models/Page.js';
import './models/Coupon.js';
import './models/Review.js';

import { getSalesAnalytics } from './controllers/orderController.js';
import { getInventoryReport } from './controllers/productController.js';
import { getStoreCreditStats } from './controllers/returnController.js';

dotenv.config();

const simulateReqRes = async (fn) => {
  const req = {
    query: {},
    params: {},
    body: {}
  };
  const res = {
    status: (code) => {
      console.log('  Response status:', code);
      return res;
    },
    json: (data) => {
      console.log('  Response JSON: Success!');
      return res;
    }
  };
  const next = (err) => {
    if (err) console.error('  Next encountered Error:', err);
  };
  
  try {
    await fn(req, res, next);
  } catch (err) {
    console.error('  Caught Exception:', err);
  }
};

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('1. Testing getSalesAnalytics...');
  await simulateReqRes(getSalesAnalytics);
  
  console.log('2. Testing getInventoryReport...');
  await simulateReqRes(getInventoryReport);
  
  console.log('3. Testing getStoreCreditStats...');
  await simulateReqRes(getStoreCreditStats);
  
  process.exit(0);
} catch (err) {
  console.error('Connection error:', err);
  process.exit(1);
}
