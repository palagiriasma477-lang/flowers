import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CustomBouquetBuilder from './components/CustomBouquetBuilder';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import WhatsAppModal from './components/WhatsAppModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';
import { api } from './services/api';
import { Sparkles, Flower2, Heart, Search } from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  
  // Cart & Wishlist state with localStorage persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('petalcraft_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('petalcraft_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [discount, setDiscount] = useState(0);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [checkoutPricing, setCheckoutPricing] = useState({ grandTotal: 0 });

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('petalcraft_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('petalcraft_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load products from MySQL backend API
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        search: searchTerm,
        occasion: selectedOccasion,
        sort: selectedSort
      });
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load bouquets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedOccasion, selectedSort]);

  // Cart operations
  const handleAddToCart = (product) => {
    setCart((prev) => {
      // If custom bouquet or has specific custom notes, append as new line item
      if (product.isCustom || product.customNote || product.selectedSize) {
        return [...prev, { ...product, quantity: product.quantity || 1 }];
      }
      const existingIdx = prev.findIndex(item => item.id === product.id && !item.isCustom);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity = (next[existingIdx].quantity || 1) + 1;
        return next;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (index, delta) => {
    setCart((prev) => {
      const next = [...prev];
      const newQty = (next[index].quantity || 1) + delta;
      if (newQty <= 0) {
        return next.filter((_, i) => i !== index);
      }
      next[index].quantity = newQty;
      return next;
    });
  };

  const handleRemoveFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist((prev) => prev.filter(item => item.id !== id));
  };

  // Auth operations
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleProceedToCheckout = (pricing) => {
    setCheckoutPricing(pricing);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    setCart([]);
    localStorage.removeItem('petalcraft_cart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/40 text-stone-900 font-sans selection:bg-rose-200">
      
      {/* Top Navbar */}
      <Navbar
        cartCount={cart.reduce((a, b) => a + (b.quantity || 1), 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        user={user}
        onLogout={handleLogout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Hero Banner */}
      <HeroBanner
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        onScrollToCatalog={() => {
          document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Category / Occasion Filter */}
      <div id="catalog">
        <CategoryFilter
          selectedOccasion={selectedOccasion}
          setSelectedOccasion={setSelectedOccasion}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          totalCount={products.length}
        />
      </div>

      {/* Main Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {loading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-rose-100 animate-pulse space-y-4">
                <div className="aspect-square bg-rose-100/60 rounded-xl" />
                <div className="h-4 bg-rose-100/60 rounded w-3/4" />
                <div className="h-3 bg-rose-100/40 rounded w-1/2" />
                <div className="h-8 bg-rose-100/60 rounded-xl" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty Search or Filter State */
          <div className="text-center py-20 bg-white rounded-3xl border border-rose-100 shadow-sm p-8 max-w-lg mx-auto space-y-4">
            <div className="w-20 h-20 rounded-full bg-rose-50 text-4xl flex items-center justify-center mx-auto">
              🥀
            </div>
            <h3 className="font-serif text-xl font-bold text-gray-800">No Bouquets Found</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              We couldn't find any floral arrangement matching your filter. Try adjusting your search or browse our full collection.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedOccasion('all');
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition shadow"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlist.some(w => w.id === product.id)}
                onQuickView={(p) => setSelectedProductForModal(p)}
              />
            ))}
          </div>
        )}

        {/* Custom Bouquet Studio Callout Section */}
        <section className="mt-16 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-950 rounded-3xl text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-rose-700/40">
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-rose-700/60 px-3 py-1 rounded-full text-xs font-semibold text-amber-200 border border-rose-600">
              <Sparkles size={14} />
              <span>CUSTOM FLORIST STUDIO</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              Can't find the exact arrangement? <br />
              <span className="text-amber-200 italic">Create your dream bouquet.</span>
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 font-light leading-relaxed">
              Pick your favorite Dutch roses, exotic lilies, or orchids stem-by-stem. Choose luxury wrapping paper, velvet ribbons, and sweet celebration gifts.
            </p>
            <button
              onClick={() => setIsCustomBuilderOpen(true)}
              className="mt-2 inline-flex items-center gap-2 bg-white text-rose-900 font-bold px-7 py-3.5 rounded-full shadow-lg hover:bg-rose-50 transition transform hover:-translate-y-0.5 text-xs"
            >
              <Flower2 size={16} className="text-rose-600" />
              <span>Launch Bouquet Customizer</span>
            </button>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 lg:opacity-40 pointer-events-none hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"
              alt="Artisan Bouquet"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer onOpenWhatsApp={() => setIsWhatsAppOpen(true)} />

      {/* Floating WhatsApp Quick Action Button */}
      <FloatingWhatsApp onOpen={() => setIsWhatsAppOpen(true)} />

      {/* Modals & Slide-overs */}
      <ProductModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProductForModal ? wishlist.some(w => w.id === selectedProductForModal.id) : false}
      />

      <CustomBouquetBuilder
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
        discount={discount}
        setDiscount={setDiscount}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        pricing={checkoutPricing}
        user={user}
        onOrderSuccess={handleOrderSuccess}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductCreated={loadProducts}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

    </div>
  );
}
