import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/ui/modal';
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
  ArrowRight
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
    setActiveModule,
  } = useDataContext();

  // Modal Open states
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSupplierOpen, setIsSupplierOpen] = useState(false);
  const [isClientOpen, setIsClientOpen] = useState(false);

  // Form states - New Invoice
  const [invoiceClientId, setInvoiceClientId] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState(0);

  // Form states - New Payment
  const [paymentInvoiceId, setPaymentInvoiceId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer' | 'credit_card' | 'check'>('bank_transfer');
  const [paymentRef, setPaymentRef] = useState('');

  // Form states - New Supplier
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supAddress, setSupAddress] = useState('');

  // Form states - New Client
  const [cliName, setCliName] = useState('');
  const [cliCompany, setCliCompany] = useState('');
  const [cliEmail, setCliEmail] = useState('');
  const [cliPhone, setCliPhone] = useState('');
  const [cliAddress, setCliAddress] = useState('');

  // Success message states
  const [successMsg, setSuccessMsg] = useState('');

  // Local validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper trigger alerts
  const showToast = (message: string) => {
    setSuccessMsg(message);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

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

  // Form Handlers
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!invoiceClientId) newErrors.clientId = 'Seulement pour un client existant';
    if (!invoiceDueDate) newErrors.dueDate = "La date d'échéance est obligatoire";
    if (invoiceAmount <= 0) newErrors.amount = 'Le montant doit être supérieur à 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedClient = clients.find((c) => c.id === invoiceClientId);
    if (!selectedClient) return;

    addInvoice({
      clientId: invoiceClientId,
      clientName: selectedClient.name,
      date: new Date().toISOString().split('T')[0],
      dueDate: invoiceDueDate,
      totalAmount: invoiceAmount,
      paidAmount: 0,
      status: 'unpaid',
    });

    // Reset
    setInvoiceClientId('');
    setInvoiceDueDate('');
    setInvoiceAmount(0);
    setErrors({});
    setIsInvoiceOpen(false);
    showToast('Facture créée avec succès !');
  };

  const handleCreatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!paymentInvoiceId) newErrors.invoiceId = 'Sélectionnez une facture';
    
    const selectedInv = invoices.find((i) => i.id === paymentInvoiceId);
    if (selectedInv) {
      const rest = selectedInv.totalAmount - selectedInv.paidAmount;
      if (paymentAmount <= 0 || paymentAmount > rest) {
        newErrors.amount = `Le montant doit être entre 0.01 et ${rest} ${settings.currency}`;
      }
    } else {
      newErrors.amount = 'Facture invalide';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!selectedInv) return;

    addPayment({
      invoiceId: selectedInv.id,
      invoiceNumber: selectedInv.invoiceNumber,
      clientName: selectedInv.clientName,
      amount: Number(paymentAmount),
      paymentMethod,
      reference: paymentRef || undefined,
    });

    // Reset
    setPaymentInvoiceId('');
    setPaymentAmount(0);
    setPaymentMethod('bank_transfer');
    setPaymentRef('');
    setErrors({});
    setIsPaymentOpen(false);
    showToast('Règlement enregistré avec succès !');
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!supName.trim()) newErrors.name = 'Le nom du fournisseur est obligatoire';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addSupplier({
      name: supName,
      contactName: supContact || 'Directeur commercial',
      email: supEmail || 'contact@fournisseur.com',
      phone: supPhone || '+212 600-000000',
      address: supAddress || 'Zone Industrielle',
      status: 'active',
    });

    // Reset
    setSupName('');
    setSupContact('');
    setSupEmail('');
    setSupPhone('');
    setSupAddress('');
    setErrors({});
    setIsSupplierOpen(false);
    showToast('Fournisseur enregistré avec succès !');
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!cliName.trim()) newErrors.name = 'Le nom du client est obligatoire';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addClient({
      name: cliName,
      company: cliCompany || 'Particulier',
      email: cliEmail || 'client@email.com',
      phone: cliPhone || '+212 600-000000',
      address: cliAddress || 'Casablanca, Maroc',
      status: 'active',
    });

    // Reset
    setCliName('');
    setCliCompany('');
    setCliEmail('');
    setCliPhone('');
    setCliAddress('');
    setErrors({});
    setIsClientOpen(false);
    showToast('Client enregistré avec succès !');
  };

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

  const handleOpenPayment = () => {
    const firstInv = invoicesWithReceivables[0];
    if (firstInv) {
      setPaymentInvoiceId(firstInv.id);
      setPaymentAmount(firstInv.totalAmount - firstInv.paidAmount);
    } else {
      setPaymentInvoiceId('');
      setPaymentAmount(0);
    }
    setErrors({});
    setIsPaymentOpen(true);
  };

  const handleOpenInvoice = () => {
    setInvoiceClientId(clients[0]?.id || '');
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setInvoiceDueDate(d.toISOString().split('T')[0]);
    setInvoiceAmount(0);
    setErrors({});
    setIsInvoiceOpen(true);
  };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Nouvelle Facture */}
          <button
            onClick={handleOpenInvoice}
            className="group flex flex-col items-start text-left p-5 bg-white border border-slate-200 rounded-xl shadow-3xs hover:border-indigo-500 hover:shadow-xs transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="p-3 bg-indigo-50 text-indigo-650 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-4 group-hover:text-indigo-650 transition-colors">
              Nouvelle Facture
            </h3>
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-indigo-600" />
            </div>
          </button>

          {/* Action 2: Nouveau Règlement */}
          <button
            onClick={handleOpenPayment}
            className="group flex flex-col items-start text-left p-5 bg-white border border-slate-200 rounded-xl shadow-3xs hover:border-emerald-500 hover:shadow-xs transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="p-3 bg-emerald-50 text-emerald-650 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-4 group-hover:text-emerald-650 transition-colors">
              Nouveau Règlement
            </h3>
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-emerald-600" />
            </div>
          </button>

          {/* Action 3: Nouveau fournisseur */}
          <button
            onClick={() => setIsSupplierOpen(true)}
            className="group flex flex-col items-start text-left p-5 bg-white border border-slate-200 rounded-xl shadow-3xs hover:border-violet-500 hover:shadow-xs transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="p-3 bg-violet-50 text-violet-650 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-4 group-hover:text-violet-650 transition-colors">
              Nouveau Fournisseur
            </h3>
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-violet-600" />
            </div>
          </button>

          {/* Action 4: Nouveau client */}
          <button
            onClick={() => setIsClientOpen(true)}
            className="group flex flex-col items-start text-left p-5 bg-white border border-slate-200 rounded-xl shadow-3xs hover:border-amber-550 hover:shadow-xs transition-all duration-200 cursor-pointer relative overflow-hidden"
          >
            <div className="p-3 bg-amber-50 text-amber-650 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <UserPlus className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mt-4 group-hover:text-amber-650 transition-colors">
              Nouveau Client
            </h3>
            <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus className="h-4 w-4 text-amber-600" />
            </div>
          </button>
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
                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-slate-800">
                        {inv.totalAmount.toLocaleString()} <span className="text-[10px] font-black">{settings.currency}</span>
                      </p>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                        inv.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : inv.status === 'partially_paid'
                          ? 'bg-amber-50 text-amber-700'
                          : inv.status === 'overdue'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inv.status === 'paid' ? 'Payée' : inv.status === 'partially_paid' ? 'Partiel' : inv.status === 'overdue' ? 'En retard' : 'Impayée'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS DEFINITION */}

      {/* Modal 1: Nouvelle Facture */}
      <Modal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        title="Émettre une Nouvelle Facture"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Client Bénéficiaire *
            </label>
            <select
              value={invoiceClientId}
              onChange={(e) => setInvoiceClientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Sélectionner un client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.clientId}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Montant Brute Total ({settings.currency}) *
            </label>
            <input
              type="number"
              value={invoiceAmount || ''}
              onChange={(e) => setInvoiceAmount(Number(e.target.value))}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              required
            />
            {errors.amount && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date d'Échéance *
            </label>
            <input
              type="date"
              value={invoiceDueDate}
              onChange={(e) => setInvoiceDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.dueDate && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.dueDate}</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsInvoiceOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Émettre la Facture
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Nouveau Règlement */}
      <Modal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title="Enregistrer un Règlement Encaissé"
      >
        <form onSubmit={handleCreatePayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sélectionner la Facture à imputer *
            </label>
            <select
              value={paymentInvoiceId}
              onChange={(e) => {
                const id = e.target.value;
                setPaymentInvoiceId(id);
                const inv = invoices.find((i) => i.id === id);
                if (inv) {
                  setPaymentAmount(inv.totalAmount - inv.paidAmount);
                }
              }}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Choisir une facture en attente --</option>
              {invoicesWithReceivables.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.clientName} (Reste :{' '}
                  {(inv.totalAmount - inv.paidAmount).toLocaleString()}{' '}
                  {settings.currency})
                </option>
              ))}
            </select>
            {errors.invoiceId && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.invoiceId}</p>
            )}
            {invoicesWithReceivables.length === 0 && (
              <p className="text-slate-500 text-xs mt-1.5 italic">
                Aucune facture en attente de paiement trouvée !
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Montant reçu * ({settings.currency})
            </label>
            <input
              type="number"
              value={paymentAmount || ''}
              onChange={(e) => setPaymentAmount(Number(e.target.value))}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
              required
            />
            {errors.amount && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.amount}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Canal de règlement *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="bank_transfer">Virement Bancaire</option>
              <option value="cash">Espèces (Cash)</option>
              <option value="credit_card">Carte Bancaire</option>
              <option value="check">Chèque</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Référence du justificatif (Optionnel)
            </label>
            <input
              type="text"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              placeholder="Ex: N° transaction, ID Virement"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsPaymentOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={invoicesWithReceivables.length === 0}
            >
              Enregistrer l'Encaissement
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 3: Nouveau fournisseur */}
      <Modal
        isOpen={isSupplierOpen}
        onClose={() => setIsSupplierOpen(false)}
        title="Créer un Nouveau Fournisseur"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nom / Raison Sociale *
            </label>
            <input
              type="text"
              value={supName}
              onChange={(e) => setSupName(e.target.value)}
              placeholder="Ex: DistriBio S.A.R.L"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {errors.name && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nom du correspondant principal
            </label>
            <input
              type="text"
              value={supContact}
              onChange={(e) => setSupContact(e.target.value)}
              placeholder="Ex: Ahmed Alaoui"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email de contact
              </label>
              <input
                type="email"
                value={supEmail}
                onChange={(e) => setSupEmail(e.target.value)}
                placeholder="contact@fournisseur.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                N° de Téléphone
              </label>
              <input
                type="text"
                value={supPhone}
                onChange={(e) => setSupPhone(e.target.value)}
                placeholder="+212 522-XXXXXX"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Adresse physique
            </label>
            <input
              type="text"
              value={supAddress}
              onChange={(e) => setSupAddress(e.target.value)}
              placeholder="Zone Industrielle, Tit Mellil"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsSupplierOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer Fournisseur
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 4: Nouveau client */}
      <Modal
        isOpen={isClientOpen}
        onClose={() => setIsClientOpen(false)}
        title="Ajouter un Nouveau Client"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nom Complet *
              </label>
              <input
                type="text"
                value={cliName}
                onChange={(e) => setCliName(e.target.value)}
                placeholder="Ex: Karim Bensalah"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              {errors.name && (
                <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Entreprise (Raison Sociale)
              </label>
              <input
                type="text"
                value={cliCompany}
                onChange={(e) => setCliCompany(e.target.value)}
                placeholder="Ex: Alpha Tech S.A.S"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Adresse Email
              </label>
              <input
                type="email"
                value={cliEmail}
                onChange={(e) => setCliEmail(e.target.value)}
                placeholder="client@domaine.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Téléphone Mobile
              </label>
              <input
                type="text"
                value={cliPhone}
                onChange={(e) => setCliPhone(e.target.value)}
                placeholder="+212 661-XXXXXX"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Adresse de Facturation
            </label>
            <input
              type="text"
              value={cliAddress}
              onChange={(e) => setCliAddress(e.target.value)}
              placeholder="Ex: Boulevard Anfa, Casablanca"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsClientOpen(false)}
            >
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer Client
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
