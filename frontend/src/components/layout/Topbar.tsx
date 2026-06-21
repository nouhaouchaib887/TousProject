import React, { useState } from 'react';
import { useDataContext } from '../../services/DataContext';
import { Menu, Search, X, Calendar, DollarSign, Bell } from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeModule,
    searchQuery,
    setSearchQuery,
    settings,
    products,
    invoices
  } = useDataContext();

  const [searchVisible, setSearchVisible] = useState(true);

  // Format module name for visual breadcrumbs
  const getModuleTitle = () => {
    switch (activeModule) {
      case 'dashboard':
        return 'Tableau de Bord';
      case 'factures':
        return 'Factures & Devis';
      case 'paiements':
        return 'Paiements Reçus';
      case 'clients':
        return 'Répertoire Clients';
      case 'fournisseurs':
        return 'Gestion Fournisseurs';
      case 'produits':
        return 'Catalogue Produits';
      case 'stock':
        return 'Suivi du Stock & Mouvements';
      case 'commandes':
        return 'Commandes Clients';
      case 'banques_caisses':
        return 'Banques & Caisses';
      case 'rapports':
        return 'Rapports & Statistiques';
      case 'parametres':
        return 'Configuration Système';
      default:
        return 'Gestion de Stock';
    }
  };

  // Quick stats to display in the header bar
  const itemsEnAlerte = products.filter(p => p.stockQuantity <= p.minStockThreshold).length;

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Toggle Sidebar Button */}
        <button
          id="btn-toggle-sidebar"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
          title={sidebarOpen ? 'Cacher le menu' : 'Afficher le menu'}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-800 font-semibold">
          <span>{getModuleTitle()}</span>
        </div>
      </div>

      {/* Center Search bar with hide/show capability */}
      <div className="flex-1 max-w-md mx-6 flex items-center justify-end sm:justify-start">
        {searchVisible ? (
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3 h-4 items-center text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Rechercher dans ${getModuleTitle().toLowerCase()}...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-10 pr-9 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all"
            />
            {/* Clear/Hide search icon */}
            <button
              id="btn-hide-search-bar"
              onClick={() => {
                setSearchQuery('');
                setSearchVisible(false);
              }}
              className="absolute right-2 p-1 text-slate-405 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
               placeholder="Ex: Ref VRM-73892, N°928"
              title="Masquer la recherche"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            id="btn-show-search-bar"
            onClick={() => setSearchVisible(true)}
            className="p-2 text-slate-505 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            title="Afficher la recherche"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline font-normal text-xs text-slate-400">Recherche activée</span>
          </button>
        )}
      </div>

      {/* Right elements (notifications, status labels, currency reminder) */}
      <div className="flex items-center gap-4">

        <div className="hidden xl:flex items-center gap-1 text-slate-400 text-xs">
          <Calendar className="h-3.5 w-3.5" />
          <span>Devises : <span className="font-semibold text-slate-700">{settings.currency || 'MAD'}</span></span>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        {/* User profile dropdown look-alike */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-xs shadow-inner">
            AD
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-800">Administrateur</p>
            <p className="text-[10px] text-slate-400 font-medium leading-none">Stock Controller</p>
          </div>
        </div>
      </div>
    </header>
  );
};
