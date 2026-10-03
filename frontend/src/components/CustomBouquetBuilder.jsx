import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Minus, ShoppingBag, Check, Layers, Gift } from 'lucide-react';
import { api } from '../services/api';

const AVAILABLE_FLOWERS = [
  { id: 'rose', name: 'Dutch Red Roses', price: 45, emoji: '🌹', color: '#e11d48' },
  { id: 'lily', name: 'Oriental Lilies', price: 75, emoji: '🌸', color: '#ec4899' },
  { id: 'orchid', name: 'Thai Orchids', price: 85, emoji: '🪻', color: '#9333ea' },
  { id: 'sunflower', name: 'Golden Sunflowers', price: 90, emoji: '🌻', color: '#eab308' },
  { id: 'carnation', name: 'Pastel Carnations', price: 35, emoji: '🌺', color: '#f43f5e' },
  { id: 'tulip', name: 'Holland Tulips', price: 95, emoji: '🌷', color: '#f97316' },
  { id: 'hydrangea', name: 'Blue Hydrangeas', price: 130, emoji: '💐', color: '#3b82f6' }
];

const WRAPPERS = [
  { name: 'Matte Black Luxury', price: 120, hex: '#18181b', desc: 'Sleek, dark modern aesthetic' },
  { name: 'Pearl Blush', price: 100, hex: '#fbcfe8', desc: 'Soft pastel pink elegance' },
  { name: 'Rustic Eco-Craft', price: 50, hex: '#d97706', desc: 'Natural brown vintage look' },
  { name: 'Sage Green Silk', price: 110, hex: '#84cc16', desc: 'Earthy calm botanical touch' },
  { name: 'Royal Velvet Box', price: 350, hex: '#831843', desc: 'Premium reusable hatbox' }
];

const RIBBONS = [
  { name: 'Satin Gold', price: 40, hex: '#eab308' },
  { name: 'Silk Burgundy', price: 40, hex: '#881337' },
  { name: 'Rose Gold', price: 50, hex: '#f43f5e' },
  { name: 'Emerald Velvet', price: 60, hex: '#065f46' }
];

const ADDONS = [
  { id: 'chocolates', name: 'Ferrero Rocher Box (16 Pcs)', price: 499, emoji: '🍫' },
  { id: 'teddy', name: 'Cute Fluffy Teddy Bear (6")', price: 399, emoji: '🧸' },
  { id: 'vase', name: 'Crystal Glass Flower Vase', price: 349, emoji: '🏺' },
  { id: 'greetingCard', name: 'Luxury Handwritten Card', price: 99, emoji: '💌' }
];

