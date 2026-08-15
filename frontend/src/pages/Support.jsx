import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Clock, Send } from 'lucide-react';

export const Support = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    setSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-2 border-b border-brand-border dark:border-zinc-800 pb-4 text-center">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-brand-burgundy dark:text-white">
          Customer Support
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-400">
          We are here to help. Reach out to us through any of the channels below.
        </p>
      </div>

      {/* Grid of contact methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-brand-border dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 bg-brand-light/20 dark:bg-zinc-800/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-burgundy/10 text-brand-burgundy">
            <Mail size={22} />
          </div>
          <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Email Support</h3>
          <p className="text-xs text-gray-500 font-medium">Get a response within 24 business hours.</p>
          <a href="mailto:support@celinaclothing.com" className="block text-sm font-bold text-brand-burgundy hover:underline">
            support@celinaclothing.com
          </a>
        </div>

        <div className="border border-brand-border dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 bg-brand-light/20 dark:bg-zinc-800/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-burgundy/10 text-brand-burgundy">
            <Phone size={22} />
          </div>
          <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Toll-Free Phone</h3>
          <p className="text-xs text-gray-500 font-medium">Direct support line for active orders.</p>
          <a href="tel:18001234567" className="block text-sm font-bold text-brand-burgundy hover:underline">
            1800-123-4567
          </a>
        </div>

        <div className="border border-brand-border dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 bg-brand-light/20 dark:bg-zinc-800/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-burgundy/10 text-brand-burgundy">
            <Clock size={22} />
          </div>
          <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Live Support Hours</h3>
          <p className="text-xs text-gray-500 font-medium">Our helpdesk agents are active online.</p>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
        {/* Support Inquiry Form */}
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white">
              Send an Inquiry
            </h2>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase">
              Submit your ticket and our agents will respond via email.
            </p>
          </div>

          {success && (
            <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-xs font-bold p-4 rounded-lg border border-green-200 dark:border-green-900 animate-fadeIn">
              ✓ Inquiry submitted successfully! Our representative will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anurag"
                  className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. example@gmail.com"
                  className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-500">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Request for Refund / Exchange Option"
                className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-500">Message / details</label>
              <textarea
                required
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain your problem in details..."
                className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-burgundy text-white hover:opacity-90 py-2.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition"
            >
              <Send size={12} /> Send Message
            </button>
          </form>
        </div>

        {/* Common Help Topics FAQ quicklinks */}
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white">
              Instant Help Resources
            </h2>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase">
              Save time with instant resolutions to common issues.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How do I cancel my order?', a: 'You can cancel any order directly from your profile tab "My Orders" while the order is in the "Processing" stage.' },
              { q: 'What is the return policy?', a: 'We offer an easy 7-day hassle-free return and size exchange policy on unworn apparel items with original tags intact.' },
              { q: 'Are there shipping charges?', a: 'We offer Free Delivery on orders above ₹1299. For orders below ₹1299, a flat standard delivery rate of ₹99 is applicable.' }
            ].map((item, idx) => (
              <div key={idx} className="border border-brand-border dark:border-zinc-800 rounded-xl p-4 bg-brand-light/5 dark:bg-zinc-900/5 hover:border-brand-burgundy transition">
                <h4 className="font-bold text-xs uppercase text-brand-burgundy dark:text-red-400">{item.q}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
