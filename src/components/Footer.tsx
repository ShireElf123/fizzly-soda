import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <BrandLogo brand="gladchemistry" size="md" />
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              Home of three distinct South African signature brands —{' '}
              <strong className="text-slate-700">Gladchemistry</strong> organic personal care,{' '}
              <strong className="text-slate-700">Felis be Glad</strong> fine fragrances &amp;
              diffusers, and <strong className="text-slate-700">Bubbles Detergents</strong> home
              &amp; car care.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <BrandLogo brand="felis-be-glad" size="sm" />
              <BrandLogo brand="bubbles-detergents" size="sm" />
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link to="/" className="hover:text-emerald-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-emerald-600 transition-colors">
                  Shop All Products
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-emerald-600 transition-colors">
                  Our 3 Brands
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-600 transition-colors">
                  Contact &amp; Wholesale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>Johannesburg, Gauteng, South Africa</li>
              <li>info@gladchemistry.com</li>
              <li>Mon – Fri: 08:00 – 17:00</li>
              <li>Sat: 09:00 – 13:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Gladchemistry Products. All rights reserved.</p>
          <p>Gladchemistry · Felis be Glad · Bubbles Detergents</p>
        </div>
      </div>
    </footer>
  );
};
