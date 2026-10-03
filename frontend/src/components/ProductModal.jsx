import React, { useState } from 'react';
import { X, Star, Heart, ShieldCheck, Clock, MapPin, ShoppingBag, Check } from 'lucide-react';

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  // Size price calculation
  const sizeMultiplier = selectedSize === 'Deluxe' ? 350 : selectedSize === 'Grand' ? 700 : 0;
  const basePrice = product.discounted_price ? Number(product.discounted_price) : Number(product.price);
  const totalPrice = (basePrice + sizeMultiplier) * quantity;

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus('Available for same-day express 2-hour delivery! 🚀');
    } else {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      price: basePrice + sizeMultiplier,
      selectedSize,
      customNote,
      quantity
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row relative border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition"
        >
          <X size={20} />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-rose-50 flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover max-h-[350px] md:max-h-full"
          />
          {product.is_bestseller === 1 && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
              Florist Bestseller
            </span>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto max-h-[85vh] space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                {product.occasion || 'Fresh Floral Arrangement'}
              </span>
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-full ${isWishlisted ? 'text-rose-600' : 'text-gray-400 hover:text-rose-600'}`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <h2 className="font-serif text-2xl font-bold text-gray-900 mt-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
              <div className="flex items-center text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded">
                <Star size={13} fill="currentColor" className="mr-1" />
                {product.rating || '4.9'}
              </div>
              <span>({product.review_count || 18} Verified Buyer Reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-bold font-serif text-gray-900">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
            {product.discounted_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{((Number(product.price) + sizeMultiplier) * quantity).toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-rose-600 font-semibold">(Taxes included)</span>
          </div>

          {/* Flowers Included */}
          <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-100 text-xs space-y-1">
            <p className="font-bold text-gray-800">🌿 Stems & Bloom Breakdown:</p>
            <p className="text-gray-600 leading-relaxed">{product.flowers_included || product.description}</p>
          </div>

          {/* Size Options */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-2">Select Bouquet Size:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Standard', desc: `${product.stem_count || 12} Stems`, extra: '+₹0' },
                { name: 'Deluxe', desc: `${(product.stem_count || 12) + 6} Stems`, extra: '+₹350' },
                { name: 'Grand', desc: `${(product.stem_count || 12) + 12} Stems`, extra: '+₹700' }
              ].map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setSelectedSize(s.name)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    selectedSize === s.name
                      ? 'border-rose-600 bg-rose-50/80 text-rose-900 shadow-sm'
                      : 'border-gray-200 hover:border-rose-200 text-gray-600'
                  }`}
                >
                  <p className="text-xs font-bold">{s.name}</p>
                  <p className="text-[10px] text-gray-500">{s.desc}</p>
                  <p className="text-[10px] text-rose-600 font-semibold">{s.extra}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Personal Greeting Card Message */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Complimentary Florist Note Card (Optional):
            </label>
            <textarea
              rows="2"
              placeholder="Write your sweet words to the recipient..."
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full text-xs p-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none"
              maxLength={150}
            />
          </div>

          {/* Delivery Check */}
          <form onSubmit={handlePincodeCheck} className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">Check Express City Delivery:</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit PIN code (e.g. 500001)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button
                type="submit"
                className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Check
              </button>
            </div>
            {pincodeStatus && (
              <p className="text-[11px] text-emerald-700 font-medium">{pincodeStatus}</p>
            )}
          </form>

          {/* Quantity & CTA */}
          <div className="flex items-center gap-3 pt-3">
            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded-l-xl"
              >
                -
              </button>
              <span className="w-9 text-center text-xs font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200 rounded-r-xl"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-xl'
              }`}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Add to Cart (₹{totalPrice.toLocaleString('en-IN')})
                </>
              )}
            </button>
          </div>

          {/* Safety & Care note */}
          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-gray-500 border-t border-rose-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>100% Farm Fresh Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-rose-600" />
              <span>Same-Day Guaranteed Delivery</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
