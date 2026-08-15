import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gift, Heart, Home, LayoutGrid, ShoppingBag, User, X, Copy, Check } from 'lucide-react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import SettingsContext from '../context/SettingsContext';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Categories', path: '/shop', icon: LayoutGrid },
  { label: 'Wishlist', path: '/wishlist', icon: Heart },
  { label: 'Cart', path: '/checkout', icon: ShoppingBag },
  { label: 'Profile', path: '/profile', icon: User }
];

export const CommerceExperience = () => {
  const location = useLocation();
  const { cartItems, wishlistItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { settings } = useContext(SettingsContext);
  const [showCoupon, setShowCoupon] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showExit, setShowExit] = useState(false);
  
  // Coupon copying states
  const [copiedText, setCopiedText] = useState('');
  const handleCopy = (code) => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedText(code);
      setTimeout(() => setCopiedText(''), 2000);
    }
  };
  
  // Newsletter subscription states
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setShowNewsletter(false);
        setNewsletterEmail('');
        setNewsletterSubscribed(false);
      }, 2200);
    }
  };

  const isAdmin = location.pathname.startsWith('/admin');
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const isHomepage = location.pathname === '/';

  // Handlers for sequential display
  const handleCloseCoupon = () => {
    setShowCoupon(false);
    if (isHomepage) {
      setTimeout(() => {
        setShowNewsletter(true);
      }, 1000);
    }
  };

  const handleCloseNewsletter = () => {
    setShowNewsletter(false);
  };

  useEffect(() => {
    if (!isHomepage) return;

    // Show coupon after 1 second on homepage
    const couponTimer = window.setTimeout(() => setShowCoupon(true), 1000);

    const handleMouseLeave = (event) => {
      if (event.clientY <= 8) setShowExit(true);
    };
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.clearTimeout(couponTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHomepage]);

  const announcementText = useMemo(() => {
    return settings?.metaDescription || 'A premium women\'s ethnic fashion store inspired by luxurious traditional details and modern comfort styling.';
  }, [settings]);

  if (isAdmin) return null;



  return (
    <>

      <Popup
        open={showCoupon}
        onClose={handleCloseCoupon}
        title="First Order Treat"
        body="Use this coupon before checkout for a premium welcome discount."
        cta="Shop The Offer"
        code="CELINA10"
        copiedText={copiedText}
        handleCopy={handleCopy}
      />
      <Popup
        open={showNewsletter}
        onClose={handleCloseNewsletter}
        title="Private Drop Alerts"
        body="Join the newsletter for daily deals, festival launches, and early access."
        cta="Explore New Arrivals"
        code="VIPACCESS"
        isNewsletter={true}
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        newsletterSubscribed={newsletterSubscribed}
        handleSubscribeSubmit={handleSubscribeSubmit}
      />
      <Popup
        open={showExit}
        onClose={() => setShowExit(false)}
        title="Wait, Save More"
        body="Your limited-time exit offer is ready. Apply it before it expires."
        cta="Claim Exit Offer"
        code="LASTCHANCE"
        variant="festival"
        copiedText={copiedText}
        handleCopy={handleCopy}
      />

      <nav className="fixed bottom-0 left-0 right-0 z-[70] bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] md:hidden">
        <div className="grid grid-cols-5 h-16">
          {navItems.map(({ label, path, icon: Icon }) => {
            const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
            const badge = label === 'Cart' ? cartCount : label === 'Wishlist' ? wishlistCount : 0;
            const resolvedPath = label === 'Profile' && !user ? '/login' : path;
            return (
              <Link
                key={label}
                to={resolvedPath}
                className={`relative flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-tight ${active ? 'text-main' : 'text-gray-500'}`}
              >
                <span className="relative">
                  <Icon size={19} strokeWidth={active ? 3 : 2} />
                  {badge > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#ff007f] text-white text-[9px] leading-4 text-center">
                      {badge}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

// Standalone Popup Component to prevent input focus unmounting issue
const Popup = ({
  open,
  onClose,
  title,
  body,
  cta,
  code,
  variant = 'dark',
  isNewsletter = false,
  newsletterEmail,
  setNewsletterEmail,
  newsletterSubscribed,
  handleSubscribeSubmit,
  copiedText,
  handleCopy
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl border border-black/10 overflow-hidden">
        <div className={`${variant === 'festival' ? 'bg-[#7f1d1d]' : 'bg-main'} text-white p-5 relative`}>
          <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/15" aria-label="Close popup">
            <X size={16} />
          </button>
          <Gift size={24} className="mb-3" />
          <h3 className="font-Poppins font-black text-xl uppercase tracking-wide">{title}</h3>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">{body}</p>
        </div>
        <div className="p-5 space-y-4">
          {isNewsletter ? (
            <form onSubmit={handleSubscribeSubmit} className="space-y-3">
              {newsletterSubscribed ? (
                <div className="text-center py-4 bg-green-50 rounded-lg text-green-700 font-bold text-xs uppercase tracking-wider animate-pulse">
                  🎉 Successfully Subscribed!
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-full px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-main text-black text-center bg-gray-50 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    className="block w-full bg-black hover:bg-main text-white text-center rounded-full py-3 text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    Subscribe To Newsletter
                  </button>
                </>
              )}
            </form>
          ) : (
            <>
              {code && (
                <div className="flex items-center gap-2">
                  <div 
                    onClick={() => handleCopy(code)}
                    className="flex-1 cursor-pointer hover:bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 text-center font-black tracking-[0.24em] text-sm text-black transition-colors"
                    title="Click to copy"
                  >
                    {code}
                  </div>
                  <button
                    onClick={() => handleCopy(code)}
                    type="button"
                    className="bg-main text-white p-3 rounded-lg hover:bg-opacity-90 transition shrink-0 flex items-center justify-center min-w-[42px] min-h-[42px]"
                    title="Copy code"
                  >
                    {copiedText === code ? <Check size={16} className="text-green-200" /> : <Copy size={16} />}
                  </button>
                </div>
              )}
              {copiedText === code && (
                <div className="text-center text-xs font-bold text-green-600 animate-pulse mt-1">
                  Copied to clipboard!
                </div>
              )}
              <Link to="/shop" onClick={onClose} className="block w-full bg-black text-white text-center rounded-full py-3 text-xs font-black uppercase tracking-wider">
                {cta}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommerceExperience;
