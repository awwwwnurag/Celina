import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SettingsContext from '../context/SettingsContext';

export const AnnouncementBar = () => {
  const { settings } = React.useContext(SettingsContext);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem('announcement_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        setIsVisible(false);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcement_dismissed', Date.now().toString());
  };

  if (!isVisible || !settings?.announcementText) return null;

  return (
    <div className="bg-brand-burgundy text-white text-center py-2 px-4 relative">
      <p className="text-xs font-medium tracking-wide">
        {settings.announcementText}
      </p>
      <button
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
      >
        <X size={14} />
      </button>
    </div>
  );
};
