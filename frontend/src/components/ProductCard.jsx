import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';

export default function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onQuickView
}) {
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discountPercent = product.discounted_price && product.price > product.discounted_price
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0;

  const currentPrice = product.discounted_price ? Number(product.discounted_price) : Number(product.price);
  const originalPrice = Number(product.price);

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group bg-white rounded-2xl border border-rose-100/80 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.is_bestseller === 1 && (
          <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
            Bestseller
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Wishlist button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-rose-500 text-white shadow-md'
            : 'bg-white/80 backdrop-blur-md text-gray-500 hover:text-rose-600 hover:bg-white shadow-sm'
        }`}
        title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-rose-50">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Quick View overlay hint */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white/95 text-gray-900 text-xs font-semibold px-4 py-2 rounded-full shadow flex items-center gap-1.5 backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye size={14} className="text-rose-600" /> Quick Details
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Stems & Category */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5 font-medium">
            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-semibold">
              {product.stem_count || 12} Fresh Stems
            </span>
            <span>{product.occasion || 'Bouquet'}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-gray-900 text-base line-clamp-1 group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          {/* Flower breakdown summary */}
          <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-light">
            {product.flowers_included || product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex items-center text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-bold">
              <Star size={12} fill="currentColor" className="mr-0.5" />
              <span>{product.rating || '4.9'}</span>
            </div>
            <span className="text-[11px] text-gray-400">({product.review_count || 24} reviews)</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-4 mt-3 border-t border-rose-50 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900 font-serif">₹{currentPrice.toLocaleString('en-IN')}</span>
              {discountPercent > 0 && (
                <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium block">Standard Delivery Available</span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-md'
            }`}
          >
            {added ? (
              <>
                <Check size={14} /> Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
