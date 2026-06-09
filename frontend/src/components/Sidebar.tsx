import React from 'react';
import { LayoutDashboard, Briefcase, Wallet, Settings, Users, Map as MapIcon, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

const modules = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'projects', label: 'Projets', icon: Briefcase },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'admin', label: 'Administration', icon: Settings },
  { id: 'users', label: 'Équipe', icon: Users },
];

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
            <MapIcon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">TopoFlow</h1>
            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Cabinet Topo</p>
          </div>
        </div>

        <nav className="space-y-1">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = activeModule === module.id;
            
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-50 text-brand-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <span className="font-medium text-sm">{module.label}</span>
                </div>
                {isActive && (
                  <motion.div layoutId="active-pill">
                    <ChevronRight size={14} className="text-brand-600" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
