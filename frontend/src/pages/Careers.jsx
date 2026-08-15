import React, { useState } from 'react';
import { Briefcase, MapPin, Users, Heart, Award, ArrowUpRight } from 'lucide-react';

export const Careers = () => {
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Fashion Designer',
    portfolio: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.portfolio) return;
    setSuccess(true);
    setFormData({ name: '', email: '', role: 'Fashion Designer', portfolio: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  const openings = [
    { title: 'Senior Apparel Designer (Ethnic/Fusion)', type: 'Full-Time', location: 'Mumbai HQ', experience: '5+ Years' },
    { title: 'E-commerce Frontend Developer (React)', type: 'Full-Time / Remote', location: 'Bengaluru Office', experience: '3+ Years' },
    { title: 'Merchandising & Production Manager', type: 'Full-Time', location: 'Delhi Hub', experience: '4+ Years' },
    { title: 'Social Media & Brand Growth Manager', type: 'Full-Time', location: 'Mumbai HQ', experience: '2+ Years' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-2 border-b border-brand-border dark:border-zinc-800 pb-4 text-center">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-brand-burgundy dark:text-white">
          Careers at Celina Clothing
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-400">
          Build the future of Indian fashion and shopping experiences with us.
        </p>
      </div>

      {/* Grid of Work Culture values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-brand-border dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 bg-brand-light/20 dark:bg-zinc-800/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-burgundy/10 text-brand-burgundy">
            <Users size={22} />
          </div>
          <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Creative Autonomy</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">We trust our designers, developers, and marketers with full ownership of their work pipelines.</p>
        </div>

        <div className="border border-brand-border dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 bg-brand-light/20 dark:bg-zinc-800/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-burgundy/10 text-brand-burgundy">
            <Heart size={22} />
          </div>
          <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Inclusivity & Growth</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">An inclusive workspace structure built around wellness, progress reviews, and constant mentorship.</p>
        </div>

        <div className="border border-brand-border dark:border-zinc-800 rounded-2xl p-6 text-center space-y-3 bg-brand-light/20 dark:bg-zinc-800/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-burgundy/10 text-brand-burgundy">
            <Award size={22} />
          </div>
          <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Premium Benefits</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">Top tier salary packages, health insurance coverage plans, wellness support, and clothing credits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
        {/* Open Roles list */}
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white">
              Open Opportunities
            </h2>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase">
              Apply directly to our active open positions.
            </p>
          </div>

          <div className="space-y-4">
            {openings.map((job, idx) => (
              <div key={idx} className="border border-brand-border dark:border-zinc-800 rounded-xl p-5 bg-brand-light/5 dark:bg-zinc-900/5 flex justify-between items-center group hover:border-brand-burgundy transition">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-white group-hover:text-brand-burgundy transition">{job.title}</h4>
                  <div className="flex gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Briefcase size={12} /> {job.type}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold mt-1">Req: {job.experience}</p>
                </div>
                <ArrowUpRight size={18} className="text-gray-300 group-hover:text-brand-burgundy group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-8 rounded-2xl shadow-sm space-y-6">
          <div>
            <h2 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white">
              Join the Team
            </h2>
            <p className="text-xs text-gray-400 font-semibold mt-1 uppercase">
              Submit your resume and details for priority consideration.
            </p>
          </div>

          {success && (
            <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-xs font-bold p-4 rounded-lg border border-green-200 dark:border-green-900 animate-fadeIn">
              ✓ Application submitted successfully! Our HR team will review and contact you.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-500">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Anurag Aryan"
                className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-500">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g. example@gmail.com"
                className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500">Position</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                >
                  {openings.map((o, idx) => (
                    <option key={idx} value={o.title}>{o.title}</option>
                  ))}
                  <option value="Other">Other Roles</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-gray-500">Resume / Portfolio URL</label>
                <input
                  type="url"
                  required
                  value={formData.portfolio}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio: e.target.value }))}
                  placeholder="Link to Drive, Behance or GitHub"
                  className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase font-bold text-gray-500">Introduction Note (Optional)</label>
              <textarea
                rows="3"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us why you are a great fit..."
                className="w-full text-xs p-3 border border-gray-300 dark:border-gray-700 dark:bg-zinc-800 rounded outline-none focus:border-brand-burgundy text-brand-dark dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="bg-brand-burgundy text-white hover:opacity-90 py-2.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition"
            >
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Careers;
