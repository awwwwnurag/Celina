import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SettingsContext from '../context/SettingsContext';

export const About = () => {
  const { pages } = useContext(SettingsContext);
  const page = pages?.find(p => p.slug === 'about');

  if (page && page.isActive) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="space-y-2 border-b border-brand-border dark:border-zinc-800 pb-4 text-center">
          <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-brand-burgundy dark:text-white">
            {page.title}
          </h1>
        </div>
        <div 
          className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify" 
          dangerouslySetInnerHTML={{ __html: page.content }} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8 text-center sm:text-left">
      <div className="space-y-2 border-b border-brand-border dark:border-zinc-800 pb-4 text-center">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-brand-burgundy dark:text-white">
          About Celina Clothing
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-400">Quality Apparel. Modern Silhouettes. Uncompromising Fits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <img
          src="https://images.unsplash.com/photo-1522337360788-8b13edd793be?w=800&auto=format&fit=crop"
          alt="About us models"
          className="rounded-lg shadow object-cover aspect-[3/4] w-full"
        />
        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
          <p>
            At <strong>Celina Clothing</strong>, we believe that fashion should fit seamlessly into your active lifestyle. Designed for comfort, longevity, and modern styling, we curate apparel that looks premium and feels effortless.
          </p>
          <p>
            Our specialized collections bridge the gap between everyday basics and standout streetwear. Spanning across Men, Women, Kids, and Accessories, we source long-staple cotton and structured technical fabrics that hold up gracefully through years of daily wear.
          </p>
          <p>
            Whether you are searching for clean slim-fit shirts, everyday essentials, cozy knit outerwear, or minimalist accessories, our pieces are designed to elevate your personal style while providing ultimate comfort.
          </p>
          <div className="pt-4 text-center sm:text-left">
            <Link to="/shop" className="inline-block bg-brand-burgundy text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition">
              Explore Collections
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
