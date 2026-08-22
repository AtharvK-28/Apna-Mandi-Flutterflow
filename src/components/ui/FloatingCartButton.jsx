import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

/**
 * Quick route back to the cart from anywhere a vendor is shopping.
 *
 * Three things were wrong with the old version: it was mounted above the router
 * so it floated over the login screen and both non-vendor dashboards; it
 * navigated with `window.location.href`, which reloads the whole SPA and throws
 * away in-memory state; and its icon was a 🛒 emoji that rendered differently on
 * every platform.
 */
const FloatingCartButton = () => {
  const [showPreview, setShowPreview] = useState(false);
  const { can } = useAuth();
  const { cartCount, getCartTotal } = useCart();
  const { pathname } = useLocation();

  // Only buyers have a cart, an empty cart needs no shortcut, and there is no
  // point floating a link to the cart on top of the cart.
  if (!can('cart') || cartCount === 0 || pathname === '/cart') return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-40"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
    >
      {showPreview && (
        <div className="absolute bottom-[72px] right-0 w-72 card-warm overflow-hidden shadow-xl animate-slide-down">
          <div className="px-4 py-3 border-b border-paper-dark/60 flex items-center justify-between">
            <p className="font-display font-bold text-sm text-ink">Your cart</p>
            <p className="text-xs font-semibold text-ink-medium">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="px-4 py-3">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-semibold text-ink-medium">Total</span>
              <span className="font-display font-extrabold text-xl text-ink">
                ₹{getCartTotal().toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <Link
              to="/cart"
              className="press flex items-center justify-center gap-2 w-full text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
            >
              View cart and checkout
              <Icon name="ArrowRight" size={15} />
            </Link>
          </div>
        </div>
      )}

      <Link
        to="/cart"
        aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
        className="press relative w-14 h-14 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-[0_10px_28px_-8px_rgba(192,83,46,.9)] hover:bg-terracotta-dark transition-colors"
      >
        <Icon name="ShoppingCart" size={22} />
        <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-chili text-white text-[11px] font-extrabold flex items-center justify-center ring-2 ring-paper">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      </Link>
    </div>
  );
};

export default FloatingCartButton;
