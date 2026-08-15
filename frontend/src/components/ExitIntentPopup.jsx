import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import SettingsContext from '../context/SettingsContext';
import { useNavigate } from 'react-router-dom';

export const ExitIntentPopup = () => {
  const { settings } = React.useContext(SettingsContext);
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const shown = localStorage.getItem('exit_intent_shown');
    if (shown) setHasShown(true);

    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        localStorage.setItem('exit_intent_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleContinueShopping = () => {
    handleClose();
    navigate('/shop');
  };

  if (!isVisible || !settings?.exitIntentOffer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X size={20} />
        </button>
        
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
            <Gift size={40} className="text-white" />
          </div>
          
          <h3 className="font-bold text-2xl text-gray-900 dark:text-white">Wait! Don't Leave Empty-Handed</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Use code <span className="font-bold text-brand-burgundy">{settings.exitIntentOffer}</span> for extra discount on your order
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleContinueShopping}
              className="w-full bg-brand-burgundy text-white py-3 rounded-full font-semibold hover:bg-opacity-90 transition"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleClose}
              className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              No Thanks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
