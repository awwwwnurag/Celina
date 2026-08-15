import React, { useState, useEffect } from 'react';
import { X, Copy, Check } from 'lucide-react';
import SettingsContext from '../context/SettingsContext';

export const CouponPopup = () => {
  const { settings } = React.useContext(SettingsContext);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem('coupon_popup_shown');
    if (!shown) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('coupon_popup_shown', 'true');
  };

  const handleCopy = () => {
    if (settings?.couponPopupCode) {
      navigator.clipboard.writeText(settings.couponPopupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isVisible || !settings?.couponPopupCode) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 relative shadow-2xl animate-bounce-in">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-brand-burgundy/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">🎉</span>
          </div>
          
          <h3 className="font-bold text-xl text-gray-900 dark:text-white">Special Offer!</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use this exclusive coupon code on your first order
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <div className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-brand-burgundy rounded-lg px-6 py-3">
              <span className="font-bold text-lg text-brand-burgundy tracking-wider">
                {settings.couponPopupCode}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="bg-brand-burgundy text-white p-3 rounded-lg hover:bg-opacity-90 transition"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          {copied && (
            <div className="text-center text-xs font-bold text-green-600 animate-pulse mt-1">
              Copied to clipboard!
            </div>
          )}
          
          <button
            onClick={handleClose}
            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-opacity-90 transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
