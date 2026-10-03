import React from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Sparkles, 
  User, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  PhoneCall
} from 'lucide-react';

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenAdmin,
  onOpenCustomBuilder,
  onOpenWhatsApp,
  user,
  onLogout,
  searchTerm,
  setSearchTerm
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-rose-100 shadow-sm transition-all">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-rose-50 text-xs py-1.5 px-4 text-center font-medium flex justify-between items-center">
        <span className="hidden sm:inline">🌸 Hand-picked morning blooms delivered in 2 hours across city!</span>
        <span className="mx-auto sm:mx-0 font-semibold tracking-wide">Use code <span className="bg-rose-700/80 px-2 py-0.5 rounded text-amber-200">BLOOM10</span> for 10% off</span>
        <button 
          onClick={onOpenWhatsApp}
          className="hidden md:flex items-center gap-1.5 text-emerald-200 hover:text-white transition font-medium"
        >
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.106 8.106 0 0 1-1.25-4.29c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.15-8.16 8.15zm4.49-6.13c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.61c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.17 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.17-.48-.3z"/>
          </svg>
          <span>WhatsApp Florist: +91 93900 11965</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shadow-inner border border-rose-200">
              <span className="text-2xl">💐</span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-gray-900">
                Bloom <span className="text-rose-600">&</span> Petal
              </span>
              <p className="text-[10px] tracking-widest text-rose-700 uppercase font-semibold">Artisan Florist Studio</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search red roses, lilies, orchids, anniversary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-rose-50/60 border border-rose-200/80 rounded-full py-2.5 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-3 text-rose-400" size={18} />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 text-xs bg-rose-100 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Custom Bouquet Builder CTA button */}
            <button
              onClick={onOpenCustomBuilder}
              className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow hover:from-rose-600 hover:to-rose-700 transition transform hover:-translate-y-0.5"
            >
              <Sparkles size={14} className="text-amber-200 animate-pulse" />
              <span>Custom Bouquet</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition"
              title="Saved Wishlist"
            >
              <Heart size={21} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition flex items-center gap-2"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag size={21} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold text-xs text-gray-700">Cart</span>
            </button>

            {/* User / Auth */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-rose-200">
                {user.role === 'admin' && (
                  <button
                    onClick={onOpenAdmin}
                    className="flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-1.5 rounded-lg font-medium hover:bg-amber-200 transition"
                  >
                    <ShieldCheck size={14} className="text-amber-700" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </button>
                )}

                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">{user.name}</p>
                  <span className="text-[10px] text-rose-600 capitalize font-medium">{user.role}</span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold px-3 py-2 rounded-full transition"
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-rose-600"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search bouquets & occasions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-rose-50/70 border border-rose-200 rounded-full py-2 pl-10 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <Search className="absolute left-3 top-2.5 text-rose-400" size={16} />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-gray-400 text-xs">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
