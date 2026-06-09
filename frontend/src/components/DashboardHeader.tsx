import React from 'react';
import { Search, Bell, UserCircle, Plus } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function DashboardHeader({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un dossier, client..." 
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 w-64 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="flex items-center gap-3 ml-2 cursor-pointer group">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">Ing. Ahmed Benani</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Directeur Technique</p>
            </div>
            <UserCircle size={32} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
