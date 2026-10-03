import React from 'react';
import { Sparkles, Clock, Truck, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export default function HeroBanner({ onOpenCustomBuilder, onScrollToCatalog }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-100/60 via-rose-50/40 to-white py-12 md:py-20 border-b border-rose-100">
      {/* Background soft blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold tracking-wide border border-rose-200 shadow-sm">
              <Sparkles size={14} className="text-rose-600 animate-spin" />
              <span>SAME DAY EXPRESS BOUQUET DELIVERY</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              Every petal whispers a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600 italic">love story.</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Hand-tied botanical arrangements designed by master florists. Sourced fresh every morning from Dutch and Bangalore farms, wrapped in luxury paper with your bespoke message.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onScrollToCatalog}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 text-sm"
              >
                <span>Browse Fresh Bouquets</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onOpenCustomBuilder}
                className="flex items-center gap-2 bg-white hover:bg-rose-50 text-rose-700 border-2 border-rose-300 font-medium px-6 py-3 rounded-full shadow-sm hover:shadow transition text-sm"
              >
                <Sparkles size={16} className="text-rose-500" />
                <span>Custom Bouquet Studio</span>
              </button>
            </div>

            {/* Mini Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-rose-200/60 max-w-xl mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 text-rose-700 rounded-full"><Clock size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-800">2-Hour Delivery</p>
                  <p className="text-[11px] text-gray-500">Fast local slots</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100 text-rose-700 rounded-full"><ShieldCheck size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-800">7-Day Freshness</p>
                  <p className="text-[11px] text-gray-500">Farm-cut stems</p>
                </div>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="p-1.5 bg-rose-100 text-rose-700 rounded-full"><HeartHandshake size={16} /></div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Free Card & Ribbon</p>
                  <p className="text-[11px] text-gray-500">Personalized print</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md">
              
              {/* Highlight badge */}
              <div className="absolute -top-3 -right-3 z-10 bg-amber-400 text-amber-950 font-bold text-xs uppercase px-3 py-1.5 rounded-full shadow-md tracking-wider flex items-center gap-1">
                <span>⭐ 4.9 Rated Bouquet</span>
              </div>

              {/* Main Image Frame */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white aspect-[4/5] bg-rose-100 group">
                <img
                  src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80"
                  alt="Crimson Passion Roses"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                
                {/* Floating pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-rose-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Bestseller of the Week</span>
                    <h3 className="font-serif font-bold text-gray-900 text-sm">Crimson Passion (24 Roses)</h3>
                    <p className="text-xs text-gray-500">Includes Belgian luxury truffles</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 line-through">₹1,499</span>
                    <p className="text-base font-bold text-rose-700">₹1,299</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
