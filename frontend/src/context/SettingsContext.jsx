import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSettingsData = async () => {
    try {
      const settingsRes = await axios.get('/api/settings');
      setSettings(settingsRes.data);

      const pagesRes = await axios.get('/api/pages');
      setPages(pagesRes.data || []);
    } catch (error) {
      console.error('Failed to load global website settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const refreshSettings = async () => {
    await fetchSettingsData();
  };

  // Helper utility to safely resolve image objects { public_id, url } or strings
  const getImageUrl = (image) => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    return image.url || '';
  };

  // Apply theme settings dynamically in CSS
  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      
      // Main theme color variable (default is yellow #F2C852)
      if (settings.themeColorMain) {
        root.style.setProperty('--color-main', settings.themeColorMain);
      }
      // Burgundy accent color variable (default is #7D1F3C)
      if (settings.themeColorBurgundy) {
        root.style.setProperty('--color-burgundy', settings.themeColorBurgundy);
      }
      // Font style (Poppins, Roboto, Inter, etc.)
      if (settings.fontStyle) {
        root.style.setProperty('--font-family', settings.fontStyle);
        document.body.style.fontFamily = `${settings.fontStyle}, sans-serif`;
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        pages,
        loading,
        refreshSettings,
        getImageUrl
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
