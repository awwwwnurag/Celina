import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';
import SettingsContext from '../context/SettingsContext';
import axios from 'axios';

export const NewsletterPopup = () => {
  const { settings } = React.useContext(SettingsContext);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const shown = localStorage.getItem('newsletter_popup_shown');
    if (!shown) {
      const timer = setTimeout(() => setIsVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter_popup_shown', 'true');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await axios.post('/api/newsletter/subscribe', { email });
      setSubscribed(true);
      setTimeout(() => {
        handleClose();
        setSubscribed(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-brand-burgundy/10 rounded-full flex items-center justify-center mx-auto">
            <Mail size={32} className="text-brand-burgundy" />
          </div>
          
          <h3 className="font-bold text-xl text-gray-900 dark:text-white">
            {settings?.newsletterPopupTitle || 'Stay in the Loop'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {settings?.homepageNewsletter?.subtitle || 'Get exclusive offers and new arrival alerts'}
          </p>
          
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-brand-burgundy dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-burgundy text-white py-3 rounded-full font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          ) : (
            <div className="text-green-600 font-semibold">Successfully subscribed! 🎉</div>
          )}
          
          <button
            onClick={handleClose}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            No thanks, maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
