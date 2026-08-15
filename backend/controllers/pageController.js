import Page from '../models/Page.js';

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public
export const getPages = async (req, res, next) => {
  try {
    const pages = await Page.find({});
    res.json(pages);
  } catch (error) {
    next(error);
  }
};

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public
export const getPageBySlug = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (page) {
      res.json(page);
    } else {
      res.status(404);
      return next(new Error(`Page with slug ${req.params.slug} not found`));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update a page
// @route   POST /api/pages
// @access  Private/Admin
export const createOrUpdatePage = async (req, res, next) => {
  try {
    const { slug, title, content, isActive } = req.body;
    let page = await Page.findOne({ slug });
    
    if (page) {
      page.title = title || page.title;
      page.content = content !== undefined ? content : page.content;
      page.isActive = isActive !== undefined ? isActive : page.isActive;
      const updatedPage = await page.save();
      res.json(updatedPage);
    } else {
      page = new Page({ slug, title, content, isActive });
      const createdPage = await page.save();
      res.status(201).json(createdPage);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a page by slug
// @route   DELETE /api/pages/:slug
// @access  Private/Admin
export const deletePage = async (req, res, next) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (page) {
      await Page.findOneAndDelete({ slug: req.params.slug });
      res.json({ message: 'Page removed' });
    } else {
      res.status(404);
      return next(new Error('Page not found'));
    }
  } catch (error) {
    next(error);
  }
};
