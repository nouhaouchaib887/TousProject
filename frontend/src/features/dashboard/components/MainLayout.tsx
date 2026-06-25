import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/ui/modal';
import AddInvoiceForm from '../../Invoice/components/AddInvoiceForm';
import  AddPartnerModal from '../../partner/components/partnerModal';
import  AddProductModal from '../../Product/components/AddProductModal';
import {
  FileText,
  CreditCard,
  UserPlus,
  Truck,
  Boxes,
  Briefcase,
  TrendingUp,
  Receipt,
  Plus,
  Coins,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Check
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    products,
    payments,
    invoices,
    clients,
    suppliers,
    settings,
    addInvoice,
    addPayment,
    addSupplier,
    addClient,
    addProduct,
    setActiveModule,
  } = useDataContext();

  // Modal Open states
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isTiersOpen, setIsTiersOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
 


  

  

  // Success message states
  const [successMsg, setSuccessMsg] = useState('');

  

  // KPI calculations
  const stats = useMemo(() => {
    // 1. Products in stock (unique products with quantity > 0)
    const activeProducts = products.filter((p) => p.stockQuantity > 0);
    const sumQty = products.reduce((acc, p) => acc + p.stockQuantity, 0);

    // 2. Payments received
    const sumPayments = payments.reduce((acc, p) => acc + p.amount, 0);

    // 3. Turnover (Chiffre d'Affaires - cumulative amount of all invoices)
    const sumInvoices = invoices.reduce((acc, i) => acc + i.totalAmount, 0);

    // 4. Number of invoices
    const countInvoices = invoices.length;

    return {
      activeProductsCount: activeProducts.length,
      totalUnits: sumQty,
      totalPayments: sumPayments,
      totalTurnover: sumInvoices,
      totalInvoicesCount: countInvoices,
    };
  }, [products, payments, invoices]);

  

  // Helper current remaining invoice details
  const invoicesWithReceivables = useMemo(() => {
    return invoices.filter((i) => i.totalAmount - i.paidAmount > 0);
  }, [invoices]);

  const alertProducts = useMemo(() => {
    return products.filter((p) => p.stockQuantity <= p.minStockThreshold);
  }, [products]);

  const recentInvoices = useMemo(() => {
    return [...invoices].reverse().slice(0, 5);
  }, [invoices]);

  

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Floating alert */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-50 border border-emerald-250 text-emerald-800 p-4 rounded-xl shadow-lg flex items-center gap-3 text-xs font-bold animate-bounce">
          <span className="h-2 w-2 bg-emerald-600 rounded-full"></span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. SECTIONS: ACTIONS À FAIRE (QUICK ACTIONS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Actions Directes Opérationnelles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Action 1: Nouvelle Facture */}
          <button
            onClick={() => {
              setIsInvoiceOpen(true);
            }}
            className="group flex flex-col items-start text-left p-5 bg-white border border-slate-200 rounded-xl shadow-3xs hover:border-[#1d2745] hover:shadow-xs transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="p-3 bg-violet-50 text-[#1d2745] rounded-xl group-hover:bg-[#1d2745] group-hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-4 group-hover:text-[#1d2745] transition-colors">
              Nouvelle Facture
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Créer une créance ou facturer directement un compte client existant.
            </p>
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-indigo-600" />
            </div>
          </button>
            {/* Add Invoice Modal */}
            <AddInvoiceForm
              isOpen={isInvoiceOpen} 
              onClose={() => {
              setIsInvoiceOpen(false);
              }} 
            />
          {/* Action 2: Nouveau Tiers */}
          <button
            onClick={() => {
              setIsTiersOpen(true);
            }}
            className="group flex flex-col items-start text-left p-5 bg-white border border-slate-200 rounded-xl shadow-3xs hover:border-[#1d2745] hover:shadow-xs transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="p-3 bg-violet-50 text-[#1d2745] rounded-xl group-hover:bg-[#1d2745] group-hover:text-white transition-colors">
              <UserPlus className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-4 group-hover:text-[#1d2745] transition-colors">
              Nouveau Tiers
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Enregistrer une fiche d'entreprise ou de contact pour un client ou un fournisseur.
            </p>
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-emerald-600" />
            </div>
          </button>
          <AddPartnerModal
            isOpen={isTiersOpen}
            onClose={() => setIsTiersOpen(false)}
           
          ></AddPartnerModal>

          {/* Action 3: Nouveau Produit */}
          <button
            onClick={() => setIsProductOpen(true)}
            className="group flex flex-col items-start text-left p-5 bg-white border border-slate-200 rounded-xl shadow-3xs hover:border-[#1d2745] hover:shadow-xs transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="p-3 bg-violet-50 text-[#1d2745] rounded-xl group-hover:bg-[#1d2745] group-hover:text-white transition-colors">
              <Boxes className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-4 group-hover:text-[#1d2745] transition-colors">
              Nouveau Produit
            </h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Enregistrer une référence produit, un service ou un article du catalogue de stock.
            </p>
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-[#1d2745]" />
            </div>
          </button>
          <AddProductModal
            isOpen={isProductOpen}
            onClose={() => setIsProductOpen(false)}
           
          ></AddProductModal>
        </div>
      </div>

      {/* 2. SECTIONS: STATISTIQUES (KPI METRICS) */}
      <div className="space-y-4">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Indicateurs Clés et Statistiques d'Activité
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1: Produits en stock */}
          <div
            onClick={() => setActiveModule('produits')}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-3xs flex items-center justify-between hover:border-slate-350 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                Produits en stock
              </p>
              <p id="stat-products-in-stock" className="text-2xl font-black text-slate-800">
                {stats.activeProductsCount} <span className="text-xs font-semibold text-slate-400">réfs</span>
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">
                Units physiques : <span className="font-bold text-slate-600">{stats.totalUnits} pièces</span>
              </p>
            </div>
            <div id="icon-products-in-stock" className="p-3 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-slate-100 group-hover:text-slate-800 transition-colors">
              <Boxes className="h-6 w-6" />
            </div>
          </div>

          {/* Stat 2: Paiements reçus */}
          <div
            onClick={() => setActiveModule('paiements')}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-3xs flex items-center justify-between hover:border-slate-350 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                Paiements reçus
              </p>
              <p id="stat-payments-received" className="text-2xl font-black text-emerald-600">
                {stats.totalPayments.toLocaleString()} <span className="text-xs font-black">{settings.currency}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">
                Trésorerie encaissée en banque
              </p>
            </div>
            <div id="icon-payments-received" className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <Coins className="h-6 w-6" />
            </div>
          </div>

          {/* Stat 3: Chiffre d'Affaires */}
          <div
            onClick={() => setActiveModule('factures')}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-3xs flex items-center justify-between hover:border-slate-350 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                Chiffre d'affaire
              </p>
              <p id="stat-turnover" className="text-2xl font-black text-indigo-600">
                {stats.totalTurnover.toLocaleString()} <span className="text-xs font-black">{settings.currency}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-semibold">
                Facturé global hors encaissements
              </p>
            </div>
            <div id="icon-turnover" className="p-3 bg-indigo-50 text-indigo-650 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          {/* Stat 4: Nombre de factures */}
          <div
            onClick={() => setActiveModule('factures')}
            className="p-5 bg-white border border-slate-200 rounded-xl shadow-3xs flex items-center justify-between hover:border-slate-350 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                Nombre de factures
              </p>
              <p id="stat-invoice-count" className="text-2xl font-black text-slate-850">
                {stats.totalInvoicesCount} <span className="text-xs font-semibold text-slate-400">émises</span>
              </p>
              <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>Régularisées : {invoices.filter(i => i.status === 'paid').length}</span>
              </p>
            </div>
            <div id="icon-invoice-count" className="p-3 bg-slate-50 text-slate-550 rounded-xl group-hover:bg-slate-100 group-hover:text-slate-800 transition-colors">
              <Receipt className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. ALERTS & RECENT INVOICES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-slate-800 text-sm">Alertes de Stock Bas</h3>
              </div>
              <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                {alertProducts.length} produit(s)
              </span>
            </div>

            <div className="mt-4 space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {alertProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="h-9 w-9 rounded-full bg-emerald-55/60 text-emerald-600 flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-bold text-slate-700">Tout est en règle !</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Aucun produit n'est en alerte de stock bas.</p>
                </div>
              ) : (
                alertProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-amber-50/40 border border-amber-100/60">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{p.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Ref : {p.sku || p.id.slice(0, 6)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-rose-600">{p.stockQuantity} restants</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">seuil min : {p.minStockThreshold}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {alertProducts.length > 0 && (
            <button
              onClick={() => setActiveModule('produits')}
              className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-indigo-600 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200/60 cursor-pointer"
            >
              <span>Gérer les approvisionnements</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Card Recent Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-sm">Factures Récentes</h3>
              </div>
              <button
                onClick={() => setActiveModule('factures')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <span>Voir tout</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {recentInvoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="h-9 w-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-bold text-slate-600">Aucune facture émise</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Émettez une facture pour commencer.</p>
                </div>
              ) : (
                recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{inv.clientName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-medium">
                        <span className="font-bold text-slate-500">{inv.invoiceNumber}</span>
                        <span>•</span>
                        <span>{inv.date}</span>
                      </div>
                    </div>
                    
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      
     
    </div>

    
  );
};
