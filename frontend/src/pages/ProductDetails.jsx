import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, MessageSquare, MapPin, CheckCircle, XCircle, Camera, X, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import { StickyAddToCart } from '../components/StickyAddToCart';
import { LoginPromptModal } from '../components/LoginPromptModal';
import { ProductCard } from '../components/ProductCard';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, wishlistItems, toggleWishlist } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected parameters
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  // Dynamic related products, frequently bought & Size Chart modal state
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // New Review form state
  const [ratingInput, setRatingInput] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewImages, setReviewImages] = useState([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState(null);

  // Delivery Location/Pincode states
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [showCodModal, setShowCodModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState(5);

  const fetchProductDetails = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data.product);
      setReviews(data.reviews || []);
      
      // Pre-select default options
      if (data.product.sizes?.length > 0) setSelectedSize(data.product.sizes[0]);
      if (data.product.colors?.length > 0) setSelectedColor(data.product.colors[0]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    if (product) {
      const fetchRelated = async () => {
        try {
          const { data } = await axios.get(`/api/products?limit=8&category=${product.category}`);
          const filtered = (data.products || []).filter(p => p._id !== product._id);
          setRelatedProducts(filtered.slice(0, 4));
          setFrequentlyBought(filtered.slice(0, 2));
        } catch (e) {
          console.error("Failed to load related products", e);
        }
      };
      fetchRelated();
    }
  }, [product]);

  const handleAddToCart = () => {
    console.log("Add to Bag clicked. Product:", product?._id, "User:", user);
    if (!product) return;
    if (!user) {
      console.log("No user logged in. Setting pending action: cart, opening LoginPromptModal");
      setPendingAuthAction('cart');
      setShowLoginPrompt(true);
      return;
    }
    addToCart(product, selectedSize, selectedColor, qty);
  };

  const handleBuyNow = () => {
    console.log("Buy Now clicked. Product:", product?._id, "User:", user);
    if (!product) return;
    if (!user) {
      console.log("No user logged in. Setting pending action: buy, opening LoginPromptModal");
      setPendingAuthAction('buy');
      setShowLoginPrompt(true);
      return;
    }
    addToCart(product, selectedSize, selectedColor, qty);
    navigate('/checkout');
  };

  const handleAuthSuccess = () => {
    if (pendingAuthAction === 'wishlist') {
      toggleWishlist(product);
    } else if (pendingAuthAction === 'cart') {
      addToCart(product, selectedSize, selectedColor, qty);
    } else if (pendingAuthAction === 'buy') {
      addToCart(product, selectedSize, selectedColor, qty);
      navigate('/checkout');
    }
    setPendingAuthAction(null);
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (reviewImages.length + files.length > 5) {
        setReviewError('You can upload a maximum of 5 images per review.');
        return;
      }
      setReviewImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index) => {
    setReviewImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (ratingInput < 1 || ratingInput > 5) {
      setReviewError('Please select a star rating. It is mandatory!');
      return;
    }

    setIsSubmittingReview(true);

    try {
      const formData = new FormData();
      formData.append('rating', ratingInput);
      formData.append('comment', commentInput || '');
      reviewImages.forEach((file) => {
        formData.append('images', file);
      });

      // Get configuration if token exists
      const userInfo = localStorage.getItem('evara_user_info');
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }

      await axios.post(`/api/products/${id}/reviews`, formData, config);
      setReviewSuccess('Review submitted successfully!');
      setCommentInput('');
      setRatingInput(0);
      setReviewImages([]);
      fetchProductDetails(); // Refetch product to update rating and review list
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review? This action cannot be undone.')) {
      return;
    }

    try {
      const userInfo = localStorage.getItem('evara_user_info');
      let config = {};
      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed.token) {
          config.headers = {
            Authorization: `Bearer ${parsed.token}`
          };
        }
      }

      await axios.delete(`/api/reviews/${reviewId}`, config);
      fetchProductDetails(); // Refetch to update ratings and reviews list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  // Track accordion states — must be declared BEFORE any early return (Rules of Hooks)
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    specifications: true,
    know: false,
    vendor: false,
    policy: false
  });

  const toggleAccordion = (section) => {
    setOpenAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus({
        type: 'error',
        message: 'Please enter a valid 6-digit pincode.',
        icon: <XCircle size={14} className="shrink-0 mt-0.5" />
      });
      return;
    }

    const isDelhiNCR = pincode.startsWith('11') || 
                       pincode.startsWith('201') || 
                       pincode.startsWith('121') || 
                       pincode.startsWith('122');

    if (isDelhiNCR) {
      setDeliveryDays(2);
      setPincodeStatus({
        type: 'success',
        message: 'Available! Fast delivery to your location in 1-2 working days.',
        icon: <CheckCircle size={14} className="shrink-0 mt-0.5 text-green-600" />
      });
    } else {
      setDeliveryDays(8);
      setPincodeStatus({
        type: 'success',
        message: 'Available! Standard delivery to your location in 6-8 working days.',
        icon: <CheckCircle size={14} className="shrink-0 mt-0.5 text-green-600" />
      });
    }
  };

  const handleKnowMore = (section) => {
    if (section === 'cod') {
      setOpenAccordions(prev => ({ ...prev, details: true }));
      setTimeout(() => {
        const el = document.getElementById('accordion-details');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } else if (section === 'return') {
      setOpenAccordions(prev => ({ ...prev, policy: true }));
      setTimeout(() => {
        const el = document.getElementById('accordion-policy');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } else if (section === 'delivery') {
      const el = document.getElementById('pincode-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const input = document.getElementById('pincode-input');
          if (input) input.focus();
        }, 300);
      }
    }
  };

  // Reset active image on color swap — must be BEFORE early returns
  useEffect(() => {
    setActiveImage(0);
  }, [selectedColor]);

  // Early returns AFTER all hooks
  if (loading) return <div className="text-center py-20 text-brand-burgundy font-bold text-lg">Loading Product...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold text-lg">{error}</div>;
  if (!product) return null;

  // Derived values (not hooks — safe after early returns)
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);
  const discountedPrice = product.discount > 0 ? product.price * (1 - (product.discount / 100)) : product.price;

  const getDisplayedImages = () => {
    let list = [];
    if (selectedColor && product.colorImages?.length > 0) {
      const match = product.colorImages.find(
        (ci) => ci.color.toLowerCase() === selectedColor.toLowerCase()
      );
      if (match && match.images?.length > 0) {
        list = match.images;
      }
    }
    if (list.length === 0) {
      list = product.images?.length > 0 ? product.images : [];
    }
    if (list.length === 0) return ['/placeholder.jpg'];
    return list.map(img => (typeof img === 'string' ? img : (img?.url || '/placeholder.jpg')));
  };
  const displayedImages = getDisplayedImages();

  const getEstimatedDeliveryDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + deliveryDays);
    return `${days[targetDate.getDay()]}, ${targetDate.getDate()} ${months[targetDate.getMonth()]}`;
  };

  const handleImageSwipe = (endX) => {
    if (touchStart === null || displayedImages.length < 2) return;
    const distance = touchStart - endX;
    if (Math.abs(distance) > 45) {
      setActiveImage((prev) => {
        if (distance > 0) return (prev + 1) % displayedImages.length;
        return (prev - 1 + displayedImages.length) % displayedImages.length;
      });
    }
    setTouchStart(null);
  };

  // Extract all customer photos from reviews
  const customerPhotos = [];
  reviews.forEach((r) => {
    if (r.images && r.images.length > 0) {
      r.images.forEach((img) => {
        if (img.url) {
          customerPhotos.push(img);
        }
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-36 md:pb-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: IMAGES PREVIEW */}
        <div className="space-y-4">
          <div
            className="overflow-hidden aspect-[3/4] rounded-lg bg-gray-100 border border-brand-border dark:border-zinc-800 animate-fadeIn relative group"
            onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
            onTouchEnd={(e) => handleImageSwipe(e.changedTouches[0].clientX)}
          >
            <img
              src={displayedImages[activeImage] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 cursor-zoom-in"
            />
            {displayedImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveImage(prev => (prev - 1 + displayedImages.length) % displayedImages.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/75 dark:bg-black/75 hover:bg-white dark:hover:bg-black text-black dark:text-white flex items-center justify-center transition shadow-sm md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                  aria-label="Previous product image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveImage(prev => (prev + 1) % displayedImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/75 dark:bg-black/75 hover:bg-white dark:hover:bg-black text-black dark:text-white flex items-center justify-center transition shadow-sm md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                  aria-label="Next product image"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          <div className="md:hidden text-center text-[10px] uppercase tracking-widest text-gray-400 font-bold">Swipe to view more</div>
          <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-none">
            {displayedImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-26 rounded border overflow-hidden bg-gray-100 flex-shrink-0 transition ${
                  activeImage === idx ? 'border-black border-2 shadow-sm' : 'border-brand-border'
                }`}
              >
                <img src={img} alt="preview thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="fixed left-0 right-0 bottom-16 z-[65] md:hidden bg-white border-t border-gray-200 shadow-[0_-10px_28px_rgba(15,23,42,0.12)] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-black truncate">{product.name}</p>
                <p className="text-xs font-bold text-gray-500">₹{discountedPrice.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</p>
              </div>
              <button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="bg-main disabled:bg-gray-300 text-white rounded-full px-5 py-3 text-[11px] font-black uppercase tracking-wider flex items-center gap-2"
              >
                <ShoppingBag size={15} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS BLOCK */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-gray-400">
              {product.collectionName} Collection
            </span>
            <h1 className="font-Poppins font-black text-2xl sm:text-3xl text-black dark:text-white uppercase tracking-wide mt-1">
              {product.name}
            </h1>
            
            {/* Stars average */}
            <div className="flex items-center gap-1.5 mt-2 text-sm text-amber-500 font-semibold">
              <Star size={16} fill="currentColor" />
              <span>{product.rating.toFixed(1)} / 5.0</span>
              <span className="text-gray-400 font-normal ml-2">({reviews.length} customer reviews)</span>
            </div>
          </div>

          {/* Price Layout */}
          <div className="flex items-baseline gap-3 border-y border-brand-border dark:border-zinc-800 py-3">
            <span className="text-2xl font-bold text-black dark:text-red-400">
              ₹{discountedPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs uppercase font-extrabold tracking-wider text-green-600 bg-green-50 dark:bg-green-950 px-2.5 py-1 rounded">
                  Save {product.discount}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          {/* Size picker */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">Select Size</h5>
              <button 
                type="button" 
                onClick={() => setShowSizeChart(true)}
                className="text-[10px] text-main hover:text-brand-burgundy font-black uppercase tracking-wider underline cursor-pointer"
              >
                Size Chart
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 text-xs border rounded font-semibold transition ${
                    selectedSize === s
                      ? 'bg-main border-main text-white'
                      : 'border-brand-border text-brand-dark dark:text-gray-300 dark:border-zinc-700 hover:border-main'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Selection */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">Select Color</h5>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-4 py-2 text-xs border rounded-full font-semibold transition ${
                    selectedColor.toLowerCase() === c.toLowerCase()
                      ? 'bg-black border-black text-white'
                      : 'border-brand-border text-brand-dark dark:text-gray-300 dark:border-zinc-700 hover:border-black'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector and stock warning */}
          <div className="space-y-2.5">
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-gray-400">Quantity</h5>
            <div className="flex items-center gap-4">
              <div className="flex border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden">
                <button className="px-3 py-1.5 text-lg" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span className="px-4 py-1.5 text-sm flex items-center font-bold">{qty}</span>
                <button className="px-3 py-1.5 text-lg" onClick={() => setQty(Math.min(product.stock, qty + 1))}>+</button>
              </div>

              {/* Stock notifications */}
              <span className="text-xs font-bold uppercase tracking-wider">
                {product.stock === 0 ? (
                  <span className="text-red-500">Out of Stock</span>
                ) : product.stock <= 5 ? (
                  <span className="text-amber-500">Hurry, only {product.stock} items left!</span>
                ) : (
                  <span className="text-green-600">In Stock</span>
                )}
              </span>
            </div>
          </div>

          {/* Add to bag / Buy Now / Wishlist buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              className="flex-grow border-2 border-main hover:bg-main hover:text-white text-main font-black py-3 px-6 rounded-full text-xs uppercase tracking-wider transition flex justify-center items-center gap-2"
            >
              <ShoppingBag size={16} /> Add To Bag
            </button>
            <button
              disabled={product.stock === 0}
              onClick={handleBuyNow}
              className="flex-grow bg-main hover:bg-brand-burgundy text-white font-black py-3 px-6 rounded-full text-xs uppercase tracking-wider transition flex justify-center items-center gap-2 shadow-sm"
            >
              Buy Now
            </button>
            <button
              onClick={() => {
                if (!user) {
                  setPendingAuthAction('wishlist');
                  setShowLoginPrompt(true);
                } else {
                  toggleWishlist(product);
                }
              }}
              className={`p-3.5 border rounded-full transition self-center sm:self-auto ${
                isWishlisted
                  ? 'bg-red-50 border-red-500 text-red-500 dark:bg-red-950'
                  : 'border-brand-border text-brand-dark dark:text-gray-300 dark:border-zinc-700 hover:border-main'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Nykaa Shipping & Returns Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-200 py-6 my-6">
            <div 
              onClick={() => setShowCodModal(true)}
              className="space-y-2 text-center flex flex-col items-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#fceef2] flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-lg text-black">₹</span>
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xs font-bold text-neutral-900 leading-tight uppercase tracking-wider">
                  {product.codAvailable !== false ? 'COD available' : 'Prepaid Only'}
                </p>
                <span className="text-[11px] text-pink-600 font-black uppercase tracking-wider hover:underline cursor-pointer">
                  Know More
                </span>
              </div>
            </div>

            <div 
              onClick={() => setShowReturnModal(true)}
              className="space-y-2 text-center flex flex-col items-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#fceef2] flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                <RefreshCw size={18} className="text-black" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xs font-bold text-neutral-900 leading-tight uppercase tracking-wider">
                  {product.returnAvailable !== false ? '7-day return & exchange' : 'No Returns'}
                </p>
                <span className="text-[11px] text-pink-600 font-black uppercase tracking-wider hover:underline cursor-pointer">
                  Know More
                </span>
              </div>
            </div>

            <div 
              onClick={() => setShowDeliveryModal(true)}
              className="space-y-2 text-center flex flex-col items-center cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-[#fceef2] flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                <Truck size={18} className="text-black" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-xs font-bold text-neutral-900 leading-tight uppercase tracking-wider">
                  {product.freeDelivery !== false ? 'Delivery' : 'Standard Delivery'}
                  <span className="block text-[10px] text-gray-500 font-semibold tracking-normal mt-0.5 normal-case">by {getEstimatedDeliveryDate()}</span>
                </p>
                <span className="text-[11px] text-pink-600 font-black uppercase tracking-wider hover:underline cursor-pointer">
                  Know More
                </span>
              </div>
            </div>
          </div>

          {/* Select Delivery Location & Pincode Checker */}
          <div id="pincode-section" className="bg-brand-light dark:bg-zinc-900/50 p-5 rounded-2xl border border-brand-border space-y-3 my-6 transition-all duration-300">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-main" />
              <h5 className="font-extrabold text-xs uppercase tracking-wider text-black dark:text-white">
                Select Delivery Location
              </h5>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              Enter the pincode of your area to check product availability and delivery options
            </p>
            
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  id="pincode-input"
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPincode(val);
                    if (pincodeStatus) setPincodeStatus(null);
                  }}
                  placeholder="Enter Pincode"
                  className="w-full bg-white dark:bg-zinc-800 border border-brand-border dark:border-zinc-700 px-4 py-2.5 rounded-full text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-main focus:border-main tracking-wider"
                />
                {pincodeStatus && pincodeStatus.type === 'success' && (
                  <CheckCircle size={14} className="text-green-500 absolute right-4 top-1/2 -translate-y-1/2" />
                )}
              </div>
              <button
                type="submit"
                className="bg-main hover:bg-neutral-900 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-102 cursor-pointer"
              >
                Check
              </button>
            </form>

            {pincodeStatus && (
              <div className={`text-xs font-bold px-3 py-2 rounded-lg flex items-start gap-1.5 ${
                pincodeStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {pincodeStatus.icon}
                <span className="leading-relaxed">{pincodeStatus.message}</span>
              </div>
            )}

            <div className="pt-1.5 border-t border-brand-border/60 text-[11px] text-slate-600 font-bold flex items-center gap-1.5 leading-relaxed">
              <span>🚀 Orders within Delhi NCR are delivered in just 1–2 working days!</span>
            </div>
          </div>

          {/* Nykaa Style Product Information Accordions */}
          <div className="space-y-2 border-t border-gray-200 pt-6">
            <h3 className="font-Poppins font-black text-sm uppercase text-black tracking-wide mb-4">Product Information</h3>

            {/* Accordion 1: Product details */}
            <div id="accordion-details" className="border-b border-gray-200 pb-3">
              <button
                type="button"
                onClick={() => toggleAccordion('details')}
                className="w-full flex justify-between items-center py-2 text-left font-black text-xs uppercase text-black"
              >
                <span>Product details</span>
                <span className="text-lg">{openAccordions.details ? '−' : '+'}</span>
              </button>
              {openAccordions.details && (
                <div className="pl-1 pt-2 pb-1 space-y-2 text-xs text-gray-600 font-normal">
                  <p><span className="font-bold text-black uppercase">Care Instructions:</span> {product.careInstructions || 'Dry clean or gentle hand wash'}</p>
                  <p><span className="font-bold text-black uppercase">Pack Contains:</span> {product.packContains || '1 Product'}</p>
                </div>
              )}
            </div>

            {/* Accordion: Specifications */}
            {(product.fabric || product.fashionTrends || product.fit || product.length || product.multipackSet || product.neck || product.occasion || product.pattern || product.printPatternType || product.sleeveLength || product.sleeveStyling || product.washCare) && (
              <div className="border-b border-gray-200 pb-3">
                <button
                  type="button"
                  onClick={() => toggleAccordion('specifications')}
                  className="w-full flex justify-between items-center py-2 text-left font-black text-xs uppercase text-black"
                >
                  <span>Specifications</span>
                  <span className="text-lg">{openAccordions.specifications ? '−' : '+'}</span>
                </button>
                {openAccordions.specifications && (
                  <div className="pl-1 pt-3 pb-2 grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
                    {product.fabric && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fabrics</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.fabric}</p>
                      </div>
                    )}
                    {product.fashionTrends && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fashion Trends</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.fashionTrends}</p>
                      </div>
                    )}
                    {product.fit && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fit</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.fit}</p>
                      </div>
                    )}
                    {product.length && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Length</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.length}</p>
                      </div>
                    )}
                    {product.multipackSet && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Multipack Set</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.multipackSet}</p>
                      </div>
                    )}
                    {product.neck && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Neck</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.neck}</p>
                      </div>
                    )}
                    {product.occasion && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Occasions</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.occasion}</p>
                      </div>
                    )}
                    {product.pattern && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Patterns</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.pattern}</p>
                      </div>
                    )}
                    {product.printPatternType && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Print or Pattern Types</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.printPatternType}</p>
                      </div>
                    )}
                    {product.sleeveLength && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sleeve Length</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.sleeveLength}</p>
                      </div>
                    )}
                    {product.sleeveStyling && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sleeve Styling</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.sleeveStyling}</p>
                      </div>
                    )}
                    {product.washCare && (
                      <div className="border-b border-gray-100 pb-2">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Wash Care</p>
                        <p className="text-sm font-normal text-black mt-0.5">{product.washCare}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Accordion 2: Know your product */}
            <div className="border-b border-gray-200 pb-3">
              <button
                type="button"
                onClick={() => toggleAccordion('know')}
                className="w-full flex justify-between items-center py-2 text-left font-black text-xs uppercase text-black"
              >
                <span>Know your product</span>
                <span className="text-lg">{openAccordions.know ? '−' : '+'}</span>
              </button>
              {openAccordions.know && (
                <div className="pl-1 pt-2 pb-1 text-xs text-gray-600 leading-relaxed font-normal">
                  <p>{product.description}</p>
                </div>
              )}
            </div>

            {/* Accordion 3: Vendor details */}
            <div className="border-b border-gray-200 pb-3">
              <button
                type="button"
                onClick={() => toggleAccordion('vendor')}
                className="w-full flex justify-between items-center py-2 text-left font-black text-xs uppercase text-black"
              >
                <span>Vendor details</span>
                <span className="text-lg">{openAccordions.vendor ? '−' : '+'}</span>
              </button>
              {openAccordions.vendor && (
                <div className="pl-1 pt-2 pb-1 space-y-2 text-xs text-gray-600 font-normal">
                  <p><span className="font-bold text-black uppercase">Manufacturer Details:</span> {product.manufacturerDetails || 'Celina Clothing Pvt Ltd'}</p>
                  <p><span className="font-bold text-black uppercase">Country of Origin:</span> {product.countryOfOrigin || 'India'}</p>
                </div>
              )}
            </div>

            {/* Accordion 4: Return and exchange policy */}
            <div id="accordion-policy" className="border-b border-gray-200 pb-3">
              <button
                type="button"
                onClick={() => toggleAccordion('policy')}
                className="w-full flex justify-between items-center py-2 text-left font-black text-xs uppercase text-black"
              >
                <span>Return and exchange policy</span>
                <span className="text-lg">{openAccordions.policy ? '−' : '+'}</span>
              </button>
              {openAccordions.policy && (
                <div className="pl-1 pt-2 pb-1 text-xs text-gray-600 font-normal">
                  <p>Easy 7-day return and size exchange. Products must be unused, unwashed, and returned with original tags intact.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* REVIEWS & QA BLOCK */}
      <section className="mt-16 border-t border-brand-border dark:border-zinc-800 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Reviews list (left 2 cols) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* RATINGS HEADER */}
            <div className="space-y-6">
              <h3 className="font-Poppins font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1">
                RATINGS <span className="text-gray-400 font-light">☆</span>
              </h3>
              
              {/* Ratings Breakdown Block */}
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                <div className="text-center sm:text-left flex-shrink-0 min-w-[120px]">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-6xl font-sans font-normal text-slate-850 dark:text-white leading-none">
                      {reviews.length > 0
                        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1).replace('.0', '')
                        : '0'}
                    </span>
                    <span className="text-3xl text-[#14958F] font-sans">★</span>
                  </div>
                  <p className="text-xs text-gray-500 font-semibold mt-3">
                    {reviews.length} Verified Buyers
                  </p>
                </div>

                {/* Vertical divider */}
                <div className="hidden sm:block w-px h-24 bg-gray-200 dark:bg-zinc-800" />

                {/* Bar breakdown */}
                <div className="flex-1 w-full space-y-1.5 max-w-sm">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const starCount = reviews.filter((r) => r.rating === star).length;
                    const percentage = reviews.length > 0 ? (starCount / reviews.length) * 100 : 0;
                    
                    let barColor = 'bg-[#14958F]';
                    if (star === 3) barColor = 'bg-[#fbc11d]';
                    if (star === 2) barColor = 'bg-[#fbc11d]';
                    if (star === 1) barColor = 'bg-[#ff5a5a]';

                    return (
                      <div key={star} className="flex items-center gap-3 text-xs text-slate-500 dark:text-gray-400 font-normal">
                        <span className="w-5 flex items-center justify-end gap-0.5 text-[11px]">
                          {star} <span className="text-[10px] text-slate-400 font-light">★</span>
                        </span>
                        <div className="flex-grow h-1 bg-[#f5f5f6] dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${barColor} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-left text-slate-700 dark:text-gray-400 font-normal text-[11px]">{starCount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <hr className="border-gray-150 dark:border-zinc-850" />

            {/* Customer Photos Gallery */}
            {customerPhotos.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wide">
                  Customer Photos ({customerPhotos.length})
                </h4>
                <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-none">
                  {customerPhotos.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setLightboxImages(customerPhotos.map(photo => photo.url));
                        setLightboxIndex(idx);
                      }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden border border-brand-border dark:border-zinc-800 bg-white dark:bg-zinc-800 flex-shrink-0 cursor-pointer hover:opacity-90 hover:shadow-xs transition duration-200"
                    >
                      <img src={img.url} alt="customer upload" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Reviews Section */}
            <div className="space-y-6">
              <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wide">
                Customer Reviews ({reviews.length})
              </h4>
              
              {reviews.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No reviews yet for this product. Be the first to leave a review!</p>
              ) : (
                <div className="space-y-6 divide-y divide-gray-100 dark:divide-zinc-850">
                  {reviews.map((r, i) => {
                    const isOwnReview = user && (r.user === user._id || (r.user && r.user._id === user._id));
                    const formattedDate = (() => {
                      const d = new Date(r.createdAt);
                      const day = d.getDate();
                      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                      return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
                    })();

                    return (
                      <div key={i} className={`${i > 0 ? 'pt-6' : ''} space-y-4`}>
                        <div className="flex items-start gap-2.5">
                          {/* Rating badge */}
                          <div className="bg-[#14958F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0 mt-0.5">
                            <span>{r.rating}</span>
                            <span className="text-[8px]">★</span>
                          </div>
                          
                          {/* Review comment */}
                          <div className="flex-grow space-y-3">
                            <p className="text-[13px] text-slate-850 dark:text-slate-200 font-normal leading-relaxed">
                              {r.comment}
                            </p>

                            {/* Inline images */}
                            {r.images && r.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {r.images.map((img, idx) => (
                                  <div
                                    key={idx}
                                    onClick={() => {
                                      setLightboxImages(r.images.map(photo => photo.url));
                                      setLightboxIndex(idx);
                                    }}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden border border-brand-border dark:border-zinc-800 bg-white dark:bg-zinc-850 cursor-pointer hover:opacity-90 transition"
                                  >
                                    <img src={img.url} alt={`Review ${idx + 1}`} className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Footer: User, Date & Likes */}
                            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-550 pt-1">
                              <div>
                                <span className="font-medium text-slate-500 dark:text-zinc-400">{r.name}</span>
                                <span className="mx-2 text-slate-300 dark:text-zinc-700">|</span>
                                <span>{formattedDate}</span>
                                {isOwnReview && (
                                  <>
                                    <span className="mx-2 text-slate-300 dark:text-zinc-700">|</span>
                                    <button
                                      onClick={() => handleDeleteReview(r._id)}
                                      className="text-red-500 hover:text-red-750 font-bold hover:underline cursor-pointer transition"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-slate-400">
                                <button className="flex items-center gap-1 hover:text-slate-600 transition" aria-label="Like review">
                                  <ThumbsUp size={12} />
                                  <span className="text-[10px]">0</span>
                                </button>
                                <button className="flex items-center gap-1 hover:text-slate-600 transition" aria-label="Dislike review">
                                  <ThumbsDown size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Add review form (right 1 col) */}
          <div className="bg-brand-light dark:bg-zinc-800 p-6 rounded-lg border border-brand-border dark:border-zinc-700 h-fit space-y-4">
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-brand-burgundy dark:text-white">
              Write a Review
            </h4>

            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {reviewError && <p className="text-xs text-red-500 font-bold">{reviewError}</p>}
                {reviewSuccess && <p className="text-xs text-green-600 font-bold">{reviewSuccess}</p>}

                {/* Star selectors */}
                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">Rating</label>
                  <div className="flex gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRatingInput(star)}
                        className="hover:scale-110 transition"
                      >
                        <Star size={20} fill={star <= ratingInput ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase font-bold text-gray-500">Comment</label>
                  <textarea
                    rows="4"
                    required
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Describe your experience with the fit, color, and fabric..."
                    className="w-full text-sm p-3 border border-gray-300 dark:border-gray-600 dark:bg-zinc-700 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                  />
                </div>

                {/* Photo Upload and Previews */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase font-bold text-gray-500">Add Photos (Max 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="review-image-upload"
                  />
                  <label
                    htmlFor="review-image-upload"
                    className="inline-flex items-center gap-1.5 cursor-pointer bg-white dark:bg-zinc-750 hover:bg-gray-50 dark:hover:bg-zinc-650 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-xs font-bold text-gray-650 dark:text-gray-250 transition"
                  >
                    <Camera size={14} /> Choose Photos
                  </label>

                  {reviewImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {reviewImages.map((file, idx) => (
                        <div key={idx} className="relative w-14 h-14 border border-gray-200 dark:border-zinc-700 rounded overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-0.5 right-0.5 bg-red-650 text-white rounded-full p-0.5 hover:bg-red-750 transition"
                            aria-label="Remove image"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full bg-brand-burgundy text-white hover:opacity-90 disabled:bg-gray-400 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-gray-500">Please log in to submit a review.</p>
                <Link to="/login" className="inline-block bg-brand-burgundy text-white text-[10px] font-bold uppercase tracking-wider px-6 py-2 rounded-full">
                  Login
                </Link>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* FREQUENTLY BOUGHT TOGETHER */}
      {frequentlyBought.length > 0 && (
        <section className="mt-16 border-t border-brand-border pt-10">
          <h3 className="font-Poppins font-black text-sm uppercase text-black tracking-wider mb-6">
            Frequently Bought Together
          </h3>
          <div className="bg-brand-light/30 border border-brand-border p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              {/* Item 1: Main Product */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-20 rounded overflow-hidden border border-brand-border bg-white flex-shrink-0">
                  <img src={displayedImages[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black max-w-[120px] truncate">{product.name}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">₹{discountedPrice.toLocaleString()}</p>
                </div>
              </div>

              <span className="text-gray-400 font-bold text-lg">+</span>

              {/* Item 2: Frequently item 1 */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-20 rounded overflow-hidden border border-brand-border bg-white flex-shrink-0">
                  <img src={frequentlyBought[0].images?.[0]?.url || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-black max-w-[120px] truncate">{frequentlyBought[0].name}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">₹{frequentlyBought[0].price.toLocaleString()}</p>
                </div>
              </div>

              {frequentlyBought[1] && (
                <>
                  <span className="text-gray-400 font-bold text-lg">+</span>
                  {/* Item 3: Frequently item 2 */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-20 rounded overflow-hidden border border-brand-border bg-white flex-shrink-0">
                      <img src={frequentlyBought[1].images?.[0]?.url || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-black max-w-[120px] truncate">{frequentlyBought[1].name}</h4>
                      <p className="text-[10px] text-gray-500 font-semibold mt-0.5">₹{frequentlyBought[1].price.toLocaleString()}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="text-center md:text-right space-y-2">
              <p className="text-xs text-gray-500 font-semibold">
                Total Price: <span className="text-lg font-bold text-black">
                  ₹{(discountedPrice + frequentlyBought.reduce((acc, curr) => acc + curr.price, 0)).toLocaleString()}
                </span>
              </p>
              <button
                onClick={() => {
                  addToCart(product, selectedSize, selectedColor, 1);
                  frequentlyBought.forEach(fb => addToCart(fb, fb.sizes?.[0] || 'M', fb.colors?.[0] || 'Blue', 1));
                  alert("All items added to cart!");
                }}
                className="bg-main hover:bg-brand-burgundy text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-full shadow-sm"
              >
                Add All Three To Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-brand-border pt-10">
          <h3 className="font-Poppins font-black text-sm uppercase text-black tracking-wider mb-6">
            Related Products
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* SIZE CHART MODAL */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowSizeChart(false)}>
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl border border-brand-border relative" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowSizeChart(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-2">
              Women's Ethnic Size Guide
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-brand-light border-b border-brand-border text-gray-500 font-bold uppercase">
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Bust (in)</th>
                    <th className="p-2.5">Waist (in)</th>
                    <th className="p-2.5">Hips (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border font-medium text-black">
                  <tr><td className="p-2.5 font-bold text-main">XS</td><td className="p-2.5">32</td><td className="p-2.5">26</td><td className="p-2.5">35</td></tr>
                  <tr><td className="p-2.5 font-bold text-main">S</td><td className="p-2.5">34</td><td className="p-2.5">28</td><td className="p-2.5">37</td></tr>
                  <tr><td className="p-2.5 font-bold text-main">M</td><td className="p-2.5">36</td><td className="p-2.5">30</td><td className="p-2.5">39</td></tr>
                  <tr><td className="p-2.5 font-bold text-main">L</td><td className="p-2.5">38</td><td className="p-2.5">32</td><td className="p-2.5">41</td></tr>
                  <tr><td className="p-2.5 font-bold text-main">XL</td><td className="p-2.5">40</td><td className="p-2.5">34</td><td className="p-2.5">43</td></tr>
                  <tr><td className="p-2.5 font-bold text-main">XXL</td><td className="p-2.5">42</td><td className="p-2.5">36</td><td className="p-2.5">45</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-gray-500 italic mt-2">Note: Measurements are body dimensions. Kurtis are styled with relaxed adjustments for straight/flared cuts.</p>
          </div>
        </div>
      )}

      <StickyAddToCart 
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        qty={qty}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cash On Delivery Details Half-Window Modal / Drawer */}
      {showCodModal && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setShowCodModal(false)} />
          
          {/* Drawer Panel container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-t-[32px] p-6 pb-8 shadow-2xl border-t border-brand-border dark:border-zinc-800 transform translate-y-full animate-slideUp z-10 text-neutral-900 dark:text-white">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
              <h4 className="font-display font-black text-xl text-[#0F172A] dark:text-white">
                Cash On Delivery Details
              </h4>
              <button 
                onClick={() => setShowCodModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <span className="font-sans text-xl text-gray-400 hover:text-black dark:hover:text-white font-semibold">✕</span>
              </button>
            </div>

            {/* Content body */}
            <div className="py-6 flex items-start gap-4">
              {/* Icon container */}
              <div className="relative shrink-0 w-12 h-12 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-zinc-900 shadow-sm">
                <ShoppingBag size={20} className="text-slate-700 dark:text-slate-300" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#F43F5E] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  ₹
                </span>
              </div>

              {/* Text Information */}
              <div className="space-y-1.5">
                <h5 className="text-[11px] font-black tracking-wider uppercase text-slate-800 dark:text-slate-300 font-sans">
                  Terms and Conditions
                </h5>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-normal">
                  Cash on delivery is available for orders between <span className="font-extrabold text-black dark:text-white">₹500</span> to <span className="font-extrabold text-black dark:text-white">₹5,000</span>. However, cash on delivery will not be available if there are one or more <span className="font-extrabold text-black dark:text-white">"Made to Order"</span> products in the order.
                </p>
              </div>
            </div>
            
            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={() => setShowCodModal(false)}
                className="w-full bg-[#0F172A] dark:bg-zinc-800 text-white hover:bg-neutral-800 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                Okay, Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return & Exchange Details Half-Window Modal / Drawer */}
      {showReturnModal && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setShowReturnModal(false)} />
          
          {/* Drawer Panel container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-t-[32px] p-6 pb-8 shadow-2xl border-t border-brand-border dark:border-zinc-800 transform translate-y-full animate-slideUp z-10 text-neutral-900 dark:text-white">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
              <h4 className="font-display font-black text-xl text-[#0F172A] dark:text-white">
                Return & Exchange Details
              </h4>
              <button 
                onClick={() => setShowReturnModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <span className="font-sans text-xl text-gray-400 hover:text-black dark:hover:text-white font-semibold">✕</span>
              </button>
            </div>

            {/* Content body */}
            <div className="py-6 flex items-start gap-4 max-h-[60vh] overflow-y-auto">
              {/* Icon container */}
              <div className="relative shrink-0 w-12 h-12 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-zinc-900 shadow-sm">
                <ShoppingBag size={20} className="text-slate-700 dark:text-slate-300" />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#F43F5E] text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                  ⇄
                </span>
              </div>

              {/* Text Information */}
              <div className="space-y-3 flex-grow">
                <h5 className="text-[11px] font-black tracking-wider uppercase text-slate-800 dark:text-slate-300 font-sans">
                  Terms and Conditions
                </h5>
                <ol className="list-decimal pl-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-normal leading-relaxed">
                  <li>
                    Once your order is delivered, you can raise a return or exchange (whichever is applicable) from My orders section on app or website. Delivery executive will pick up your item within 7 working days.
                  </li>
                  <li>
                    In case of return, refund will be initiated to your source (or bank account in case of cash on delivery) within 5-7 working days after the item is picked up.
                  </li>
                  <li>
                    In case of exchange, the replacement item will be shipped to your original address with no extra cost.
                  </li>
                </ol>
                <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans font-normal border-t border-gray-100 dark:border-zinc-800 pt-3">
                  If you have any more questions, you can always reach out to us at{' '}
                  <a href="mailto:support@celina.com" className="text-pink-600 underline font-bold hover:text-pink-700">
                    support@celina.com
                  </a>
                </div>
              </div>
            </div>
            
            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={() => setShowReturnModal(false)}
                className="w-full bg-[#0F172A] dark:bg-zinc-800 text-white hover:bg-neutral-800 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                Okay, Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Details Half-Window Modal / Drawer */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={() => setShowDeliveryModal(false)} />
          
          {/* Drawer Panel container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-t-[32px] p-6 pb-8 shadow-2xl border-t border-brand-border dark:border-zinc-800 transform translate-y-full animate-slideUp z-10 text-neutral-900 dark:text-white">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-zinc-800">
              <h4 className="font-display font-black text-xl text-[#0F172A] dark:text-white">
                Delivery Details
              </h4>
              <button 
                onClick={() => setShowDeliveryModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <span className="font-sans text-xl text-gray-400 hover:text-black dark:hover:text-white font-semibold">✕</span>
              </button>
            </div>

            {/* Content body */}
            <div className="py-6 space-y-5 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* 1. DELIVERY */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-zinc-900 shadow-sm text-slate-700 dark:text-slate-300">
                  <Truck size={18} />
                </div>
                <div className="space-y-1">
                  <h5 className="text-[11px] font-black tracking-wider uppercase text-slate-800 dark:text-slate-300 font-sans">
                    Delivery
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-normal">
                    With Celina, you can be assured that the item you purchase is genuine & will reach you within the estimated delivery date.
                  </p>
                </div>
              </div>

              {/* 2. EXPRESS DELIVERY */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-zinc-900 shadow-sm text-slate-700 dark:text-slate-300">
                  <Truck size={18} className="text-amber-500" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-[11px] font-black tracking-wider uppercase text-slate-800 dark:text-slate-300 font-sans">
                    Express Delivery
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-normal">
                    There are products with shorter delivery time, look out for products with <span className="font-bold text-black dark:text-white">"Express delivery"</span> tag & get faster delivery.
                  </p>
                </div>
              </div>

              {/* 3. SHIPPING */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 border border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-zinc-900 shadow-sm text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-xs text-rose-500">⚡</span>
                </div>
                <div className="space-y-2">
                  <h5 className="text-[11px] font-black tracking-wider uppercase text-slate-800 dark:text-slate-300 font-sans">
                    Shipping
                  </h5>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-normal space-y-2">
                    <p>We charge Convenience Fee, which comprises -</p>
                    <p>
                      <span className="font-bold text-black dark:text-white">(a) Platform Fee</span><br />
                      Flat platform charges of ₹29, applicable to all customers (including Prive Users) for platform upkeep, onboarding the most stylish brands on the platform and seamless customer experience.
                    </p>
                    <p>
                      <span className="font-bold text-black dark:text-white">(b) Packaging & Delivery Fee</span><br />
                      ₹70 for order value upto ₹499, ₹20 for order value above ₹500 upto ₹999, free delivery for all the orders above ₹1000 and above ₹149 for Prive Platinum Users.
                    </p>
                    <p>
                      <span className="font-bold text-black dark:text-white">(c) Additional Fee</span><br />
                      Chargeable to the customers with higher return records, to ensure hassle-free return experience, additional cost of logistics and customer support engagement. This additional fee can be chargeable 'nil' upon reduction in returns per order.
                    </p>
                    <p className="font-bold text-black dark:text-white mt-1">
                      Note - Shipping charges are calculated basis subtotal amount on cart.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. CANCELLATION POLICY */}
              <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                <h5 className="text-[11px] font-black tracking-wider uppercase text-slate-800 dark:text-slate-300 font-sans">
                  Cancellation Policy
                </h5>
                <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-normal space-y-2">
                  <p>
                    After placing an order, you can directly cancel it through the <span className="font-bold text-black dark:text-white">"My order"</span> section before the item(s) that you want to cancel are shipped. If your order is a <span className="font-bold text-black dark:text-white">'Made-to-Order'</span> piece, you can cancel within 24 hrs of placing by writing to customer care at <a href="mailto:support@celina.com" className="text-pink-600 underline">support@celina.com</a>.
                  </p>
                  <p className="font-bold text-black dark:text-white">
                    Note - Post cancellation, the money will be refunded to you within 5 business days after the cancellation request.
                  </p>
                </div>
              </div>

              {/* Support Contact Footer */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 text-xs text-slate-500 dark:text-slate-400 font-sans font-normal leading-relaxed">
                If you have any more questions, you can always reach out to us at{' '}
                <a href="mailto:support@celina.com" className="text-pink-600 underline font-bold hover:text-pink-700">
                  support@celina.com
                </a>
              </div>

            </div>
            
            {/* Action button */}
            <div className="pt-2">
              <button
                onClick={() => setShowDeliveryModal(false)}
                className="w-full bg-[#0F172A] dark:bg-zinc-800 text-white hover:bg-neutral-800 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                Okay, Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Photo Lightbox Modal */}
      {lightboxImages.length > 0 && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 p-4 animate-fadeIn">
          {/* Close button */}
          <button
            onClick={() => setLightboxImages([])}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2.5 rounded-full bg-black/50 transition cursor-pointer z-10"
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          {/* Navigation controls */}
          {lightboxImages.length > 1 && (
            <>
              <button
                onClick={() => setLightboxIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/35 hover:bg-black/60 p-2.5 rounded-full transition cursor-pointer z-10"
                aria-label="Previous photo"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={() => setLightboxIndex(prev => (prev + 1) % lightboxImages.length)}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/35 hover:bg-black/60 p-2.5 rounded-full transition cursor-pointer z-10"
                aria-label="Next photo"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Image & Index indicator */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center gap-3">
            <img
              src={lightboxImages[lightboxIndex]}
              alt={`Customer preview ${lightboxIndex + 1}`}
              className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl animate-zoomIn"
            />
            <span className="text-white/60 text-xs font-semibold tracking-wider select-none bg-black/30 px-3 py-1 rounded-full">
              {lightboxIndex + 1} / {lightboxImages.length}
            </span>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => {
          setShowLoginPrompt(false);
          setPendingAuthAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Animation style block for sliding drawer modals */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

    </div>
  );
};
export default ProductDetails;
