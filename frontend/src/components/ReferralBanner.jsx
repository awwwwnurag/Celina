import React from 'react';
import { Gift, Share2, X } from 'lucide-react';
import SettingsContext from '../context/SettingsContext';

export const ReferralBanner = () => {
  const { settings } = React.useContext(SettingsContext);
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible || !settings?.referralBanner) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Celina Clothing',
          text: settings.referralBanner,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-4 mb-6 relative">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-white/70 hover:text-white"
      >
        <X size={16} />
      </button>
      
      <div className="flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-full">
          <Gift size={24} className="text-white" />
        </div>
        
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">
            {settings.referralBanner}
          </p>
          <p className="text-white/80 text-xs mt-1">
            Share with friends and earn rewards
          </p>
        </div>
        
        <button
          onClick={handleShare}
          className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold text-xs flex items-center gap-2 hover:bg-yellow-300 transition"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
};
