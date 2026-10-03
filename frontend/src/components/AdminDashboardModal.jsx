import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, DollarSign, Package, ShoppingBag, Plus, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboardModal({ isOpen, onClose, onProductCreated }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory' | 'add'
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0 });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category_id: 1,
    price: '',
    discounted_price: '',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    flowers_included: '',
    stem_count: 12,
    occasion: 'Romance',
    description: '',
    is_bestseller: false,
    is_featured: true
  });

  const token = localStorage.getItem('token');

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [statsRes, ordersRes, prodRes] = await Promise.all([
        api.getAdminStats(token),
        api.getOrders(token),
        api.getProducts()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (ordersRes.success) setOrders(ordersRes.data);
      if (prodRes.success) setProducts(prodRes.data);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus, token);
      if (res.success) {
        setStatusMessage(`Order #${orderId} marked as ${newStatus}`);
        setTimeout(() => setStatusMessage(''), 2500);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this bouquet?')) return;
    try {
      const res = await api.deleteProduct(id, token);
      if (res.success) {
        setStatusMessage('Bouquet deleted from inventory');
        setTimeout(() => setStatusMessage(''), 2500);
        loadData();
        if (onProductCreated) onProductCreated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.addProduct(newProduct, token);
      if (res.success) {
        setStatusMessage('New bouquet added successfully!');
        setNewProduct({
          name: '',
          category_id: 1,
          price: '',
          discounted_price: '',
          image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
          flowers_included: '',
          stem_count: 12,
          occasion: 'Romance',
          description: '',
          is_bestseller: false,
          is_featured: true
        });
        setActiveTab('inventory');
        loadData();
        if (onProductCreated) onProductCreated();
        setTimeout(() => setStatusMessage(''), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-amber-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950 via-rose-950 to-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-100">Florist Administration Portal</h2>
              <p className="text-xs text-amber-200/80">Manage live bouquet orders, inventory, and analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2 rounded-full hover:bg-white/10 text-amber-200 transition"
              title="Refresh"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-amber-50/50 border-b border-amber-100 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-amber-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900 font-serif">₹{Number(stats.totalRevenue).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-amber-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Total Orders</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-amber-200/80 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <p className="text-gray-500 font-medium">Catalog Bouquets</p>
              <p className="text-lg font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6 gap-6 text-xs font-bold text-gray-500 bg-gray-50">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 transition ${activeTab === 'orders' ? 'border-rose-600 text-rose-600' : 'border-transparent hover:text-gray-800'}`}
          >
            Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3.5 border-b-2 transition ${activeTab === 'inventory' ? 'border-rose-600 text-rose-600' : 'border-transparent hover:text-gray-800'}`}
          >
            Bouquet Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`py-3.5 border-b-2 transition flex items-center gap-1 ${activeTab === 'add' ? 'border-rose-600 text-rose-600' : 'border-transparent hover:text-gray-800'}`}
          >
            <Plus size={14} /> Add New Bouquet
          </button>
        </div>

        {statusMessage && (
          <div className="bg-emerald-50 text-emerald-800 text-xs px-6 py-2 border-b border-emerald-200 font-medium flex items-center gap-1.5">
            <CheckCircle size={14} /> {statusMessage}
          </div>
        )}

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-8">No orders placed yet.</p>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          #{ord.order_number}
                        </span>
                        <span className="font-bold text-gray-900">{ord.customer_name}</span>
                        <span className="text-gray-400">({ord.customer_phone})</span>
                      </div>
                      <p className="text-gray-600">
                        📍 {ord.delivery_address}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        🗓️ {ord.delivery_date} • ⏰ {ord.delivery_slot}
                      </p>
                      {ord.greeting_message && (
                        <p className="text-[11px] text-rose-800 italic">💌 Note: "{ord.greeting_message}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-200">
                      <span className="font-serif font-bold text-sm text-gray-900">
                        ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                      </span>

                      {/* Status Dropdown */}
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleStatusUpdate(ord.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                          ord.order_status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : ord.order_status === 'out_for_delivery'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : ord.order_status === 'preparing'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="placed">Placed</option>
                        <option value="preparing">Preparing Blooms</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered ✅</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((p) => (
                <div key={p.id} className="p-3 bg-white rounded-2xl border border-gray-200 flex gap-3 items-center">
                  <img src={p.image_url} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-bold text-gray-900 text-xs truncate">{p.name}</h4>
                    <p className="text-[11px] text-gray-500">{p.occasion} • {p.stem_count || 12} Stems</p>
                    <p className="text-xs font-bold text-rose-700 mt-1">₹{Number(p.price).toLocaleString('en-IN')}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition"
                    title="Delete bouquet"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs max-w-xl mx-auto">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Bouquet Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Celestial Orchid & White Lilies"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1299"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    placeholder="1099"
                    value={newProduct.discounted_price}
                    onChange={(e) => setNewProduct({ ...newProduct, discounted_price: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Occasion</label>
                  <select
                    value={newProduct.occasion}
                    onChange={(e) => setNewProduct({ ...newProduct, occasion: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="Romance">Romance</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Congratulations">Congratulations</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Sympathy">Sympathy</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Stem Count</label>
                  <input
                    type="number"
                    value={newProduct.stem_count}
                    onChange={(e) => setNewProduct({ ...newProduct, stem_count: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Flower Breakdown & Fillers</label>
                <input
                  type="text"
                  placeholder="e.g. 12 Pink Lilies, Gypsophila, Italian Ruscus"
                  value={newProduct.flowers_included}
                  onChange={(e) => setNewProduct({ ...newProduct, flowers_included: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.is_bestseller}
                    onChange={(e) => setNewProduct({ ...newProduct, is_bestseller: e.target.checked })}
                    className="rounded text-rose-600"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.is_featured}
                    onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                    className="rounded text-rose-600"
                  />
                  <span>Show in Featured Banner</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl shadow-md transition"
              >
                Add Bouquet to MySQL Store
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
