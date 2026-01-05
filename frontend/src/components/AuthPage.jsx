import React, { useState } from 'react';
import { IconLeaf } from './Icons';
import { authService } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google'; // Added this

const AuthPage = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    role: 'OBLIGATED_ENTITY',
    sector: 'DEFAULT',
    complianceTarget2025: '',
  });

  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Google Auth Failed');

      authService.setSession(data.token, data.user);
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      authService.setSession(data.token, data.user);
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor - UNCHANGED */}
      <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="text-emerald-400 mb-3 bg-emerald-500/10 p-3 rounded-full">
            <IconLeaf />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">BEE Carbon Registry</h1>
          <p className="text-slate-400 text-sm mt-1 text-center">
            {isLoginMode ? "Secure Corporate Login" : "Entity Registration Portal"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Corporate Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@company.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          {!isLoginMode && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Company Legal Name</label>
                <input
                  type="text"
                  name="companyName"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Adani Power Ltd"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Industry Sector</label>
                  <select 
                    name="sector"
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-lg p-2.5 outline-none focus:border-emerald-500 text-sm"
                    value={formData.sector}
                    onChange={handleChange}
                  >
                    <option value="DEFAULT">OTHER / GENERAL</option>
                    <option value="CEMENT">CEMENT</option>
                    <option value="STEEL">STEEL</option>
                    <option value="POWER">POWER</option>
                    <option value="ALUMINUM">ALUMINUM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Market Role</label>
                  <select 
                    name="role"
                    className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-lg p-2.5 outline-none focus:border-emerald-500 text-sm"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="OBLIGATED_ENTITY">Buyer (Obligated)</option>
                    <option value="OFFSET_DEVELOPER">Seller (Developer)</option>
                    <option value="VERIFIER">Verifier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Annual Target (tCO2e)</label>
                <input
                  type="number"
                  name="complianceTarget2025"
                  required
                  value={formData.complianceTarget2025}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold py-3 rounded-lg mt-4 transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20"
          >
            {loading ? "Processing..." : (isLoginMode ? "Sign In" : "Register Entity")}
          </button>
        </form>

        {/* GOOGLE SECTION - Inserted below the manual button */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center w-full gap-2">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Or</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>
          <div className="w-full flex justify-center">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={() => setError("Google Login Failed")}
              theme="filled_black"
              shape="pill"
              text={isLoginMode ? "signin_with" : "signup_with"}
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button 
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isLoginMode ? "New company? Create a registry account" : "Existing account? Return to sign in"}
          </button>
        </div>
      </div>

      <p className="mt-8 text-slate-600 text-[10px] uppercase tracking-[0.2em]">
        © 2025 Bureau of Energy Efficiency • Govt of India
      </p>
    </div>
  );
};

export default AuthPage;