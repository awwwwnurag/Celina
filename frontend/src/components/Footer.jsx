import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import SettingsContext from '../context/SettingsContext';

export const Footer = () => {
  const { settings } = useContext(SettingsContext);
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionName) => {
    setActiveSection(activeSection === sectionName ? null : sectionName);
  };

  return (
    <footer className="font-['Montserrat',sans-serif] text-sm text-gray-300 border-t border-white/10" style={{ backgroundColor: '#0B1A30' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
          
          {/* Brand & Bio Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            <Link to="/home" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
              <img src="/assets/logo_icon.png" alt="Celina Icon" className="h-12 w-auto rounded-full object-contain bg-white/5 p-1" />
              <img src="/assets/logo_text.png" alt="Celina Clothing" className="h-9 w-auto object-contain" />
            </Link>
            
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              {settings?.metaDescription || "A premium women's ethnic fashion store inspired by luxurious traditional details and modern comfort styling."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {settings?.socialFacebook && (
                <a
                  href={settings.socialFacebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#1877F2] text-gray-300 hover:text-white hover:scale-110 hover:shadow-[0_0_18px_rgba(24,119,242,0.45)] flex items-center justify-center transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings?.socialInstagram && (
                <a
                  href={settings.socialInstagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-gray-300 hover:text-white hover:scale-110 hover:shadow-[0_0_18px_rgba(225,48,108,0.45)] flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Nav Links Columns (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 w-full">
            
            {/* 1. Company */}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10 sm:border-transparent">
                <h4 className="text-white font-semibold uppercase tracking-wider text-xs font-['Cinzel',serif] text-[#B08D57]">Company</h4>
                <button
                  onClick={() => toggleSection('company')}
                  className="sm:hidden text-gray-400 p-1"
                  aria-label="Toggle Company links"
                >
                  <svg
                    width="12"
                    height="12"
                    className={`transition-transform duration-300 ${activeSection === 'company' ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
              <ul className={`space-y-2.5 text-xs transition-all duration-300 ${activeSection === 'company' ? 'block' : 'hidden sm:block'}`}>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* 2. Quick Links */}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10 sm:border-transparent">
                <h4 className="text-white font-semibold uppercase tracking-wider text-xs font-['Cinzel',serif] text-[#B08D57]">Quick Links</h4>
                <button
                  onClick={() => toggleSection('quick-link')}
                  className="sm:hidden text-gray-400 p-1"
                  aria-label="Toggle Quick links"
                >
                  <svg
                    width="12"
                    height="12"
                    className={`transition-transform duration-300 ${activeSection === 'quick-link' ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
              <ul className={`space-y-2.5 text-xs transition-all duration-300 ${activeSection === 'quick-link' ? 'block' : 'hidden sm:block'}`}>
                <li>
                  <Link to="/shop" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    All Collections
                  </Link>
                </li>
                <li>
                  <Link to="/home#best-sellers" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link to="/size-guide" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link to="/faqs" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3. Legal */}
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10 sm:border-transparent">
                <h4 className="text-white font-semibold uppercase tracking-wider text-xs font-['Cinzel',serif] text-[#B08D57]">Legal</h4>
                <button
                  onClick={() => toggleSection('legal')}
                  className="sm:hidden text-gray-400 p-1"
                  aria-label="Toggle Legal links"
                >
                  <svg
                    width="12"
                    height="12"
                    className={`transition-transform duration-300 ${activeSection === 'legal' ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
              <ul className={`space-y-2.5 text-xs transition-all duration-300 ${activeSection === 'legal' ? 'block' : 'hidden sm:block'}`}>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-white hover:text-[#B08D57] transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} {settings?.companyName || 'Celina Ethnic Fashion Pvt Ltd'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[11px] text-gray-400">
            <span>Secure 256-bit SSL Checkout</span>
            <span>•</span>
            <span>Crafted with Luxury</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