export default function CustomBouquetBuilder({ isOpen, onClose, onAddToCart }) {
  const [flowerCounts, setFlowerCounts] = useState({
    rose: 8,
    lily: 4,
    orchid: 0,
    sunflower: 0,
    carnation: 0,
    tulip: 0,
    hydrangea: 0
  });

  const [selectedWrapper, setSelectedWrapper] = useState('Matte Black Luxury');
  const [selectedRibbon, setSelectedRibbon] = useState('Satin Gold');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [customNote, setCustomNote] = useState('');
  const [calculatedTotal, setCalculatedTotal] = useState(1200);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Recalculate price whenever inputs change
  useEffect(() => {
    let flowerTotal = 0;
    for (const [key, count] of Object.entries(flowerCounts)) {
      const fl = AVAILABLE_FLOWERS.find(f => f.id === key);
      if (fl) flowerTotal += fl.price * count;
    }

    const wrapperObj = WRAPPERS.find(w => w.name === selectedWrapper);
    const wrapperPrice = wrapperObj ? wrapperObj.price : 100;

    const ribbonObj = RIBBONS.find(r => r.name === selectedRibbon);
    const ribbonPrice = ribbonObj ? ribbonObj.price : 40;

    let addonsPrice = 0;
    selectedAddons.forEach(addonId => {
      const a = ADDONS.find(item => item.id === addonId);
      if (a) addonsPrice += a.price;
    });

    const baseFillers = 150; // Baby breath and fresh eucalyptus greens
    setCalculatedTotal(flowerTotal + wrapperPrice + ribbonPrice + addonsPrice + baseFillers);
  }, [flowerCounts, selectedWrapper, selectedRibbon, selectedAddons]);

  if (!isOpen) return null;

  const totalStems = Object.values(flowerCounts).reduce((a, b) => a + b, 0);

  const updateFlower = (id, delta) => {
    setFlowerCounts(prev => {
      const nextCount = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: nextCount };
    });
  };

  const toggleAddon = (id) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAddCustomToCart = () => {
    if (totalStems < 6) {
      alert('Please select at least 6 stems to build a lovely bouquet!');
      return;
    }

    const chosenFlowersDesc = Object.entries(flowerCounts)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const flower = AVAILABLE_FLOWERS.find(f => f.id === id);
        return `${count}x ${flower?.name || id}`;
      }).join(', ');

    const customBouquetItem = {
      id: 'custom-' + Date.now(),
      name: `Custom Artisan Bouquet (${totalStems} Stems)`,
      price: calculatedTotal,
      image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
      description: `Bespoke handcraft: ${chosenFlowersDesc}. Wrapped in ${selectedWrapper} with ${selectedRibbon} ribbon.`,
      flowers_included: chosenFlowersDesc,
      selectedSize: `${totalStems} Stems Custom`,
      customNote: customNote || 'Custom Florist Selection',
      quantity: 1,
      isCustom: true
    };

    setIsSubmitting(true);
    setTimeout(() => {
      onAddToCart(customBouquetItem);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-700/80 flex items-center justify-center text-amber-200">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">Custom Bouquet Studio</h2>
              <p className="text-xs text-rose-200">Design your own signature arrangement stem by stem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
          
          {/* Step 1: Pick Flowers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <span className="w-5 h-5 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center">1</span>
                Select Your Flowers & Stems ({totalStems} Total Stems)
              </h3>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
                Min. 6 stems recommended
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AVAILABLE_FLOWERS.map((fl) => {
                const count = flowerCounts[fl.id] || 0;
                return (
                  <div
                    key={fl.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      count > 0 ? 'border-rose-500 bg-rose-50/50 shadow-sm' : 'border-gray-200 hover:border-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{fl.emoji}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{fl.name}</p>
                        <p className="text-[11px] text-gray-500">₹{fl.price} / stem</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateFlower(fl.id, -1)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-700 flex items-center justify-center hover:bg-rose-100 hover:border-rose-400 text-xs font-bold disabled:opacity-30"
                        disabled={count <= 0}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-bold text-xs">{count}</span>
                      <button
                        onClick={() => updateFlower(fl.id, 1)}
                        className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 text-xs font-bold shadow-sm"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 2: Luxury Wrapping */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-3">
              <span className="w-5 h-5 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center">2</span>
              Choose Luxury Wrapping Style
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {WRAPPERS.map((w) => (
                <button
                  key={w.name}
                  onClick={() => setSelectedWrapper(w.name)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedWrapper === w.name
                      ? 'border-rose-600 bg-rose-50/80 shadow-md ring-1 ring-rose-600'
                      : 'border-gray-200 hover:border-rose-200 bg-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full border border-gray-300 mb-2 shadow-inner" style={{ backgroundColor: w.hex }} />
                  <p className="text-xs font-bold text-gray-900 line-clamp-1">{w.name}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">{w.desc}</p>
                  <p className="text-[10px] text-rose-700 font-semibold mt-1">+₹{w.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Ribbon Tie */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-3">
              <span className="w-5 h-5 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center">3</span>
              Silk & Satin Ribbon Accent
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {RIBBONS.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setSelectedRibbon(r.name)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition ${
                    selectedRibbon === r.name
                      ? 'border-rose-600 bg-rose-50 shadow-sm ring-1 ring-rose-600'
                      : 'border-gray-200 hover:border-rose-200 bg-white'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: r.hex }} />
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900">{r.name}</p>
                    <p className="text-[10px] text-rose-700 font-semibold">+₹{r.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Add-ons */}
          <div>
            <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-3">
              <span className="w-5 h-5 bg-rose-600 text-white rounded-full text-xs flex items-center justify-center">4</span>
              Special Celebration Add-ons (Optional)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {ADDONS.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-1 ring-emerald-600'
                        : 'border-gray-200 hover:border-rose-200 bg-white'
                    }`}
                  >
                    <span className="text-2xl mb-1">{addon.emoji}</span>
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{addon.name}</p>
                    <p className="text-[11px] text-emerald-700 font-bold">+₹{addon.price}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 5: Bespoke Note */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Personal Note Card to Recipient:
            </label>
            <input
              type="text"
              placeholder="e.g. Happy 5th Anniversary my love! Forever yours ❤️"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:outline-none"
            />
          </div>

        </div>

        {/* Footer Summary & Price */}
        <div className="p-4 sm:p-6 bg-rose-50 border-t border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Estimated Custom Total:</span>
              <span className="text-2xl font-bold font-serif text-gray-900">
                ₹{calculatedTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Includes {totalStems} fresh stems, filler greenery, {selectedWrapper} wrap & {selectedRibbon} ribbon
            </p>
          </div>

          <button
            onClick={handleAddCustomToCart}
            disabled={isSubmitting || totalStems < 6}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition ${
              totalStems >= 6
                ? 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span>Crafting Arrangement...</span>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add Custom Bouquet to Cart (₹{calculatedTotal.toLocaleString('en-IN')})</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
