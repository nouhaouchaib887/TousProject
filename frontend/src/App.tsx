import React from 'react';
import { DataProvider, useDataContext } from './services/DataContext';
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar';

// Features imports
import { DashboardView } from './features/dashboard/components/MainLayout';
import { InvoiceView } from './features/Invoice/components/InvoiceView';
import { PaiementsView } from './features/Payment/components/PaymentView';
import { ClientsView } from './features/Client/components/ClientView';
import { FournisseursView } from './features/Supplier/components/SupplierView';
import { ProduitsView } from './features/Product/components/ProductView';
import { StockView } from './features/Stock/components/StockView';
import { CommandesView } from './features/Commande/components/CommandeView';
import { RapportsView } from './features/Report/components/ReportView';
import { ParametresView } from './features/Setting/components/SettingView';

// Subcomponent carrying context access
const AppLayout: React.FC = () => {
  const { activeModule } = useDataContext();

  // Dynamic router based on global state (SOLID OCP)
  const renderActiveView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView />;
      case 'factures':
        return <InvoiceView />;
      case 'paiements':
        return <PaiementsView />;
      case 'clients':
        return <ClientsView />;
      case 'fournisseurs':
        return <FournisseursView />;
      case 'produits':
        return <ProduitsView />;
      case 'stock':
        return <StockView />;
      case 'commandes':
        return <CommandesView />;
      case 'rapports':
        return <RapportsView />;
      case 'parametres':
        return <ParametresView />;
      default:
        return <InvoiceView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans" id="app-root-shell">
      {/* 1. Left Drawer Sidebar */}
      <Sidebar />

      {/* 2. Right Viewport Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header details */}
        <Topbar />

        {/* Scrolling view body wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50" id="main-content-viewport">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <AppLayout />
    </DataProvider>
  );
}
