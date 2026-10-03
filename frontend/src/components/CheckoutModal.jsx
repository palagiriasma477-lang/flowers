import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Calendar, Clock, CreditCard, Sparkles, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const TIME_SLOTS = [
  { id: 'Morning (9:00 AM - 1:00 PM)', label: 'Morning Slot', time: '9:00 AM - 1:00 PM', icon: '🌅' },
  { id: 'Afternoon (1:00 PM - 5:00 PM)', label: 'Afternoon Slot', time: '1:00 PM - 5:00 PM', icon: '☀️' },
  { id: 'Evening (5:00 PM - 9:00 PM)', label: 'Evening Prime', time: '5:00 PM - 9:00 PM', icon: '🌆' },
  { id: 'Midnight (11:30 PM - 12:15 AM)', label: 'Midnight Surprise', time: '11:30 PM - 12:15 AM', icon: '🌙' }
];

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  pricing,
  user,
  onOrderSuccess
}) {
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    customer_phone: user?.phone || '',
    delivery_address: user?.address || '',
    pincode: '500001',
    delivery_date: new Date().toISOString().split('T')[0],
    delivery_slot: 'Morning (9:00 AM - 1:00 PM)',
    greeting_message: '',
    sender_name: user?.name || '',
    payment_method: 'UPI / Google Pay / PhonePe'
  });

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderPayload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        delivery_address: `${formData.delivery_address}, PIN: ${formData.pincode}`,
        delivery_date: formData.delivery_date,
        delivery_slot: formData.delivery_slot,
        greeting_message: formData.greeting_message,
        sender_name: formData.sender_name,
        total_amount: pricing.grandTotal,
        payment_method: formData.payment_method,
        items: items.map(item => ({
          id: typeof item.id === 'number' ? item.id : null,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          custom_notes: item.customNote || item.selectedSize || ''
        }))
      };

      const token = localStorage.getItem('token');
      const res = await api.createOrder(orderPayload, token);

      if (res.success) {
        setOrderComplete(res);
        onOrderSuccess();
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        setError(res.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-700 flex items-center justify-center text-amber-200">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Express Floral Checkout</h2>
              <p className="text-xs text-rose-200">Handcrafted freshness guaranteed upon arrival</p>
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
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {orderComplete ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900">
                Order Confirmed & Blooms Reserved!
              </h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Thank you, <b>{formData.customer_name}</b>. Your order <b>#{orderComplete.orderNumber}</b> has been received and our florists are preparing fresh stems.
              </p>

              {/* Order summary card */}
              <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Order Reference:</span>
                  <span className="text-rose-700 font-mono">{orderComplete.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Date & Slot:</span>
                  <span className="font-medium text-gray-700">{formData.delivery_date} ({formData.delivery_slot.split(' ')[0]})</span>
                </div>
                <div className="flex justify-between">
                  <span>Recipient Address:</span>
                  <span className="font-medium text-gray-700 text-right truncate max-w-[200px]">{formData.delivery_address}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-gray-900 pt-2 border-t border-rose-200">
                  <span>Paid Total:</span>
                  <span className="text-rose-700 font-serif">₹{pricing.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold hover:bg-gray-50 text-gray-700"
                >
                  <Printer size={14} /> Print Receipt
                </button>
                <button
                  onClick={onClose}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-6 py-2 rounded-xl shadow"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* Recipient Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-rose-800">
                  1. Recipient Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="e.g. Priya Sharma"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Phone Number (For Delivery Call) *</label>
                    <input
                      type="tel"
                      name="customer_phone"
                      required
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Full Street Address *</label>
                    <input
                      type="text"
                      name="delivery_address"
                      required
                      value={formData.delivery_address}
                      onChange={handleChange}
                      placeholder="Flat/House No, Building, Landmark, Area"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength="6"
                      required
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-600 block mb-1">Email (For Order Updates & Tracking) *</label>
                  <input
                    type="email"
                    name="customer_email"
                    required
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Delivery Timing */}
              <div className="space-y-3 pt-2 border-t border-rose-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-rose-800">
                  2. Delivery Schedule
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Select Delivery Date *</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="delivery_date"
                        min={new Date().toISOString().split('T')[0]}
                        required
                        value={formData.delivery_date}
                        onChange={handleChange}
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Time Slot *</label>
                    <select
                      name="delivery_slot"
                      value={formData.delivery_slot}
                      onChange={handleChange}
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                    >
                      {TIME_SLOTS.map(slot => (
                        <option key={slot.id} value={slot.id}>
                          {slot.icon} {slot.label} ({slot.time})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Greeting Message & Sender */}
              <div className="space-y-2 pt-2 border-t border-rose-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-rose-800">
                  3. Complimentary Florist Greeting Card
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Sender Name (Sign-off)</label>
                    <input
                      type="text"
                      name="sender_name"
                      value={formData.sender_name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul, or Keep Anonymous"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-1">Message on the Card</label>
                    <input
                      type="text"
                      name="greeting_message"
                      value={formData.greeting_message}
                      onChange={handleChange}
                      placeholder="e.g. Wishing you joy, love & happiness!"
                      className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                      maxLength={100}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2 pt-2 border-t border-rose-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-rose-800">
                  4. Payment Method
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'UPI / Google Pay / PhonePe', label: 'Instant UPI', desc: 'GPay, PhonePe, Paytm', icon: '⚡' },
                    { id: 'Credit / Debit Card', label: 'Cards / NetBanking', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
                    { id: 'Cash on Delivery', label: 'Pay on Delivery', desc: 'Cash or QR scan at doorstep', icon: '💵' }
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, payment_method: pm.id }))}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        formData.payment_method === pm.id
                          ? 'border-rose-600 bg-rose-50/80 shadow-sm ring-1 ring-rose-600'
                          : 'border-gray-200 hover:border-rose-200 bg-white'
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900">{pm.icon} {pm.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{pm.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-xs"
                >
                  {loading ? (
                    <span>Placing Your Order...</span>
                  ) : (
                    <>
                      <Sparkles size={16} className="text-amber-200" />
                      <span>Confirm & Pay ₹{pricing.grandTotal.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
