import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { BRAND_LIST } from '../data/brands';
import type { BrandId } from '../data/brands';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBrand = (searchParams.get('brand') as BrandId | 'all') || 'all';

  const [selectedBrand, setSelectedBrand] = useState<BrandId | 'all'>(initialBrand);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  useEffect(() => {
    const paramBrand = (searchParams.get('brand') as BrandId | 'all') || 'all';
    setSelectedBrand(paramBrand);
  }, [searchParams]);

  const handleBrandChange = (brand: BrandId | 'all') => {
    setSelectedBrand(brand);
    if (brand === 'all') {
      searchParams.delete('brand');
    } else {
      searchParams.set('brand', brand);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];
    if (selectedBrand !== 'all') {
      list = list.filter((p) => p.brand === selectedBrand);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedBrand, searchQuery, sortBy]);

  return (
    <div className="px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="ui-card rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              E-Commerce Catalog
            </span>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 mt-1">
              Shop All Products
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Browse organic personal care, fine fragrances, diffusers, and home &amp; car detergents.
            </p>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="relative flex items-center">
              <SlidersHorizontal className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-10 pr-8 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brand Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleBrandChange('all')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedBrand === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Brands ({PRODUCTS.length})
          </button>
          {BRAND_LIST.map((b) => {
            const count = PRODUCTS.filter((p) => p.brand === b.id).length;
            const active = selectedBrand === b.id;
            return (
              <button
                key={b.id}
                onClick={() => handleBrandChange(b.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  active
                    ? `${b.buttonClass} border-transparent shadow-md`
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {b.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="ui-card rounded-3xl p-14 text-center">
            <p className="font-display font-bold text-lg text-slate-900">No products found</p>
            <p className="text-sm text-slate-500 mt-1">
              Try clearing your search or selecting a different brand.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
