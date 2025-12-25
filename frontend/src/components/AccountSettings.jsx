import React, { useState } from 'react';
import { IconSettings, IconLogOut } from './Icons';
import { authService } from '../services/authService';
const AccountSettings = ({ user, onUpdateUser, onLogout }) => {
  const [formData, setFormData] = useState({
    companyName: user.companyName,
    role: user.role,
    sector: user.sector,
    complianceTarget2025: user.complianceTarget2025,
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const updatedData = {
    companyName: formData.companyName,
    role: formData.role,
    sector: formData.sector,
    complianceTarget2025: Number(formData.complianceTarget2025),
  };

  try {
    const response = await fetch(`http://localhost:5000/api/auth/update/${user._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}` 
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (response.ok) {
      onUpdateUser(data.user); 
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  } catch (err) {
    console.error("Update failed", err);
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
             <IconSettings /> Account Settings
           </h2>
           <p className="text-slate-400 text-sm">Manage entity profile and compliance targets.</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20">
          <IconLogOut />
          <span className="font-medium text-sm">Log Out</span>
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Sector</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="CEMENT">CEMENT</option>
                  <option value="STEEL">STEEL</option>
                  <option value="POWER">POWER</option>
                  <option value="ALUMINUM">ALUMINUM</option>
                  <option value="DEFAULT">OTHER / GENERAL</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Role Type</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
                >
                  <option value="OBLIGATED_ENTITY">OBLIGATED ENTITY</option>
                  <option value="OFFSET_DEVELOPER">OFFSET DEVELOPER</option>
                  <option value="VERIFIER">VERIFIER</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">2025 Target (tCO2e)</label>
                <input
                  type="number"
                  required
                  value={formData.complianceTarget2025}
                  onChange={(e) => setFormData({...formData, complianceTarget2025: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-mono">ID: {user._id}</p>
            <div className="flex items-center gap-4">
              {isSaved && <span className="text-emerald-400 text-sm animate-pulse">Changes saved!</span>}
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-6 rounded-lg transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;