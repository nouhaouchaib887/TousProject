import React, { useState, useEffect } from "react"
import { Sheet } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { motion, AnimatePresence } from 'motion/react';

import { 
  FileText, 
  CreditCard, 
  User, 
  Map, 
  Download, 
  ExternalLink, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Info,
  Package
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import StatusBadge from "@/components/StatusBadge"
import { cn } from "@/lib/utils"
import { InvoiceTableRead, InvoiceItem} from "../types"

interface InvoiceDetailPanelProps {
  invoice: InvoiceTableRead | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (invoice: any) => void
  onDelete?: (invoice: InvoiceTableRead) => void;
  onDuplicate?: (invoice: InvoiceTableRead) => void;
  onEditPartner?: (partner: any) => void
   initialTab?: string
}

export default function InvoiceDetailPanel({ invoice, isOpen, onClose, onEdit, onEditPartner, initialTab = "overview" }: InvoiceDetailPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
    }
    console.log("Invoice Detail Panel Opened with Project:", invoice)
  }, [isOpen, initialTab])
  if (!invoice) return null

  // Mock transactions for display
  const transactions = [
    { id: "TR-001", type: "Advance", date: "2024-03-15", amount: invoice.total_paid, status: "Completed", method: "Bank Transfer" },
    { id: "TR-002", type: "Partial", date: "2024-03-28", amount: 5000, status: "Pending", method: "Check" },
  ]
   const fieldInterventions = [
    { 
      id: "INT-F-001", 
      date: "2024-03-14", 
      agents: [
        { name: "Ahmed Alami", role: "Chef de Brigade" },
        { name: "Youssef Benani", role: "Opérateur" },
        { name: "Said Naciri", role: "Chauffeur/Aide" }
      ],
      observations: "Bornage effectué selon le plan de masse. Les bornes B1 à B4 sont en place.",
      type: "Bornage"
    },
    { 
      id: "INT-F-002", 
      date: "2024-03-20", 
      agents: [
        { name: "Ahmed Alami", role: "Chef de Brigade" },
        { name: "Karim Tazi", role: "Assistant" }
      ],
      observations: "Levé complémentaire de la façade sud à la demande du client.",
      type: "Levé"
    }]

    const officeInterventions = [
    {
      id: "INT-B-001",
      category: "Calculs de Structure",
      timeSpent: "4h 30min",
      description: "Traitement des données brutes du levé et compensation du cheminement.",
      agents: ["Mohammed Slaoui", "Amine Idrissi"]
    },
    {
      id: "INT-B-002",
      category: "Dessin & DAO",
      timeSpent: "6h 00min",
      description: "Établissement du plan de situation et du plan de masse définitif.",
      agents: ["Laila Mansouri"]
    },
    {
      id: "INT-B-003",
      category: "Administratif",
      timeSpent: "1h 15min",
      description: "Dépôt du dossier numérique sur la plateforme e-foncier.",
       agents: ["Mohammed Slaoui"]
    }
  ]

 const progressPercent =( invoice.amount_ttc??0) > 0 ? ((invoice.total_paid?? 0)/ (invoice.amount_ttc ?? 1)) * 100 : 0;
  return (
     <AnimatePresence>
    <Sheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Facture ${invoice.reference}`}
      description={`${invoice.reference} - ${invoice.partner?.full_name}`}
    >
      <div className="p-6 pt-2">
        <button 
          onClick={() => onEdit?.(invoice)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-50 text-brand-600 rounded-xl font-bold text-sm hover:bg-brand-100 transition-all mb-6 border border-brand-100"
        >
          <FileText size={18} />
          Modifier les informations de la facture
        </button>
      <Tabs  value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
  <TabsTrigger value="overview" className="w-full justify-center">
    Aperçu
  </TabsTrigger>

  <TabsTrigger value="items" className="w-full justify-center">
    Articles
  </TabsTrigger>

  <TabsTrigger value="billing" className="w-full justify-center">
    Réglements
  </TabsTrigger>
</TabsList>

        {/* --- OVERVIEW --- */}
        <TabsContent value="overview" className="space-y-6 ">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Etat de la Facture</p>
              <div className="mt-2">
                <StatusBadge status={invoice.status} type="project" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Paiement</p>
              <div className="mt-2">
                <StatusBadge status={invoice?.payment_status} type="payment" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p  className="text-xs text-slate-500 uppercase font-bold tracking-wider">Date d'Émission</p>
          <p className="mt-2 text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          <span>{invoice.invoice_date}</span>
          </p>
          </div>

           <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p  className="text-xs text-slate-500 uppercase font-bold tracking-wider">Date d'Échéance</p>
          <p className="mt-2 text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Calendar size={13} className="text-slate-400" />
          <span>{invoice.due_date}</span>
          </p>
          </div>
          </div>


          <section>
            <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <User size={16} className="text-brand-600" />
                {invoice.invoice_type === "ACHAT"
                ? "Fournisseur associé"
                : "Client associé"}
              </h3>
            </div>
            <div className="space-y-4">
              {invoice.partner && (
  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
          {invoice.partner.first_name?.[0]}
          {invoice.partner.last_name?.[0]}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {invoice.partner.full_name} 
          </p>
          <p className="text-xs text-slate-500">
            {invoice.partner.phone_number}
          </p>
        </div>
      </div>

      <button
        onClick={() => onEditPartner?.(invoice.partner)}
        className="p-2 hover:bg-white rounded-lg text-brand-600 transition-colors border border-transparent hover:border-brand-100"
        title="Détails & Modification"
      >
        <Info size={16} />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
      <div>
        <p className="text-[10px] text-slate-400 uppercase font-bold">
          CIN
        </p>
        <p className="text-xs font-mono font-medium">
          {invoice.partner.cin || "N/A"}
        </p>
      </div>

    </div>
  </div>
)}

            </div>
          </section>
        {/* Meta Fields Section */}
        <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
        <Info size={14} />
        <span>Conditions de Règlement</span>
        </h3>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p  className="text-xs text-slate-500 uppercase font-bold tracking-wider">Date d'Échéance</p>
              <p className="font-bold text-slate-700">{invoice.expected_check_date}</p>
            </div>
            <div>
              <p  className="text-xs text-slate-500 uppercase font-bold tracking-wider">Méthode de Règlement</p>
              <p className="font-bold text-slate-700">{invoice.payment_method || 'Virement Bancaire'}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-4 text-xs">
            <div>
              <p  className="text-xs text-slate-500 uppercase font-bold tracking-wider">Référence du paiement</p>
              <p className="font-bold text-slate-700">{invoice.payment_reference}</p>
            </div>
      
          </div>
      </section>
        </TabsContent>
 {/* --- Items--- */}
        <TabsContent value="items" className="space-y-8">
          {!invoice.invoice_items || invoice.invoice_items.length === 0 ? (
                      <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                        <Package size={28} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-medium">Aucun article enregistré sur cette facture.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {invoice.invoice_items.map((iIt: InvoiceItem, index: number) => (
                          <div 
                            key={iIt.id || index}
                            className="p-4 bg-white border border-slate-150 rounded-xl shadow-3xs hover:border-[#1d2745]/30 transition-all space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-xs font-bold text-slate-900">{iIt.item?.label}</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">Produit Réf : {iIt.item?.reference|| 'N/A'}</p>
                              </div>
                              <span className="text-[10px] font-extrabold text-[#1d2745] bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                                {iIt.quantity} {iIt.unit || 'pcs'}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-xs">
                              <div>
                                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">P.U. ({iIt.amount_type || 'HT'})</span>
                                <span className="font-semibold text-slate-700">{iIt.amount_ttc?.toLocaleString()} DH</span>
                              </div>
                              <div className="text-center">
                                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">TVA</span>
                                <span className="font-bold text-slate-700">{iIt.vat_rate}%</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wide">Total TTC</span>
                                <span className="font-black text-slate-800">{( ((iIt.amount_ttc?? 0) *( iIt.quantity ?? 0))).toLocaleString()} DH</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-50">
                              <span>Total HT : { ((iIt.amount_ht ?? 0) * (iIt.quantity ?? 0)).toLocaleString()} DH</span>
                              <span>TVA : {( ((iIt.amount_ttc?? 0) *( iIt.quantity ?? 0)) - ((iIt.amount_ht ?? 0) * (iIt.quantity ?? 0))).toLocaleString()} DH</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
        </TabsContent>
        {/* --- BILLING --- */}
        <TabsContent value="billing" className="space-y-6">
            <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
           {/* Financial Summary Card */}
           <div className="bg-[#1d2745] text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                      
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-slate-350 uppercase font-black tracking-wider">Total à Régler TTC</p>
                    <h4 className="text-2xl font-black mt-1.5 tracking-tight">
                    {invoice.total_paid?.toLocaleString()} DH
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-slate-350 uppercase font-black tracking-wider">Solde restant</p>
                          <p className={`text-base font-black mt-1 ${(invoice.balance ?? 0)> 0 ? 'text-amber-300' : 'text-emerald-400'}`}>
                            {invoice.balance?.toLocaleString()} DH
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-5 space-y-1.5">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full bg-emerald-400 rounded-full" 
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-300 font-bold uppercase tracking-wider">
                          <span>Payé : {invoice.total_paid?.toLocaleString()} DH ({Math.round(progressPercent)}%)</span>
                          <span>Reste : {invoice.balance?.toLocaleString()} DH</span>
                        </div>
                      </div>
                    </div>

                    {/* HT, TVA, TTC breakdown */}
                    <section className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">Ventilation Financière</h3>
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2.5 text-xs">
                        <div className="flex justify-between text-slate-500">
                          <span>Montant Total HT :</span>
                          <span className="font-semibold text-slate-700">
                            {invoice.amount_ht?.toLocaleString(undefined, { maximumFractionDigits: 2 })}DH
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Montant de la TVA :</span>
                          <span className="font-semibold text-slate-700">
                            {invoice.total_vat?.toLocaleString(undefined, { maximumFractionDigits: 2 })} DH
                          </span>
                        </div>
                        <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-805">
                          <span>Total TTC :</span>
                          <span className="text-slate-900 font-extrabold">
                            {invoice.amount_ttc?.toLocaleString()} DH
                          </span>
                        </div>
                      </div>
                    </section>

                    {/* Transaction History */}
                    <section className="space-y-3">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                        <CreditCard size={14} className="text-[#1d2745]" />
                         Historique des Règlements ({invoice.transactions?.length ?? 0})
                      </h3>

                      {invoice.transactions.length === 0 ? (
                        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-450">
                          Aucun encaissement n'a encore été enregistré pour cette facture.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {invoice.transactions?.map((p) => (
                            <div 
                              key={p.id}
                              className="p-3 bg-white border border-slate-150 rounded-lg flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-emerald-50 text-emerald-650 rounded-md">
                                  <ArrowUpRight size={14} />
                                </div>
                                <div className="text-xs">
                                  <p className="font-bold text-slate-800">Encaissé via {p.payment_method === 'cash' ? 'Espèces' : p.payment_method === 'bank_transfer' ? 'Virement' : p.payment_method === 'check' ? 'Chèque' : 'Carte'}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">{p.payment_date} {p.reference ? `• Ref: ${p.reference}` : ''}</p>
                                </div>
                              </div>
                              <span className="text-xs font-extrabold font-mono text-emerald-650">
                                +{p.amount.toLocaleString()} DH
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                    </motion.div>
        </TabsContent>
      </Tabs>
      </div>
    </Sheet>
    </AnimatePresence>
  )
}