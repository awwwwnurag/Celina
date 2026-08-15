import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LayoutDashboard, ShoppingCart, Users, FolderHeart, Plus, Edit3, Trash2, ShieldCheck, TrendingUp, AlertTriangle, Upload, Image, ListPlus, Settings, Tag, MessageSquare, RefreshCw, Package, BarChart2, Download, FileUp, ArrowLeftRight, Bell, CheckCircle2, XCircle, Clock, Barcode, Zap, Wallet, ChevronDown, ChevronUp, Eye, Palette, SearchCheck, MailCheck, Megaphone, PanelsTopLeft } from 'lucide-react';
import { ReturnsTab, InventoryTab, BulkToolsTab, SkuBarcodesTab, StoreCreditTab } from '../components/AdminBusinessTabs.jsx';
import { AdminMediaLibrary } from '../components/AdminMediaLibrary.jsx';
import { AdminAnalytics } from '../components/AdminAnalytics.jsx';
import { AdminHomepageBuilder } from '../components/AdminHomepageBuilder.jsx';
import { AdminThemeSettings } from '../components/AdminThemeSettings.jsx';
import { AdminSEO } from '../components/AdminSEO.jsx';
import { AdminEmailTemplates } from '../components/AdminEmailTemplates.jsx';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'categories', 'brands', 'banners', 'orders', 'users', 'media', 'analytics', 'homepage-builder', 'theme', 'seo', 'email-templates', 'product-form'

  // Dashboard Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    statusCounts: { Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0 }
  });

  // Data lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Categories dynamic state
  const [categories, setCategories] = useState([]);
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: null, order: 0, isActive: true });
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);

  // Brands dynamic state
  const [brands, setBrands] = useState([]);
  const [isBrandEditing, setIsBrandEditing] = useState(false);
  const [currentBrandId, setCurrentBrandId] = useState(null);
  const [brandForm, setBrandForm] = useState({ name: '', description: '' });

  // Banners dynamic state
  const [banners, setBanners] = useState([]);
  const [isBannerEditing, setIsBannerEditing] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Shop Now',
    image: '',
    link: '/shop',
    isActive: true
  });

  // Dynamic global settings state
  const [globalSettings, setGlobalSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);

  // Dynamic pages states
  const [pagesList, setPagesList] = useState([]);
  const [currentEditingPage, setCurrentEditingPage] = useState(null);
  const [pageForm, setPageForm] = useState({ title: '', content: '', isActive: true });

  // Coupon states
  const [couponsList, setCouponsList] = useState([]);
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'Percentage', discountValue: 0, minPurchaseAmount: 0, expiryDate: '' });
  const [isCouponEditing, setIsCouponEditing] = useState(false);
  const [currentCouponId, setCurrentCouponId] = useState(null);

  // Reviews states
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewReplyText, setReviewReplyText] = useState({});

  // ── Returns & Exchange states ──────────────────────────────
  const [returnRequests, setReturnRequests] = useState([]);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [returnFilter, setReturnFilter] = useState({ status: '', type: '' });
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [returnAdminNote, setReturnAdminNote] = useState('');
  const [returnRefundMethod, setReturnRefundMethod] = useState('None');
  const [returnRefundAmount, setReturnRefundAmount] = useState(0);

  // ── Inventory Report states ─────────────────────────────────
  const [inventoryReport, setInventoryReport] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryFilter, setInventoryFilter] = useState('all'); // 'all' | 'lowStock' | 'outOfStock'

  // ── Alerts Bell states ─────────────────────────────────────
  const [alertData, setAlertData] = useState({ totalAlerts: 0, lowStockCount: 0, outOfStockCount: 0, lowStock: [], outOfStock: [] });
  const [showAlertDropdown, setShowAlertDropdown] = useState(false);

  // ── Bulk Export / Import states ─────────────────────────────
  const [exportLoading, setExportLoading] = useState(false);
  const [csvImportRows, setCsvImportRows] = useState([]);
  const [csvImportLoading, setCsvImportLoading] = useState(false);
  const [csvImportResult, setCsvImportResult] = useState(null);

  // ── SKU Generator states ────────────────────────────────────
  const [skuGenLoading, setSkuGenLoading] = useState(false);
  const [skuGenResult, setSkuGenResult] = useState(null);

  // ── Store Credit stats ──────────────────────────────────────
  const [storeCreditStats, setStoreCreditStats] = useState(null);
  const [storeCreditLoading, setStoreCreditLoading] = useState(false);
  const [manualCreditForm, setManualCreditForm] = useState({ userId: '', amount: '', reason: '' });

  // ── Media Library state ─────────────────────────────────────
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedMediaFolder, setSelectedMediaFolder] = useState('all');

  // ── Homepage Builder state ──────────────────────────────────
  const [homepageSections, setHomepageSections] = useState([]);
  const [draggedSection, setDraggedSection] = useState(null);

  // ── Analytics state ─────────────────────────────────────────
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');


  // Product CRUD Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    gender: 'Women',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    price: 0,
    discount: 0,
    images: [],
    stock: 20,
    featured: false,
    trending: false,
    bestSeller: false,
    newArrival: false,
    sale: false,
    isActive: true,
    collectionName: 'Casual',
    season: 'All',
    codAvailable: true,
    returnAvailable: true,
    freeDelivery: true,
    careInstructions: 'Dry clean or gentle hand wash',
    packContains: '1 Product',
    manufacturerDetails: 'Celina Clothing Pvt Ltd',
    countryOfOrigin: 'India',
    colorImages: [],
    fabric: '',
    fashionTrends: '',
    fit: '',
    length: '',
    multipackSet: '',
    neck: '',
    occasion: '',
    pattern: '',
    printPatternType: '',
    sleeveLength: '',
    sleeveStyling: '',
    washCare: ''
  });

  const subcategoryMap = {
    Apparel: {
      Men: ['Shirts', 'Kurtas', 'T-Shirts', 'Jeans', 'Jackets', 'Suits'],
      Women: ['Kurtas', 'Sarees', 'Suit Sets', 'Lehengas', 'Skirts', 'Tops', 'Dresses', 'Blouses', 'Palazzos', 'Jackets'],
      Kids: ['T-Shirts', 'Shirts', 'Dresses', 'Pants', 'Ethnic wear'],
      Unisex: ['T-Shirts', 'Hoodies', 'Jackets', 'Trousers']
    },
    Footwear: {
      Men: ['Sneakers', 'Formals', 'Sandals', 'Sports Shoes', 'Loafers'],
      Women: ['Sneakers', 'Heels', 'Flats', 'Wedges', 'Sandals', 'Boots'],
      Kids: ['Sneakers', 'School Shoes', 'Sandals', 'Booties'],
      Unisex: ['Sneakers', 'Running Shoes', 'Slides', 'Clogs']
    },
    Accessories: {
      Men: ['Watches', 'Bags & Backpacks', 'Sunglasses', 'Wallets', 'Belts'],
      Women: ['Handbags & Clutches', 'Jewellery', 'Sunglasses', 'Belts', 'Hair Accessories'],
      Kids: ['Backpacks', 'Caps & Hats', 'Watches', 'Hair Clips'],
      Unisex: ['Backpacks', 'Sunglasses', 'Caps', 'Smart Watches', 'Socks']
    }
  };

  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);

  const genders = ['Men', 'Women', 'Kids', 'Unisex'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'All'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter', 'All'];
  const collections = ['Casual', 'Formal', 'Sportswear', 'Streetwear'];

  // Get configuration headers for authenticated admin routes
  const getAuthConfig = () => {
    const userInfo = localStorage.getItem('evara_user_info');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed.token) {
        return {
          headers: {
            Authorization: `Bearer ${parsed.token}`
          }
        };
      }
    }
    return {};
  };

  // Load all data
  const loadDashboardData = async () => {
    const config = getAuthConfig();
    try {
      const statsRes = await axios.get('/api/orders/analytics', config);
      setStats(statsRes.data);

      const productsRes = await axios.get('/api/products?limit=100&isAdminQuery=true', config);
      setProducts(productsRes.data.products || []);

      const ordersRes = await axios.get('/api/orders', config);
      setOrders(ordersRes.data || []);

      const usersRes = await axios.get('/api/users', config);
      setUsersList(usersRes.data || []);

      // Load Categories, Brands, Banners
      const categoriesRes = await axios.get('/api/categories', config);
      setCategories(categoriesRes.data || []);

      const brandsRes = await axios.get('/api/brands', config);
      setBrands(brandsRes.data || []);

      const bannersRes = await axios.get('/api/banners', config);
      setBanners(bannersRes.data || []);

      const settingsRes = await axios.get('/api/settings', config);
      setGlobalSettings(settingsRes.data);

      const pagesRes = await axios.get('/api/pages', config);
      setPagesList(pagesRes.data || []);

      const couponsRes = await axios.get('/api/coupons', config);
      setCouponsList(couponsRes.data || []);

      const reviewsRes = await axios.get('/api/reviews', config);
      setReviewsList(reviewsRes.data || []);
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadInventoryAlerts();
  }, []);

  // ── Returns & Exchanges ─────────────────────────────────────
  const loadReturnRequests = async () => {
    setReturnsLoading(true);
    try {
      const config = getAuthConfig();
      const params = new URLSearchParams();
      if (returnFilter.status) params.append('status', returnFilter.status);
      if (returnFilter.type) params.append('type', returnFilter.type);
      const { data } = await axios.get(`/api/returns?${params}`, config);
      setReturnRequests(data.requests || []);
    } catch (e) {
      console.error('Failed to load return requests:', e);
    } finally {
      setReturnsLoading(false);
    }
  };

  const handleUpdateReturn = async (requestId) => {
    try {
      const config = getAuthConfig();
      await axios.put(`/api/returns/${requestId}`, {
        status: selectedReturn.status,
        adminNote: returnAdminNote,
        refundMethod: returnRefundMethod,
        refundAmount: returnRefundAmount
      }, config);
      alert('Return request updated successfully.');
      setSelectedReturn(null);
      loadReturnRequests();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update return request.');
    }
  };

  // ── Inventory Alerts (Bell) ─────────────────────────────────
  const loadInventoryAlerts = async () => {
    try {
      const config = getAuthConfig();
      const { data } = await axios.get('/api/orders/alerts', config);
      setAlertData(data);
    } catch (e) {
      // Silently fail — user may not be logged in yet
    }
  };

  // ── Inventory Report ────────────────────────────────────────
  const loadInventoryReport = async () => {
    setInventoryLoading(true);
    try {
      const config = getAuthConfig();
      const { data } = await axios.get('/api/products/inventory', config);
      setInventoryReport(data);
    } catch (e) {
      console.error('Failed to load inventory report:', e);
    } finally {
      setInventoryLoading(false);
    }
  };

  // ── CSV Export ──────────────────────────────────────────────
  const exportProductsCSV = async () => {
    setExportLoading(true);
    try {
      const config = getAuthConfig();
      const { data } = await axios.get('/api/products/export', config);
      if (!data || data.length === 0) { alert('No products to export.'); return; }

      // Convert JSON to CSV
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row =>
          headers.map(h => {
            const val = String(row[h] ?? '').replace(/"/g, '""');
            return `"${val}"`;
          }).join(',')
        )
      ];
      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Export failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setExportLoading(false);
    }
  };

  // ── CSV Import parser ───────────────────────────────────────
  const parseCsvImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target.result;
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map(line => {
        const vals = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = (vals[i] || '').replace(/^"|"$/g, '');
        });
        return obj;
      });
      setCsvImportRows(rows);
      setCsvImportResult(null);
    };
    reader.readAsText(file);
  };

  const submitCsvImport = async () => {
    if (csvImportRows.length === 0) { alert('No rows to import.'); return; }
    setCsvImportLoading(true);
    try {
      const config = getAuthConfig();
      const products = csvImportRows.map(r => ({
        name: r.name || '',
        description: r.description || 'No description',
        category: r.category || 'Kurtis',
        subcategory: r.subcategory || '',
        brand: r.brand || 'Celina',
        gender: r.gender || 'Women',
        price: Number(r.price) || 0,
        discount: Number(r.discount) || 0,
        stock: Number(r.stock) || 0,
        sku: r.sku || '',
        barcode: r.barcode || '',
        lowStockThreshold: Number(r.lowStockThreshold) || 5,
        fabric: r.fabric || '',
        occasion: r.occasion || '',
        pattern: r.pattern || '',
        sleeveLength: r.sleeveLength || '',
        sizes: r.sizes ? r.sizes.split('|') : ['S', 'M', 'L'],
        colors: r.colors ? r.colors.split('|') : ['Black'],
        isActive: r.isActive !== 'false',
        featured: r.featured === 'true',
        bestSeller: r.bestSeller === 'true',
        newArrival: r.newArrival === 'true',
        sale: r.sale === 'true',
        season: r.season || 'All',
        collectionName: r.collectionName || 'Regular',
        images: []
      }));
      const { data } = await axios.post('/api/products/import', { products }, config);
      setCsvImportResult(data);
      loadDashboardData();
    } catch (e) {
      alert('Import failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setCsvImportLoading(false);
    }
  };

  // ── SKU Generator ───────────────────────────────────────────
  const handleGenerateAllSkus = async () => {
    if (!window.confirm('Auto-generate SKUs for all products missing one?')) return;
    setSkuGenLoading(true);
    try {
      const config = getAuthConfig();
      const { data } = await axios.post('/api/products/generate-skus', {}, config);
      setSkuGenResult(data);
    } catch (e) {
      alert('SKU generation failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setSkuGenLoading(false);
    }
  };

  // ── Store Credit ────────────────────────────────────────────
  const loadStoreCreditStats = async () => {
    setStoreCreditLoading(true);
    try {
      const config = getAuthConfig();
      const { data } = await axios.get('/api/returns/store-credit/stats', config);
      setStoreCreditStats(data);
    } catch (e) {
      console.error('Failed to load store credit stats:', e);
    } finally {
      setStoreCreditLoading(false);
    }
  };

  const issueManualCredit = async () => {
    if (!manualCreditForm.userId || !manualCreditForm.amount) {
      alert('Please enter a User ID and amount.');
      return;
    }
    try {
      const config = getAuthConfig();
      const { data } = await axios.post('/api/returns/store-credit', manualCreditForm, config);
      alert(data.message);
      setManualCreditForm({ userId: '', amount: '', reason: '' });
      loadStoreCreditStats();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to issue store credit.');
    }
  };

  // ── CSV template download ────────────────────────────────────
  const downloadCsvTemplate = () => {
    const headers = ['name','description','category','subcategory','brand','gender','price','discount','stock','sku','barcode','lowStockThreshold','sizes','colors','fabric','occasion','pattern','sleeveLength','isActive','featured','bestSeller','newArrival','sale','season','collectionName','careInstructions'];
    const example = ['Sample Kurti','Beautiful cotton kurti','Kurtis','Straight','Celina','Women','599','10','50','KUR-CEL-ABC12','KUR-CEL-ABC12','5','S|M|L|XL','Red|Blue|Green','Cotton','Casual Wear','Printed','Short','true','false','true','false','false','All','Regular','Machine wash cold'];
    const csv = headers.join(',') + '\n' + example.join(',');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'celina_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };


  // Multi-Image Upload logic for Product
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const config = getAuthConfig();
    const uploadConfig = {
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const { data } = await axios.post('/api/upload', formData, uploadConfig);
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...data.urls]
      }));
      alert('Images uploaded successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload images.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Image upload logic for Banner
  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBannerImage(true);
    const formData = new FormData();
    formData.append('images', file);

    const config = getAuthConfig();
    const uploadConfig = {
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const { data } = await axios.post('/api/upload', formData, uploadConfig);
      setBannerForm((prev) => ({
        ...prev,
        image: data.urls[0]
      }));
      alert('Banner image uploaded successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload banner image.');
    } finally {
      setUploadingBannerImage(false);
    }
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCategoryImage(true);
    const formData = new FormData();
    formData.append('images', file);

    const config = getAuthConfig();
    const uploadConfig = {
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      const { data } = await axios.post('/api/upload?folder=categories', formData, uploadConfig);
      setCategoryForm((prev) => ({
        ...prev,
        image: data.urls[0]
      }));
      alert('Category image uploaded successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload category image.');
    } finally {
      setUploadingCategoryImage(false);
    }
  };

  // Size selections
  const handleSizeToggle = (size) => {
    const selected = productForm.sizes.includes(size);
    setProductForm((prev) => ({
      ...prev,
      sizes: selected ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]
    }));
  };

  // Product CRUD Submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (productForm.images.length === 0) {
      return alert('Please upload or add at least one product image.');
    }
    if (!productForm.category) {
      return alert('Please select or create a Category first.');
    }
    if (!productForm.brand) {
      return alert('Please select or create a Brand first.');
    }

    const config = getAuthConfig();
    try {
      if (isEditing) {
        await axios.put(`/api/products/${currentProductId}`, productForm, config);
        alert('Product updated successfully.');
      } else {
        await axios.post('/api/products', productForm, config);
        alert('Product created successfully.');
      }

      handleResetForm();
      loadDashboardData();
      setActiveTab('products');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product details.');
    }
  };

  const handleEditClick = (p) => {
    setProductForm({
      name: p.name,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory || '',
      brand: p.brand,
      gender: p.gender,
      sizes: p.sizes,
      colors: p.colors,
      price: p.price,
      discount: p.discount,
      images: p.images,
      stock: p.stock,
      featured: p.featured || false,
      trending: p.trending || false,
      bestSeller: p.bestSeller || false,
      newArrival: p.newArrival || false,
      sale: p.sale || false,
      isActive: p.isActive !== undefined ? p.isActive : true,
      collectionName: p.collectionName,
      season: p.season,
      codAvailable: p.codAvailable !== undefined ? p.codAvailable : true,
      returnAvailable: p.returnAvailable !== undefined ? p.returnAvailable : true,
      freeDelivery: p.freeDelivery !== undefined ? p.freeDelivery : true,
      careInstructions: p.careInstructions || 'Dry clean or gentle hand wash',
      packContains: p.packContains || '1 Product',
      manufacturerDetails: p.manufacturerDetails || 'Celina Clothing Pvt Ltd',
      countryOfOrigin: p.countryOfOrigin || 'India',
      colorImages: p.colorImages || [],
      fabric: p.fabric || '',
      fashionTrends: p.fashionTrends || '',
      fit: p.fit || '',
      length: p.length || '',
      multipackSet: p.multipackSet || '',
      neck: p.neck || '',
      occasion: p.occasion || '',
      pattern: p.pattern || '',
      printPatternType: p.printPatternType || '',
      sleeveLength: p.sleeveLength || '',
      sleeveStyling: p.sleeveStyling || '',
      washCare: p.washCare || ''
    });
    setCurrentProductId(p._id);
    setIsEditing(true);
    setActiveTab('product-form');
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? All reviews will also be removed.')) return;

    try {
      await axios.delete(`/api/products/${productId}`, getAuthConfig());
      alert('Product deleted successfully.');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleResetForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: categories[0]?.name || '',
      subcategory: '',
      brand: brands[0]?.name || '',
      gender: 'Women',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black'],
      price: 0,
      discount: 0,
      images: [],
      stock: 20,
      featured: false,
      trending: false,
      bestSeller: false,
      newArrival: false,
      sale: false,
      isActive: true,
      collectionName: 'Casual',
      season: 'All',
      codAvailable: true,
      returnAvailable: true,
      freeDelivery: true,
      careInstructions: 'Dry clean or gentle hand wash',
      packContains: '1 Product',
      manufacturerDetails: 'Celina Clothing Pvt Ltd',
      countryOfOrigin: 'India',
      colorImages: [],
      fabric: '',
      fashionTrends: '',
      fit: '',
      length: '',
      multipackSet: '',
      neck: '',
      occasion: '',
      pattern: '',
      printPatternType: '',
      sleeveLength: '',
      sleeveStyling: '',
      washCare: ''
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  // CATEGORY CRUD SUBMIT
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return alert('Category Name is required.');

    const config = getAuthConfig();
    try {
      if (isCategoryEditing) {
        await axios.put(`/api/categories/${currentCategoryId}`, categoryForm, config);
        alert('Category updated successfully.');
      } else {
        await axios.post('/api/categories', categoryForm, config);
        alert('Category created successfully.');
      }
      setCategoryForm({ name: '', description: '', image: null, order: 0, isActive: true });
      setIsCategoryEditing(false);
      setCurrentCategoryId(null);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save Category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Category?')) return;
    try {
      await axios.delete(`/api/categories/${id}`, getAuthConfig());
      alert('Category deleted successfully.');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete Category.');
    }
  };

  // BRAND CRUD SUBMIT
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    if (!brandForm.name.trim()) return alert('Brand Name is required.');

    const config = getAuthConfig();
    try {
      if (isBrandEditing) {
        await axios.put(`/api/brands/${currentBrandId}`, brandForm, config);
        alert('Brand updated successfully.');
      } else {
        await axios.post('/api/brands', brandForm, config);
        alert('Brand created successfully.');
      }
      setBrandForm({ name: '', description: '' });
      setIsBrandEditing(false);
      setCurrentBrandId(null);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save Brand.');
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Brand?')) return;
    try {
      await axios.delete(`/api/brands/${id}`, getAuthConfig());
      alert('Brand deleted successfully.');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete Brand.');
    }
  };

  // BANNER CRUD SUBMIT
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) return alert('Banner Title is required.');
    if (!bannerForm.image.trim()) return alert('Banner Image is required.');

    const config = getAuthConfig();
    try {
      if (isBannerEditing) {
        await axios.put(`/api/banners/${currentBannerId}`, bannerForm, config);
        alert('Banner updated successfully.');
      } else {
        await axios.post('/api/banners', bannerForm, config);
        alert('Banner created successfully.');
      }
      setBannerForm({ title: '', subtitle: '', buttonText: 'Shop Now', image: '', link: '/shop', isActive: true });
      setIsBannerEditing(false);
      setCurrentBannerId(null);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save Banner.');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Banner?')) return;
    try {
      await axios.delete(`/api/banners/${id}`, getAuthConfig());
      alert('Banner deleted successfully.');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete Banner.');
    }
  };

  const handleLogoUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === 'logo') setUploadingLogo(true);
    else setUploadingFooterLogo(true);

    const formData = new FormData();
    formData.append('images', file);
    const config = getAuthConfig();
    const uploadConfig = {
      headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
    };
    try {
      const { data } = await axios.post(`/api/upload?folder=logo`, formData, uploadConfig);
      setGlobalSettings(prev => ({
        ...prev,
        [type === 'logo' ? 'websiteLogo' : 'footerLogo']: data.urls[0]
      }));
      alert('Logo uploaded successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload logo.');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingFooterLogo(false);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoadingSettings(true);
    const config = getAuthConfig();
    try {
      await axios.put('/api/settings', globalSettings, config);
      alert('Global website configurations saved successfully.');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setLoadingSettings(false);
    }
  };

  const handlePageSubmit = async (e) => {
    e.preventDefault();
    if (!currentEditingPage) return;
    const config = getAuthConfig();
    try {
      await axios.put(`/api/pages/${currentEditingPage._id}`, pageForm, config);
      alert('Page content updated successfully.');
      setCurrentEditingPage(null);
      setPageForm({ title: '', content: '', isActive: true });
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update page.');
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return alert('Coupon Code is required.');
    const config = getAuthConfig();
    try {
      if (isCouponEditing) {
        await axios.put(`/api/coupons/${currentCouponId}`, couponForm, config);
        alert('Coupon updated successfully.');
      } else {
        await axios.post('/api/coupons', couponForm, config);
        alert('Coupon created successfully.');
      }
      setCouponForm({ code: '', discountType: 'Percentage', discountValue: 0, minPurchaseAmount: 0, expiryDate: '' });
      setIsCouponEditing(false);
      setCurrentCouponId(null);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save coupon.');
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Coupon?')) return;
    try {
      await axios.delete(`/api/coupons/${id}`, getAuthConfig());
      alert('Coupon deleted successfully.');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete coupon.');
    }
  };

  const handleToggleReviewStatus = async (id, currentStatus) => {
    const config = getAuthConfig();
    try {
      await axios.put(`/api/reviews/${id}/status`, { isApproved: !currentStatus }, config);
      alert('Review approval status toggled.');
      loadDashboardData();
    } catch (err) {
      alert('Failed to update review status.');
    }
  };

  const handleReviewReplySubmit = async (e, id) => {
    e.preventDefault();
    const replyText = reviewReplyText[id];
    if (!replyText?.trim()) return alert('Reply content cannot be empty.');
    const config = getAuthConfig();
    try {
      await axios.post(`/api/reviews/${id}/reply`, { reply: replyText }, config);
      alert('Reply published successfully.');
      setReviewReplyText(prev => ({ ...prev, [id]: '' }));
      loadDashboardData();
    } catch (err) {
      alert('Failed to send review reply.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await axios.delete(`/api/reviews/${id}`, getAuthConfig());
      alert('Review deleted.');
      loadDashboardData();
    } catch (err) {
      alert('Failed to delete review.');
    }
  };

  // Order workflow status updates
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, getAuthConfig());
      alert(`Order status updated to ${newStatus}`);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
  };

  const handleTogglePayment = async (orderId, isPaid) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { isPaid: !isPaid }, getAuthConfig());
      alert(`Payment status toggled successfully.`);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle payment status.');
    }
  };

  // Delete customer accounts
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user account?')) return;

    try {
      await axios.delete(`/api/users/${userId}`, getAuthConfig());
      alert('User removed successfully.');
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-Poppins">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-2">
          <div className="bg-main text-black p-4 rounded-lg flex items-center gap-2 font-black">
            <ShieldCheck size={20} className="text-black" />
            <span className="font-bold uppercase tracking-wider text-xs">Admin Control</span>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-1">
            {/* Alerts Bell */}
            <div className="relative mb-2">
              <button
                onClick={() => setShowAlertDropdown(prev => !prev)}
                className="w-full flex items-center gap-2 px-4 py-2 rounded bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-bold uppercase tracking-wider hover:bg-yellow-100 transition"
              >
                <Bell size={14} />
                <span>Stock Alerts</span>
                {alertData.totalAlerts > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {alertData.totalAlerts}
                  </span>
                )}
              </button>

              {showAlertDropdown && alertData.totalAlerts > 0 && (
                <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {alertData.outOfStockCount > 0 && (
                    <div className="p-3 border-b border-red-100 bg-red-50">
                      <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-1.5">
                        🚫 Out of Stock ({alertData.outOfStockCount})
                      </p>
                      {alertData.outOfStock.slice(0, 3).map(p => (
                        <div key={p._id} className="flex items-center gap-2 py-1">
                          <div className="w-6 h-8 bg-gray-100 rounded overflow-hidden shrink-0">
                            {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <p className="text-xs text-gray-700 font-semibold line-clamp-1 flex-1">{p.name}</p>
                          <span className="text-[10px] text-red-600 font-black">0 left</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {alertData.lowStockCount > 0 && (
                    <div className="p-3 bg-yellow-50">
                      <p className="text-xs font-black text-yellow-700 uppercase tracking-wider mb-1.5">
                        ⚠️ Low Stock ({alertData.lowStockCount})
                      </p>
                      {alertData.lowStock.slice(0, 3).map(p => (
                        <div key={p._id} className="flex items-center gap-2 py-1">
                          <div className="w-6 h-8 bg-gray-100 rounded overflow-hidden shrink-0">
                            {p.image && <img src={p.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <p className="text-xs text-gray-700 font-semibold line-clamp-1 flex-1">{p.name}</p>
                          <span className="text-[10px] text-yellow-700 font-black">{p.stock} left</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => { setActiveTab('inventory'); setShowAlertDropdown(false); loadInventoryReport(); }}
                    className="w-full py-2 text-xs font-bold text-center text-blue-600 hover:bg-blue-50 border-t border-gray-100 transition"
                  >
                    View Full Inventory Report →
                  </button>
                </div>
              )}
            </div>

            {[
              { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={14} /> },
              { id: 'products', label: 'Manage Products', icon: <FolderHeart size={14} /> },
              { id: 'categories', label: 'Manage Categories', icon: <ListPlus size={14} /> },
              { id: 'brands', label: 'Manage Brands', icon: <ListPlus size={14} /> },
              { id: 'banners', label: 'Manage Banners', icon: <Image size={14} /> },
              { id: 'orders', label: 'Manage Orders', icon: <ShoppingCart size={14} /> },
              { id: 'returns', label: 'Returns & Exchanges', icon: <ArrowLeftRight size={14} /> },
              { id: 'inventory', label: 'Inventory Reports', icon: <BarChart2 size={14} /> },
              { id: 'bulk-tools', label: 'Bulk Import / Export', icon: <Package size={14} /> },
              { id: 'sku-barcodes', label: 'SKU & Barcodes', icon: <Barcode size={14} /> },
              { id: 'store-credit', label: 'Store Credit', icon: <Wallet size={14} /> },
              { id: 'users', label: 'Manage Customers', icon: <Users size={14} /> },
              { id: 'product-form', label: isEditing ? 'Edit Product' : 'Add Product', icon: <Plus size={14} /> },
              { id: 'media', label: 'Media Library', icon: <Upload size={14} /> },
              { id: 'analytics', label: 'Analytics & Reports', icon: <TrendingUp size={14} /> },
              { id: 'homepage-builder', label: 'Homepage Builder', icon: <PanelsTopLeft size={14} /> },
              { id: 'theme', label: 'Theme Settings', icon: <Palette size={14} /> },
              { id: 'seo', label: 'SEO Management', icon: <SearchCheck size={14} /> },
              { id: 'email-templates', label: 'Email Templates', icon: <MailCheck size={14} /> },
              { id: 'website-cms', label: 'Website CMS', icon: <PanelsTopLeft size={14} /> },
              { id: 'settings', label: 'Global Settings', icon: <Settings size={14} /> },
              { id: 'pages', label: 'Custom Pages', icon: <Edit3 size={14} /> },
              { id: 'coupons', label: 'Manage Coupons', icon: <Tag size={14} /> },
              { id: 'reviews', label: 'Moderate Reviews', icon: <MessageSquare size={14} /> }
            ].map((tab) => (

              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'product-form' && !isEditing) handleResetForm();
                  setActiveTab(tab.id);
                }}
                className={`flex-grow lg:w-full text-left px-4 py-3 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-black text-white border-l-4 border-main'
                    : 'bg-brand-light dark:bg-zinc-800 text-brand-dark dark:text-gray-300 hover:bg-main/20 hover:text-black'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Dashboard Panels */}
        <main className="flex-grow">
          
          {/* TABS 1: OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* sales widgets */}
                <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-850 p-5 rounded-lg flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Total Sales Revenue</span>
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-black dark:text-white mt-2">
                    ₹{stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </h4>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-850 p-5 rounded-lg flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Total Orders Placed</span>
                    <ShoppingCart size={20} className="text-black dark:text-white" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-black dark:text-white mt-2">
                    {stats.totalOrders}
                  </h4>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-850 p-5 rounded-lg flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Total Products</span>
                    <FolderHeart size={20} className="text-blue-500" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-black dark:text-white mt-2">
                    {stats.totalProducts}
                  </h4>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-850 p-5 rounded-lg flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start text-gray-400">
                    <span className="text-[10px] uppercase font-bold tracking-wider">Active Customers</span>
                    <Users size={20} className="text-amber-500" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-black dark:text-white mt-2">
                    {stats.totalCustomers}
                  </h4>
                </div>
              </div>

              {/* inventory stock alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-850 p-5 rounded-lg">
                  <h4 className="font-Poppins font-black uppercase text-xs tracking-wider text-gray-400 border-b border-brand-border pb-3 mb-4">
                    Orders Workflow Breakdown
                  </h4>
                  <div className="space-y-3 font-bold text-xs text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Processing Orders</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-black">{stats.statusCounts?.Processing || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipped Orders</span>
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-black">{stats.statusCounts?.Shipped || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivered Orders</span>
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-black">{stats.statusCounts?.Delivered || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cancelled Orders</span>
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-black">{stats.statusCounts?.Cancelled || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-850 p-5 rounded-lg space-y-4">
                  <h4 className="font-Poppins font-black uppercase text-xs tracking-wider text-gray-400 border-b border-brand-border pb-3">
                    Inventory & Low Stock Alerts
                  </h4>
                  <div className="space-y-3 overflow-y-auto max-h-[160px] scrollbar-none">
                    {products.filter(p => p.stock <= 5).map((p) => (
                      <div key={p._id} className="flex justify-between items-center bg-red-50 dark:bg-red-950/20 border border-red-200 p-2.5 rounded text-xs gap-4">
                        <span className="font-bold text-red-800 dark:text-red-300 flex items-center gap-1.5">
                          <AlertTriangle size={14} /> {p.name}
                        </span>
                        <span className="bg-red-100 text-red-900 px-2 py-0.5 rounded font-black">
                          Qty: {p.stock} Left
                        </span>
                      </div>
                    ))}
                    {products.filter(p => p.stock <= 5).length === 0 && (
                      <p className="text-xs text-gray-500 italic text-center py-4">All products are healthy in stock.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TABS: RETURNS & EXCHANGES */}
          {activeTab === 'returns' && (
            <ReturnsTab
              returnRequests={returnRequests}
              returnsLoading={returnsLoading}
              returnFilter={returnFilter}
              setReturnFilter={setReturnFilter}
              loadReturnRequests={loadReturnRequests}
              selectedReturn={selectedReturn}
              setSelectedReturn={setSelectedReturn}
              returnAdminNote={returnAdminNote}
              setReturnAdminNote={setReturnAdminNote}
              returnRefundMethod={returnRefundMethod}
              setReturnRefundMethod={setReturnRefundMethod}
              returnRefundAmount={returnRefundAmount}
              setReturnRefundAmount={setReturnRefundAmount}
              handleUpdateReturn={handleUpdateReturn}
            />
          )}

          {/* TABS: INVENTORY REPORTS */}
          {activeTab === 'inventory' && (
            <InventoryTab
              inventoryReport={inventoryReport}
              inventoryLoading={inventoryLoading}
              inventoryFilter={inventoryFilter}
              setInventoryFilter={setInventoryFilter}
              loadInventoryReport={loadInventoryReport}
            />
          )}

          {/* TABS: BULK IMPORT / EXPORT */}
          {activeTab === 'bulk-tools' && (
            <BulkToolsTab
              exportLoading={exportLoading}
              exportProductsCSV={exportProductsCSV}
              downloadCsvTemplate={downloadCsvTemplate}
              parseCsvImport={parseCsvImport}
              csvImportRows={csvImportRows}
              setCsvImportRows={setCsvImportRows}
              csvImportLoading={csvImportLoading}
              submitCsvImport={submitCsvImport}
              csvImportResult={csvImportResult}
            />
          )}

          {/* TABS: SKU & BARCODES */}
          {activeTab === 'sku-barcodes' && (
            <SkuBarcodesTab
              skuGenLoading={skuGenLoading}
              handleGenerateAllSkus={handleGenerateAllSkus}
              skuGenResult={skuGenResult}
              inventoryReport={inventoryReport}
              loadInventoryReport={loadInventoryReport}
            />
          )}

          {/* TABS: STORE CREDIT */}
          {activeTab === 'store-credit' && (
            <StoreCreditTab
              storeCreditStats={storeCreditStats}
              storeCreditLoading={storeCreditLoading}
              loadStoreCreditStats={loadStoreCreditStats}
              manualCreditForm={manualCreditForm}
              setManualCreditForm={setManualCreditForm}
              issueManualCredit={issueManualCredit}
            />
          )}

          {/* TABS 2: PRODUCTS INVENTORY GRID */}
          {activeTab === 'products' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-brand-border pb-3">
                <h3 className="font-Poppins font-black text-lg uppercase tracking-wider text-black dark:text-white">
                  Manage Product Inventory
                </h3>
                <button
                  onClick={() => { handleResetForm(); setActiveTab('product-form'); }}
                  className="bg-black text-white hover:bg-neutral-800 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-light dark:bg-zinc-800 uppercase text-gray-400 font-bold border-b border-brand-border">
                      <th className="p-3">Product</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Brand</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-brand-light/50">
                        <td className="p-3 flex items-center gap-3">
                          <img src={typeof p.images[0] === 'string' ? p.images[0] : (p.images[0]?.url || '/placeholder.jpg')} alt="" className="w-8 h-11 object-cover rounded bg-gray-50" />
                          <div>
                            <span className="font-bold text-black dark:text-white block">{p.name}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.featured && <span className="bg-purple-100 text-purple-800 text-[8px] px-1 rounded">HOT</span>}
                              {p.trending && <span className="bg-blue-100 text-blue-800 text-[8px] px-1 rounded">TRENDING</span>}
                              {p.bestSeller && <span className="bg-yellow-100 text-yellow-800 text-[8px] px-1 rounded">BESTSELLER</span>}
                              {p.newArrival && <span className="bg-green-100 text-green-800 text-[8px] px-1 rounded">NEW</span>}
                              {p.sale && <span className="bg-red-100 text-red-800 text-[8px] px-1 rounded">SALE</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-semibold">₹{p.price.toFixed(2)}</td>
                        <td className="p-3 text-gray-500 font-bold">{p.category}</td>
                        <td className="p-3 text-gray-500 font-semibold">{p.brand}</td>
                        <td className={`p-3 font-bold ${p.stock <= 5 ? 'text-red-500' : 'text-green-600'}`}>{p.stock}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            p.isActive ? 'bg-green-100 text-green-800' : 'bg-zinc-200 text-zinc-600'
                          }`}>
                            {p.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABS 3: DYNAMIC CATEGORY CRUD PANEL */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Category creation Form */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-4 h-fit">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  {isCategoryEditing ? 'Edit Category' : 'Create Category'}
                </h3>
                <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Category Name</label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="e.g. Apparel"
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Description</label>
                    <textarea
                      rows="2"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="Category details..."
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Display Order</label>
                    <input
                      type="number"
                      value={categoryForm.order}
                      onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Category Image</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={typeof categoryForm.image === 'string' ? categoryForm.image : (categoryForm.image?.url || '')}
                        onChange={(e) => setCategoryForm({ ...categoryForm, image: { url: e.target.value } })}
                        placeholder="Image URL or upload"
                        className="flex-grow p-2 border border-gray-300 rounded text-xs text-black"
                      />
                      <label className="bg-black text-white hover:bg-neutral-800 px-3 py-2 rounded text-xs font-bold uppercase tracking-wider cursor-pointer">
                        <Upload size={12} className="inline mr-1" /> File
                        <input type="file" accept="image/*" className="hidden" onChange={handleCategoryImageUpload} disabled={uploadingCategoryImage} />
                      </label>
                    </div>
                    {uploadingCategoryImage && <p className="text-[10px] text-gray-500 italic animate-pulse mt-0.5">Uploading category image...</p>}
                    {categoryForm.image && (
                      <div className="mt-2 border rounded p-1 bg-neutral-50 max-w-[100px] aspect-square overflow-hidden relative">
                        <img 
                          src={typeof categoryForm.image === 'string' ? categoryForm.image : (categoryForm.image?.url || '')} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded" 
                        />
                        <button
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, image: null })}
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded text-[10px]"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="catIsActive"
                      checked={categoryForm.isActive !== false}
                      onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                      className="rounded text-main focus:ring-main"
                    />
                    <label htmlFor="catIsActive" className="text-xs uppercase font-bold text-gray-600">Active (Visible in Catalog)</label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow bg-black text-white hover:bg-neutral-800 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition">
                      {isCategoryEditing ? 'Update' : 'Save'}
                    </button>
                    {isCategoryEditing && (
                      <button
                        type="button"
                        onClick={() => { setIsCategoryEditing(false); setCategoryForm({ name: '', description: '', image: null, order: 0, isActive: true }); }}
                        className="bg-zinc-200 text-black px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Categories list table */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm md:col-span-2 space-y-4">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  Categories List
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-brand-light uppercase text-gray-400 font-bold border-b border-brand-border">
                        <th className="p-3">Image</th>
                        <th className="p-3">Category Name</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-center">Order</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {categories.map((c) => (
                        <tr key={c._id} className="hover:bg-brand-light/50">
                          <td className="p-3">
                            <div className="w-10 h-10 rounded border overflow-hidden bg-gray-50 flex items-center justify-center">
                              {c.image ? (
                                <img 
                                  src={typeof c.image === 'string' ? c.image : (c.image?.url || '')} 
                                  alt="" 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">No image</span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-black">{c.name}</td>
                          <td className="p-3 text-gray-500">{c.description || 'No description'}</td>
                          <td className="p-3 text-center text-black font-semibold">{c.order || 0}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              c.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {c.isActive !== false ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => {
                                  setCategoryForm({
                                    name: c.name,
                                    description: c.description || '',
                                    image: c.image || null,
                                    order: c.order || 0,
                                    isActive: c.isActive !== false
                                  });
                                  setCurrentCategoryId(c._id);
                                  setIsCategoryEditing(true);
                                }}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(c._id)}
                                className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-4 text-center italic text-gray-400">No categories found in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TABS 4: DYNAMIC BRAND CRUD PANEL */}
          {activeTab === 'brands' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Brand creation Form */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-4 h-fit">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  {isBrandEditing ? 'Edit Brand' : 'Create Brand'}
                </h3>
                <form onSubmit={handleBrandSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Brand Name</label>
                    <input
                      type="text"
                      required
                      value={brandForm.name}
                      onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                      placeholder="e.g. Classic Essentials"
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Description</label>
                    <textarea
                      rows="3"
                      value={brandForm.description}
                      onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                      placeholder="Brand details..."
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow bg-black text-white hover:bg-neutral-800 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition">
                      {isBrandEditing ? 'Update' : 'Save'}
                    </button>
                    {isBrandEditing && (
                      <button
                        type="button"
                        onClick={() => { setIsBrandEditing(false); setBrandForm({ name: '', description: '' }); }}
                        className="bg-zinc-200 text-black px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Brands list table */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm md:col-span-2 space-y-4">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  Brands List
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-brand-light uppercase text-gray-400 font-bold border-b border-brand-border">
                        <th className="p-3">Brand Name</th>
                        <th className="p-3">Description</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {brands.map((b) => (
                        <tr key={b._id} className="hover:bg-brand-light/50">
                          <td className="p-3 font-bold text-black">{b.name}</td>
                          <td className="p-3 text-gray-500">{b.description || 'No description'}</td>
                          <td className="p-3 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => {
                                  setBrandForm({ name: b.name, description: b.description || '' });
                                  setCurrentBrandId(b._id);
                                  setIsBrandEditing(true);
                                }}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteBrand(b._id)}
                                className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {brands.length === 0 && (
                        <tr>
                          <td colSpan="3" className="p-4 text-center italic text-gray-400">No brands found in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TABS 5: HOMEPAGE BANNERS MANAGER */}
          {activeTab === 'banners' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Banner Form */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-4 h-fit">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  {isBannerEditing ? 'Edit Banner' : 'Create Banner'}
                </h3>
                <form onSubmit={handleBannerSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Banner Title</label>
                    <input
                      type="text"
                      required
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="e.g. PAYDAY SALE NOW"
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Banner Subtitle</label>
                    <input
                      type="text"
                      required
                      value={bannerForm.subtitle}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      placeholder="e.g. Spend minimal $100 get 30% off"
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-500 uppercase">Button Text</label>
                      <input
                        type="text"
                        required
                        value={bannerForm.buttonText}
                        onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-500 uppercase">Redirect Link</label>
                      <input
                        type="text"
                        required
                        value={bannerForm.link}
                        onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                  </div>
                  
                  {/* Banner Image Upload */}
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Banner Image</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        value={bannerForm.image}
                        onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                        placeholder="Image URL or upload"
                        className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black text-[11px]"
                      />
                      <label className="bg-black text-white hover:bg-neutral-800 p-2.5 rounded cursor-pointer transition">
                        <Upload size={14} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleBannerImageUpload} disabled={uploadingBannerImage} />
                      </label>
                    </div>
                    {uploadingBannerImage && <p className="text-[10px] text-gray-500 italic animate-pulse mt-0.5">Uploading banner image...</p>}
                    {bannerForm.image && (
                      <div className="mt-2 border border-brand-border rounded p-1">
                        <img src={bannerForm.image} alt="Preview" className="h-16 w-full object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={bannerForm.isActive}
                      onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                      className="w-4 h-4 text-black focus:ring-black rounded"
                    />
                    <span className="font-bold text-black uppercase">Active on Homepage</span>
                  </label>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-grow bg-black text-white hover:bg-neutral-800 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition">
                      {isBannerEditing ? 'Update' : 'Save'}
                    </button>
                    {isBannerEditing && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsBannerEditing(false);
                          setBannerForm({ title: '', subtitle: '', buttonText: 'Shop Now', image: '', link: '/shop', isActive: true });
                        }}
                        className="bg-zinc-200 text-black px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Banners list table */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm md:col-span-2 space-y-4">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  Homepage Banners List
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-brand-light uppercase text-gray-400 font-bold border-b border-brand-border">
                        <th className="p-3">Banner Image</th>
                        <th className="p-3">Banner Text</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border">
                      {banners.map((b) => (
                        <tr key={b._id} className="hover:bg-brand-light/50">
                          <td className="p-3">
                            <img src={b.image} alt="" className="w-20 h-10 object-cover rounded bg-gray-50 border" />
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-black block">{b.title}</span>
                            <span className="text-gray-500 text-[10px] block line-clamp-1">{b.subtitle}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              b.isActive ? 'bg-green-100 text-green-800' : 'bg-zinc-200 text-zinc-600'
                            }`}>
                              {b.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => {
                                  setBannerForm({
                                    title: b.title,
                                    subtitle: b.subtitle,
                                    buttonText: b.buttonText || 'Shop Now',
                                    image: b.image,
                                    link: b.link || '/shop',
                                    isActive: b.isActive !== undefined ? b.isActive : true
                                  });
                                  setCurrentBannerId(b._id);
                                  setIsBannerEditing(true);
                                }}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteBanner(b._id)}
                                className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {banners.length === 0 && (
                        <tr>
                          <td colSpan="4" className="p-4 text-center italic text-gray-400">No homepage banners found in database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TABS 6: MANAGE CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-Poppins font-black text-lg uppercase tracking-wider text-black border-b border-brand-border pb-3">
                Manage Customer Orders
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-light uppercase text-gray-400 font-bold border-b border-brand-border">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Paid Status</th>
                      <th className="p-3">Order Status</th>
                      <th className="p-3 text-center">Change Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {orders.map((o) => (
                      <tr key={o._id} className="hover:bg-brand-light/50">
                        <td className="p-3 font-semibold text-gray-500">{o._id}</td>
                        <td className="p-3 font-bold uppercase text-black">{o.user?.name}</td>
                        <td className="p-3 text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 font-semibold">₹{o.totalPrice.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleTogglePayment(o._id, o.isPaid)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {o.isPaid ? 'PAID' : 'UNPAID'}
                          </button>
                        </td>
                        <td className="p-3 font-black text-black">{o.status}</td>
                        <td className="p-3 text-center">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            className="px-2 py-1 text-xs border border-brand-border rounded outline-none"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABS 7: MANAGE CUSTOMERS ACCOUNTS */}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-Poppins font-black text-lg uppercase tracking-wider text-black border-b border-brand-border pb-3">
                Manage Customer Accounts
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-light uppercase text-gray-400 font-bold border-b border-brand-border">
                      <th className="p-3">Customer ID</th>
                      <th className="p-3">Full Name</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">Joined Date</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border">
                    {usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-brand-light/50">
                        <td className="p-3 text-gray-500">{u._id}</td>
                        <td className="p-3 font-bold uppercase text-black">{u.name}</td>
                        <td className="p-3 text-gray-600">{u.email}</td>
                        <td className="p-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="bg-red-50 text-red-500 hover:bg-red-100 p-1.5 rounded transition"
                            title="Remove account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABS 8: ADD / EDIT PRODUCT FORM PANEL */}
          {activeTab === 'product-form' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-Poppins font-black text-lg uppercase tracking-wider text-black border-b border-brand-border pb-3">
                {isEditing ? `Edit: ${productForm.name}` : 'Add New Product Item'}
              </h3>

              <form onSubmit={handleProductSubmit} className="space-y-6 text-sm">
                
                {/* Name and Target Gender dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Product Name</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black animate-fadeIn"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Target Gender</label>
                    <select
                      value={productForm.gender}
                      onChange={(e) => setProductForm({ ...productForm, gender: e.target.value, subcategory: '' })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black font-semibold bg-white"
                    >
                      {genders.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category, Subcategory, and Brand dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Product Category</label>
                    <select
                      required
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value, subcategory: '' })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black font-semibold"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Product Subcategory</label>
                    <select
                      required
                      value={productForm.subcategory}
                      onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black font-semibold bg-white"
                    >
                      <option value="">Select Subcategory</option>
                      {productForm.category && subcategoryMap[productForm.category]?.[productForm.gender]?.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Product Brand</label>
                    <select
                      required
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black font-semibold"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((b) => (
                        <option key={b._id} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">Product Description</label>
                  <textarea
                    rows="4"
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                  />
                </div>

                {/* Price, Discount, and Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Discount (%)</label>
                    <input
                      type="number"
                      required
                      value={productForm.discount}
                      onChange={(e) => setProductForm({ ...productForm, discount: Number(e.target.value) })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Stock Qty</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                </div>

                {/* Collection & Season */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Collection Name</label>
                    <select
                      value={productForm.collectionName}
                      onChange={(e) => setProductForm({ ...productForm, collectionName: e.target.value })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    >
                      {collections.map((col) => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Season</label>
                    <select
                      value={productForm.season}
                      onChange={(e) => setProductForm({ ...productForm, season: e.target.value })}
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    >
                      {seasons.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Size selections checkbox row */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold text-gray-500">Select Available Sizes</label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => {
                      const selected = productForm.sizes.includes(s);
                      return (
                        <button
                          type="button"
                          key={s}
                          onClick={() => handleSizeToggle(s)}
                          className={`px-4 py-2 border-2 border-black rounded-lg font-bold text-xs transition flex items-center gap-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] ${
                            selected ? 'bg-[#dffe00] text-black font-black' : 'bg-white text-black'
                          }`}
                        >
                          {selected && <span className="text-black font-extrabold font-sans">✓</span>}
                          <span>{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color tags input */}
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">Colors (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={productForm.colors.join(', ')}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="e.g. Black, White, Red"
                    className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                  />
                </div>

                {/* Color-specific images section */}
                <div className="space-y-4 border-t border-[#c2c8da] pt-4">
                  <h5 className="font-Poppins font-bold text-xs uppercase text-black">Color-Specific Images</h5>
                  <p className="text-[10px] text-gray-400">Add image URLs or upload files for each color listed above. Multiple image URLs should be separated by commas.</p>
                  {productForm.colors.filter(Boolean).map((color) => {
                    const entry = productForm.colorImages.find(ci => ci.color.toLowerCase() === color.toLowerCase()) || { color, images: [] };
                    return (
                      <div key={color} className="p-4 bg-[#F4F6F5] rounded-lg border border-[#c2c8da] space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs uppercase text-black flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full border border-black/10 inline-block shadow-sm" style={{ backgroundColor: color.toLowerCase() }} />
                            {color} Pics
                          </span>
                          <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded font-black uppercase">{entry.images.length} uploaded</span>
                        </div>
                        
                        {/* File Uploader for this specific color */}
                        <div className="flex gap-2 items-center">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={async (e) => {
                              const files = Array.from(e.target.files);
                              if (files.length === 0) return;
                              
                              const formData = new FormData();
                              files.forEach((file) => formData.append('images', file));
                              
                              const config = getAuthConfig();
                              const uploadConfig = {
                                headers: {
                                  ...config.headers,
                                  'Content-Type': 'multipart/form-data'
                                }
                              };
                              try {
                                const { data } = await axios.post('/api/upload', formData, uploadConfig);
                                let updated = [...productForm.colorImages];
                                const idx = updated.findIndex(ci => ci.color.toLowerCase() === color.toLowerCase());
                                const currentImages = idx > -1 ? updated[idx].images : [];
                                const nextImages = [...currentImages, ...data.urls];
                                
                                if (idx > -1) {
                                  updated[idx] = { color, images: nextImages };
                                } else {
                                  updated.push({ color, images: nextImages });
                                }
                                
                                // Update both the specific color mapping and the global flat images list for backwards compatibility
                                const allFlatImages = Array.from(new Set([...productForm.images, ...data.urls]));
                                setProductForm({ ...productForm, colorImages: updated, images: allFlatImages });
                                alert(`Successfully uploaded ${files.length} images for color: ${color}`);
                              } catch (err) {
                                alert('Failed to upload images for ' + color);
                              }
                            }}
                            className="text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-black file:text-white hover:file:bg-neutral-800 cursor-pointer"
                          />
                        </div>

                        {/* Preview of images for this color */}
                        {entry.images.length > 0 && (
                          <div className="grid grid-cols-6 gap-2 bg-white p-2 rounded border border-gray-300">
                            {entry.images.map((img, idx) => (
                              <div key={idx} className="relative aspect-[3/4] rounded border overflow-hidden group/item">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextImages = entry.images.filter((_, i) => i !== idx);
                                    let updated = [...productForm.colorImages];
                                    const pIdx = updated.findIndex(ci => ci.color.toLowerCase() === color.toLowerCase());
                                    if (pIdx > -1) {
                                      updated[pIdx] = { color, images: nextImages };
                                    }
                                    // Also filter global images list
                                    const nextFlat = productForm.images.filter(x => x !== img);
                                    setProductForm({ ...productForm, colorImages: updated, images: nextFlat });
                                  }}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-105 flex items-center justify-center text-white transition duration-200"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Shipping Options */}
                <div className="space-y-3">
                  <label className="block text-xs uppercase font-bold text-gray-500">Shipping & Delivery Configurations</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#F4F6F5] p-4 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.codAvailable}
                        onChange={(e) => setProductForm({ ...productForm, codAvailable: e.target.checked })}
                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase text-black">COD Available</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.returnAvailable}
                        onChange={(e) => setProductForm({ ...productForm, returnAvailable: e.target.checked })}
                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase text-black">7-Day Return/Exchange</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.freeDelivery}
                        onChange={(e) => setProductForm({ ...productForm, freeDelivery: e.target.checked })}
                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase text-black">Free Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Detailed Info text fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#c2c8da] pt-4">
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Care Instructions</label>
                    <input
                      type="text"
                      value={productForm.careInstructions}
                      onChange={(e) => setProductForm({ ...productForm, careInstructions: e.target.value })}
                      placeholder="e.g. Dry clean only, machine wash cold"
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Pack Contains</label>
                    <input
                      type="text"
                      value={productForm.packContains}
                      onChange={(e) => setProductForm({ ...productForm, packContains: e.target.value })}
                      placeholder="e.g. 1 Kurti, 1 Palazzo"
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Manufacturer Details</label>
                    <input
                      type="text"
                      value={productForm.manufacturerDetails}
                      onChange={(e) => setProductForm({ ...productForm, manufacturerDetails: e.target.value })}
                      placeholder="e.g. Celina Clothing Pvt Ltd, Mumbai"
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs uppercase font-bold text-gray-500">Country of Origin</label>
                    <input
                      type="text"
                      value={productForm.countryOfOrigin}
                      onChange={(e) => setProductForm({ ...productForm, countryOfOrigin: e.target.value })}
                      placeholder="e.g. India"
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                    />
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="space-y-3 border-t border-[#c2c8da] pt-4">
                  <label className="block text-xs uppercase font-bold text-gray-500">Product Specifications (Apparel)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Fabric / Material</label>
                      <input
                        type="text"
                        value={productForm.fabric}
                        onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                        placeholder="e.g. Pure Cotton"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Fashion Trends</label>
                      <input
                        type="text"
                        value={productForm.fashionTrends}
                        onChange={(e) => setProductForm({ ...productForm, fashionTrends: e.target.value })}
                        placeholder="e.g. New Basics"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Fit</label>
                      <input
                        type="text"
                        value={productForm.fit}
                        onChange={(e) => setProductForm({ ...productForm, fit: e.target.value })}
                        placeholder="e.g. Regular Fit"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Length</label>
                      <input
                        type="text"
                        value={productForm.length}
                        onChange={(e) => setProductForm({ ...productForm, length: e.target.value })}
                        placeholder="e.g. Regular"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Multipack Set</label>
                      <input
                        type="text"
                        value={productForm.multipackSet}
                        onChange={(e) => setProductForm({ ...productForm, multipackSet: e.target.value })}
                        placeholder="e.g. Single"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Neck</label>
                      <input
                        type="text"
                        value={productForm.neck}
                        onChange={(e) => setProductForm({ ...productForm, neck: e.target.value })}
                        placeholder="e.g. Round Neck"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Occasion</label>
                      <input
                        type="text"
                        value={productForm.occasion}
                        onChange={(e) => setProductForm({ ...productForm, occasion: e.target.value })}
                        placeholder="e.g. Casual"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Pattern</label>
                      <input
                        type="text"
                        value={productForm.pattern}
                        onChange={(e) => setProductForm({ ...productForm, pattern: e.target.value })}
                        placeholder="e.g. Solid"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Print or Pattern Type</label>
                      <input
                        type="text"
                        value={productForm.printPatternType}
                        onChange={(e) => setProductForm({ ...productForm, printPatternType: e.target.value })}
                        placeholder="e.g. Solid"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Sleeve Length</label>
                      <input
                        type="text"
                        value={productForm.sleeveLength}
                        onChange={(e) => setProductForm({ ...productForm, sleeveLength: e.target.value })}
                        placeholder="e.g. Short Sleeves"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Sleeve Styling</label>
                      <input
                        type="text"
                        value={productForm.sleeveStyling}
                        onChange={(e) => setProductForm({ ...productForm, sleeveStyling: e.target.value })}
                        placeholder="e.g. Regular Sleeves"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase font-bold text-gray-500">Wash Care</label>
                      <input
                        type="text"
                        value={productForm.washCare}
                        onChange={(e) => setProductForm({ ...productForm, washCare: e.target.value })}
                        placeholder="e.g. Machine Wash"
                        className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      />
                    </div>
                  </div>
                </div>

                {/* PRODUCT STATUS AND MARKETING FLAGS (FEATURED/TRENDING/ETC) */}
                <div className="space-y-3">
                  <label className="block text-xs uppercase font-bold text-gray-500">Marketing Badges & Flags</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-[#F4F6F5] p-4 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase text-black">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.trending}
                        onChange={(e) => setProductForm({ ...productForm, trending: e.target.checked })}
                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase text-black">Trending</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.bestSeller}
                        onChange={(e) => setProductForm({ ...productForm, bestSeller: e.target.checked })}
                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase text-black">Best Seller</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.newArrival}
                        onChange={(e) => setProductForm({ ...productForm, newArrival: e.target.checked })}
                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase text-black">New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={productForm.sale}
                        onChange={(e) => setProductForm({ ...productForm, sale: e.target.checked })}
                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase text-black">Sale</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">Product Enabled Status</label>
                  <label className="flex items-center gap-2 cursor-pointer select-none bg-[#F4F6F5] p-3 rounded-lg border border-[#c2c8da] w-fit">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                    />
                    <span className="text-xs font-black uppercase text-black">Visible in Store Front</span>
                  </label>
                </div>

                {/* Multiple Images Upload & Preview */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold text-gray-500">Product Images</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add Image URL manually or upload below"
                      className="w-full text-sm p-3 border border-gray-300 rounded outline-none focus:border-main text-black"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (e.target.value.trim()) {
                            setProductForm((prev) => ({
                              ...prev,
                              images: [...prev.images, e.target.value.trim()]
                            }));
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    <label className="bg-black text-white hover:bg-neutral-800 p-3.5 rounded cursor-pointer transition">
                      <Upload size={16} />
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImages} />
                    </label>
                  </div>
                  {uploadingImages && <p className="text-xs text-gray-500 italic animate-pulse">Uploading product images...</p>}

                  {/* Previews List */}
                  {productForm.images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-2 bg-[#F4F6F5] p-3 rounded-lg border border-[#c2c8da]">
                      {productForm.images.map((img, index) => (
                        <div key={index} className="relative group aspect-[3/4] border rounded overflow-hidden bg-white">
                          <img src={typeof img === 'string' ? img : (img?.url || '')} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setProductForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, idx) => idx !== index)
                            }))}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Row */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-grow bg-black text-white hover:bg-neutral-800 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition"
                  >
                    {isEditing ? 'Update Product Details' : 'Publish Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleResetForm(); setActiveTab('products'); }}
                    className="bg-zinc-200 text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TABS 9: GLOBAL WEBSITE CONFIGURATIONS */}
          {activeTab === 'settings' && globalSettings && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
              <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3 flex items-center gap-2">
                <Settings size={18} /> Global Website Settings
              </h3>
              <form onSubmit={handleSettingsSubmit} className="space-y-6 text-xs">
                {/* 1. General & SEO Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Website Title</label>
                    <input
                      type="text"
                      required
                      value={globalSettings.websiteTitle || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, websiteTitle: e.target.value })}
                      placeholder="e.g. Celina Clothing"
                      className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Company Legal Name</label>
                    <input
                      type="text"
                      required
                      value={globalSettings.companyName || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, companyName: e.target.value })}
                      placeholder="e.g. Celina Clothing Pvt Ltd"
                      className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">SEO / Announcement Description</label>
                    <input
                      type="text"
                      value={globalSettings.metaDescription || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, metaDescription: e.target.value })}
                      placeholder="Meta details and announcement updates..."
                      className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold"
                    />
                  </div>
                </div>

                {/* 2. Visual appearance customization */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-brand-border pt-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Main Brand Theme Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={globalSettings.themeColorMain || '#F2C852'}
                        onChange={(e) => setGlobalSettings({ ...globalSettings, themeColorMain: e.target.value })}
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={globalSettings.themeColorMain || '#F2C852'}
                        onChange={(e) => setGlobalSettings({ ...globalSettings, themeColorMain: e.target.value })}
                        className="flex-grow p-2.5 border border-gray-300 rounded text-black font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Accent Secondary Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={globalSettings.themeColorBurgundy || '#7D1F3C'}
                        onChange={(e) => setGlobalSettings({ ...globalSettings, themeColorBurgundy: e.target.value })}
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={globalSettings.themeColorBurgundy || '#7D1F3C'}
                        onChange={(e) => setGlobalSettings({ ...globalSettings, themeColorBurgundy: e.target.value })}
                        className="flex-grow p-2.5 border border-gray-300 rounded text-black font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Typography Font Style</label>
                    <select
                      value={globalSettings.fontStyle || 'Poppins'}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, fontStyle: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold"
                    >
                      <option value="Poppins">Poppins (Modern Clean)</option>
                      <option value="Inter">Inter (Minimal Tech)</option>
                      <option value="Roboto">Roboto (Classic Formal)</option>
                      <option value="Outfit">Outfit (Round Premium)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Logos & Media Assets uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-brand-border pt-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Website Primary Header Logo</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={typeof globalSettings.websiteLogo === 'string' ? globalSettings.websiteLogo : (globalSettings.websiteLogo?.url || '')}
                        onChange={(e) => setGlobalSettings({ ...globalSettings, websiteLogo: { url: e.target.value } })}
                        placeholder="Image URL or upload"
                        className="flex-grow p-2.5 border border-gray-300 rounded text-black"
                      />
                      <label className="bg-black text-white hover:bg-neutral-800 px-4 py-2.5 rounded cursor-pointer font-bold uppercase tracking-wider text-center">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, 'logo')} disabled={uploadingLogo} />
                      </label>
                    </div>
                    {uploadingLogo && <p className="text-[10px] text-gray-500 italic animate-pulse">Uploading primary logo...</p>}
                    {globalSettings.websiteLogo && (
                      <img 
                        src={typeof globalSettings.websiteLogo === 'string' ? globalSettings.websiteLogo : (globalSettings.websiteLogo?.url || '')} 
                        alt="Logo" 
                        className="h-10 w-auto object-contain mt-2 border rounded p-1 bg-neutral-50" 
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Footer / Secondary Text Logo</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={typeof globalSettings.footerLogo === 'string' ? globalSettings.footerLogo : (globalSettings.footerLogo?.url || '')}
                        onChange={(e) => setGlobalSettings({ ...globalSettings, footerLogo: { url: e.target.value } })}
                        placeholder="Image URL or upload"
                        className="flex-grow p-2.5 border border-gray-300 rounded text-black"
                      />
                      <label className="bg-black text-white hover:bg-neutral-800 px-4 py-2.5 rounded cursor-pointer font-bold uppercase tracking-wider text-center">
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoUpload(e, 'footerLogo')} disabled={uploadingFooterLogo} />
                      </label>
                    </div>
                    {uploadingFooterLogo && <p className="text-[10px] text-gray-500 italic animate-pulse">Uploading footer logo...</p>}
                    {globalSettings.footerLogo && (
                      <img 
                        src={typeof globalSettings.footerLogo === 'string' ? globalSettings.footerLogo : (globalSettings.footerLogo?.url || '')} 
                        alt="Footer Logo" 
                        className="h-10 w-auto object-contain mt-2 border rounded p-1 bg-neutral-50" 
                      />
                    )}
                  </div>
                </div>

                {/* 4. Contact details & Business metadata */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-brand-border pt-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Contact Email</label>
                    <input
                      type="email"
                      value={globalSettings.contactEmail || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, contactEmail: e.target.value })}
                      placeholder="support@celina.com"
                      className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Contact Telephone / WhatsApp</label>
                    <input
                      type="text"
                      value={globalSettings.contactPhone || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, contactPhone: e.target.value })}
                      placeholder="+91 99999 99999"
                      className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Business Office Address</label>
                    <input
                      type="text"
                      value={globalSettings.businessAddress || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, businessAddress: e.target.value })}
                      placeholder="Outer Ring Road, Bangalore, India"
                      className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold"
                    />
                  </div>
                </div>

                {/* 5. Payments options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-brand-border pt-4 bg-[#F4F6F5] p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="optCOD"
                      checked={globalSettings.codAvailable !== false}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, codAvailable: e.target.checked })}
                      className="rounded text-black focus:ring-black cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="optCOD" className="font-bold uppercase text-gray-700">Allow Cash on Delivery (COD)</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="optPrepaid"
                      checked={globalSettings.prepaidAvailable !== false}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, prepaidAvailable: e.target.checked })}
                      className="rounded text-black focus:ring-black cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="optPrepaid" className="font-bold uppercase text-gray-700">Allow Online Payments</label>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Standard Delivery Charge (₹)</label>
                    <input
                      type="number"
                      value={globalSettings.deliveryCharge || 0}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, deliveryCharge: Number(e.target.value) })}
                      className="w-full p-2 border border-gray-300 rounded text-black font-bold"
                    />
                  </div>
                </div>

                {/* 6. Social Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-brand-border pt-4">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Facebook URL</label>
                    <input
                      type="text"
                      value={globalSettings.socialFacebook || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, socialFacebook: e.target.value })}
                      placeholder="https://facebook.com/..."
                      className="w-full p-2.5 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Instagram URL</label>
                    <input
                      type="text"
                      value={globalSettings.socialInstagram || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, socialInstagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full p-2.5 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Twitter URL</label>
                    <input
                      type="text"
                      value={globalSettings.socialTwitter || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, socialTwitter: e.target.value })}
                      placeholder="https://twitter.com/..."
                      className="w-full p-2.5 border border-gray-300 rounded text-black"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">LinkedIn URL</label>
                    <input
                      type="text"
                      value={globalSettings.socialLinkedin || ''}
                      onChange={(e) => setGlobalSettings({ ...globalSettings, socialLinkedin: e.target.value })}
                      placeholder="https://linkedin.com/..."
                      className="w-full p-2.5 border border-gray-300 rounded text-black"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loadingSettings}
                    className="w-full bg-black text-white hover:bg-neutral-800 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition disabled:opacity-50"
                  >
                    {loadingSettings ? 'Saving Settings...' : 'Save Global Website Configurations'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'website-cms' && globalSettings && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-4 mb-6">
                  <div>
                    <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black flex items-center gap-2">
                      <PanelsTopLeft size={18} /> Website Management System
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Manage homepage, theme, SEO, email, payments, shipping, marketing, contact details, analytics, and reports without editing code.</p>
                  </div>
                  <button
                    onClick={handleSettingsSubmit}
                    disabled={loadingSettings}
                    className="bg-black text-white hover:bg-neutral-800 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider disabled:opacity-50"
                  >
                    {loadingSettings ? 'Saving...' : 'Save All Controls'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border border-brand-border rounded-lg p-4 space-y-4">
                    <h4 className="font-black uppercase text-xs text-black flex items-center gap-2"><PanelsTopLeft size={16} /> Homepage Builder</h4>
                    <div className="space-y-2">
                      {(globalSettings.homepageLayout || ['Hero','Flash Sale','Categories','New Arrivals','Best Sellers','Festival Theme','Referral Banner','Gift Cards','Newsletter']).map((section, index) => (
                        <div key={`${section}-${index}`} className="flex items-center gap-2 bg-[#F4F6F5] rounded p-2">
                          <input
                            type="checkbox"
                            checked
                            onChange={() => {}}
                            className="rounded text-black"
                            title="Section enabled"
                          />
                          <input
                            value={section}
                            onChange={(e) => {
                              const next = [...(globalSettings.homepageLayout || [])];
                              next[index] = e.target.value;
                              setGlobalSettings({ ...globalSettings, homepageLayout: next });
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded text-xs font-bold text-black"
                          />
                          <button type="button" onClick={() => {
                            const next = [...(globalSettings.homepageLayout || [])];
                            if (index > 0) [next[index - 1], next[index]] = [next[index], next[index - 1]];
                            setGlobalSettings({ ...globalSettings, homepageLayout: next });
                          }} className="px-2 py-1 bg-white rounded border text-[10px] font-black">Up</button>
                          <button type="button" onClick={() => setGlobalSettings({ ...globalSettings, homepageLayout: (globalSettings.homepageLayout || []).filter((_, i) => i !== index) })} className="px-2 py-1 bg-red-50 text-red-600 rounded border border-red-100 text-[10px] font-black">Delete</button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setGlobalSettings({ ...globalSettings, homepageLayout: [...(globalSettings.homepageLayout || []), 'New Section'] })} className="bg-black text-white px-4 py-2 rounded text-xs font-black uppercase">Create Section</button>
                      <a href="/" target="_blank" rel="noreferrer" className="bg-zinc-200 text-black px-4 py-2 rounded text-xs font-black uppercase">Preview</a>
                    </div>
                  </div>

                  <div className="border border-brand-border rounded-lg p-4 space-y-4">
                    <h4 className="font-black uppercase text-xs text-black flex items-center gap-2"><Palette size={16} /> Theme Settings</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {[
                        ['Primary Color', 'themeColorMain', 'color'],
                        ['Secondary Color', 'themeColorBurgundy', 'color'],
                        ['Website Width', 'websiteWidth', 'text'],
                        ['Border Radius', 'borderRadius', 'text'],
                        ['Button Style', 'buttonStyle', 'text'],
                        ['Card Style', 'cardStyle', 'text']
                      ].map(([label, key, type]) => (
                        <label key={key} className="space-y-1">
                          <span className="block font-bold uppercase text-gray-500">{label}</span>
                          <input type={type} value={globalSettings[key] || (type === 'color' ? '#0F172A' : '')} onChange={(e) => setGlobalSettings({ ...globalSettings, [key]: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-black font-bold" />
                        </label>
                      ))}
                      <label className="space-y-1 col-span-2">
                        <span className="block font-bold uppercase text-gray-500">Fonts</span>
                        <select value={globalSettings.fontStyle || 'Poppins'} onChange={(e) => setGlobalSettings({ ...globalSettings, fontStyle: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-black font-bold">
                          {['Poppins','Inter','Roboto','Outfit','Playfair Display'].map(font => <option key={font} value={font}>{font}</option>)}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="border border-brand-border rounded-lg p-4 space-y-4">
                    <h4 className="font-black uppercase text-xs text-black flex items-center gap-2"><SearchCheck size={16} /> SEO Center</h4>
                    <div className="grid grid-cols-1 gap-3 text-xs">
                      {[
                        ['Meta Title', 'websiteTitle'],
                        ['Meta Description', 'metaDescription'],
                        ['Keywords', 'seoKeywords'],
                        ['Open Graph Title', 'openGraphTitle'],
                        ['Open Graph Image', 'openGraphImage'],
                        ['Twitter Card', 'twitterCard'],
                        ['Canonical URL', 'canonicalUrl'],
                        ['Sitemap URL', 'sitemapUrl'],
                        ['robots.txt Rules', 'robotsTxt'],
                        ['Schema.org JSON-LD', 'schemaOrg']
                      ].map(([label, key]) => (
                        <label key={key} className="space-y-1">
                          <span className="block font-bold uppercase text-gray-500">{label}</span>
                          <textarea rows={key === 'schemaOrg' ? 4 : 2} value={globalSettings[key] || ''} onChange={(e) => setGlobalSettings({ ...globalSettings, [key]: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-black font-semibold" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border border-brand-border rounded-lg p-4 space-y-4">
                    <h4 className="font-black uppercase text-xs text-black flex items-center gap-2"><MailCheck size={16} /> Email Templates</h4>
                    {['Order Confirmation','Shipping','Delivered','Cancelled','Refund','Newsletter','OTP','Welcome Email'].map(template => (
                      <label key={template} className="block space-y-1 text-xs">
                        <span className="block font-bold uppercase text-gray-500">{template}</span>
                        <textarea
                          rows="3"
                          value={globalSettings.emailTemplates?.[template] || `<h1>${template}</h1><p>Hi {{customerName}}, your Celina update is ready.</p>`}
                          onChange={(e) => setGlobalSettings({ ...globalSettings, emailTemplates: { ...(globalSettings.emailTemplates || {}), [template]: e.target.value } })}
                          className="w-full p-2 border border-gray-300 rounded text-black font-mono text-[11px]"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="border border-brand-border rounded-lg p-4 space-y-4">
                    <h4 className="font-black uppercase text-xs text-black flex items-center gap-2"><Megaphone size={16} /> Marketing & Store Rules</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {[
                        ['Announcement Bar', 'announcementText'],
                        ['Coupon Popup Code', 'couponPopupCode'],
                        ['Newsletter Popup Title', 'newsletterPopupTitle'],
                        ['Exit Intent Offer', 'exitIntentOffer'],
                        ['Referral Banner', 'referralBanner'],
                        ['Gift Card Message', 'giftCardMessage'],
                        ['Payment Settings', 'paymentSettings'],
                        ['Shipping Rules', 'shippingRules']
                      ].map(([label, key]) => (
                        <label key={key} className="space-y-1">
                          <span className="block font-bold uppercase text-gray-500">{label}</span>
                          <textarea rows="2" value={globalSettings[key] || ''} onChange={(e) => setGlobalSettings({ ...globalSettings, [key]: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-black font-semibold" />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border border-brand-border rounded-lg p-4 space-y-4">
                    <h4 className="font-black uppercase text-xs text-black flex items-center gap-2"><BarChart2 size={16} /> Analytics & Reports</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        ['Revenue', `₹${stats.totalRevenue.toLocaleString('en-IN')}`],
                        ['Orders', stats.totalOrders],
                        ['Products', stats.totalProducts],
                        ['Customers', stats.totalCustomers]
                      ].map(([label, value]) => (
                        <div key={label} className="bg-[#F4F6F5] rounded p-4">
                          <p className="text-[10px] uppercase font-black text-gray-500">{label}</p>
                          <p className="font-black text-xl text-black mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                    <textarea value={globalSettings.reportNotes || ''} onChange={(e) => setGlobalSettings({ ...globalSettings, reportNotes: e.target.value })} rows="5" placeholder="Admin report notes, KPI commentary, analytics snippets..." className="w-full p-3 border border-gray-300 rounded text-black text-xs font-semibold" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TABS 10: CUSTOM TEXT PAGES */}
          {activeTab === 'pages' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Pages List */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-4 h-fit md:col-span-1">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  Custom Website Pages
                </h3>
                <div className="space-y-2">
                  {pagesList.map((p) => (
                    <button
                      key={p._id}
                      onClick={() => {
                        setCurrentEditingPage(p);
                        setPageForm({ title: p.title, content: p.content, isActive: p.isActive !== false });
                      }}
                      className={`w-full text-left p-3 rounded border text-xs font-bold uppercase tracking-wider transition ${
                        currentEditingPage?._id === p._id
                          ? 'border-black bg-black text-white'
                          : 'border-brand-border bg-brand-light/20 hover:bg-brand-light text-brand-dark'
                      }`}
                    >
                      {p.title}
                      <span className="block text-[9px] text-gray-400 font-normal mt-0.5 font-Poppins lowercase">slug: /{p.slug}</span>
                    </button>
                  ))}
                  {pagesList.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No custom pages loaded.</p>
                  )}
                </div>
              </div>

              {/* Editor */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm md:col-span-2 space-y-4">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  {currentEditingPage ? `Edit Page: ${currentEditingPage.title}` : 'Select a page to edit'}
                </h3>
                {currentEditingPage ? (
                  <form onSubmit={handlePageSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-500 uppercase">Page Title</label>
                      <input
                        type="text"
                        required
                        value={pageForm.title}
                        onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                        className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block font-bold text-gray-500 uppercase">HTML / Markdown Content</label>
                      <textarea
                        rows="15"
                        required
                        value={pageForm.content}
                        onChange={(e) => setPageForm({ ...pageForm, content: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded text-black font-mono text-xs leading-relaxed"
                        placeholder="<div>Page details in HTML format...</div>"
                      />
                    </div>
                    <div className="flex items-center gap-2 bg-[#F4F6F5] p-3 rounded">
                      <input
                        type="checkbox"
                        id="pageIsActive"
                        checked={pageForm.isActive}
                        onChange={(e) => setPageForm({ ...pageForm, isActive: e.target.checked })}
                        className="rounded text-black focus:ring-black cursor-pointer w-4 h-4"
                      />
                      <label htmlFor="pageIsActive" className="font-bold uppercase text-gray-600">Visible on Site</label>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-grow bg-black text-white hover:bg-neutral-800 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition">
                        Update Page Content
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCurrentEditingPage(null); setPageForm({ title: '', content: '', isActive: true }); }}
                        className="bg-zinc-200 text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-20 text-gray-400 italic">
                    Click on a custom page from the left sidebar panel to load it into the dynamic HTML editor.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TABS 11: COUPONS CONTROL */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Add Coupon Form */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-4 h-fit">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  {isCouponEditing ? 'Edit Coupon' : 'Create Coupon'}
                </h3>
                <form onSubmit={handleCouponSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Coupon Promo Code</label>
                    <input
                      type="text"
                      required
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                      placeholder="e.g. EXTRA20"
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black font-bold uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Discount Type</label>
                    <select
                      value={couponForm.discountType}
                      onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded text-black font-semibold"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed">Fixed Amount (₹)</option>
                      <option value="FreeShipping">Free Shipping</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={couponForm.discountValue}
                      onChange={(e) => setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })}
                      placeholder="10"
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Minimum Purchase Amount (₹)</label>
                    <input
                      type="number"
                      value={couponForm.minPurchaseAmount}
                      onChange={(e) => setCouponForm({ ...couponForm, minPurchaseAmount: Number(e.target.value) })}
                      placeholder="500"
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-gray-500 uppercase">Expiry Date</label>
                    <input
                      type="date"
                      value={couponForm.expiryDate ? couponForm.expiryDate.split('T')[0] : ''}
                      onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                      className="w-full p-2.5 border border-gray-300 rounded outline-none focus:border-main text-black font-semibold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-grow bg-black text-white hover:bg-neutral-800 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition">
                      {isCouponEditing ? 'Update Coupon' : 'Save Coupon'}
                    </button>
                    {isCouponEditing && (
                      <button
                        type="button"
                        onClick={() => { setIsCouponEditing(false); setCouponForm({ code: '', discountType: 'Percentage', discountValue: 0, minPurchaseAmount: 0, expiryDate: '' }); }}
                        className="bg-zinc-200 text-black px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Coupons List Table */}
              <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm md:col-span-2 space-y-4">
                <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3">
                  Coupons List
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-brand-light uppercase text-gray-400 font-bold border-b border-brand-border">
                        <th className="p-3">Code</th>
                        <th className="p-3">Type</th>
                        <th className="p-3 text-center">Value</th>
                        <th className="p-3 text-center">Min Purchase</th>
                        <th className="p-3 text-center">Expiry</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border text-black">
                      {couponsList.map((cp) => (
                        <tr key={cp._id} className="hover:bg-brand-light/50 font-semibold">
                          <td className="p-3 font-bold text-brand-burgundy dark:text-red-400">{cp.code}</td>
                          <td className="p-3 text-gray-500">{cp.discountType}</td>
                          <td className="p-3 text-center">
                            {cp.discountType === 'Percentage' ? `${cp.discountValue}%` : `₹${cp.discountValue}`}
                          </td>
                          <td className="p-3 text-center">₹{cp.minPurchaseAmount || 0}</td>
                          <td className="p-3 text-center text-gray-400">
                            {cp.expiryDate ? new Date(cp.expiryDate).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="p-3 text-center">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => {
                                  setCouponForm({
                                    code: cp.code,
                                    discountType: cp.discountType,
                                    discountValue: cp.discountValue,
                                    minPurchaseAmount: cp.minPurchaseAmount || 0,
                                    expiryDate: cp.expiryDate ? cp.expiryDate.split('T')[0] : ''
                                  });
                                  setCurrentCouponId(cp._id);
                                  setIsCouponEditing(true);
                                }}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteCoupon(cp._id)}
                                className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {couponsList.length === 0 && (
                        <tr>
                          <td colSpan="6" className="p-4 text-center italic text-gray-400">No promo coupons available in DB.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TABS 12: MODERATE REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-4">
              <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3 flex items-center gap-2">
                <MessageSquare size={18} /> Moderate Customer Reviews
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-brand-light uppercase text-gray-400 font-bold border-b border-brand-border">
                      <th className="p-3">Product Name</th>
                      <th className="p-3">User</th>
                      <th className="p-3 text-center">Rating</th>
                      <th className="p-3">Comment</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3">Admin Reply</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border text-black">
                    {reviewsList.map((r) => (
                      <tr key={r._id} className="hover:bg-brand-light/50 align-top">
                        <td className="p-3 font-bold text-xs truncate max-w-[150px]">
                          {r.product?.name || 'Deleted Product'}
                        </td>
                        <td className="p-3 text-xs text-gray-500 font-medium">
                          {r.name}
                          <span className="block text-[9px] text-gray-400 font-normal">Rating user</span>
                        </td>
                        <td className="p-3 text-center font-bold text-yellow-500 text-sm">
                          {r.rating} ★
                        </td>
                        <td className="p-3 text-gray-600 font-medium max-w-[200px] text-justify text-xs">
                          {r.comment}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleReviewStatus(r._id, r.isApproved)}
                            className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase transition ${
                              r.isApproved !== false ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            {r.isApproved !== false ? 'Approved' : 'Pending'}
                          </button>
                        </td>
                        <td className="p-3 max-w-[200px]">
                          {r.reply ? (
                            <div className="bg-neutral-50 p-2 rounded border border-gray-100 text-[10px] text-gray-500 italic">
                              <strong>Store Manager:</strong> {r.reply}
                            </div>
                          ) : (
                            <form onSubmit={(e) => handleReviewReplySubmit(e, r._id)} className="flex gap-1.5 items-center">
                              <input
                                type="text"
                                value={reviewReplyText[r._id] || ''}
                                onChange={(e) => setReviewReplyText({ ...reviewReplyText, [r._id]: e.target.value })}
                                placeholder="Reply to customer..."
                                className="p-1.5 border border-gray-300 rounded text-[10px] flex-grow text-black"
                              />
                              <button type="submit" className="bg-black text-white hover:bg-neutral-800 px-2.5 py-1.5 rounded text-[9px] font-black uppercase">
                                Send
                              </button>
                            </form>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteReview(r._id)}
                            className="p-1.5 bg-red-50 text-red-500 rounded hover:bg-red-100"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {reviewsList.length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-4 text-center italic text-gray-400">No reviews submitted yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TABS: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <AdminMediaLibrary getAuthConfig={getAuthConfig} globalSettings={globalSettings} setGlobalSettings={setGlobalSettings} />
          )}

          {/* TABS: ANALYTICS & REPORTS */}
          {activeTab === 'analytics' && (
            <AdminAnalytics stats={stats} products={products} />
          )}

          {/* TABS: HOMEPAGE BUILDER */}
          {activeTab === 'homepage-builder' && (
            <AdminHomepageBuilder globalSettings={globalSettings} setGlobalSettings={setGlobalSettings} getAuthConfig={getAuthConfig} />
          )}

          {/* TABS: THEME SETTINGS */}
          {activeTab === 'theme' && (
            <AdminThemeSettings globalSettings={globalSettings} setGlobalSettings={setGlobalSettings} getAuthConfig={getAuthConfig} />
          )}

          {/* TABS: SEO MANAGEMENT */}
          {activeTab === 'seo' && (
            <AdminSEO globalSettings={globalSettings} setGlobalSettings={setGlobalSettings} getAuthConfig={getAuthConfig} />
          )}

          {/* TABS: EMAIL TEMPLATES */}
          {activeTab === 'email-templates' && (
            <AdminEmailTemplates globalSettings={globalSettings} setGlobalSettings={setGlobalSettings} getAuthConfig={getAuthConfig} />
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
