import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Hardcode dark mode to false globally to disable it
  const darkMode = false;
  const toggleTheme = () => {};

  useEffect(() => {
    // Keep both body and html tags styled for light mode
    document.body.classList.remove('dark');
    document.documentElement.classList.remove('dark');
    localStorage.setItem('evara_theme_dark', 'false');
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;
