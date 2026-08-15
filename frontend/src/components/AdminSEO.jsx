import React from 'react';
import { SearchCheck } from 'lucide-react';
import axios from 'axios';

export const AdminSEO = ({ globalSettings, setGlobalSettings, getAuthConfig }) => {
  const handleSaveSEO = async () => {
    try {
      const config = getAuthConfig();
      await axios.put('/api/settings', {
        websiteTitle: globalSettings?.websiteTitle,
        metaDescription: globalSettings?.metaDescription,
        seoKeywords: globalSettings?.seoKeywords,
        openGraphTitle: globalSettings?.openGraphTitle,
        twitterCard: globalSettings?.twitterCard,
        canonicalUrl: globalSettings?.canonicalUrl,
        sitemapUrl: globalSettings?.sitemapUrl,
        robotsTxt: globalSettings?.robotsTxt,
        schemaOrg: globalSettings?.schemaOrg
      }, config);
      alert('SEO settings saved successfully!');
    } catch (err) {
      alert('Failed to save SEO: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3 flex items-center gap-2">
        <SearchCheck size={18} /> SEO Management
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-black uppercase text-xs text-black">Basic SEO</h4>
          {[
            { label: 'Meta Title', key: 'websiteTitle' },
            { label: 'Meta Description', key: 'metaDescription' },
            { label: 'Keywords', key: 'seoKeywords' }
          ].map(({ label, key }) => (
            <div key={key} className="space-y-2">
              <label className="block font-bold text-xs text-gray-500 uppercase">{label}</label>
              <textarea rows={key === 'metaDescription' ? 3 : 2} value={globalSettings?.[key] || ''} onChange={(e) => setGlobalSettings({ ...globalSettings, [key]: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-black uppercase text-xs text-black">Social Media</h4>
          {[
            { label: 'Open Graph Title', key: 'openGraphTitle' },
            { label: 'Twitter Card Type', key: 'twitterCard' },
            { label: 'Canonical URL', key: 'canonicalUrl' }
          ].map(({ label, key }) => (
            <div key={key} className="space-y-2">
              <label className="block font-bold text-xs text-gray-500 uppercase">{label}</label>
              <input type="text" value={globalSettings?.[key] || ''} onChange={(e) => setGlobalSettings({ ...globalSettings, [key]: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-black uppercase text-xs text-black">Advanced SEO</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-bold text-xs text-gray-500 uppercase">Sitemap URL</label>
            <input type="text" value={globalSettings?.sitemapUrl || ''} onChange={(e) => setGlobalSettings({ ...globalSettings, sitemapUrl: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs" />
          </div>
          <div className="space-y-2">
            <label className="block font-bold text-xs text-gray-500 uppercase">robots.txt</label>
            <textarea rows="3" value={globalSettings?.robotsTxt || 'User-agent: *\nAllow: /'} onChange={(e) => setGlobalSettings({ ...globalSettings, robotsTxt: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs font-mono" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block font-bold text-xs text-gray-500 uppercase">Schema.org JSON-LD</label>
          <textarea rows="6" value={globalSettings?.schemaOrg || ''} onChange={(e) => setGlobalSettings({ ...globalSettings, schemaOrg: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-xs font-mono" placeholder='{"@context": "https://schema.org", "@type": "WebSite", ...}' />
        </div>
      </div>

      <button onClick={handleSaveSEO} className="bg-brand-burgundy text-white px-6 py-3 rounded-full text-xs font-bold uppercase">Save SEO Settings</button>
    </div>
  );
};
