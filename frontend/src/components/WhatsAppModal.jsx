import React, { useState } from 'react';
import { X, Send, User, Phone, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WhatsAppModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'Custom Bouquet Requirement',
    message: ''
  });
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSend = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      alert('Please enter your name and message.');
      return;
    }

    const adminNumber = '919390011965'; // Admin/Owner WhatsApp number

    // Format clean professional message
    const formattedMessage = 
`🌸 *Bloom & Petal Florist Support Request* 🌸
━━━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${formData.name.trim()}
📱 *Phone Number:* ${formData.phone.trim() || 'Not specified'}
🏷️ *Inquiry Topic:* ${formData.topic}

💬 *Query / Details:*
${formData.message.trim()}
━━━━━━━━━━━━━━━━━━━━
📍 *Sent from:* Bloom & Petal Website`;

    const whatsappUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(formattedMessage)}`;

    // Open WhatsApp in new tab / mobile app
    window.open(whatsappUrl, '_blank');

    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.106 8.106 0 0 1-1.25-4.29c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.15-8.16 8.15zm4.49-6.13c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.61c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.17 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.17-.48-.3z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">Chat with Florist Owner</h2>
              <p className="text-xs text-emerald-100">WhatsApp: <span className="font-semibold text-white">+91 93900 11965</span></p>
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
        <div className="p-6 space-y-4">
          {sent ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900">Opening WhatsApp...</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Connecting you directly with the Bloom & Petal owner (+91 9390011965) with your inquiry details.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-3.5">
              <p className="text-xs text-gray-600 leading-relaxed bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/80">
                💬 Need custom bouquets, bulk event flowers, or order assistance? Enter your details below and click <b>Send to WhatsApp</b> to chat immediately with the owner.
              </p>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Your Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs p-2.5 pl-9 border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                  <User size={15} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Your WhatsApp Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full text-xs p-2.5 pl-9 border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                  <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Inquiry Topic</label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full text-xs p-2.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Custom Bouquet Requirement">💐 Custom Bouquet Requirement</option>
                  <option value="Urgent Delivery / Order Status">🚚 Urgent Same-Day Delivery / Status</option>
                  <option value="Wedding / Event Bulk Flower Booking">💍 Wedding / Party Bulk Flower Booking</option>
                  <option value="Flower Price / Catalog Inquiry">🌸 Flower Variety & Pricing Inquiry</option>
                  <option value="Other Assistance">❓ Other Assistance</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-700 block mb-1">Your Query / Message *</label>
                <div className="relative">
                  <textarea
                    rows="3"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please specify flower types, delivery date/location, or any special requests..."
                    className="w-full text-xs p-2.5 pl-9 border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  />
                  <MessageSquare size={15} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-xs"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 18.06c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.106 8.106 0 0 1-1.25-4.29c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.15-8.16 8.15zm4.49-6.13c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.02 2.61c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.17 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.23-.17-.48-.3z"/>
                </svg>
                <span>Send to WhatsApp (+91 9390011965)</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
