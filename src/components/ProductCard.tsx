import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Heart, Sparkles } from 'lucide-react';
import type { Product } from '../data/products';
import { BRANDS } from '../data/brands';
import { useCart } from '../context/CartContext';
import { ProductModal } from './ProductModal';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const brand = BRANDS[product.brand];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.01 }}
        className="group ui-card rounded-3xl p-4 flex flex-col justify-between transition-shadow duration-300 hover:shadow-2xl"
      >
        <div>
          <div
            onClick={() => setModalOpen(true)}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 mb-3.5 cursor-pointer"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${brand.badgeClass}`}
              >
                {brand.name}
              </span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLiked(!liked);
                }}
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  liked
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white/85 text-slate-600 hover:bg-white'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setModalOpen(true);
                }}
                className="p-2 rounded-full bg-white/85 text-slate-700 hover:bg-white backdrop-blur-md transition-all cursor-pointer"
                aria-label="Quick view"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
            </div>

            {product.badge && (
              <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/85 text-white backdrop-blur-md">
                {product.badge}
              </span>
            )}
          </div>

          <div className="px-1">
            {/* Pre-Message */}
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50/90 px-2.5 py-0.5 rounded-full mb-2">
              <Sparkles className="h-3 w-3 shrink-0" />
              <span className="truncate">{product.preMessage}</span>
            </div>

            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-slate-400">{product.category}</span>
              <span className="text-xs font-semibold text-slate-500">{product.size}</span>
            </div>
            <h3
              onClick={() => setModalOpen(true)}
              className="font-display font-bold text-slate-900 text-lg leading-snug mb-1.5 cursor-pointer hover:text-emerald-700 transition-colors"
            >
              {product.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
              {product.description}
            </p>
          </div>
        </div>

        <div className="px-1 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Price</span>
            <span className="font-display font-extrabold text-lg text-slate-900">
              R{product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer ${brand.buttonClass}`}
          >
            <Plus className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </motion.div>

      {modalOpen && (
        <ProductModal product={product} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
};
