import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [inquiryType, setInquiryType] = useState<'retail' | 'wholesale'>('retail');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="ui-card rounded-3xl p-8 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Get in Touch
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-1">
                Contact &amp; Wholesale
              </h1>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Have a question about Gladchemistry, Felis be Glad, or Bubbles Detergents? Reach
                out for orders, stockist opportunities, or bulk pricing.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900">Location</p>
                  <p className="text-sm text-slate-500">Johannesburg, Gauteng, South Africa</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900">Email</p>
                  <p className="text-sm text-slate-500">info@gladchemistry.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-sm text-slate-900">Business Hours</p>
                  <p className="text-sm text-slate-500">Mon – Fri: 08:00 – 17:00 | Sat: 09:00 – 13:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="ui-card rounded-3xl p-8"
          >
            {submitted ? (
              <div className="py-16 text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-900">
                  Message Received!
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Thank you for contacting Gladchemistry Products. Our team will respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => setInquiryType('retail')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      inquiryType === 'retail'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Retail / General
                  </button>
                  <button
                    type="button"
                    onClick={() => setInquiryType('wholesale')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      inquiryType === 'wholesale'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500'
                    }`}
                  >
                    Wholesale &amp; Bulk
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Brand of Interest
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
                    <option>All 3 Brands</option>
                    <option>Gladchemistry (Organic Personal Care)</option>
                    <option>Felis be Glad (Fine Fragrances &amp; Diffusers)</option>
                    <option>Bubbles Detergents (Home &amp; Car Care)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
