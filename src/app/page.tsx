'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Recycle, ArrowRight, Shield, Leaf, Heart, Mail, Phone as PhoneIcon, Eye, EyeOff, Lock } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-set Demo User Validation
    const demoPhone = '9876543210';
    const demoPassword = 'shecycle2026';

    if (inputValue === demoPhone && password === demoPassword) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      setError('Invalid Credentials. Please try again.');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-6 text-center">
      {/* Brand Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-rose-700 to-rose-800 rounded-[2rem] flex items-center justify-center shadow-xl shadow-rose-200 mb-6 animate-bounce">
        <Recycle size={40} className="text-white" />
      </div>

      {/* Hero Text */}
      <h1 className="text-3xl font-black text-black mb-1 tracking-tight">SheCycle</h1>
      <p className="text-rose-700 font-black text-[10px] uppercase tracking-[0.2em] mb-8">Empowering Punjab</p>
      
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-xl border border-rose-100 space-y-6">
        {/* Toggle Login Method */}
        <div className="flex p-1 bg-gray-100 rounded-2xl border border-gray-200">
          <button
            onClick={() => { setLoginMethod('email'); setInputValue(''); setError(''); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              loginMethod === 'email' ? 'bg-white text-rose-700 shadow-sm' : 'text-gray-500 hover:text-black'
            }`}
          >
            <Mail size={14} />
            Email
          </button>
          <button
            onClick={() => { setLoginMethod('phone'); setInputValue(''); setError(''); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              loginMethod === 'phone' ? 'bg-white text-rose-700 shadow-sm' : 'text-gray-500 hover:text-black'
            }`}
          >
            <PhoneIcon size={14} />
            Phone
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          {/* Email/Phone Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-700 transition-colors">
              {loginMethod === 'email' ? <Mail size={18} /> : <PhoneIcon size={18} />}
            </div>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter phone number'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-black text-black focus:bg-white focus:border-rose-300 focus:outline-none transition-all placeholder:text-gray-400"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-rose-700 transition-colors">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-12 text-sm font-black text-black focus:bg-white focus:border-rose-300 focus:outline-none transition-all placeholder:text-gray-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-700 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Validation Messages */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black uppercase tracking-wider p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-sage-50 border border-sage-200 text-sage-800 text-[10px] font-black uppercase tracking-wider p-3 rounded-xl text-center">
              Login Successful! Redirecting...
            </div>
          )}

          <button 
            type="submit"
            disabled={success}
            className={`w-full ${success ? 'bg-sage-600' : 'bg-rose-700 hover:bg-rose-800'} text-white font-black py-4 rounded-[1.5rem] shadow-lg shadow-rose-200 flex items-center justify-center gap-3 transition-all active:scale-95 group`}
          >
            <span className="text-white">{success ? 'Welcome' : 'Continue'}</span>
            {!success && <ArrowRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
          New to SheCycle? <span className="text-rose-700 hover:underline cursor-pointer">Create Account</span>
        </p>
      </div>

      {/* Feature Pills */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-12">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-rose-100 text-rose-700">
            <Shield size={18} />
          </div>
          <span className="text-[10px] font-black text-black uppercase tracking-tighter">Safe</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-rose-100 text-rose-700">
            <Leaf size={18} />
          </div>
          <span className="text-[10px] font-black text-black uppercase tracking-tighter">Green</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-rose-100 text-rose-700">
            <Heart size={18} />
          </div>
          <span className="text-[10px] font-black text-black uppercase tracking-tighter">Local</span>
        </div>
      </div>

      <div className="mt-12 text-[10px] font-black text-gray-500 uppercase tracking-widest">
        Made with ♥ in Jalandhar
      </div>
    </div>
  );
}
