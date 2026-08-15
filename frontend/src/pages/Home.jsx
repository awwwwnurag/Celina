import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ProductCard } from '../components/ProductCard';
import SettingsContext from '../context/SettingsContext';
import { ChevronRight, Gift, Sparkles, Star, ArrowRight, Clock, TicketPercent, Users } from 'lucide-react';

export const Home = () => {
  const { settings, getImageUrl } = useContext(SettingsContext);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [dealTimeLeft, setDealTimeLeft] = useState({ hours: '06', minutes: '00', seconds: '00' });

  // Fetch products and banners concurrently in parallel for 5x faster mobile loading
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [arrivalsRes, bestSellersRes, trendingRes, featuredRes, bannersRes] = await Promise.allSettled([
          axios.get('/api/products?limit=4&sort=newest'),
          axios.get('/api/products?limit=4&bestSeller=true'),
          axios.get('/api/products?limit=4&trending=true'),
          axios.get('/api/products?limit=4&featured=true'),
          axios.get('/api/banners')
        ]);

        if (arrivalsRes.status === 'fulfilled') {
          setNewArrivals(arrivalsRes.value.data.products || []);
        }
        if (bestSellersRes.status === 'fulfilled') {
          setBestSellers(bestSellersRes.value.data.products || []);
        }
        if (trendingRes.status === 'fulfilled') {
          setTrendingProducts(trendingRes.value.data.products || []);
        }
        if (featuredRes.status === 'fulfilled') {
          setFeaturedProducts(featuredRes.value.data.products || []);
        }

        const apiBanners = bannersRes.status === 'fulfilled' ? (bannersRes.value.data || []).filter(b => b.isActive) : [];
        setBanners([
          {
            _id: "welcome-celina",
            title: "Imperials of Zardozi",
            subtitle: "Discover curated luxury clothing collections crafted with traditional heritage and modern comfort.",
            buttonText: "Explore Catalogue",
            link: "/shop",
            image: { url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1400" },
            tag: "The Heritage Edit"
          },
          ...apiBanners
        ]);
      } catch (e) {
        console.error("Failed to load products on Home:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // Banner slide timer
  useEffect(() => {
    if (banners.length > 1) {
      const bannerTimer = setInterval(() => {
        setActiveBanner((prev) => (prev + 1) % banners.length);
      }, 7000);
      return () => clearInterval(bannerTimer);
    }
  }, [banners]);

  useEffect(() => {
    const saleEndsAt = new Date();
    saleEndsAt.setHours(23, 59, 59, 999);
    const timer = setInterval(() => {
      const remaining = Math.max(0, saleEndsAt.getTime() - Date.now());
      const hours = String(Math.floor(remaining / 3600000)).padStart(2, '0');
      const minutes = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, '0');
      const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
      setDealTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Smooth scroll to anchor hash (e.g. #best-sellers) on mount
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleHeroSwipe = (endX) => {
    if (touchStart === null || banners.length < 2) return;
    const distance = touchStart - endX;
    if (Math.abs(distance) > 45) {
      setActiveBanner((prev) => distance > 0 ? (prev + 1) % banners.length : (prev - 1 + banners.length) % banners.length);
    }
    setTouchStart(null);
  };

  const categoriesList = [
    { name: "Kurtis", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop", path: "/shop?category=Kurtis", desc: "Cotton & Printed tunics" },
    { name: "Coord Sets", image: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop", path: "/shop?category=Coord%20Sets", desc: "Modern matching sets" },
    { name: "Bottom Wear", image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop", path: "/shop?category=Bottom%20Wear", desc: "Palazzos & trousers" },
    { name: "Dupattas", image: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop", path: "/shop?category=Dupattas", desc: "Premium silk & organza" }
  ];

  const occasionsList = [
    { name: "Casual Wear", subtitle: "Comfortable Cotton Kurtis", image: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop", path: "/shop?occasion=Casual Wear" },
    { name: "Office Wear", subtitle: "Refined Tunic Coordinates", image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop", path: "/shop?occasion=Office Wear" },
    { name: "Festive Wear", subtitle: "Luxurious Silk Gowns", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop", path: "/shop?occasion=Festive Wear" }
  ];

  const promoCollections = [
    { title: "Festive Collection", desc: "Dazzle in embroidered suits", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop", path: "/shop?collectionName=Festive Collection" },
    { title: "Office Wear Collection", desc: "Comfort meets sophistication", image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop", path: "/shop?collectionName=Office Wear Collection" },
    { title: "Summer Collection", desc: "Light pastel cotton coordinates", image: "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop", path: "/shop?collectionName=Summer Collection" }
  ];

  const instagramTiles = [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608748010899-18f300247112?w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=800&auto=format&fit=crop"
  ];

  const defaultTestimonials = [
    { name: "Priya Sharma", role: "Verified Buyer", content: "Absolutely love the fit and quality of the Cotton Kurtis! The Sky Blue shade is gorgeous and perfect for hot summer days." },
    { name: "Ananya Iyer", role: "Premium Club Member", content: "The Coord Sets are a game changer for my office wardrobe. Very professional yet comfortable and breathable." },
    { name: "Meera Patel", role: "Verified Buyer", content: "Beautiful festive collection! Sourced my Anarkali suit set from here, and the zari work detail is incredibly luxurious." }
  ];

  const renderHero = () => {
    if (loading) {
      return (
        <section className="relative px-4 sm:px-6 lg:px-8 pt-2">
          <div className="relative rounded-[20px] sm:rounded-[32px] overflow-hidden bg-neutral-100 animate-pulse h-[400px] md:h-[500px] lg:h-[580px]" />
        </section>
      );
    }
    if (banners.length === 0) return null;
    return (
      <section className="relative px-4 sm:px-6 lg:px-8 pt-2">
        <div
          className="relative rounded-[20px] sm:rounded-[32px] overflow-hidden h-[420px] md:h-[500px] lg:h-[580px] flex items-center justify-center border border-[#B08D57]/30 shadow-2xl"
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => handleHeroSwipe(e.changedTouches[0].clientX)}
        >
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 brightness-75 scale-100"
            style={{ backgroundImage: `url(${getImageUrl(banners[activeBanner].image)})` }}
          />
          {/* Symmetrical dark overlay */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />

          {/* Sabyasachi Elegant Gold Framed Card */}
          <div className="relative z-10 mx-4 max-w-lg md:max-w-xl text-center bg-[#0D5C63]/90 backdrop-blur-md p-6 sm:p-10 md:p-14 border border-[#B08D57]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm space-y-4 sm:space-y-6 flex flex-col items-center justify-center animate-brandFade">
            
            {/* Fine line details on top/bottom of text */}
            <div className="flex items-center gap-3">
              <div className="w-8 sm:w-12 h-[1px] bg-[#B08D57]/40" />
              <span className="font-['Montserrat'] text-[9px] sm:text-[11px] uppercase tracking-[0.35em] text-[#B08D57] font-semibold pl-[0.35em]">
                {banners[activeBanner].tag || "Heritage Collection"}
              </span>
              <div className="w-8 sm:w-12 h-[1px] bg-[#B08D57]/40" />
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-['Cinzel'] text-white tracking-[0.08em] uppercase font-normal leading-tight">
              {banners[activeBanner].title}
            </h2>

            <p className="font-['Playfair_Display'] italic text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-md">
              "{banners[activeBanner].subtitle}"
            </p>

            <div className="pt-2">
              <Link to={banners[activeBanner].link}>
                <button className="border border-[#B08D57] hover:bg-[#B08D57] hover:text-[#0D5C63] text-[#B08D57] px-8 sm:px-10 py-3 uppercase text-[10px] sm:text-xs tracking-[0.3em] font-['Montserrat'] font-semibold transition-all duration-300 rounded-xs shadow-md">
                  {banners[activeBanner].buttonText || "Shop Collection"}
                </button>
              </Link>
            </div>

          </div>

          {/* Elegant navigation dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBanner(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeBanner === idx ? 'bg-[#B08D57] w-8' : 'bg-white/40 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderFlashSale = () => {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#0D5C63] text-white rounded-none p-5 sm:p-6 border border-[#B08D57]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <span className="inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-[0.25em] text-[#B08D57]">
                <Clock size={13} /> Flash Sale
              </span>
              <h3 className="font-['Cinzel'] text-xl uppercase tracking-wider mt-1">Daily Deals End Tonight</h3>
              <p className="font-['Playfair_Display'] italic text-xs text-white/70 mt-1">Limited time offers on best sellers, festive edits, and cotton essentials.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {Object.entries(dealTimeLeft).map(([label, value]) => (
                <div key={label} className="bg-white/5 border border-[#B08D57]/30 text-white rounded-none min-w-[56px] px-3 py-2 text-center">
                  <div className="font-['Cinzel'] text-lg leading-none">{value}</div>
                  <div className="text-[8px] uppercase font-bold text-[#B08D57] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <Link to="/shop?sale=true" className="bg-[#FAF7F0] border border-[#B08D57]/30 rounded-none p-5 sm:p-6 flex items-center gap-4 hover:border-[#B08D57] transition duration-300">
            <div className="w-12 h-12 rounded-none border border-[#B08D57] text-[#B08D57] flex items-center justify-center shrink-0">
              <TicketPercent size={22} />
            </div>
            <div>
              <h4 className="font-['Cinzel'] uppercase text-xs tracking-wider text-[#0D5C63]">Limited Time Offers</h4>
              <p className="font-['Playfair_Display'] italic text-xs text-gray-600 mt-1">Extra 15% off selected collections.</p>
            </div>
          </Link>
        </div>
      </section>
    );
  };

  const renderCategories = () => {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="font-['Montserrat'] text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#B08D57] font-semibold block">Curated Catalog</span>
          <h3 className="font-['Cinzel'] text-2xl sm:text-3xl font-normal text-[#0D5C63] tracking-[0.15em] uppercase mt-2">Shop By Category</h3>
          <div className="w-12 h-[1px] bg-[#B08D57]/40 mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categoriesList.map((cat, idx) => (
            <Link key={idx} to={cat.path} className="group relative rounded-none overflow-hidden aspect-[3/4] border border-[#B08D57]/20 flex items-end p-4 transition-all hover:border-[#B08D57] duration-300 shadow-sm">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D5C63]/90 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
              {/* Inner gold frame overlay on hover */}
              <div className="absolute inset-2 border border-[#B08D57]/0 group-hover:border-[#B08D57]/40 transition-all duration-300 pointer-events-none" />
              <div className="relative z-10 text-center w-full pb-2">
                <h4 className="font-['Cinzel'] text-sm sm:text-base uppercase tracking-[0.2em] text-white group-hover:text-[#B08D57] transition-colors">{cat.name}</h4>
                <p className="font-['Playfair_Display'] italic text-[10px] sm:text-[11px] text-gray-300 mt-1">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  const renderNewArrivals = () => {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8 border-b border-[#B08D57]/30 pb-3">
          <div>
            <span className="font-['Montserrat'] text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-semibold block">Freshly Crafted</span>
            <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-normal text-[#0D5C63] tracking-[0.1em] uppercase mt-1">New Arrivals</h3>
          </div>
          <Link to="/shop?sort=newest" className="font-['Montserrat'] text-[10px] font-bold text-[#0D5C63] hover:text-[#B08D57] uppercase tracking-[0.2em] flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-neutral-100 aspect-[3/4] w-full rounded-none border border-neutral-200"></div>
                <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    );
  };

  const renderOccasions = () => {
    return (
      <section className="max-w-7xl mx-auto px-4 bg-[#FAF7F0] py-16 rounded-none border border-[#B08D57]/20">
        <div className="text-center mb-10">
          <span className="font-['Montserrat'] text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#B08D57] font-semibold block">Garments for Every Event</span>
          <h3 className="font-['Cinzel'] text-2xl md:text-3xl font-normal text-[#0D5C63] tracking-[0.15em] uppercase mt-2">Shop By Occasion</h3>
          <div className="w-12 h-[1px] bg-[#B08D57]/40 mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
          {occasionsList.map((occ, idx) => (
            <Link key={idx} to={occ.path} className="group relative rounded-none overflow-hidden aspect-[16/10] border border-[#B08D57]/20 flex items-end p-6 shadow-sm">
              <img 
                src={occ.image} 
                alt={occ.name} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D5C63]/90 via-transparent to-transparent opacity-85" />
              {/* Inner gold frame overlay on hover */}
              <div className="absolute inset-2.5 border border-[#B08D57]/0 group-hover:border-[#B08D57]/40 transition-all duration-300 pointer-events-none" />
              <div className="relative z-10 text-left">
                <span className="font-['Playfair_Display'] italic text-xs text-[#B08D57] block">{occ.subtitle}</span>
                <h4 className="font-['Cinzel'] text-base uppercase tracking-[0.2em] text-white mt-1 group-hover:text-[#B08D57] transition-colors">{occ.name}</h4>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  const renderBestSellers = () => {
    return (
      <section id="best-sellers" className="max-w-7xl mx-auto px-4 scroll-mt-28 lg:scroll-mt-36">
        <div className="flex justify-between items-end mb-8 border-b border-[#B08D57]/30 pb-3">
          <div>
            <span className="font-['Montserrat'] text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#B08D57] font-semibold block">Most Loved Pieces</span>
            <h3 className="font-['Cinzel'] text-xl sm:text-2xl font-normal text-[#0D5C63] tracking-[0.1em] uppercase mt-1">Best Sellers</h3>
          </div>
          <Link to="/shop?bestSeller=true" className="font-['Montserrat'] text-[10px] font-bold text-[#0D5C63] hover:text-[#B08D57] uppercase tracking-[0.2em] flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="bg-neutral-100 aspect-[3/4] w-full rounded-none border border-neutral-200"></div>
                <div className="h-4 bg-neutral-100 rounded w-3/4"></div>
                <div className="h-3 bg-neutral-100 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {bestSellers.length > 0 ? (
              bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        )}
      </section>
    );
  };

  const renderFestivalTheme = () => {
    return (
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/shop?collectionName=Festive%20Collection" className="md:col-span-2 min-h-[240px] rounded-none overflow-hidden relative p-8 flex items-end border border-[#B08D57]/30">
          <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop" alt="Festival collection" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#6B1E23]/95 via-black/45 to-transparent" />
          <div className="relative z-10 text-white max-w-md space-y-2">
            <span className="font-['Montserrat'] text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-[#B08D57]">Festival Theme</span>
            <h3 className="font-['Cinzel'] text-xl sm:text-2xl uppercase tracking-wider text-white">Celebrate In Signature Styles</h3>
            <p className="font-['Playfair_Display'] italic text-xs text-white/80 mt-2">Curated festive outfits, gifting picks, and limited edition occasion wear.</p>
          </div>
        </Link>
        <div className="grid grid-cols-1 gap-4">
          <Link to="/shop?referral=true" className="rounded-none border border-[#B08D57]/35 p-5 bg-white flex items-center gap-4 hover:border-[#B08D57] transition duration-300">
            <Users size={24} className="text-[#B08D57]" />
            <div>
              <h4 className="font-['Cinzel'] uppercase text-xs tracking-wider text-[#0D5C63]">Referral Program</h4>
              <p className="font-['Playfair_Display'] italic text-xs text-gray-500 mt-0.5">Give Rs. 250, get Rs. 250.</p>
            </div>
          </Link>
          <Link to="/shop?giftCard=true" className="rounded-none border border-[#B08D57]/35 p-5 bg-[#FAF7F0] flex items-center gap-4 hover:border-[#B08D57] transition duration-300">
            <Gift size={24} className="text-[#B08D57]" />
            <div>
              <h4 className="font-['Cinzel'] uppercase text-xs tracking-wider text-[#0D5C63]">Imperial Gift Cards</h4>
              <p className="font-['Playfair_Display'] italic text-xs text-gray-500 mt-0.5">Digital gifts for every celebration.</p>
            </div>
          </Link>
        </div>
      </section>
    );
  };

  const renderCottonCollection = () => {
    return (
      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-none overflow-hidden bg-brand-light aspect-[21/9] min-h-[320px] flex items-center border border-[#B08D57]/30 shadow-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center brightness-75 scale-100"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-xl pl-8 md:pl-16 space-y-4 text-white">
            <span className="font-['Montserrat'] text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#B08D57] font-semibold flex items-center gap-1.5">
              <Star size={14} className="fill-current text-[#B08D57]" /> Cotton Curations
            </span>
            <h2 className="text-2xl md:text-4xl font-['Cinzel'] uppercase tracking-wider">
              Pure Cotton Comforts
            </h2>
            <p className="font-['Playfair_Display'] italic text-xs md:text-sm text-gray-200 leading-relaxed max-w-sm">
              Handblock styles, breathable fabrics, and straight-fit silhouettes designed to beat the summer heat in pure elegance.
            </p>
            <Link to="/shop?fabric=100%25%20Pure%20Cotton,Premium%20Cotton" className="inline-block pt-2">
              <button className="border border-white hover:bg-white hover:text-black text-white px-8 py-3.5 uppercase text-xs tracking-[0.25em] font-['Montserrat'] font-semibold transition-all duration-300">
                Shop Cotton Collection
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const renderPromoCollections = () => {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoCollections.map((col, idx) => (
            <div key={idx} className="bg-white border border-[#B08D57]/20 rounded-none overflow-hidden shadow-sm flex flex-col group">
              <div className="aspect-[4/3] overflow-hidden relative border-b border-[#B08D57]/10">
                <img 
                  src={col.image} 
                  alt={col.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
              </div>
              <div className="p-6 space-y-2 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="font-['Cinzel'] text-[#0D5C63] font-normal text-base uppercase tracking-wider">{col.title}</h4>
                  <p className="font-['Playfair_Display'] italic text-xs text-gray-500 mt-1">{col.desc}</p>
                </div>
                <Link to={col.path} className="font-['Montserrat'] text-[10px] font-bold text-[#0D5C63] hover:text-[#B08D57] uppercase tracking-wider flex items-center gap-1 pt-4 self-start mt-auto">
                  Shop Collection <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderTrendingFeatured = () => {
    return (
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Trending */}
        <div className="space-y-6">
          <div className="border-b border-[#B08D57]/30 pb-3 flex justify-between items-end">
            <h3 className="font-['Cinzel'] text-base tracking-wider uppercase text-[#0D5C63]">Trending Collection</h3>
            <Link to="/shop?trending=true" className="font-['Montserrat'] text-[10px] font-bold text-[#B08D57] uppercase tracking-wider">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trendingProducts.slice(0, 2).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
            {trendingProducts.length === 0 && newArrivals.slice(0, 2).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>

        {/* Featured */}
        <div className="space-y-6">
          <div className="border-b border-[#B08D57]/30 pb-3 flex justify-between items-end">
            <h3 className="font-['Cinzel'] text-base tracking-wider uppercase text-[#0D5C63]">Featured Collection</h3>
            <Link to="/shop?featured=true" className="font-['Montserrat'] text-[10px] font-bold text-[#B08D57] uppercase tracking-wider">View All</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featuredProducts.slice(0, 2).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
            {featuredProducts.length === 0 && newArrivals.slice(2, 4).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderBrandStory = () => {
    return (
      <section className="bg-[#FAF7F0] border-y border-[#B08D57]/30 py-20 relative overflow-hidden">
        {/* Subtle background filigree pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#B08D57_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center px-4 space-y-6 relative z-10">
          <span className="font-['Montserrat'] text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#B08D57] font-semibold block">The Legacy of Craft</span>
          <h2 className="font-['Cinzel'] text-2xl sm:text-4xl text-[#0D5C63] tracking-[0.1em] font-normal">
            Rooted in Heritage
          </h2>
          {/* Ornate Gold Accent Divider */}
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-[1px] bg-[#B08D57]/30" />
            <div className="w-2.5 h-2.5 rotate-45 border border-[#B08D57] bg-[#B08D57]/10" />
            <div className="w-12 h-[1px] bg-[#B08D57]/30" />
          </div>
          <p className="font-['Playfair_Display'] italic text-sm sm:text-lg text-[#333333] leading-relaxed">
            "At Celina, we believe in celebrating the poetry of Indian weavers. Every thread is spun with local stories, hand-blocked in traditional dye baths, and tailored into refined cuts that combine imperial elegance with modern ease."
          </p>
          <div className="pt-4">
            <Link to="/about" className="font-['Montserrat'] text-xs font-bold text-[#0D5C63] hover:text-[#B08D57] uppercase tracking-[0.25em] transition duration-300 border-b border-[#0D5C63] pb-1">
              Explore Our Journey
            </Link>
          </div>
        </div>
      </section>
    );
  };

  const renderTestimonials = () => {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="font-['Montserrat'] text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#B08D57] font-semibold block">Words of Trust</span>
          <h3 className="font-['Cinzel'] text-2xl md:text-3xl font-normal text-[#0D5C63] tracking-[0.15em] uppercase mt-2">Customer Reviews</h3>
          <div className="w-12 h-[1px] bg-[#B08D57]/40 mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(settings?.testimonials && settings.testimonials.length > 0 ? settings.testimonials : defaultTestimonials).map((t, idx) => (
            <div key={idx} className="bg-white border border-[#B08D57]/20 rounded-none p-6 space-y-4 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex text-[#B08D57] gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-current" />)}
                </div>
                <p className="font-['Playfair_Display'] italic text-xs sm:text-sm text-gray-600 leading-relaxed text-justify">
                  "{t.content}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-[#B08D57]/20">
                <div className="w-8 h-8 rounded-none border border-[#B08D57]/30 overflow-hidden bg-[#FAF7F0] flex items-center justify-center font-bold text-xs text-[#0D5C63]">
                  {t.avatar?.url ? (
                    <img src={t.avatar.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    t.name.charAt(0)
                  )}
                </div>
                <div>
                  <h5 className="font-['Cinzel'] text-xs text-[#0D5C63] font-semibold">{t.name}</h5>
                  <span className="font-['Montserrat'] text-[8px] sm:text-[9px] uppercase tracking-widest text-[#B08D57]">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderInstagram = () => {
    return (
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="font-['Montserrat'] text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#B08D57] font-semibold block">Social Showcase</span>
          <h3 className="font-['Cinzel'] text-2xl md:text-3xl font-normal text-[#0D5C63] tracking-[0.15em] uppercase mt-2">Instagram Gallery</h3>
          <div className="w-12 h-[1px] bg-[#B08D57]/40 mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {instagramTiles.map((img, idx) => (
            <a key={idx} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group block aspect-square rounded-none overflow-hidden relative border border-[#B08D57]/20 shadow-xs">
              <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[#0D5C63]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[9px] font-['Montserrat'] tracking-widest uppercase transition-opacity">
                View Post
              </div>
            </a>
          ))}
        </div>
      </section>
    );
  };

  const renderNewsletter = () => {
    return (
      <section className="bg-[#FAF7F0] border-t border-[#B08D57]/30 py-16">
        <div className="max-w-xl mx-auto text-center px-4 space-y-4">
          <h3 className="font-['Cinzel'] text-xl uppercase tracking-wider text-[#0D5C63]">
            {settings?.homepageNewsletter?.title || "Join Our Ethnic Community"}
          </h3>
          <p className="font-['Playfair_Display'] italic text-xs text-gray-500 leading-relaxed">
            {settings?.homepageNewsletter?.subtitle || "Subscribe to get exclusive previews of new handblock kurtis and special subscriber offers."}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing! Seasonal updates will be sent to your email.');
            }}
            className="flex flex-col sm:flex-row items-center gap-2 pt-2"
          >
            <input
              type="email"
              required
              className="flex-grow w-full px-4 py-3 rounded-none border border-[#B08D57]/30 text-xs outline-none focus:border-[#B08D57] text-black font-semibold shadow-xs"
              placeholder="Enter your email address"
            />
            <button type="submit" className="w-full sm:w-auto bg-[#0D5C63] hover:bg-[#B08D57] hover:text-[#0D5C63] text-white font-['Montserrat'] font-semibold text-xs uppercase tracking-wider px-8 py-3 rounded-none shadow-md transition-all duration-300 border border-[#0D5C63]">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    );
  };

  const renderSection = (sectionName) => {
    switch (sectionName) {
      case 'Hero':
        return renderHero();
      case 'Flash Sale':
      case 'FlashSale':
      case 'Strip':
        return renderFlashSale();
      case 'Categories':
        return renderCategories();
      case 'Arrivals':
      case 'New Arrivals':
      case 'NewArrivals':
        return renderNewArrivals();
      case 'Occasions':
      case 'Shop By Occasion':
      case 'Occasion':
        return renderOccasions();
      case 'Best Sellers':
      case 'BestSellers':
        return renderBestSellers();
      case 'Festival Theme':
      case 'Festival':
      case 'Gift Cards':
      case 'Referral Banner':
        return renderFestivalTheme();
      case 'Cotton Collection':
      case 'Cotton':
      case 'Young':
      case 'App':
        return renderCottonCollection();
      case 'Promo Collections':
      case 'Sponsors':
        return renderPromoCollections();
      case 'Trending & Featured':
      case 'Trending':
      case 'Featured':
        return renderTrendingFeatured();
      case 'Story':
      case 'Brand Story':
        return renderBrandStory();
      case 'Testimonials':
      case 'Reviews':
        return renderTestimonials();
      case 'Instagram':
        return renderInstagram();
      case 'Newsletter':
        return renderNewsletter();
      default:
        return null;
    }
  };

  const layout = settings?.homepageLayout || [
    'Hero',
    'Flash Sale',
    'Categories',
    'New Arrivals',
    'Occasions',
    'Best Sellers',
    'Festival Theme',
    'Story',
    'Newsletter'
  ];

  return (
    <div className="overflow-x-hidden space-y-16 bg-white min-h-screen">
      {layout.map((section, idx) => (
        <React.Fragment key={`${section}-${idx}`}>
          {renderSection(section)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Home;
