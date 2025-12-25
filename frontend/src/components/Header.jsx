import React from 'react';
import { IconLeaf } from './Icons';

const Header = ({ user }) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="text-emerald-400">
          <IconLeaf />
        </div>
        <h1 className="text-lg font-bold text-slate-100 tracking-tight">
          India Carbon Market <span className="text-slate-500 text-sm font-normal hidden sm:inline">| BEE Compliance Portal</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-200">{user.companyName}</p>
          <div className="flex items-center justify-end gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xs text-slate-400 uppercase tracking-wider">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
        <div className="h-8 w-8 rounded bg-linear-to-br from-emerald-400 to-slate-700 flex items-center justify-center text-white font-bold">
          {user.companyName.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;