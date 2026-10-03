import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
            <div className="flex items-center gap-2">
              <Heart size={20} className="text-rose-600 fill-rose-600" />
              <h2 className="font-serif text-lg font-bold text-gray-900">Saved Bouquets</h2>
              <span className="bg-rose-100 text-rose-800 text-xs px-2 py-0.5 rounded-full font-bold">
                {wishlist.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-rose-100 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-rose-50">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-300 text-3xl">
                  💖
                </div>
                <h3 className="font-serif font-bold text-gray-800 text-base">Your wishlist is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs">
                  Save your favorite arrangements here by clicking the heart icon on any bouquet!
                </p>
              </div>
            ) : (
              wishlist.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-18 h-18 rounded-2xl object-cover bg-rose-50 border border-rose-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                    <p className="text-xs font-bold text-gray-900 mt-1">₹{Number(item.price).toLocaleString('en-IN')}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          onAddToCart(item);
                          onRemoveFromWishlist(item.id);
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition"
                      >
                        <ShoppingBag size={13} /> Move to Cart
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(item.id)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 transition"
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

        </div>
      </div>
    </div>
  );
}
