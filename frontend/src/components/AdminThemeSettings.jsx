import React from 'react';
import { Palette } from 'lucide-react';
import axios from 'axios';

export const AdminThemeSettings = ({ globalSettings, setGlobalSettings, getAuthConfig }) => {
  const handleSaveTheme = async () => {
    try {
      const config = getAuthConfig();
      await axios.put('/api/settings', {
        themeColorMain: globalSettings?.themeColorMain,
        themeColorBurgundy: globalSettings?.themeColorBurgundy,
        themeColorBg: globalSettings?.themeColorBg,
        fontStyle: globalSettings?.fontStyle,
        websiteWidth: globalSettings?.websiteWidth,
        borderRadius: globalSettings?.borderRadius,
        buttonStyle: globalSettings?.buttonStyle,
        cardStyle: globalSettings?.cardStyle
      }, config);
      alert('Theme settings saved successfully!');
    } catch (err) {
      alert('Failed to save theme: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3 flex items-center gap-2">
        <Palette size={18} /> Theme Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-black uppercase text-xs text-black">Colors</h4>
          {[
            { label: 'Primary Color', key: 'themeColorMain', default: '#F2C852' },
            { label: 'Secondary Color', key: 'themeColorBurgundy', default: '#7D1F3C' },
            { label: 'Background Color', key: 'themeColorBg', default: '#ffffff' }
          ].map(({ label, key, default: defaultColor }) => (
            <div key={key} className="space-y-2">
              <label className="block font-bold text-xs text-gray-500 uppercase">{label}</label>
              <div className="flex gap-2">
                <input type="color" value={globalSettings?.[key] || defaultColor} onChange={(e) => setGlobalSettings({ ...globalSettings, [key]: e.target.value })} className="w-12 h-10 rounded cursor-pointer" />
                <input type="text" value={globalSettings?.[key] || defaultColor} onChange={(e) => setGlobalSettings({ ...globalSettings, [key]: e.target.value })} className="flex-1 p-2 border border-gray-300 rounded text-xs font-mono" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-black uppercase text-xs text-black">Typography</h4>
          <div className="space-y-2">
            <label className="block font-bold text-xs text-gray-500 uppercase">Font Family</label>
            <select value={globalSettings?.fontStyle || 'Poppins'} onChange={(e) => setGlobalSettings({ ...globalSettings, fontStyle: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs">
              {['Poppins', 'Roboto', 'Inter', 'Open Sans', 'Lato', 'Montserrat'].map(font => <option key={font} value={font}>{font}</option>)}
            </select>
          </div>

          <h4 className="font-black uppercase text-xs text-black mt-4">Layout</h4>
          {[
            { label: 'Website Width', key: 'websiteWidth', default: '1280px' },
            { label: 'Border Radius', key: 'borderRadius', default: '8px' }
          ].map(({ label, key, default: defaultVal }) => (
            <div key={key} className="space-y-2">
              <label className="block font-bold text-xs text-gray-500 uppercase">{label}</label>
              <input type="text" value={globalSettings?.[key] || defaultVal} onChange={(e) => setGlobalSettings({ ...globalSettings, [key]: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs font-mono" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-black uppercase text-xs text-black">Component Styles</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-bold text-xs text-gray-500 uppercase">Button Style</label>
            <select value={globalSettings?.buttonStyle || 'rounded'} onChange={(e) => setGlobalSettings({ ...globalSettings, buttonStyle: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs">
              <option value="rounded">Rounded</option>
              <option value="square">Square</option>
              <option value="pill">Pill</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block font-bold text-xs text-gray-500 uppercase">Card Style</label>
            <select value={globalSettings?.cardStyle || 'bordered'} onChange={(e) => setGlobalSettings({ ...globalSettings, cardStyle: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs">
              <option value="bordered">Bordered</option>
              <option value="shadow">Shadow</option>
              <option value="flat">Flat</option>
            </select>
          </div>
        </div>
      </div>

      <button onClick={handleSaveTheme} className="bg-brand-burgundy text-white px-6 py-3 rounded-full text-xs font-bold uppercase">Save Theme Settings</button>
    </div>
  );
};
