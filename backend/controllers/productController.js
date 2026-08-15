import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Fetch all products with filtering, sorting & search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      gender,
      sizes,
      colors,
      minPrice,
      maxPrice,
      featured,
      collectionName,
      season,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    let queryObj = {};

    // Search query
    if (search) {
      queryObj.name = { $regex: search, $options: 'i' };
    }

    // Filters
    if (category) {
      const categoryList = category.split(',');
      queryObj.category = { $in: categoryList.map(c => new RegExp(`^${c.trim()}$`, 'i')) };
    }
    if (brand) {
      const brandList = brand.split(',');
      queryObj.brand = { $in: brandList.map(b => new RegExp(`^${b.trim()}$`, 'i')) };
    }
    if (gender) {
      const genderList = gender.split(',');
      queryObj.gender = { $in: genderList };
    }
    if (featured) queryObj.featured = featured === 'true';
    if (req.query.trending) queryObj.trending = req.query.trending === 'true';
    if (req.query.bestSeller) queryObj.bestSeller = req.query.bestSeller === 'true';
    if (req.query.newArrival) queryObj.newArrival = req.query.newArrival === 'true';
    if (req.query.sale) queryObj.sale = req.query.sale === 'true';
    
    // Hide inactive products unless requested by admin
    if (req.query.isAdminQuery !== 'true') {
      queryObj.isActive = true;
    }
    
    if (collectionName) queryObj.collectionName = collectionName;
    if (season) queryObj.season = season;

    // Price Range Filter
    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = Number(minPrice);
      if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // Size Filter (sizes can be comma-separated or single)
    if (sizes) {
      const sizeList = sizes.split(',');
      queryObj.sizes = { $in: sizeList };
    }

    // Color Filter (case-insensitive substring match)
    if (colors) {
      const colorList = colors.split(',');
      queryObj.colors = { $in: colorList.map(c => new RegExp(c.trim(), 'i')) };
    }

    // Extra filters requested by user
    if (req.query.minDiscount) {
      queryObj.discount = { $gte: Number(req.query.minDiscount) };
    }
    if (req.query.material) {
      const materialList = req.query.material.split(',');
      queryObj.material = { $in: materialList.map(m => new RegExp(`^${m.trim()}$`, 'i')) };
    }
    if (req.query.fabric) {
      const fabricList = req.query.fabric.split(',');
      queryObj.fabric = { $in: fabricList.map(f => new RegExp(`^${f.trim()}$`, 'i')) };
    }
    if (req.query.neck) {
      const neckList = req.query.neck.split(',');
      queryObj.neck = { $in: neckList.map(n => new RegExp(`^${n.trim()}$`, 'i')) };
    }
    if (req.query.sleeveLength) {
      const sleeveList = req.query.sleeveLength.split(',');
      queryObj.sleeveLength = { $in: sleeveList.map(s => new RegExp(`^${s.trim()}$`, 'i')) };
    }
    if (req.query.inStock === 'true') {
      queryObj.stock = { $gt: 0 };
    }
    if (req.query.packSize) {
      const packList = req.query.packSize.split(',');
      queryObj.packSize = { $in: packList };
    }
    if (req.query.occasion) {
      const occasionList = req.query.occasion.split(',');
      queryObj.occasion = { $in: occasionList.map(o => new RegExp(`^${o.trim()}$`, 'i')) };
    }
    if (req.query.pattern) {
      const patternList = req.query.pattern.split(',');
      queryObj.pattern = { $in: patternList.map(p => new RegExp(`^${p.trim()}$`, 'i')) };
    }
    if (req.query.closure) {
      const closureList = req.query.closure.split(',');
      queryObj.closure = { $in: closureList.map(c => new RegExp(`^${c.trim()}$`, 'i')) };
    }
    if (req.query.age) {
      const ageList = req.query.age.split(',');
      queryObj.age = { $in: ageList };
    }
    if (req.query.curations) {
      const curationList = req.query.curations.split(',');
      curationList.forEach(cur => {
        if (cur.toLowerCase() === 'trending') queryObj.trending = true;
        if (cur.toLowerCase() === 'bestseller') queryObj.bestSeller = true;
        if (cur.toLowerCase() === 'newarrival') queryObj.newArrival = true;
        if (cur.toLowerCase() === 'sale') queryObj.sale = true;
      });
    }

    // Sorting
    let sortObj = {};
    if (sort === 'price-asc') {
      sortObj.price = 1;
    } else if (sort === 'price-desc') {
      sortObj.price = -1;
    } else if (sort === 'popular') {
      sortObj.rating = -1;
    } else {
      // Default: Newest
      sortObj.createdAt = -1;
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(queryObj)
      .sort(sortObj)
      .limit(Number(limit))
      .skip(skip);

    const count = await Product.countDocuments(queryObj);

    res.json({
      products,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // Get associated reviews
      const reviews = await Review.find({ product: product._id }).populate('user', 'name');
      res.json({ product, reviews });
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      brand,
      gender,
      sizes,
      colors,
      price,
      discount,
      images,
      stock,
      featured,
      trending,
      bestSeller,
      newArrival,
      sale,
      isActive,
      collectionName,
      season,
      codAvailable,
      returnAvailable,
      freeDelivery,
      careInstructions,
      packContains,
      manufacturerDetails,
      countryOfOrigin,
      colorImages,
      fabric,
      fashionTrends,
      fit,
      length,
      multipackSet,
      neck,
      occasion,
      pattern,
      printPatternType,
      sleeveLength,
      sleeveStyling,
      washCare,
      sku,
      barcode,
      lowStockThreshold
    } = req.body;

    let finalSku = sku || '';
    if (!finalSku) {
      let attempts = 0;
      do {
        finalSku = generateSKU(category, brand);
        attempts++;
      } while (attempts < 10 && await Product.findOne({ sku: finalSku }));
    }

    const product = new Product({
      name,
      description,
      category,
      subcategory: subcategory || '',
      brand,
      gender,
      sizes: sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors,
      price,
      discount,
      images: images || [],
      stock,
      featured: featured === true,
      trending: trending === true,
      bestSeller: bestSeller === true,
      newArrival: newArrival === true,
      sale: sale === true,
      isActive: isActive !== undefined ? isActive : true,
      collectionName: collectionName || 'Regular',
      season: season || 'All',
      codAvailable: codAvailable !== undefined ? codAvailable : true,
      returnAvailable: returnAvailable !== undefined ? returnAvailable : true,
      freeDelivery: freeDelivery !== undefined ? freeDelivery : true,
      careInstructions: careInstructions || 'Dry clean or gentle hand wash',
      packContains: packContains || '1 Product',
      manufacturerDetails: manufacturerDetails || 'Celina Clothing Pvt Ltd',
      countryOfOrigin: countryOfOrigin || 'India',
      colorImages: colorImages || [],
      fabric: fabric || '',
      fashionTrends: fashionTrends || '',
      fit: fit || '',
      length: length || '',
      multipackSet: multipackSet || '',
      neck: neck || '',
      occasion: occasion || '',
      pattern: pattern || '',
      printPatternType: printPatternType || '',
      sleeveLength: sleeveLength || '',
      sleeveStyling: sleeveStyling || '',
      washCare: washCare || '',
      sku: finalSku,
      barcode: barcode || finalSku,
      lowStockThreshold: lowStockThreshold !== undefined ? Number(lowStockThreshold) : 5
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      subcategory,
      brand,
      gender,
      sizes,
      colors,
      price,
      discount,
      images,
      stock,
      featured,
      trending,
      bestSeller,
      newArrival,
      sale,
      isActive,
      collectionName,
      season,
      codAvailable,
      returnAvailable,
      freeDelivery,
      careInstructions,
      packContains,
      manufacturerDetails,
      countryOfOrigin,
      colorImages,
      fabric,
      fashionTrends,
      fit,
      length,
      multipackSet,
      neck,
      occasion,
      pattern,
      printPatternType,
      sleeveLength,
      sleeveStyling,
      washCare,
      sku,
      barcode,
      lowStockThreshold
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.subcategory = subcategory !== undefined ? subcategory : product.subcategory;
      product.brand = brand || product.brand;
      product.gender = gender || product.gender;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.price = price !== undefined ? price : product.price;
      product.discount = discount !== undefined ? discount : product.discount;
      product.images = images || product.images;
      product.stock = stock !== undefined ? stock : product.stock;
      product.featured = featured !== undefined ? featured : product.featured;
      product.trending = trending !== undefined ? trending : product.trending;
      product.bestSeller = bestSeller !== undefined ? bestSeller : product.bestSeller;
      product.newArrival = newArrival !== undefined ? newArrival : product.newArrival;
      product.sale = sale !== undefined ? sale : product.sale;
      product.isActive = isActive !== undefined ? isActive : product.isActive;
      product.collectionName = collectionName || product.collectionName;
      product.season = season || product.season;
      product.codAvailable = codAvailable !== undefined ? codAvailable : product.codAvailable;
      product.returnAvailable = returnAvailable !== undefined ? returnAvailable : product.returnAvailable;
      product.freeDelivery = freeDelivery !== undefined ? freeDelivery : product.freeDelivery;
      product.careInstructions = careInstructions !== undefined ? careInstructions : product.careInstructions;
      product.packContains = packContains !== undefined ? packContains : product.packContains;
      product.manufacturerDetails = manufacturerDetails !== undefined ? manufacturerDetails : product.manufacturerDetails;
      product.countryOfOrigin = countryOfOrigin !== undefined ? countryOfOrigin : product.countryOfOrigin;
      product.colorImages = colorImages || product.colorImages;
      product.fabric = fabric !== undefined ? fabric : product.fabric;
      product.fashionTrends = fashionTrends !== undefined ? fashionTrends : product.fashionTrends;
      product.fit = fit !== undefined ? fit : product.fit;
      product.length = length !== undefined ? length : product.length;
      product.multipackSet = multipackSet !== undefined ? multipackSet : product.multipackSet;
      product.neck = neck !== undefined ? neck : product.neck;
      product.occasion = occasion !== undefined ? occasion : product.occasion;
      product.pattern = pattern !== undefined ? pattern : product.pattern;
      product.printPatternType = printPatternType !== undefined ? printPatternType : product.printPatternType;
      product.sleeveLength = sleeveLength !== undefined ? sleeveLength : product.sleeveLength;
      product.sleeveStyling = sleeveStyling !== undefined ? sleeveStyling : product.sleeveStyling;
      product.washCare = washCare !== undefined ? washCare : product.washCare;
      product.sku = sku !== undefined ? sku : product.sku;
      product.barcode = barcode !== undefined ? barcode : product.barcode;
      product.lowStockThreshold = lowStockThreshold !== undefined ? Number(lowStockThreshold) : product.lowStockThreshold;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove all reviews associated with the product
      await Review.deleteMany({ product: product._id });
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  const { rating, comment } = req.body;

  if (!rating || Number(rating) < 1 || Number(rating) > 5) {
    res.status(400);
    return next(new Error('Star rating is mandatory and must be between 1 and 5'));
  }

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = await Review.findOne({
        product: product._id,
        user: req.user._id
      });

      if (alreadyReviewed) {
        res.status(400);
        return next(new Error('Product already reviewed'));
      }

      // Upload review images to Cloudinary if any
      let images = [];
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'reviews'));
        images = await Promise.all(uploadPromises);
      }

      const review = await Review.create({
        name: req.user.name,
        rating: Number(rating),
        comment: comment || '',
        images,
        user: req.user._id,
        product: product._id
      });

      // Recalculate average rating
      const reviews = await Review.find({ product: product._id });
      product.rating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added', review });
    } else {
      res.status(404);
      return next(new Error('Product not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate a product
// @route   POST /api/products/:id/duplicate
// @access  Private/Admin
const duplicateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const duplicatedData = product.toObject();
      delete duplicatedData._id;
      delete duplicatedData.createdAt;
      delete duplicatedData.updatedAt;
      duplicatedData.name = `${duplicatedData.name} (Copy)`;
      
      const newProduct = new Product(duplicatedData);
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } else {
      res.status(404);
      return next(new Error('Product not found to duplicate'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete products
// @route   POST /api/products/bulk-delete
// @access  Private/Admin
const bulkDeleteProducts = async (req, res, next) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    res.status(400);
    return next(new Error('Array of product IDs is required'));
  }
  try {
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Products deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update products
// @route   POST /api/products/bulk-update
// @access  Private/Admin
const bulkUpdateProducts = async (req, res, next) => {
  const { ids, update } = req.body;
  if (!ids || !Array.isArray(ids) || !update) {
    res.status(400);
    return next(new Error('Array of product IDs and update fields are required'));
  }
  try {
    await Product.updateMany({ _id: { $in: ids } }, { $set: update });
    res.json({ message: 'Products updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Import products list
// @route   POST /api/products/import
// @access  Private/Admin
const importProducts = async (req, res, next) => {
  const { products } = req.body;
  if (!products || !Array.isArray(products)) {
    res.status(400);
    return next(new Error('Array of products is required'));
  }
  try {
    // Sanitize and insert
    const preparedProducts = [];
    for (const p of products) {
      let finalSku = p.sku || '';
      if (!finalSku) {
        let attempts = 0;
        do {
          finalSku = generateSKU(p.category || 'GEN', p.brand || 'BRD');
          attempts++;
        } while (attempts < 10 && await Product.findOne({ sku: finalSku }));
      }

      // Ensure default values or type castings
      preparedProducts.push({
        ...p,
        sku: finalSku,
        barcode: p.barcode || finalSku,
        lowStockThreshold: Number(p.lowStockThreshold) || 5,
        price: Number(p.price) || 0,
        stock: Number(p.stock) || 0,
        discount: Number(p.discount) || 0,
        images: Array.isArray(p.images) ? p.images : [],
        sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L'],
        colors: Array.isArray(p.colors) ? p.colors : ['Black']
      });
    }

    const inserted = await Product.insertMany(preparedProducts);
    res.status(201).json({ message: `Successfully imported ${inserted.length} products.`, count: inserted.length });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// SKU Generator utility
// Format: {CAT3}-{BRAND3}-{RANDOMHEX5}
// ─────────────────────────────────────────────
const generateSKU = (category = 'GEN', brand = 'BRD') => {
  const catPart = category.replace(/[^A-Z0-9]/gi, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
  const brandPart = brand.replace(/[^A-Z0-9]/gi, '').substring(0, 3).toUpperCase().padEnd(3, 'X');
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${catPart}-${brandPart}-${randomPart}`;
};

// ─────────────────────────────────────────────
// @desc    Export all products as JSON (frontend converts to CSV)
// @route   GET /api/products/export
// @access  Private/Admin
// ─────────────────────────────────────────────
const exportProducts = async (req, res, next) => {
  try {
    const { category, brand } = req.query;
    const query = {};
    if (category) query.category = { $regex: category, $options: 'i' };
    if (brand) query.brand = { $regex: brand, $options: 'i' };

    const products = await Product.find(query).lean();

    const exportData = products.map(p => ({
      id: p._id,
      name: p.name,
      sku: p.sku || '',
      barcode: p.barcode || '',
      category: p.category,
      subcategory: p.subcategory || '',
      brand: p.brand,
      price: p.price,
      discount: p.discount,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold || 5,
      fabric: p.fabric || '',
      occasion: p.occasion || '',
      pattern: p.pattern || '',
      sleeveLength: p.sleeveLength || '',
      sizes: Array.isArray(p.sizes) ? p.sizes.join('|') : '',
      colors: Array.isArray(p.colors) ? p.colors.join('|') : '',
      isActive: p.isActive,
      featured: p.featured,
      bestSeller: p.bestSeller,
      newArrival: p.newArrival,
      sale: p.sale,
      description: p.description,
      careInstructions: p.careInstructions || '',
      season: p.season || 'All',
      collectionName: p.collectionName || '',
      createdAt: p.createdAt
    }));

    res.json(exportData);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get full inventory report
// @route   GET /api/products/inventory
// @access  Private/Admin
// ─────────────────────────────────────────────
const getInventoryReport = async (req, res, next) => {
  try {
    const products = await Product.find({}).lean();

    const totalProducts = products.length;
    const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalStockValue = products.reduce((sum, p) => sum + ((p.stock || 0) * (p.price || 0)), 0);

    const outOfStock = products.filter(p => p.stock === 0);
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5));
    const inStock = products.filter(p => p.stock > (p.lowStockThreshold || 5));

    // Category breakdown
    const categoryBreakdown = {};
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { category: cat, count: 0, totalStock: 0, totalValue: 0 };
      }
      categoryBreakdown[cat].count += 1;
      categoryBreakdown[cat].totalStock += p.stock || 0;
      categoryBreakdown[cat].totalValue += (p.stock || 0) * (p.price || 0);
    });

    // Products with missing SKUs
    const missingSkuProducts = products.filter(p => !p.sku || p.sku === '').map(p => ({
      _id: p._id,
      name: p.name,
      category: p.category,
      brand: p.brand
    }));

    res.json({
      summary: {
        totalProducts,
        totalStockUnits,
        totalStockValue: Math.round(totalStockValue),
        inStockCount: inStock.length,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length,
        missingSkuCount: missingSkuProducts.length
      },
      outOfStock: outOfStock.map(p => ({
        _id: p._id,
        name: p.name,
        sku: p.sku || '',
        category: p.category,
        brand: p.brand,
        price: p.price,
        lowStockThreshold: p.lowStockThreshold || 5,
        isActive: p.isActive,
        image: p.images?.[0]?.url || ''
      })),
      lowStock: lowStock.map(p => ({
        _id: p._id,
        name: p.name,
        sku: p.sku || '',
        category: p.category,
        brand: p.brand,
        stock: p.stock,
        lowStockThreshold: p.lowStockThreshold || 5,
        price: p.price,
        isActive: p.isActive,
        image: p.images?.[0]?.url || ''
      })),
      categoryBreakdown: Object.values(categoryBreakdown).sort((a, b) => b.totalValue - a.totalValue),
      missingSkuProducts
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Auto-generate SKUs for products missing one
// @route   POST /api/products/generate-skus
// @access  Private/Admin
// ─────────────────────────────────────────────
const generateMissingSkus = async (req, res, next) => {
  try {
    const products = await Product.find({ $or: [{ sku: '' }, { sku: { $exists: false } }] });
    let updated = 0;

    for (const product of products) {
      let sku;
      let attempts = 0;
      // Ensure uniqueness
      do {
        sku = generateSKU(product.category, product.brand);
        attempts++;
      } while (attempts < 10 && await Product.findOne({ sku }));

      product.sku = sku;
      if (!product.barcode) {
        product.barcode = sku; // Use SKU as default barcode
      }
      await product.save();
      updated++;
    }

    res.json({ message: `Generated SKUs for ${updated} products`, updated });
  } catch (error) {
    next(error);
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  duplicateProduct,
  bulkDeleteProducts,
  bulkUpdateProducts,
  importProducts,
  exportProducts,
  getInventoryReport,
  generateMissingSkus,
  generateSKU
};
