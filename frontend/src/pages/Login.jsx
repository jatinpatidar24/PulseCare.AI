import React, { useState } from 'react';
import { Activity, Lock, Mail, AlertCircle, ArrowRight, UserCheck, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = ({ setCurrentTab }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      setCurrentTab('home');
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role) => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin(role);
      if (role === 'doctor') {
        setCurrentTab('doctor-portal');
      } else {
        setCurrentTab('home');
      }
    } catch (err) {
      setError("Failed to login with demo credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
            <Activity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your patient or doctor portal</p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
            Instant Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('patient')}
              className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-teal-500 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-xs transition-all hover:bg-teal-50/50"
            >
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Demo Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('doctor')}
              className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 hover:border-cyan-500 text-slate-700 text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-xs transition-all hover:bg-cyan-50/50"
            >
              <Stethoscope className="w-3.5 h-3.5 text-cyan-600" />
              <span>Demo Doctor</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider absolute">
            Or with email
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentTab('register')}
            className="font-bold text-teal-600 hover:underline"
          >
            Register Now
          </button>
        </p>
      </div>
    </div>
  );
};
