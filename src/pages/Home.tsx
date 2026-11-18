import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Leaf, Truck } from 'lucide-react';
import { BRANDS, BRAND_LIST } from '../data/brands';
import type { BrandId } from '../data/brands';
import { PRODUCTS } from '../data/products';
import { BrandLogo } from '../components/BrandLogo';
import { ProductCard } from '../components/ProductCard';
import { QualityRings } from '../components/QualityRings';

export const Home: React.FC = () => {
  const [activeBrand, setActiveBrand] = useState<BrandId>('gladchemistry');
  const currentBrand = BRANDS[activeBrand];
  const featuredProducts = PRODUCTS.filter((p) => p.featured);

  return (
    <div className="space-y-24 pb-12">
      {/* HERO SECTION — Soda & Milkshake Inspired Interactive Showcase */}
      <section className="relative pt-6 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2.5rem] ui-card p-6 sm:p-10 lg:p-14">
            {/* Dynamic Ambient Glow */}
            <div
              className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-25 transition-colors duration-700"
              style={{ backgroundColor: currentBrand.primaryColor }}
            />
            <div
              className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-20 transition-colors duration-700"
              style={{ backgroundColor: currentBrand.secondaryColor }}
            />

            {/* Brand Switcher Pills */}
            <div className="relative z-10 flex flex-wrap items-center gap-2 mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                Select Brand:
              </span>
              {BRAND_LIST.map((b) => {
                const isSelected = b.id === activeBrand;
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBrand(b.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? `${b.buttonClass} border-transparent shadow-lg scale-105`
                        : 'bg-white/80 text-slate-600 border-slate-200 hover:bg-white'
                    }`}
                  >
                    {b.name}
                  </button>
                );
              })}
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Copy */}
              <div className="lg:col-span-6 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBrand}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-5"
                  >
                    <BrandLogo brand={activeBrand} size="md" />

                    <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 leading-[1.08]">
                      {activeBrand === 'gladchemistry' && (
                        <>
                          Pure Organic <span className="text-emerald-600">Personal Care</span>
                        </>
                      )}
                      {activeBrand === 'felis-be-glad' && (
                        <>
                          Signature <span className="text-amber-600">Fine Fragrances</span>
                        </>
                      )}
                      {activeBrand === 'bubbles-detergents' && (
                        <>
                          Spotless <span className="text-sky-600">Home &amp; Car Care</span>
                        </>
                      )}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                      {currentBrand.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {currentBrand.highlights.map((h) => (
                        <span
                          key={h}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${currentBrand.badgeClass}`}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={`/shop?brand=${activeBrand}`}
                    className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95 ${currentBrand.buttonClass}`}
                  >
                    Shop {currentBrand.name}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/brands"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    Explore All 3 Brands
                  </Link>
                </div>
              </div>

              {/* Right Floating Visual */}
              <div className="lg:col-span-6 relative flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeBrand}
                    initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.94, rotate: 2 }}
                    transition={{ duration: 0.45, type: 'spring', stiffness: 180 }}
                    className="relative w-full max-w-md"
                  >
                    <div className="animate-float-slow relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white">
                      <img
                        src={currentBrand.heroImage}
                        alt={currentBrand.name}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>

                    {/* Floating UI Pill 1 */}
                    <div className="animate-float-reverse absolute -bottom-5 -left-4 sm:-left-8 ui-card rounded-2xl px-4 py-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-400">Quality</p>
                        <p className="font-display font-bold text-sm text-slate-900">
                          Agency-Grade Formulas
                        </p>
                      </div>
                    </div>

                    {/* Floating UI Pill 2 */}
                    <div className="animate-float-slow absolute -top-4 -right-3 sm:-right-6 ui-card rounded-2xl px-4 py-2.5">
                      <p className="text-[11px] font-semibold text-slate-400">Range</p>
                      <p className="font-display font-extrabold text-base text-slate-900">
                        {currentBrand.tagline}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 DISTINCT BRANDS SHOWCASE */}
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Three Distinct Identities
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-1">
                Our 3 Signature Brands
              </h2>
            </div>
            <Link
              to="/brands"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Compare all brands <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BRAND_LIST.map((brand, idx) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`rounded-3xl p-6 border ${brand.bgTint} ${brand.borderTint} flex flex-col justify-between transition-shadow hover:shadow-xl`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <BrandLogo brand={brand.id} size="md" />
                  </div>
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-white border border-white/80 shadow-sm">
                    <img
                      src={brand.heroImage}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {brand.category}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-slate-900 mt-0.5">
                      {brand.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      {brand.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between">
                  <Link
                    to={`/shop?brand=${brand.id}`}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${brand.buttonClass}`}
                  >
                    Shop {brand.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO METRICS STRIP (Inspired by Reference UI) */}
      <section className="px-4">
        <div className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Leaf,
              label: 'Organic Botanicals',
              value: '100%',
              sub: 'Gladchemistry Personal Care',
              color: 'bg-emerald-100 text-emerald-700',
            },
            {
              icon: Sparkles,
              label: 'Fine Fragrances',
              value: '24+ Scents',
              sub: 'Felis be Glad & Diffusers',
              color: 'bg-amber-100 text-amber-700',
            },
            {
              icon: ShieldCheck,
              label: 'Cleaning Power',
              value: '99.9%',
              sub: 'Bubbles Home & Car Care',
              color: 'bg-sky-100 text-sky-700',
            },
            {
              icon: Truck,
              label: 'SA Delivery',
              value: 'Nationwide',
              sub: 'Fast & Reliable Dispatch',
              color: 'bg-violet-100 text-violet-700',
            },
          ].map((stat) => (
            <div key={stat.label} className="ui-card rounded-3xl p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">{stat.label}</p>
                <p className="font-display font-extrabold text-xl text-slate-900">{stat.value}</p>
                <p className="text-[11px] text-slate-500">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUALITY RINGS — Reference UI Inspired */}
      <QualityRings />

      {/* FEATURED BESTSELLERS */}
      <section className="px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Customer Favorites
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-1">
                Featured Bestsellers
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-emerald-600 transition-colors"
            >
              View full catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
