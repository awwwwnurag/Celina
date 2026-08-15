import Brand from '../models/Brand.js';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({}).sort({ name: 1 });
    res.json(brands);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a brand
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const brandExists = await Brand.findOne({ name });
    if (brandExists) {
      res.status(400);
      return next(new Error('Brand already exists'));
    }

    const brand = new Brand({ name, description });
    const createdBrand = await brand.save();
    res.status(201).json(createdBrand);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrand = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const brand = await Brand.findById(req.params.id);

    if (brand) {
      brand.name = name || brand.name;
      brand.description = description !== undefined ? description : brand.description;
      const updatedBrand = await brand.save();
      res.json(updatedBrand);
    } else {
      res.status(404);
      return next(new Error('Brand not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (brand) {
      await Brand.findByIdAndDelete(req.params.id);
      res.json({ message: 'Brand removed' });
    } else {
      res.status(404);
      return next(new Error('Brand not found'));
    }
  } catch (error) {
    next(error);
  }
};
