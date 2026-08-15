import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Search, User, Sun, Moon, LogOut, X, Trash2, ShoppingCart, Tag, MapPin, CreditCard, Phone, Settings, ChevronRight, Shield } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import ThemeContext from '../context/ThemeContext';
import SettingsContext from '../context/SettingsContext';
import axios from 'axios';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { cartItems, wishlistItems, removeFromCart, updateQty, applyCoupon, couponCode, prices } = useContext(CartContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { settings, getImageUrl } = useContext(SettingsContext);

  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Search states & refs
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchContainerRef = React.useRef(null);
  const searchInputRef = React.useRef(null);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Save new search query to recent searches
  const addRecentSearch = (query) => {
    if (!query || !query.trim()) return;
    const clean = query.trim();
    const updated = [clean, ...recentSearches.filter(s => s !== clean)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (!searchOpen) return;
    if (e.key === 'Escape') {
      setSearchOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < searchResults.length) {
        e.preventDefault();
        const selected = searchResults[activeSuggestionIndex];
        setSearchOpen(false);
        addRecentSearch(searchQuery);
        navigate(`/product/${selected._id}`);
      }
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchOpen && searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [searchOpen]);

  // Autofocus input when search popup opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Sticky scroll navbar state
  const [isScrolled, setIsScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > prevScrollY && currentScrollY > 80) {
        setVisible(false); // scrolling down
      } else {
        setVisible(true); // scrolling up
      }
      setIsScrolled(currentScrollY > 0);
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  // Search autocomplete lookup
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const { data } = await axios.get(`/api/products?search=${searchQuery}`);
          setSearchResults(data.products || []);
        } catch (e) {
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
      setSearchOpen(false);
      navigate(`/shop?search=${searchQuery}`);
    }
  };

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const handleApplyCouponSubmit = async (e) => {
    e.preventDefault();
    const result = await applyCoupon(couponInput);
    alert(result.message);
    setCouponInput('');
  };

  const handleGoKwikCheckout = () => {
    setCartOpen(false);
    alert(`[GoKwik Checkout Simulator]\n\nItems count: ${cartItems.length}\nTotal Amount: ₹${prices.totalPrice.toLocaleString('en-IN')}\n\nFast checkout loaded successfully! COD / GPay / PhonePe / Card available.`);
  };

  // Nav menus balancing logic
  const menus = settings?.navigationMenu || [
    { title: 'Best Sellers', path: '/home#best-sellers', isActive: true, order: 0 },
    { title: 'Kurtis', path: '/shop?category=Kurtis', isActive: true, order: 1 },
    { title: 'Coord Sets', path: '/shop?category=Coord Sets', isActive: true, order: 2 },
    { title: 'Bottom Wear', path: '/shop?category=Bottom Wear', isActive: true, order: 3 }
  ];
  const activeMenus = menus.filter(m => m.isActive && m.title.toUpperCase() !== 'DUPATTAS').sort((a, b) => (a.order || 0) - (b.order || 0));
  const parsedMenus = activeMenus.map(m => {
    if (m.title.toUpperCase() === 'SHOP ALL' || m.title.toUpperCase() === 'CATALOGUE') {
      return { ...m, title: 'Best Sellers', path: '/home#best-sellers' };
    }
    return m;
  });
  const midIndex = Math.ceil(parsedMenus.length / 2);
  const leftMenus = parsedMenus.slice(0, midIndex);
  const rightMenus = parsedMenus.slice(midIndex);

  const promoLines = [
    settings?.announcementText ? settings.announcementText.toUpperCase() : 'FLASH FESTIVE EDIT: EXTRA 10% OFF WITH CODE CELINA10',
    'FREE EXPRESS SHIPPING ON ALL ORDERS ABOVE ₹1299',
    'PREMIUM HANDCRAFTED ETHNIC WEAR & LUXURY CO-ORD SETS',
    'EASY 7-DAY RETURNS & HASSLE-FREE EXCHANGES',
    'PREPAID ORDERS RECEIVE PRIORITY DISPATCH'
  ];

  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [promoFading, setPromoFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoFading(true);
      setTimeout(() => {
        setActivePromoIndex((prev) => (prev + 1) % promoLines.length);
        setPromoFading(false);
      }, 500); // 500ms fade out duration
    }, 5000); // Change sentence every 5 seconds

    return () => clearInterval(interval);
  }, [promoLines.length]);

  const renderMenuItem = (menu, mIdx) => {
    const isKurtis = menu.title.toUpperCase() === 'KURTIS';
    const isCoords = menu.title.toUpperCase() === 'COORD SETS';
    const isBestSellers = menu.title.toUpperCase() === 'BEST SELLERS';

    if (isBestSellers) {
      return (
        <li key={mIdx} className="list-none">
          <a
            href="/home#best-sellers"
            onClick={(e) => {
              e.preventDefault();
              const scrollToBestSellers = () => {
                const el = document.getElementById('best-sellers');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              };

              if (window.location.pathname !== '/home') {
                navigate('/home#best-sellers');
                setTimeout(scrollToBestSellers, 250);
                setTimeout(scrollToBestSellers, 600);
              } else {
                scrollToBestSellers();
              }
            }}
            className="hover:text-[#B08D57] hover:border-[#B08D57] border-b-2 border-transparent transition-all pb-1 font-bold text-white cursor-pointer whitespace-nowrap"
          >
            {menu.title}
          </a>
        </li>
      );
    }

    if (isKurtis) {
      return (
        <li key={mIdx} className="list-none group static">
          <Link to={menu.path} className="hover:text-[#B08D57] hover:border-[#B08D57] border-b-2 border-transparent transition-all pb-1 font-bold text-white whitespace-nowrap">
            {menu.title}
          </Link>
          {/* Mega Dropdown Panel */}
          <div className="absolute top-full left-0 right-0 w-full bg-white shadow-2xl border-t border-brand-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-350 z-[100] transform translate-y-2 group-hover:translate-y-0 text-black">
            <div className="container mx-auto px-6 py-10 grid grid-cols-5 gap-8 text-left">
              <div className="flex flex-col space-y-3">
                <h5 className="font-Poppins font-black uppercase text-xs tracking-widest text-black border-b border-brand-border pb-2">By Silhouette</h5>
                <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <li><Link to="/shop?category=Kurtis&pattern=Printed" className="hover:text-main transition-colors duration-200">Printed Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&pattern=Straight,Solid" className="hover:text-main transition-colors duration-200">Straight Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&pattern=A-Line" className="hover:text-main transition-colors duration-200">A-Line Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&pattern=Anarkali" className="hover:text-main transition-colors duration-200">Anarkali Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&sleeveLength=Short" className="hover:text-main transition-colors duration-200">Short & Sleeveless</Link></li>
                </ul>
              </div>
              <div className="flex flex-col space-y-3">
                <h5 className="font-Poppins font-black uppercase text-xs tracking-widest text-black border-b border-brand-border pb-2">By Category</h5>
                <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <li><Link to="/shop?category=Kurtis&search=Corset%20Back" className="hover:text-main transition-colors duration-200">Corset Back Kurti</Link></li>
                  <li><Link to="/shop?category=Kurtis&neck=Square%20Neck" className="hover:text-main transition-colors duration-200">Square Neck Kurti</Link></li>
                  <li><Link to="/shop?category=Kurtis&neck=Boat%20Neck" className="hover:text-main transition-colors duration-200">Boat Neck Kurti</Link></li>
                  <li><Link to="/shop?category=Kurtis&neck=Halter%20Neck" className="hover:text-main transition-colors duration-200">Halter Neck Kurti</Link></li>
                  <li><Link to="/shop?category=Kurtis&search=Short%20Sleeveless" className="hover:text-main transition-colors duration-200">Short Sleeveless Kurti</Link></li>
                  <li><Link to="/shop?category=Kurtis&search=Bell%20Sleeves" className="hover:text-main transition-colors duration-200">Bell Sleeves Kurti</Link></li>
                  <li><Link to="/shop?category=Kurtis&search=Straight%20Sleeves" className="hover:text-main transition-colors duration-200">Straight Sleeves Kurti</Link></li>
                  <li><Link to="/shop?category=Kurtis&sleeveLength=Sleeveless" className="hover:text-main transition-colors duration-200">Sleeveless Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&sleeveLength=Full%20Sleeves" className="hover:text-main transition-colors duration-200">Full Sleeve Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&pattern=Solid" className="hover:text-main transition-colors duration-200">Solid Essentials</Link></li>
                </ul>
              </div>
              <div className="flex flex-col space-y-3">
                <h5 className="font-Poppins font-black uppercase text-xs tracking-widest text-black border-b border-brand-border pb-2">By Occasion</h5>
                <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <li><Link to="/shop?category=Kurtis&occasion=Office Wear" className="hover:text-main transition-colors duration-200">Office Wear Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&occasion=Casual Wear" className="hover:text-main transition-colors duration-200">Casual Wear Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&occasion=Daily Wear" className="hover:text-main transition-colors duration-200">Daily Wear Kurtis</Link></li>
                  <li><Link to="/shop?category=Kurtis&occasion=Festive Wear" className="hover:text-main transition-colors duration-200">Festive & Ethnic Kurtas</Link></li>
                </ul>
              </div>
              <div className="flex flex-col space-y-3">
                <h5 className="font-Poppins font-black uppercase text-xs tracking-widest text-black border-b border-brand-border pb-2">By Fabric</h5>
                <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <li><Link to="/shop?category=Kurtis&fabric=100%25%20Pure%20Cotton" className="hover:text-main transition-colors duration-200">Pure Cotton</Link></li>
                  <li><Link to="/shop?category=Kurtis&fabric=Linen-Cotton" className="hover:text-main transition-colors duration-200">Linen-Cotton</Link></li>
                  <li><Link to="/shop?category=Kurtis&fabric=Indigo%20Cotton" className="hover:text-main transition-colors duration-200">Indigo Prints</Link></li>
                  <li><Link to="/shop?category=Kurtis&fabric=Premium%20Silk" className="hover:text-main transition-colors duration-200">Silk & Organza</Link></li>
                </ul>
              </div>
              <div className="bg-black p-8 rounded-lg text-white flex flex-col justify-between select-none relative overflow-hidden min-h-[220px]">
                <div className="space-y-2 z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-[#B08D57] text-black px-2.5 py-1 rounded-full">
                    BEST SELLING
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase leading-none tracking-tight text-white pt-2">
                    COTTON COMFORT
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    PREMIUM INDIAN TEXTURES
                  </p>
                </div>
                <Link to="/shop?category=Kurtis&fabric=100%25%20Pure%20Cotton" className="bg-[#B08D57] text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider w-fit hover:bg-white transition-colors z-10">
                  EXPLORE NOW
                </Link>
                <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
              </div>
            </div>
          </div>
        </li>
      );
    }

    if (isCoords) {
      return (
        <li key={mIdx} className="list-none group static">
          <Link to={menu.path} className="hover:text-[#B08D57] hover:border-[#B08D57] border-b-2 border-transparent transition-all pb-1 font-bold text-white whitespace-nowrap">
            {menu.title}
          </Link>
          {/* Mega Dropdown Panel */}
          <div className="absolute top-full left-0 right-0 w-full bg-white shadow-2xl border-t border-brand-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-350 z-[100] transform translate-y-2 group-hover:translate-y-0 text-black">
            <div className="container mx-auto px-6 py-10 grid grid-cols-4 gap-8 text-left">
              <div className="flex flex-col space-y-3">
                <h5 className="font-Poppins font-black uppercase text-xs tracking-widest text-black border-b border-brand-border pb-2">Ethnic Coords</h5>
                <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <li><Link to="/shop?category=Coord%20Sets&fabric=Linen-Cotton" className="hover:text-main transition-colors duration-200">Linen-Cotton Sets</Link></li>
                  <li><Link to="/shop?category=Coord%20Sets&fabric=100%25%20Pure%20Cotton" className="hover:text-main transition-colors duration-200">Pure Cotton Coordinates</Link></li>
                  <li><Link to="/shop?category=Coord%20Sets&occasion=Office Wear" className="hover:text-main transition-colors duration-200">Office Wear Sets</Link></li>
                </ul>
              </div>
              <div className="flex flex-col space-y-3">
                <h5 className="font-Poppins font-black uppercase text-xs tracking-widest text-black border-b border-brand-border pb-2">Kurta Sets</h5>
                <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <li><Link to="/shop?category=Coord%20Sets&fabric=Premium%20Cotton" className="hover:text-main transition-colors duration-200">Cotton Kurta Sets</Link></li>
                  <li><Link to="/shop?category=Coord%20Sets&occasion=Festive Wear" className="hover:text-main transition-colors duration-200">Festive Suit Sets</Link></li>
                </ul>
              </div>
              <div className="flex flex-col space-y-3">
                <h5 className="font-Poppins font-black uppercase text-xs tracking-widest text-black border-b border-brand-border pb-2">Bestsellers</h5>
                <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  <li><Link to="/shop?category=Coord%20Sets&bestSeller=true" className="hover:text-main transition-colors duration-200">Top Rated Coordinates</Link></li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-[#B08D57] p-8 rounded-lg text-black flex flex-col justify-between select-none relative overflow-hidden min-h-[220px]">
                <div className="space-y-2 z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-full">
                    SEASON MUST-HAVE
                  </span>
                  <h3 className="font-display font-black text-2xl uppercase leading-none tracking-tight text-black pt-2">
                    COORD DRESSING
                  </h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black/70">
                    PREMIUM ELEGANCE & COMFORT
                  </p>
                </div>
                <Link to="/shop?category=Coord%20Sets" className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider w-fit hover:bg-neutral-800 transition-colors z-10">
                  SHOP COLLECTION
                </Link>
                <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              </div>
            </div>
          </div>
        </li>
      );
    }

    return (
      <li key={mIdx} className="list-none">
        <Link to={menu.path} className="hover:text-[#B08D57] hover:border-[#B08D57] border-b-2 border-transparent transition-all pb-1 font-bold text-white whitespace-nowrap">
          {menu.title}
        </Link>
      </li>
    );
  };

  return (
    <>
      {/* FIXED CONTAINER FOR ANNOUNCEMENT BAR & HEADER */}
      <div className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        {/* 1. ANNOUNCEMENT BAR */}
        <aside className="bg-[#050C17] text-white py-1.5 sm:py-2 px-3 sm:px-6 overflow-hidden border-b border-white/5 flex items-center justify-center min-h-[34px]">
          <div className="w-full max-w-5xl text-center flex items-center justify-center font-['Montserrat',sans-serif]">
            <div className={`flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] md:text-xs font-semibold uppercase tracking-[0.06em] sm:tracking-[0.14em] text-[#B08D57] transition-all duration-500 ease-in-out ${promoFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <span className="text-[10px] sm:text-[11px] text-[#B08D57] shrink-0">✨</span>
              <span className="text-center leading-tight whitespace-normal break-words">
                {promoLines[activePromoIndex]}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[#B08D57] shrink-0">✨</span>
            </div>
          </div>
        </aside>

        {/* 2. STICKY HEADER — Premium Deep Navy Blue, centered logo */}
        <nav
          id="navbar"
          className={`relative font-Poppins transition-all duration-300 ${
            isScrolled ? 'shadow-2xl shadow-[#0B1A30]/40' : ''
          }`}
          style={{ backgroundColor: '#0B1A30' }}
        >
          {/* Desktop Centered Logo Layout: Links (Left), Logo (Center), Search & Actions (Right) */}
          <div className="w-full px-6 xl:px-12 2xl:px-16 hidden lg:grid grid-cols-3 items-center h-[80px] 2xl:h-[100px] overflow-visible gap-4">
            
            {/* COLUMN 1: LEFT LINKS */}
            <div className="flex items-center justify-start overflow-visible shrink-0">
              <ul className="flex gap-6 xl:gap-8 items-center font-bold text-[12px] xl:text-[13px] tracking-widest uppercase">
                {parsedMenus.map((menu, mIdx) => renderMenuItem(menu, mIdx))}
              </ul>
            </div>

            <div className="flex items-center justify-center shrink-0 pl-10 xl:pl-16 pointer-events-none">
              <Link to="/home" className="flex items-center gap-3 hover:opacity-90 transition duration-200 shrink-0 pointer-events-auto">
                <img
                  src="/assets/logo_icon.png"
                  alt="Celina Icon"
                  className="h-20 w-auto rounded-full object-contain"
                />
                <img
                  src="/assets/logo_text.png"
                  alt="Celina Clothing"
                  className="h-14 w-auto object-contain"
                />
              </Link>
            </div>

            {/* COLUMN 3: RIGHT SEARCH & ACTIONS */}
            <div className="flex items-center justify-end gap-5 xl:gap-7 overflow-visible">
              {/* Inline Search Bar */}
              <div ref={searchContainerRef} className="w-[170px] xl:w-[220px] relative">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-white/10 hover:bg-white/15 focus-within:bg-white border border-white/10 focus-within:border-[#B08D57] rounded-md px-3 py-1.5 transition-all duration-200">
                  <Search size={15} className="text-white/60 focus-within:text-black shrink-0" style={{ color: searchQuery ? '#B08D57' : undefined }} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); setActiveSuggestionIndex(-1); }}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-white focus:text-black placeholder-white/40 focus:placeholder-black/30 text-xs font-semibold outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery('')} className="text-white/40 focus-within:text-black hover:text-red-500 transition-colors">
                      <X size={13} />
                    </button>
                  )}
                </form>

                {/* Autocomplete suggestions dropdown (Positions dynamically below search input) */}
                {searchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[320px] xl:w-[360px] bg-[#0B1A30] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[1000] max-h-[380px] overflow-y-auto divide-y divide-white/5 scrollbar-none text-white">
                    {searchResults.length > 0 && (
                      <div>
                        <p className="px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white/40">
                          Products Found
                        </p>
                        {searchResults.map((item, idx) => (
                          <div
                            key={item._id}
                            onClick={() => {
                              setSearchOpen(false);
                              addRecentSearch(searchQuery);
                              navigate(`/product/${item._id}`);
                            }}
                            className={`flex gap-3 items-center px-4 py-2.5 cursor-pointer transition-colors ${
                              activeSuggestionIndex === idx ? 'bg-white/10' : 'hover:bg-white/5'
                            }`}
                          >
                            <img
                              src={item.images?.[0]}
                              alt={item.name}
                              className="w-8 h-10 object-cover rounded bg-white/5 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white uppercase truncate">{item.name}</p>
                              <p className="text-[10px] text-white/50">{item.category}</p>
                            </div>
                            <span className="text-xs font-black text-[#B08D57] shrink-0">
                              ₹{item.price?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                        <div
                          onClick={handleSearchSubmit}
                          className="flex items-center justify-center gap-1.5 px-4 py-2.5 cursor-pointer hover:bg-white/5 transition text-[#B08D57] text-xs font-bold uppercase tracking-wider border-t border-white/5"
                        >
                          See all results &rarr;
                        </div>
                      </div>
                    )}

                    {searchQuery.trim().length < 2 && recentSearches.length > 0 && (
                      <div className="py-2">
                        <p className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/40">
                          Recent Searches
                        </p>
                        <div className="flex flex-wrap gap-1.5 px-4 pb-1">
                          {recentSearches.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSearchQuery(q)}
                              className="flex items-center gap-1 bg-white/8 hover:bg-white/15 text-white/70 text-[10px] font-semibold px-2.5 py-1 rounded-full transition border border-white/10"
                            >
                              <Search size={8} />
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                      <div className="px-4 py-6 text-center">
                        <p className="text-white/50 text-xs">No products found for "<span className="text-white font-bold">{searchQuery}</span>"</p>
                      </div>
                    )}

                    {searchQuery.trim().length < 2 && recentSearches.length === 0 && (
                      <div className="px-4 py-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">Popular Searches</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['Cotton Kurti', 'Anarkali', 'Co-ord Set', 'Festive Wear', 'Linen Kurti'].map((term) => (
                            <button
                              key={term}
                              onClick={() => setSearchQuery(term)}
                              className="bg-white/8 hover:bg-[#B08D57]/20 text-white/70 hover:text-[#B08D57] text-[10px] font-semibold px-2.5 py-1 rounded-full transition border border-white/10 hover:border-[#B08D57]/40"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Icons: Wishlist, Bag, Profile */}
              <div className="flex items-center gap-5 xl:gap-6 shrink-0">
                {/* Wishlist */}
                <Link to="/wishlist" className="flex flex-col items-center text-white/80 hover:text-[#B08D57] transition-colors gap-0.5" aria-label="Wishlist">
                  <div className="relative">
                    <Heart size={20} />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#B08D57] text-black text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase">Wishlist</span>
                </Link>

                {/* Bag (Cart) */}
                <button
                  className="flex flex-col items-center text-white/80 hover:text-[#B08D57] transition-colors gap-0.5"
                  onClick={() => setCartOpen(true)}
                  aria-label="Shopping Bag"
                >
                  <div className="relative">
                    <ShoppingBag size={20} />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#B08D57] text-black text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase">Bag</span>
                </button>

                {/* Profile / Account */}
                <div className="relative group z-50 flex flex-col items-center">
                  {user ? (
                    <Link to="/profile" className="flex flex-col items-center text-white/80 hover:text-[#B08D57] transition-colors gap-0.5" aria-label="Profile">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-white/30" />
                      ) : (
                        <User size={20} />
                      )}
                      <span className="text-[10px] font-bold tracking-wider uppercase">Profile</span>
                    </Link>
                  ) : (
                    <Link to="/login" className="flex flex-col items-center text-white/80 hover:text-[#B08D57] transition-colors gap-0.5" aria-label="Profile">
                      <User size={20} />
                      <span className="text-[10px] font-bold tracking-wider uppercase">Profile</span>
                    </Link>
                  )}

                {/* Profile Hover Dropdown Panel */}
                {user && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 shadow-2xl rounded-xl py-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden text-black z-50">
                    <div className="px-5 py-4 border-b border-gray-100 bg-[#0B1A30] text-white">
                      <p className="font-black text-sm">Hello {user.name.split(' ')[0]}</p>
                      <p className="text-xs text-white/60 mt-0.5 truncate">{user.email}</p>
                    </div>
                    <div className="py-1.5 border-b border-gray-100">
                      <Link to="/orders" className="flex items-center justify-between px-5 py-2 hover:bg-gray-50 transition group/item">
                        <div className="flex items-center gap-3">
                          <ShoppingCart size={14} className="text-gray-400 group-hover/item:text-[#0B1A30] transition" />
                          <span className="text-xs font-semibold text-gray-700">Orders</span>
                        </div>
                        <ChevronRight size={12} className="text-gray-300" />
                      </Link>
                      <Link to="/wishlist" className="flex items-center justify-between px-5 py-2 hover:bg-gray-50 transition group/item">
                        <div className="flex items-center gap-3">
                          <Heart size={14} className="text-gray-400 group-hover/item:text-[#0B1A30] transition" />
                          <span className="text-xs font-semibold text-gray-700">Wishlist</span>
                        </div>
                        <ChevronRight size={12} className="text-gray-300" />
                      </Link>
                      <Link to="/contact" className="flex items-center justify-between px-5 py-2 hover:bg-gray-50 transition group/item">
                        <div className="flex items-center gap-3">
                          <Phone size={14} className="text-gray-400 group-hover/item:text-[#0B1A30] transition" />
                          <span className="text-xs font-semibold text-gray-700">Contact Us</span>
                        </div>
                        <ChevronRight size={12} className="text-gray-300" />
                      </Link>
                    </div>
                    <div className="py-1.5 border-b border-gray-100">
                      <Link to="/profile?tab=coupons" className="flex items-center justify-between px-5 py-2 hover:bg-gray-50 transition group/item">
                        <div className="flex items-center gap-3">
                          <Tag size={14} className="text-gray-400 group-hover/item:text-[#0B1A30] transition" />
                          <span className="text-xs font-semibold text-gray-700">Coupons</span>
                        </div>
                        <ChevronRight size={12} className="text-gray-300" />
                      </Link>
                      <Link to="/profile?tab=addresses" className="flex items-center justify-between px-5 py-2 hover:bg-gray-50 transition group/item">
                        <div className="flex items-center gap-3">
                          <MapPin size={14} className="text-gray-400 group-hover/item:text-[#0B1A30] transition" />
                          <span className="text-xs font-semibold text-gray-700">Saved Addresses</span>
                        </div>
                        <ChevronRight size={12} className="text-gray-300" />
                      </Link>
                    </div>
                    <div className="py-1.5">
                      <Link to="/profile" className="flex items-center justify-between px-5 py-2 hover:bg-gray-50 transition group/item">
                        <div className="flex items-center gap-3">
                          <Settings size={14} className="text-gray-400 group-hover/item:text-[#0B1A30] transition" />
                          <span className="text-xs font-semibold text-gray-700">Edit Profile</span>
                        </div>
                        <ChevronRight size={12} className="text-gray-300" />
                      </Link>
                      {user.role === 'Admin' && (
                        <Link to="/admin" className="flex items-center justify-between px-5 py-2 hover:bg-red-50 transition group/item">
                          <div className="flex items-center gap-3">
                            <Shield size={14} className="text-red-400" />
                            <span className="text-xs font-bold text-red-600">Admin Dashboard</span>
                          </div>
                          <ChevronRight size={12} className="text-red-300" />
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-5 py-2 hover:bg-gray-50 transition text-left group/item"
                      >
                        <LogOut size={14} className="text-gray-400 group-hover/item:text-red-500 transition" />
                        <span className="text-xs font-semibold text-gray-700 group-hover/item:text-red-500 transition">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

          {/* MOBILE LAYOUT */}
          <div className="lg:hidden container flex justify-between items-center h-[64px]">
            <Link to="/home" className="flex items-center gap-2.5">
              <img
                src="/assets/logo_icon.png"
                alt="Celina Icon"
                className="h-14 w-auto rounded-full object-contain"
              />
              <img
                src="/assets/logo_text.png"
                alt="Celina Clothing"
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* Mobile actions */}
            <div className="flex items-center gap-3">
              <button className="text-white/80 hover:text-[#B08D57] transition p-1" onClick={() => setSearchOpen(true)}>
                <Search size={20} />
              </button>
              <button className="relative text-white/80 hover:text-[#B08D57] transition p-1" onClick={() => setCartOpen(true)}>
                <ShoppingBag size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B08D57] text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-white flex items-center justify-center"
                aria-label="Toggle Menu"
              >
                <svg className="w-[38px] h-[38px] bg-white/10 cursor-pointer rounded-[5px] p-2 hover:bg-white/20 transition" viewBox="0 0 100 100" fill="none">
                  <path stroke="currentColor" strokeWidth="8" d="M 20,30 L 80,30" />
                  <path stroke="currentColor" strokeWidth="8" d="M 20,50 L 80,50" />
                  <path stroke="currentColor" strokeWidth="8" d="M 20,70 L 80,70" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </div>


      {/* 3. MOCK BACKDROP OVERLAY */}
      {(cartOpen || mobileMenuOpen || searchOpen) && (
        <div
          className="fixed inset-0 bg-black/60 z-[2000] transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => {
            setCartOpen(false);
            setMobileMenuOpen(false);
            setSearchOpen(false);
          }}
        />
      )}

      {/* 4. SEARCH POPUP — compact dropdown below header */}
      {searchOpen && (
        <div
          ref={searchContainerRef}
          className="fixed left-0 right-0 z-[3500] font-Poppins"
          style={{ top: '112px' }}
          onKeyDown={handleKeyDown}
        >
          {/* Blurred backdrop just below the header */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1]"
            style={{ top: '112px' }}
            onClick={() => setSearchOpen(false)}
          />

          {/* Search Card */}
          <div className="relative max-w-2xl mx-auto mt-4 mx-4 sm:mx-auto rounded-2xl shadow-2xl overflow-hidden border border-white/10"
               style={{ background: '#0B1A30' }}>

            {/* Header Row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search size={18} className="text-[#B08D57] shrink-0" />
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-3">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search kurtis, co-ord sets, fabrics..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setActiveSuggestionIndex(-1); }}
                  className="flex-1 bg-transparent text-white placeholder-white/40 text-sm font-medium outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-white/40 hover:text-white transition"
                  >
                    <X size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#B08D57] text-[#0B1A30] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider hover:bg-white transition-colors"
                >
                  Search
                </button>
              </form>
              <button onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white transition ml-1">
                <X size={18} />
              </button>
            </div>

            {/* Live product suggestions */}
            {searchResults.length > 0 && (
              <div className="max-h-[340px] overflow-y-auto divide-y divide-white/5 scrollbar-none">
                <p className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                  Products Found
                </p>
                {searchResults.map((item, idx) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      setSearchOpen(false);
                      addRecentSearch(searchQuery);
                      navigate(`/product/${item._id}`);
                    }}
                    className={`flex gap-4 items-center px-5 py-3 cursor-pointer transition-colors ${
                      activeSuggestionIndex === idx ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-10 h-14 object-cover rounded-md bg-white/5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white uppercase truncate">{item.name}</p>
                      <p className="text-[11px] text-white/50 mt-0.5">{item.category}</p>
                    </div>
                    <span className="text-xs font-black text-[#B08D57] shrink-0">
                      ₹{item.price?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
                <div
                  onClick={handleSearchSubmit}
                  className="flex items-center justify-center gap-2 px-5 py-3 cursor-pointer hover:bg-white/5 transition text-[#B08D57] text-xs font-bold uppercase tracking-wider"
                >
                  See all results for "{searchQuery}"
                </div>
              </div>
            )}

            {/* Recent Searches - show when no active query */}
            {searchQuery.trim().length < 2 && recentSearches.length > 0 && (
              <div className="pb-2">
                <p className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                  Recent Searches
                </p>
                <div className="flex flex-wrap gap-2 px-5 pb-3">
                  {recentSearches.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(q);
                      }}
                      className="flex items-center gap-1.5 bg-white/8 hover:bg-white/15 text-white/70 text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors border border-white/10"
                    >
                      <Search size={10} />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state — no results */}
            {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="px-5 py-6 text-center">
                <p className="text-white/50 text-sm">No products found for "<span className="text-white font-bold">{searchQuery}</span>"</p>
                <p className="text-white/30 text-xs mt-1">Try a different style, fabric or occasion</p>
              </div>
            )}

            {/* Popular suggestions - show when no query */}
            {searchQuery.trim().length < 2 && recentSearches.length === 0 && (
              <div className="px-5 py-4 pb-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Cotton Kurti', 'Anarkali', 'Co-ord Set', 'Festive Wear', 'Linen Kurti', 'Printed Kurti'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="bg-white/8 hover:bg-[#B08D57]/20 text-white/70 hover:text-[#B08D57] text-[11px] font-semibold px-3 py-1.5 rounded-full transition-colors border border-white/10 hover:border-[#B08D57]/40"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* 5. SHOPPING CART DRAWER (RIGHT SLIDE OUT) */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[440px] bg-white shadow-2xl z-[3000] flex flex-col justify-between transition-transform duration-300 transform font-Poppins ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-[#c2c8da] flex justify-between items-center">
          <h5 className="font-Poppins font-black uppercase tracking-wider text-black text-base">Shopping Bag</h5>
          <button onClick={() => setCartOpen(false)} className="p-1 text-black hover:text-main">
            <X size={22} />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-none">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="font-semibold text-sm">Your shopping bag is empty.</p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate('/shop');
                }}
                className="mt-4 bg-black text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.product}-${item.size}-${item.color}`} className="flex gap-4 border-b border-gray-100 pb-4">
                <img src={item.image} alt={item.name} className="w-16 h-22 object-cover rounded-md bg-gray-100" />
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <h6 className="text-xs font-bold uppercase text-black line-clamp-1">{item.name}</h6>
                    <p className="text-[10px] text-gray-500 font-semibold mt-0.5">Size: {item.size} | Color: {item.color}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex border border-[#c2c8da] rounded-full overflow-hidden">
                      <button className="px-2.5 py-0.5 text-sm hover:bg-braight-grey" onClick={() => updateQty(item.product, item.size, item.color, item.quantity - 1)}>-</button>
                      <span className="px-2 py-0.5 text-xs flex items-center font-bold">{item.quantity}</span>
                      <button className="px-2.5 py-0.5 text-sm hover:bg-braight-grey" onClick={() => updateQty(item.product, item.size, item.color, item.quantity + 1)}>+</button>
                    </div>
                    <span className="text-xs font-black text-black">
                      ₹{(item.price * (1 - (item.discount / 100)) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <button className="text-[10px] text-red-500 flex items-center gap-1 mt-1 hover:underline w-fit" onClick={() => removeFromCart(item.product, item.size, item.color)}>
                    <Trash2 size={10} /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-[#c2c8da] bg-braight-grey">
            {/* Coupon Code Form */}
            <form onSubmit={handleApplyCouponSubmit} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder={couponCode ? `Active Coupon: ${couponCode}` : "Apply Promo Code (e.g. FLAT10)"}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="w-full px-4 py-2 border border-[#c2c8da] bg-white rounded-full text-xs outline-none focus:border-main text-black"
              />
              <button type="submit" className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-800 transition">
                Apply
              </button>
            </form>

            <div className="space-y-2 text-xs font-semibold mb-4 text-neutral-700">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{prices.itemsPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {prices.promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Coupon Discount</span>
                  <span>-₹{prices.promoDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span>{prices.shippingPrice === 0 ? "FREE" : `₹${prices.shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (12%)</span>
                <span>₹{prices.taxPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <hr className="border-[#c2c8da]" />
              <div className="flex justify-between text-sm font-black text-black uppercase">
                <span>Estimated Total</span>
                <span>₹{prices.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full bg-main text-white text-xs font-black uppercase py-3.5 rounded-full text-center hover:opacity-90 transition tracking-widest"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

      {/* 6. MOBILE NAVIGATION DRAWER (LEFT SLIDE OUT) */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-full max-w-[280px] bg-white shadow-2xl z-[3000] p-4 flex flex-col justify-between transition-transform duration-300 transform font-Poppins ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#c2c8da] pb-3">
            <div className="flex items-center gap-2.5">
              <img src="/assets/logo_icon.png" alt="Celina Icon" className="h-14 w-auto rounded-full object-contain" />
              <img src="/assets/logo_text.png" alt="Celina Clothing" className="h-10 w-auto object-contain" />
            </div>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col gap-4 text-base font-bold uppercase tracking-tight">
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-main text-black">
              CATALOGUE
            </Link>
            <Link to="/shop?gender=Men" onClick={() => setMobileMenuOpen(false)} className="hover:text-main text-black">
              MEN
            </Link>
            <Link to="/shop?gender=Women" onClick={() => setMobileMenuOpen(false)} className="hover:text-main text-black">
              WOMEN
            </Link>
            <Link to="/shop?gender=Kids" onClick={() => setMobileMenuOpen(false)} className="hover:text-main text-black">
              KIDS
            </Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="hover:text-main text-black">
              FAVOURITE
            </Link>
          </nav>
        </div>

        {user ? (
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              logout();
            }}
            className="w-full border border-red-500 text-red-500 rounded-md py-2 font-bold uppercase tracking-wider text-xs flex justify-center items-center gap-2 hover:bg-red-50 transition"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        ) : (
          <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
            <button className="w-full bg-black text-white py-3 rounded-md font-bold uppercase text-xs tracking-wider">
              SIGN UP / LOGIN
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
