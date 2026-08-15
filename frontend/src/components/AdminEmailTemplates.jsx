import React from 'react';
import { MailCheck } from 'lucide-react';
import axios from 'axios';

export const AdminEmailTemplates = ({ globalSettings, setGlobalSettings, getAuthConfig }) => {
  const handleSaveTemplates = async () => {
    try {
      const config = getAuthConfig();
      await axios.put('/api/settings', { emailTemplates: globalSettings?.emailTemplates }, config);
      alert('Email templates saved successfully!');
    } catch (err) {
      alert('Failed to save templates: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-brand-border p-6 rounded-lg shadow-sm space-y-6">
      <h3 className="font-Poppins font-black text-sm uppercase tracking-wider text-black border-b border-brand-border pb-3 flex items-center gap-2">
        <MailCheck size={18} /> Email Templates
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { key: 'orderConfirmation', label: 'Order Confirmation' },
          { key: 'shipping', label: 'Shipping Notification' },
          { key: 'delivered', label: 'Delivery Confirmation' },
          { key: 'cancelled', label: 'Order Cancellation' },
          { key: 'refund', label: 'Refund Processed' },
          { key: 'newsletter', label: 'Newsletter' },
          { key: 'otp', label: 'OTP Verification' },
          { key: 'welcome', label: 'Welcome Email' }
        ].map(({ key, label }) => (
          <div key={key} className="border border-brand-border rounded-lg p-4 space-y-3">
            <h4 className="font-black uppercase text-xs text-black">{label}</h4>
            <div className="space-y-2">
              <label className="block font-bold text-xs text-gray-500 uppercase">Subject Line</label>
              <input type="text" value={globalSettings?.emailTemplates?.[`${key}Subject`] || ''} onChange={(e) => setGlobalSettings({
                ...globalSettings,
                emailTemplates: { ...(globalSettings?.emailTemplates || {}), [`${key}Subject`]: e.target.value }
              })} className="w-full p-2 border border-gray-300 rounded text-xs" placeholder={`Subject for ${label}`} />
            </div>
            <div className="space-y-2">
              <label className="block font-bold text-xs text-gray-500 uppercase">Email Body (HTML)</label>
              <textarea rows="8" value={globalSettings?.emailTemplates?.[key] || `<h1>${label}</h1><p>Hi {{customerName}},</p><p>Your order update is here.</p>`} onChange={(e) => setGlobalSettings({
                ...globalSettings,
                emailTemplates: { ...(globalSettings?.emailTemplates || {}), [key]: e.target.value }
              })} className="w-full p-2 border border-gray-300 rounded text-xs font-mono" />
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSaveTemplates} className="bg-brand-burgundy text-white px-6 py-3 rounded-full text-xs font-bold uppercase">Save Email Templates</button>
    </div>
  );
};
