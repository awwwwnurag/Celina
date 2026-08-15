import React, { useState } from 'react';
import { PanelsTopLeft, Trash2 } from 'lucide-react';
import axios from 'axios';

export const AdminHomepageBuilder = ({ globalSettings, setGlobalSettings, getAuthConfig }) => {
  const [draggedSection, setDraggedSection] = useState(null);

  const handleSaveLayout = async () => {
    try {
      const config = getAuthConfig();
      await axios.put('/api/settings', { homepageLayout: globalSettings?.homepageLayout }, config);
      alert('Homepage layout saved successfully!');
    } catch (err) {
      alert('Failed to save layout: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3 flex items-center gap-2">
        <PanelsTopLeft size={18} /> Homepage Builder
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="font-black uppercase text-xs text-black mb-3">Available Sections</h4>
          <div className="space-y-2">
            {['Hero', 'Sponsors', 'Arrivals', 'Young', 'App', 'Instagram', 'Flash Sale', 'Categories', 'Testimonials', 'Newsletter'].map(section => (
              <div key={section} draggable onDragStart={() => setDraggedSection(section)} className="p-3 bg-gray-50 border border-gray-200 rounded cursor-move hover:border-brand-burgundy transition">
                <span className="text-xs font-bold">{section}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-black uppercase text-xs text-black mb-3">Homepage Layout</h4>
          <div className="space-y-2 min-h-[300px] bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300">
            {(globalSettings?.homepageLayout || ['Hero', 'Sponsors', 'Arrivals']).map((section, idx) => (
              <div key={idx} draggable onDragOver={(e) => e.preventDefault()} onDrop={() => {
                if (draggedSection) {
                  const newLayout = [...(globalSettings?.homepageLayout || [])];
                  newLayout.splice(idx, 0, draggedSection);
                  setGlobalSettings({ ...globalSettings, homepageLayout: newLayout });
                  setDraggedSection(null);
                }
              }} className="p-3 bg-white border border-brand-burgundy rounded flex items-center justify-between">
                <span className="text-xs font-bold">{section}</span>
                <button onClick={() => {
                  const newLayout = globalSettings?.homepageLayout?.filter((_, i) => i !== idx) || [];
                  setGlobalSettings({ ...globalSettings, homepageLayout: newLayout });
                }} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleSaveLayout} className="bg-brand-burgundy text-white px-6 py-3 rounded-full text-xs font-bold uppercase">Save Layout</button>
    </div>
  );
};
