import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Wallet, Mail, Lock } from 'lucide-react';

export default function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ id: res.data.id, name: res.data.name, email: res.data.email }));
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center transition-colors p-4">
      <div className="max-w-md w-full p-10 bg-white rounded-[2rem] shadow-soft border border-slate-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary-600"></div>
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <Wallet size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Welcome</h2>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Sign In to Trackify</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-bold border border-red-100 flex items-center animate-shake">
                <span className="mr-2">⚠️</span> {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input 
                type="email" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                value={email} onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors" size={20} />
              <input 
                type="password" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 mt-4 rounded-2xl transition-all shadow-xl shadow-primary-200 active:scale-95 text-lg">
            Sign In
          </button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 font-bold text-sm tracking-wide">
            Don't have an account? <Link to="/register" className="text-primary-600 font-black hover:text-primary-700 transition-colors ml-1 uppercase text-xs tracking-widest bg-primary-50 px-3 py-1.5 rounded-lg">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
