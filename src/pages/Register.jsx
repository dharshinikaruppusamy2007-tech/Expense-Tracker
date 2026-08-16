import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Wallet, User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { name, email, password });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors py-12 px-4">
      <div className="max-w-md w-full p-10 bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary-600"></div>
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <Wallet size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Register</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Join Trackify Today</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-bold border border-red-100 flex items-center animate-shake">
                <span className="mr-2">⚠️</span> {error}
            </div>
        )}
        {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-8 text-sm font-bold border border-green-100 flex items-center">
                <span className="mr-2">✅</span> {success}
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input 
                type="text" required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                value={name} onChange={(e) => setName(e.target.value)} 
                placeholder="Your Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input 
                type="email" required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input 
                type="password" required minLength="6"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 mt-6 rounded-2xl transition-all shadow-xl shadow-primary-200 active:scale-95 text-lg">
            Create Account
          </button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 font-bold text-sm tracking-wide">
                Already registered? <Link to="/login" className="text-primary-600 font-black hover:text-primary-700 transition-colors ml-1 uppercase text-xs tracking-widest bg-primary-50 px-3 py-1.5 rounded-lg">Sign In</Link>
            </p>
        </div>
      </div>
    </div>
  );
}
