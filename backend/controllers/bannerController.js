import Banner from '../models/Banner.js';

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, buttonText, image, link, isActive } = req.body;

    const banner = new Banner({
      title,
      subtitle,
      buttonText: buttonText || 'Shop Now',
      image,
      link: link || '/shop',
      isActive: isActive !== undefined ? isActive : true
    });

    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res, next) => {
  try {
    const { title, subtitle, buttonText, image, link, isActive } = req.body;
    const banner = await Banner.findById(req.params.id);

    if (banner) {
      banner.title = title || banner.title;
      banner.subtitle = subtitle || banner.subtitle;
      banner.buttonText = buttonText || banner.buttonText;
      banner.image = image || banner.image;
      banner.link = link || banner.link;
      banner.isActive = isActive !== undefined ? isActive : banner.isActive;

      const updatedBanner = await banner.save();
      res.json(updatedBanner);
    } else {
      res.status(404);
      return next(new Error('Banner not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await Banner.findByIdAndDelete(req.params.id);
      res.json({ message: 'Banner removed' });
    } else {
      res.status(404);
      return next(new Error('Banner not found'));
    }
  } catch (error) {
    next(error);
  }
};
