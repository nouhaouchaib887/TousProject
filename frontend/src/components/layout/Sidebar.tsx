import React from 'react';
import { useDataContext } from '../../services/DataContext';
import { ActiveModule } from '../../types';
import {
  FileText,
  CreditCard,
  Users,
  Truck,
  Package,
  Layers,
  ShoppingCart,
  BarChart3,
  Settings as SettingsIcon,
  LayoutDashboard,
  Boxes,
  Landmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    sidebarOpen,
    products,
    invoices,
    settings
  } = useDataContext();

  // Strict order: Factures, Paiements, Clients, Fournisseurs, Produits, stock, Commandes, Rapports, Paramètres
  const menuItems = [
    {
      id: 'factures' as ActiveModule,
      label: 'Factures',
      icon: FileText,
    },
    {
      id: 'paiements' as ActiveModule,
      label: 'Paiements',
      icon: CreditCard,
    },
    {
      id: 'clients' as ActiveModule,
      label: 'Clients',
      icon: Users,
    },
    {
      id: 'fournisseurs' as ActiveModule,
      label: 'Fournisseurs',
      icon: Truck,
    },
    {
      id: 'produits' as ActiveModule,
      label: 'Produits',
      icon: Package,
    },
    {
      id: 'stock' as ActiveModule,
      label: 'Stock',
      icon: Boxes,
    },
    {
      id: 'commandes' as ActiveModule,
      label: 'Commandes',
      icon: ShoppingCart,
    },
    {
      id: 'banques_caisses' as ActiveModule,
      label: 'Banques | Caisses',
      icon: Landmark,
    },
    {
      id: 'rapports' as ActiveModule,
      label: 'Rapports',
      icon: BarChart3,
    },
    {
      id: 'parametres' as ActiveModule,
      label: 'Paramètres',
      icon: SettingsIcon,
    },
  ];

  return (
    <AnimatePresence initial={false}>
      {sidebarOpen && (
        <motion.aside
          id="app-sidebar"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-screen bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-xl overflow-hidden shrink-0"
        >
          {/* Header/Logo section - Clicking it accesses empty welcome Dashboard */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveModule('dashboard')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="p-2.5 bg-slate-800 rounded-lg text-slate-300 group-hover:bg-slate-700 transition-colors shadow-xs">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight text-white group-hover:text-slate-300 transition-colors">
                  StockManager
                </h1>
                <p className="text-xs text-slate-400 font-medium">
                  {settings.companyName || 'Pro S.A.R.L'}
                </p>
              </div>
            </button>
          </div>

          {/* Home/Dashboard Shortcut Button */}
          <div className="px-4 pt-4">
            <button
              onClick={() => setActiveModule('dashboard')}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all focus:outline-none ${
                activeModule === 'dashboard'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-5 w-5" />
                <span>Tableau de Bord</span>
              </div>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                Main
              </span>
            </button>
          </div>

          <div className="p-4">
            <div className="h-px bg-slate-800 my-2" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Modules de Gestion
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 pb-4 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  id={`sidebar-link-${item.id}`}
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all focus:outline-none ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer of Sidebar */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-center text-xs text-slate-500">
            <p>© 2026 StockManager SOLID</p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
