import React from 'react';
import { Heart, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

export default function Footer({ onOpenWhatsApp }) {
  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-rose-950/40 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💐</span>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                Bloom <span className="text-rose-500">&</span> Petal
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              India's premier artisan flower boutique. Plucked fresh from cold-climate mountain farms every morning, crafted with passion, and hand-delivered within 2 hours.
            </p>
            <div className="flex items-center gap-2 text-rose-400 font-semibold pt-1">
              <Sparkles size={14} />
              <span>100% Guaranteed Freshness upon arrival</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Occasions</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><a href="#catalog" className="hover:text-rose-400 transition">Romantic Roses</a></li>
              <li><a href="#catalog" className="hover:text-rose-400 transition">Birthday Celebrations</a></li>
              <li><a href="#catalog" className="hover:text-rose-400 transition">Anniversary Specials</a></li>
              <li><a href="#catalog" className="hover:text-rose-400 transition">Exotic Orchids & Lilies</a></li>
              <li><a href="#catalog" className="hover:text-rose-400 transition">Bridal & Weddings</a></li>
            </ul>
          </div>

          {/* Express Delivery Hubs */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Express Hubs</h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-center gap-1.5"><MapPin size={13} className="text-rose-500" /> Hyderabad (Hitech & Banjara)</li>
              <li className="flex items-center gap-1.5"><MapPin size={13} className="text-rose-500" /> Bengaluru (Indiranagar & Koramangala)</li>
              <li className="flex items-center gap-1.5"><MapPin size={13} className="text-rose-500" /> Mumbai & Navi Mumbai</li>
              <li className="flex items-center gap-1.5"><MapPin size={13} className="text-rose-500" /> Delhi NCR & Gurugram</li>
              <li className="flex items-center gap-1.5"><MapPin size={13} className="text-rose-500" /> Chennai & Pune</li>
            </ul>
          </div>

          {/* Florist Helpline & WhatsApp Support */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">Contact & Support</h4>
            <div className="space-y-2.5 text-neutral-400">
              {/* WhatsApp Clickable Button */}
              <button
                onClick={onOpenWhatsApp}
                className="w-full flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-300 hover:text-white px-3 py-2 rounded-xl transition text-left group"
                title="Chat with Website Owner on WhatsApp"
              >
                <div className="w-6 h-6 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.106 8.106 0 0 1-1.25-4.29c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.15-8.16 8.15zm4.49-6.13c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.61c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.17 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.17-.48-.3z"/>
                  </svg>
                </div>
                <div>
                  <span className="block text-[10px] text-emerald-400 font-bold uppercase">WhatsApp Owner/Admin</span>
                  <span className="font-semibold text-white group-hover:underline">+91 93900 11965</span>
                </div>
              </button>

              <p className="flex items-center gap-2">
                <Mail size={14} className="text-rose-400" />
                <span>support@petalcraft.com</span>
              </p>
              <p className="text-[11px] text-neutral-500 leading-normal pt-1">
                Mon - Sun: 7:00 AM - 11:30 PM (Midnight delivery team active 24/7)
              </p>
            </div>
          </div>

        </div>

        {/* Flower Care Tip Banner */}
        <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">💧</span>
            <div>
              <p className="font-bold text-neutral-200 text-xs">Florist's Secret to 7+ Days Bloom Life:</p>
              <p className="text-neutral-400 text-[11px]">Trim stems at 45° angle under cool water and change vase water every 48 hours.</p>
            </div>
          </div>
          <span className="text-xs bg-rose-950 text-rose-300 border border-rose-800 px-3 py-1.5 rounded-full font-semibold whitespace-nowrap">
            Free Flower Food sachet with every bouquet
          </span>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-neutral-500 text-[11px]">
          <p>© 2026 Bloom & Petal Boutique Ltd. Built collaboratively with passion & high-performance engineering.</p>
          <div className="flex items-center gap-1 text-neutral-400">
            <span>Handcrafted with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500" />
            <span>for flower lovers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
