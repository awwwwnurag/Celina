import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import SettingsContext from '../context/SettingsContext';

export const Footer = () => {
  const { settings, getImageUrl } = useContext(SettingsContext);
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (sectionName) => {
    setActiveSection(activeSection === sectionName ? null : sectionName);
  };

  return (
    <footer className="font-Roboto tracking-tight text-[16px] xl:text-[18px] 2xl:text-[22px] py-[60px] lg:py-0 border-t border-gray-950" style={{ backgroundColor: '#0F172A' }}>
      <div className="container text-white flex flex-wrap py-[30px] gap-[40px] lg:gap-0 lg:py-0 lg:min-h-[400px] 2xl:min-h-[540px] items-center">
        {/* Logo and Socials Column */}
        <div className="flex flex-col items-center lg:items-start gap-[20px] 2xl:gap-[30px] basis-full lg:basis-[45%]">
          <Link to="/home" className="flex items-center gap-3 hover:scale-105 transition duration-200 group">
            <img src="/assets/logo_icon.png" alt="Celina Icon" className="h-14 w-auto rounded-full object-contain" />
            <img src="/assets/logo_text.png" alt="Celina Clothing" className="h-10 w-auto object-contain" />
          </Link>
          <p className="text-[#8e8e8e] text-center lg:text-left leading-relaxed">
            {settings?.metaDescription || "Complete your style with awesome clothes from us."}
          </p>
          <div className="flex text-black gap-[14px]">
            {settings?.socialFacebook && (
              <a
                href={settings.socialFacebook}
                target="_blank"
                rel="noreferrer"
                className="bg-main w-[35px] h-[35px] 2xl:w-[50px] 2xl:h-[50px] flex justify-center items-center rounded-[8px] 2xl:rounded-[15px] hover:bg-white transition-all duration-300"
              >
                <svg className="w-[10px] h-[22px] 2xl:w-[14px] 2xl:h-[26px] fill-current">
                  <use href="/assets/icons/icons.svg#fb"></use>
                </svg>
              </a>
            )}
            {settings?.socialInstagram && (
              <a
                href={settings.socialInstagram}
                target="_blank"
                rel="noreferrer"
                className="bg-main w-[35px] h-[35px] 2xl:w-[50px] 2xl:h-[50px] flex justify-center items-center rounded-[8px] 2xl:rounded-[15px] hover:bg-white transition-all duration-300"
              >
                <svg className="w-[18px] h-[19px] 2xl:w-[22px] 2xl:h-[23px] fill-current">
                  <use href="/assets/icons/icons.svg#ig"></use>
                </svg>
              </a>
            )}
            {settings?.socialTwitter && (
              <a
                href={settings.socialTwitter}
                target="_blank"
                rel="noreferrer"
                className="bg-main w-[35px] h-[35px] 2xl:w-[50px] 2xl:h-[50px] flex justify-center items-center rounded-[8px] 2xl:rounded-[15px] hover:bg-white transition-all duration-300"
              >
                <svg className="w-[21px] h-[17px] 2xl:w-[25px] 2xl:h-[21px] fill-current">
                  <use href="/assets/icons/icons.svg#tw"></use>
                </svg>
              </a>
            )}
            {settings?.socialLinkedin && (
              <a
                href={settings.socialLinkedin}
                target="_blank"
                rel="noreferrer"
                className="bg-main w-[35px] h-[35px] 2xl:w-[50px] 2xl:h-[50px] flex justify-center items-center rounded-[8px] 2xl:rounded-[15px] hover:bg-white transition-all duration-300"
              >
                <svg className="w-[15px] h-[15px] 2xl:w-[19px] 2xl:h-[19px] fill-current">
                  <use href="/assets/icons/icons.svg#ln"></use>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Links Accordions */}
        <div className="text-[#8e8e8e] flex flex-col sm:flex-row grow justify-around lg:justify-between w-full lg:w-auto gap-[30px] sm:gap-[15px]">
          {/* Company Section */}
          <div className="flex flex-col gap-[10px] 2xl:gap-[20px]">
            <div className="flex justify-between items-center relative">
              <h3 className="text-[#d9d9d9] pr-[20px] relative z-10 font-bold font-Poppins" style={{ backgroundColor: '#0F172A' }}>Company</h3>
              <button
                onClick={() => toggleSection('company')}
                className="sm:hidden relative z-10 text-white border border-[#8e8e8e] p-1.5 rounded-full"
                style={{ backgroundColor: '#0F172A' }}
              >
                <svg
                  width="14"
                  height="14"
                  className={`text-white transition-transform duration-300 ${
                    activeSection === 'company' ? 'rotate-180' : 'rotate-0'
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <hr className="h-[1px] border-white absolute left-0 bottom-1/2 w-full sm:hidden opacity-10" />
            </div>
            <ul
              className={`flex flex-col gap-[10px] 2xl:gap-[20px] overflow-hidden transition-all duration-300 ${
                activeSection === 'company' ? 'max-h-[300px] mb-4' : 'max-h-0 sm:max-h-[300px]'
              }`}
            >
              <li>
                <Link to="/about" className="hover:text-main text-[#8e8e8e] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-main text-[#8e8e8e] transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-main text-[#8e8e8e] transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-main text-[#8e8e8e] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Link Section */}
          <div className="flex flex-col gap-[10px] 2xl:gap-[20px]">
            <div className="flex justify-between items-center relative">
              <h3 className="text-[#d9d9d9] pr-[20px] relative z-10 font-bold font-Poppins" style={{ backgroundColor: '#0F172A' }}>Quick Link</h3>
              <button
                onClick={() => toggleSection('quick-link')}
                className="sm:hidden relative z-10 text-white border border-[#8e8e8e] p-1.5 rounded-full"
                style={{ backgroundColor: '#0F172A' }}
              >
                <svg
                  width="14"
                  height="14"
                  className={`text-white transition-transform duration-300 ${
                    activeSection === 'quick-link' ? 'rotate-180' : 'rotate-0'
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <hr className="h-[1px] border-white absolute left-0 bottom-1/2 w-full sm:hidden opacity-10" />
            </div>
            <ul
              className={`flex flex-col gap-[10px] 2xl:gap-[20px] overflow-hidden transition-all duration-300 ${
                activeSection === 'quick-link' ? 'max-h-[300px] mb-4' : 'max-h-0 sm:max-h-[300px]'
              }`}
            >
              <li>
                <Link to="/share-location" className="hover:text-main text-[#8e8e8e] transition-colors">
                  Share Location
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-main text-[#8e8e8e] transition-colors">
                  Orders Tracking
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-main text-[#8e8e8e] transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-main text-[#8e8e8e] transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="flex flex-col gap-[10px] 2xl:gap-[20px]">
            <div className="flex justify-between items-center relative">
              <h3 className="text-[#d9d9d9] pr-[20px] relative z-10 font-bold font-Poppins" style={{ backgroundColor: '#0F172A' }}>Legal</h3>
              <button
                onClick={() => toggleSection('legal')}
                className="sm:hidden relative z-10 text-white border border-[#8e8e8e] p-1.5 rounded-full"
                style={{ backgroundColor: '#0F172A' }}
              >
                <svg
                  width="14"
                  height="14"
                  className={`text-white transition-transform duration-300 ${
                    activeSection === 'legal' ? 'rotate-180' : 'rotate-0'
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <hr className="h-[1px] border-white absolute left-0 bottom-1/2 w-full sm:hidden opacity-10" />
            </div>
            <ul
              className={`flex flex-col gap-[10px] 2xl:gap-[20px] overflow-hidden transition-all duration-300 ${
                activeSection === 'legal' ? 'max-h-[300px] mb-4' : 'max-h-0 sm:max-h-[300px]'
              }`}
            >
              <li>
                <Link to="/terms" className="hover:text-main text-[#8e8e8e] transition-colors">
                  Term & conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-main text-[#8e8e8e] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container text-center py-4 border-t border-neutral-900 mt-6">
        <p className="text-[#8e8e8e] text-xs">
          &copy; {new Date().getFullYear()} {settings?.companyName || 'Celina Clothing'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
