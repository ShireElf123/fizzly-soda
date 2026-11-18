import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import type { Product } from '../data/products';
import { BRANDS } from '../data/brands';
import { useCart } from '../context/CartContext';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) return null;
  const brand = BRANDS[product.brand];

  const handleAdd = () => {
    addToCart(product, qty);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl rounded-[2rem] bg-white shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 text-slate-600 hover:bg-slate-100 shadow-sm cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="bg-slate-100 relative min-h-[280px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span
              className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-md ${brand.badgeClass}`}
            >
              {brand.name}
            </span>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <Sparkles className="h-3 w-3" />
                {product.preMessage}
              </div>

              <h2 className="font-display font-extrabold text-2xl text-slate-900 leading-tight">
                {product.name}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

              {product.notes && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Key Notes &amp; Actives
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.notes.map((n) => (
                      <span
                        key={n}
                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.variants && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Select Size / Option
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(i)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedVariant === i
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Price</span>
                  <span className="font-display font-extrabold text-2xl text-slate-900">
                    R{(product.price * qty).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-sm px-2">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="p-2 rounded-lg hover:bg-white text-slate-700 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer ${brand.buttonClass}`}
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
