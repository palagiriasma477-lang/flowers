import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const fillDemoAdmin = () => {
    setIsRegister(false);
    setFormData({
      name: 'Admin Florist',
      email: 'admin@petalcraft.com',
      password: 'admin123',
      phone: '+91 93900 11965',
      address: 'Hyderabad Flower Market'
    });
  };

  const fillDemoCustomer = () => {
    setIsRegister(false);
    setFormData({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'password123',
      phone: '+91 91234 56789',
      address: 'Banjara Hills, Hyderabad'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await api.register(formData);
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          onLoginSuccess(res.user);
          onClose();
        } else {
          setError(res.message || 'Registration failed');
        }
      } else {
        const res = await api.login(formData.email, formData.password);
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          onLoginSuccess(res.user);
          onClose();
        } else {
          setError(res.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Connection error with backend server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-rose-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-900 to-rose-800 text-white flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold">
              {isRegister ? 'Join Bloom & Petal' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-rose-200">
              {isRegister ? 'Create an account for quick orders & bouquet tracking' : 'Sign in to access your bouquet orders & admin tools'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Quick Demo Autofill shortcuts */}
          <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200/80 text-xs space-y-2">
            <span className="font-bold text-gray-700 block text-[11px] uppercase tracking-wider">
              ⚡ 1-Click Demo Login:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold py-1.5 px-2.5 rounded-lg border border-amber-300 transition flex items-center justify-center gap-1 text-[11px]"
              >
                <ShieldCheck size={13} className="text-amber-800" /> Admin Demo
              </button>
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-900 font-semibold py-1.5 px-2.5 rounded-lg border border-rose-300 transition text-[11px]"
              >
                👤 Customer Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ananya Rao"
                    className="w-full text-xs p-2.5 pl-9 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                  <User size={15} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full text-xs p-2.5 pl-9 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                />
                <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-gray-600 block mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full text-xs p-2.5 pl-9 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                />
                <Lock size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-[11px] font-semibold text-gray-600 block mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full text-xs p-2.5 pl-9 border border-gray-200 rounded-xl focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                  <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 text-xs mt-2"
            >
              {loading ? (
                <span>Verifying...</span>
              ) : (
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-2 border-t border-rose-100">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-xs text-rose-700 font-semibold hover:underline"
            >
              {isRegister ? 'Already have an account? Sign in here' : "Don't have an account yet? Register now"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
