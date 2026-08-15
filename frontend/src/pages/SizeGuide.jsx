import React, { useState } from 'react';
import { Ruler, ShieldAlert } from 'lucide-react';

export const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('women'); // 'women', 'men'

  const womenApparelSizes = [
    { label: 'XS', ukSize: '6', chest: '31 - 32', waist: '24 - 25', hips: '34 - 35' },
    { label: 'S', ukSize: '8', chest: '33 - 34', waist: '26 - 27', hips: '36 - 37' },
    { label: 'M', ukSize: '10', chest: '35 - 36', waist: '28 - 29', hips: '38 - 39' },
    { label: 'L', ukSize: '12', chest: '37 - 38', waist: '30 - 31', hips: '40 - 41' },
    { label: 'XL', ukSize: '14', chest: '39 - 41', waist: '32 - 34', hips: '42 - 44' },
    { label: 'XXL', ukSize: '16', chest: '42 - 44', waist: '35 - 37', hips: '45 - 47' }
  ];

  const menApparelSizes = [
    { label: 'S', collar: '14.5', chest: '36 - 38', waist: '30 - 32', sleeve: '32.5' },
    { label: 'M', collar: '15.5', chest: '39 - 41', waist: '33 - 35', sleeve: '33.5' },
    { label: 'L', collar: '16.5', chest: '42 - 44', waist: '36 - 38', sleeve: '34.5' },
    { label: 'XL', collar: '17.5', chest: '45 - 47', waist: '39 - 41', sleeve: '35.5' },
    { label: 'XXL', collar: '18.5', chest: '48 - 50', waist: '42 - 44', sleeve: '36.5' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-2 border-b border-brand-border dark:border-zinc-800 pb-4 text-center">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-brand-burgundy dark:text-white">
          Size Guide
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-400">
          Find your perfect fit across our ethnic & contemporary collections.
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('women')}
          className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'women'
              ? 'bg-brand-burgundy text-white'
              : 'bg-brand-light dark:bg-zinc-800 text-brand-dark dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-750'
          }`}
        >
          Women's Size Chart
        </button>
        <button
          onClick={() => setActiveTab('men')}
          className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition ${
            activeTab === 'men'
              ? 'bg-brand-burgundy text-white'
              : 'bg-brand-light dark:bg-zinc-800 text-brand-dark dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-750'
          }`}
        >
          Men's Size Chart
        </button>
      </div>

      {activeTab === 'women' ? (
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <Ruler size={16} className="text-brand-burgundy" />
            <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Women's Apparel Measurement (Inches)</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-light dark:bg-zinc-800 border-b border-brand-border dark:border-zinc-700">
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Standard Size</th>
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">UK Size</th>
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Chest</th>
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Waist</th>
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Hips</th>
                </tr>
              </thead>
              <tbody>
                {womenApparelSizes.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-850/50">
                    <td className="p-3 font-black text-brand-dark dark:text-gray-300">{row.label}</td>
                    <td className="p-3 font-semibold text-gray-500">{row.ukSize}</td>
                    <td className="p-3 font-semibold text-gray-500">{row.chest}</td>
                    <td className="p-3 font-semibold text-gray-500">{row.waist}</td>
                    <td className="p-3 font-semibold text-gray-500">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <Ruler size={16} className="text-brand-burgundy" />
            <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Men's Apparel Measurement (Inches)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-brand-light dark:bg-zinc-800 border-b border-brand-border dark:border-zinc-700">
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Standard Size</th>
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Collar</th>
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Chest</th>
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Waist</th>
                  <th className="p-3 font-bold uppercase text-brand-burgundy dark:text-white">Sleeve</th>
                </tr>
              </thead>
              <tbody>
                {menApparelSizes.map((row) => (
                  <tr key={row.label} className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50/50 dark:hover:bg-zinc-850/50">
                    <td className="p-3 font-black text-brand-dark dark:text-gray-300">{row.label}</td>
                    <td className="p-3 font-semibold text-gray-500">{row.collar}</td>
                    <td className="p-3 font-semibold text-gray-500">{row.chest}</td>
                    <td className="p-3 font-semibold text-gray-500">{row.waist}</td>
                    <td className="p-3 font-semibold text-gray-500">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Helpful tips card */}
      <div className="border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/10 p-5 rounded-2xl flex gap-4 items-start">
        <ShieldAlert className="text-amber-500 flex-shrink-0" size={20} />
        <div className="space-y-1">
          <h4 className="font-bold text-xs uppercase text-amber-700 dark:text-amber-300">Fitting Guidelines</h4>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
            Measurements refer to body size, not garments. If your measurement lands in-between two sizes, we highly recommend choosing the larger size for a relaxed comfortable fit, or opting for size exchange within our easy 7-day period.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
