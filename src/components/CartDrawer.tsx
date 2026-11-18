import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BRANDS } from '../data/brands';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, updateQuantity, removeFromCart, clearCart, subtotal } =
    useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckout = () => {
    setCheckedOut(true);
    setTimeout(() => {
      clearCart();
      setCheckedOut(false);
      closeCart();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
                <h2 className="font-display font-bold text-lg text-slate-900">Your Cart</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {checkedOut ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                    Order Confirmed!
                  </h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    Thank you for shopping with Gladchemistry, Felis be Glad & Bubbles Detergents.
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-slate-900 mb-1">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-slate-500">
                    Explore our 3 signature brands and add your favorites.
                  </p>
                </div>
              ) : (
                items.map(({ product, quantity }) => {
                  const brandInfo = BRANDS[product.brand];
                  return (
                    <div
                      key={product.id}
                      className="flex gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-20 w-20 rounded-xl object-cover bg-white border border-slate-100"
                      />
                      <div className="flex-1 min-w-0">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1 ${brandInfo.badgeClass}`}
                        >
                          {brandInfo.name}
                        </span>
                        <h4 className="font-display font-semibold text-sm text-slate-900 truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-slate-500 mb-2">{product.size}</p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900">
                            R{(product.price * quantity).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-1.5 bg-white rounded-lg border border-slate-200 p-0.5">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 hover:bg-slate-100 rounded-md text-slate-600 cursor-pointer"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-bold px-1.5">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 hover:bg-slate-100 rounded-md text-slate-600 cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="self-start p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && !checkedOut && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/60 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-display font-bold text-xl text-slate-900">
                    R{subtotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-lg shadow-slate-900/15 transition-all active:scale-[0.99] cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
