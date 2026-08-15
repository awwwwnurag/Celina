import Settings from '../models/Settings.js';

// @desc    Get website global settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: 'global' });
    if (!settings) {
      // Create default settings document
      settings = new Settings({ key: 'global' });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update website global settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: 'global' });
    if (!settings) {
      settings = new Settings({ key: 'global' });
    }

    // Merge req.body into settings
    const fieldsToUpdate = [
      'websiteTitle', 'metaDescription', 'seoKeywords', 'contactEmail',
      'contactPhone', 'businessAddress', 'googleMapsLink',
      'socialFacebook', 'socialInstagram', 'socialWhatsapp',
      'socialYoutube', 'socialTwitter', 'socialLinkedin',
      'companyName', 'themeColorMain', 'themeColorBurgundy', 'themeColorBg', 'fontStyle',
      'websiteWidth', 'borderRadius', 'buttonStyle', 'cardStyle',
      'homepageLayout', 'websiteLogo', 'footerLogo', 'favicon', 'paymentIcons',
      'navigationMenu', 'enableRazorpay', 'enableCOD',
      'shippingCharges', 'freeShippingLimit', 'deliveryTime', 'deliveryAreas',
      'homepageHero', 'homepageSponsors', 'homepagePromoBanners', 'homepageNewsletter',
      'announcementText', 'couponPopupCode', 'newsletterPopupTitle', 'exitIntentOffer',
      'referralBanner', 'giftCardMessage',
      'openGraphTitle', 'openGraphImage', 'twitterCard', 'canonicalUrl',
      'sitemapUrl', 'robotsTxt', 'schemaOrg', 'emailTemplates',
      'paymentSettings', 'shippingRules', 'reportNotes',
      'testimonials', 'availableSizes', 'availableColors', 'availableCollections',
      'availableSeasons', 'availableSubcategories'
    ];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    next(error);
  }
};
