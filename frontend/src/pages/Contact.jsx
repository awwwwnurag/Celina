import React, { useState, useContext } from 'react';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import SettingsContext from '../context/SettingsContext';

export const Contact = () => {
  const { settings } = useContext(SettingsContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-2 border-b border-brand-border dark:border-zinc-800 pb-4">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-brand-burgundy dark:text-white">
          Contact Customer Care
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-400">We love to hear from you. Responses within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Contact info details */}
        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300">
          <h3 className="font-display font-semibold text-lg text-brand-burgundy dark:text-white uppercase tracking-wider">
            Get In Touch
          </h3>
          <p className="leading-relaxed">
            Need help with sizes, custom fitting, returns or tracking your prepaid package? Our support executives are active all days to assist you immediately.
          </p>

          <div className="space-y-4 pt-4 font-semibold">
            <div className="flex items-center gap-3">
              <Mail className="text-brand-burgundy dark:text-white flex-shrink-0" size={20} />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase">Support Email</span>
                <span className="text-brand-dark dark:text-white">{settings?.contactEmail || 'support@yourcompany.com'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="text-brand-burgundy dark:text-white flex-shrink-0" size={20} />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase">WhatsApp Support</span>
                <span className="text-brand-dark dark:text-white">{settings?.contactPhone || '+91 99990 00000'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-brand-burgundy dark:text-white flex-shrink-0" size={20} />
              <div>
                <span className="block text-[10px] text-gray-400 uppercase">Office Headquarters</span>
                <span className="text-brand-dark dark:text-white">{settings?.businessAddress || 'Ground Floor, SD-46, Sector 45, Noida, UP, 201303'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-brand-light dark:bg-zinc-800 p-6 rounded-lg border border-brand-border dark:border-zinc-700">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle size={40} className="text-green-500 mx-auto" />
              <h4 className="font-display font-semibold text-brand-burgundy dark:text-white uppercase text-sm">Message Sent Successfully!</h4>
              <p className="text-xs text-gray-500">Thank you for writing. Our support representative will contact you shortly.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-brand-burgundy text-white text-[10px] font-bold uppercase tracking-wider px-6 py-2 rounded-full"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-gray-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shruti Gupta"
                  className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-700 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-gray-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. shruti@gmail.com"
                  className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-700 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase font-bold text-gray-500">Message / Inquiry</label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you? Reference your order numbers if any..."
                  className="w-full text-sm p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-700 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-burgundy text-white hover:opacity-90 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
export default Contact;
