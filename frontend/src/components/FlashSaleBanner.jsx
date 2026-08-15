import React from 'react';
import { Lightning, ArrowRight } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import { Link } from 'react-router-dom';

export const FlashSaleBanner = ({ endDate, title = 'FLASH SALE', subtitle = 'Up to 70% OFF' }) => {
  const targetDate = endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl p-6 text-white mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Lightning size={24} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="font-black text-xl uppercase tracking-wider">{title}</h3>
            <p className="text-sm opacity-90">{subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <CountdownTimer targetDate={targetDate} />
          <Link
            to="/shop?sale=true"
            className="bg-white text-red-600 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider hover:bg-yellow-300 transition flex items-center gap-2"
          >
            Shop Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
