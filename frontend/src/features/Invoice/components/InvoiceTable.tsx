import React, { useState }  from 'react';
import { Button } from '../../../components/ui/button';
import { Facture } from '../../../types';
import{InvoiceTableRead} from '../types'
import { FileText, Eye, Copy, Check, Trash2 } from 'lucide-react';
import StatusBadge from '../../../components/StatusBadge';
import { MapPin, Phone, User, CreditCard, Users as UsersIcon, Info, ExternalLink } from 'lucide-react';
import InvoiceDetailPanel from './InvoiceDetailPanel';

export interface InvoiceTableProps {
  invoices: InvoiceTableRead[];
  currency?: string;
  onEdit: (invocie:InvoiceTableRead) => void;
  onValidate?: (invoice: InvoiceTableRead) => void;
  onDelete: (invoice: InvoiceTableRead) => void;
  onDuplicate?: (invoice: InvoiceTableRead) => void;
  onView?: (invoice: InvoiceTableRead) => void;
  onEditPartner: (invoice: InvoiceTableRead) => void;
}



type ProjectStatus = "Brouillon" | "Validé" | "Phase Terrain" | "Phase Bureau" | "Clôturé";
type PaymentStatus = "Impayé" | "Partiel" | "Payé";



export function InvoiceTable({ invoices, onEdit,onDelete, onDuplicate, onEditPartner,onValidate  }: InvoiceTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceTableRead | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpenDetails = (invoice: InvoiceTableRead) => {
    setSelectedInvoice(invoice);
    console.log("invoice:", invoice)
    setIsPanelOpen(true);
  };
  

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left min-w-[1400px]">
          <thead>
            {/* Grouped Headers */}
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th colSpan={3} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    <Info size={14} />
                    Informations de base
                  </span>
                </div>
              </th>
              <th colSpan={3} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  Informations du Client
                </div>
              </th>
              <th colSpan={3} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} />
                  Montant
                </div>
              </th>
              
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                Actions
              </th>
            </tr>
            {/* Column Headers */}
            <tr className="bg-white border-b border-slate-200">
              {/* Invoice */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">N° Facture</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Nature de la facture</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100 whitespace-nowrap">État</th>
              
              {/* Client */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Nom</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Prénom</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Téléphone</th>
              
              {/* Payment */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Montant HT</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Montant TTC</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100 whitespace-nowrap">Status du Paiement</th>
              
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr 
                key={invoice.id} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => handleOpenDetails(invoice)}
              >
                
                {/* Project */}
                <td className="px-6 py-4 text-sm font-bold text-slate-900 whitespace-nowrap">{invoice.reference}</td>
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{invoice.invoice_type}</td>
                <td className="px-6 py-4 border-r border-slate-100 whitespace-nowrap">
                  <StatusBadge status={invoice.status} type="project" />
                </td>

                {/* Client */}
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{invoice.partner?.last_name}</td>
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{invoice.partner?.first_name}</td>
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    {invoice.partner?.phone_number}
                  </div>
                </td>

                {/* Payment */}
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{invoice?.amount_ht?.toLocaleString()} DH</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">{invoice?.amount_ttc?.toLocaleString()} DH</td>
                <td className="px-6 py-4 border-r border-slate-100 whitespace-nowrap">
                  <StatusBadge status={invoice?.payment_status} type="payment" />
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right">
                   <div className="flex items-center justify-end gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(invoice);
                    }}
                   className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all"
                      title="Voir détails"
                  >
                    <Eye size={18} />
                  </button>
                  
                  <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate?.(invoice);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="Dupliquer"
                    >
                      <Copy size={18} />
                    </button>
                     <button 
                          onClick={() => onValidate?.(invoice)}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer"
                          title="Valider"
                        >
                          <Check size={15} className="stroke-[2.5]" />
                        </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(invoice);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Supprimer"
                    >
                       <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <InvoiceDetailPanel 
        invoice={selectedInvoice}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onEdit={(invoice) => {
          setIsPanelOpen(false);
          onEdit?.(invoice);
        }}
        onDelete={(invoice) => {
          setIsPanelOpen(false);
          onDelete?.(invoice);
        }}
         onDuplicate={(invoice) => {
          setIsPanelOpen(false);
          onDuplicate?.(invoice);
        }}
        onEditPartner={(partner) => {
          setIsPanelOpen(false);
          onEditPartner?.(partner);
        }}
        
      />
      
    </>
  );
}
