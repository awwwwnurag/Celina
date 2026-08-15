import React, { useState, useContext } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import SettingsContext from '../context/SettingsContext';

export const FAQs = () => {
  const { pages } = useContext(SettingsContext);
  const [openIndex, setOpenIndex] = useState(null);
  const page = pages?.find(p => p.slug === 'faqs');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      q: 'How do I place an order?',
      a: 'Browse our catalog, select products, specify sizes, and add them to your Bag. Proceed to checkout, enter your delivery address details, pick a payment method (Cash on Delivery or Online Payment), and place your order.'
    },
    {
      q: 'Can I change or cancel my order after placing it?',
      a: 'Yes, orders in the "Processing" stage can be cancelled directly from your Profile tab "My Orders". Once the order status updates to "Shipped" or "Delivered", cancellation is no longer possible.'
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept Razorpay payments including Credit/Debit Cards, UPI, Netbanking, Wallet payments, and Cash on Delivery (COD) across eligible locations.'
    },
    {
      q: 'How can I track my shipment?',
      a: 'You can check active delivery details and real-time status updates (Processing, Shipped, Delivered) directly by accessing your "My Orders" tab inside your user profile.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We offer an easy 7-day exchange and returns policy. The item must be unused, unwashed, and retained with original packaging and brand tags intact.'
    },
    {
      q: 'How do I apply a coupon code?',
      a: 'During shopping bag checkout, type your active promo code (e.g. FLAT10) into the coupon form input inside the bag sliding drawer and click Apply. The discount will instantly reflect on your checkout calculations.'
    }
  ];

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
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-2 border-b border-brand-border dark:border-zinc-800 pb-4 text-center">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-brand-burgundy dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-400">
          Find instant answers to common questions about shopping at Celina.
        </p>
      </div>

      <div className="space-y-4">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-brand-border dark:border-zinc-800 rounded-xl overflow-hidden hover:border-brand-burgundy transition bg-white dark:bg-zinc-900"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full flex justify-between items-center p-5 text-left select-none outline-none"
              >
                <span className="font-bold text-xs uppercase tracking-wider text-brand-dark dark:text-white pr-4">
                  {item.q}
                </span>
                {isOpen ? (
                  <ChevronUp size={16} className="text-brand-burgundy flex-shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-gray-500 dark:text-gray-300 leading-relaxed font-semibold border-t border-brand-border dark:border-zinc-800/50 animate-fadeIn">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQs;
