import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Sparkles } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  discount,
  setDiscount
}) {
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * (item.quantity || 1)), 0);
  const deliveryThreshold = 999;
  const isFreeDelivery = subtotal >= deliveryThreshold || appliedCoupon === 'FREESHIP';
  const deliveryFee = subtotal === 0 ? 0 : (isFreeDelivery ? 0 : 99);
  
  const discountAmount = appliedCoupon === 'BLOOM10' ? Math.round(subtotal * 0.10) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'BLOOM10') {
      setAppliedCoupon('BLOOM10');
      setDiscount(0.10);
    } else if (code === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      setDiscount(0);
    } else {
      setCouponError('Invalid coupon code. Try "BLOOM10"');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-rose-600" />
              <h2 className="font-serif text-lg font-bold text-gray-900">Your Fresh Cart</h2>
              <span className="bg-rose-100 text-rose-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {items.reduce((acc, i) => acc + (i.quantity || 1), 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-rose-100 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="p-4 bg-rose-50/80 border-b border-rose-100 text-xs">
            {subtotal >= deliveryThreshold ? (
              <p className="text-emerald-700 font-bold flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked Free Same-Day Express Delivery!
              </p>
            ) : (
              <div>
                <p className="text-gray-700 mb-1.5">
                  Add <span className="font-bold text-rose-600">₹{(deliveryThreshold - subtotal).toLocaleString('en-IN')}</span> more to get <span className="font-bold">FREE Express Delivery</span>!
                </p>
                <div className="w-full bg-rose-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-rose-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / deliveryThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-rose-50">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-4xl shadow-inner">
                  💐
                </div>
                <div>
                  <h3 className="font-serif font-bold text-gray-800 text-base">Your cart is empty</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Choose from our fresh hand-crafted rose bouquets, lilies, or design your own bespoke gift!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition shadow"
                >
                  Explore Bouquets
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-18 h-18 rounded-2xl object-cover bg-rose-50 border border-rose-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                    {item.selectedSize && (
                      <p className="text-[11px] text-rose-600 font-medium">{item.selectedSize}</p>
                    )}
                    {item.customNote && (
                      <p className="text-[10px] text-gray-400 italic truncate">Note: "{item.customNote}"</p>
                    )}
                    <p className="text-xs font-bold text-gray-900 mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                        <button
                          onClick={() => onUpdateQuantity(idx, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-l-lg"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity || 1}</span>
                        <button
                          onClick={() => onUpdateQuantity(idx, 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-r-lg"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-gray-400 hover:text-rose-600 transition p-1"
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-rose-100 bg-rose-50/40 space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. BLOOM10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-rose-200 rounded-xl uppercase font-semibold focus:outline-none focus:ring-1 focus:ring-rose-400"
                  />
                  <Tag size={13} className="absolute right-3 top-2.5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  className="bg-gray-800 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold"
                >
                  Apply
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl">
                  <span>Coupon <b>{appliedCoupon}</b> applied!</span>
                  <button onClick={removeCoupon} className="text-emerald-900 font-bold hover:underline">Remove</button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-rose-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount (10%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold font-serif text-gray-900 pt-2 border-t border-rose-200">
                  <span>Grand Total</span>
                  <span className="text-rose-700">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout({ subtotal, discountAmount, deliveryFee, grandTotal });
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
