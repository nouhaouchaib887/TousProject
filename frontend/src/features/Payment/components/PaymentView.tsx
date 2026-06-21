import React, { useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Trash2, CreditCard, Calendar, Shield, PiggyBank, Receipt } from 'lucide-react';

export const PaiementsView: React.FC = () => {
  const { payments, searchQuery, deletePayment, settings } = useDataContext();

  const filteredPayments = useMemo(() => {
    if (!searchQuery) return payments;
    const query = searchQuery.toLowerCase().trim();
    return payments.filter(
      p =>
        p.paymentNumber.toLowerCase().includes(query) ||
        p.invoiceNumber.toLowerCase().includes(query) ||
        p.clientName.toLowerCase().includes(query) ||
        (p.reference && p.reference.toLowerCase().includes(query))
    );
  }, [payments, searchQuery]);

  // Financial aggregates
  const totalReceived = useMemo(() => {
    return filteredPayments.reduce((acc, p) => acc + p.amount, 0);
  }, [filteredPayments]);

  const handleDelete = (id: string, num: string, amount: number) => {
    if (window.confirm(`Voulez-vous rejeter/supprimer le paiement ${num} de ${amount} ${settings.currency} ?\nCela réajustera la facture associée.`)) {
      deletePayment(id);
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'cash':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-250';
      case 'credit_card':
        return 'bg-violet-50 text-violet-750 border border-violet-220';
      case 'check':
        return 'bg-amber-50 text-amber-700 border border-amber-250';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const translateMethod = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return 'Virement Bancaire';
      case 'cash':
        return 'Espèces / Cash';
      case 'credit_card':
        return 'Carte bancaire';
      case 'check':
        return 'Chèque';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial aggregate banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <PiggyBank className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Trésorerie Encaissée</h2>
            <p className="text-3xl font-black text-slate-800">
              {totalReceived.toLocaleString()} <span className="text-sm font-semibold">{settings.currency}</span>
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-2 max-w-xs">
          <Shield className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Toutes les transactions passées ici sont auditées et immuables sans validation humaine.</span>
        </div>
      </div>

      {/* Main card list */}
      <Card
        id="payments-history-card"
        title="Journal d'Encaissement et Recouvrements"
        subtitle={`${filteredPayments.length} règlement(s) enregistré(s)`}
      >
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <CreditCard className="h-10 w-10 text-slate-350 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Aucun versement identifié</p>
            <p className="text-slate-400 text-xs mt-1">
              Les versements sont initiés en cliquant sur "Payer" depuis le module Factures.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold bg-slate-50/50">
                  <th className="py-3 px-4 font-bold">N° Reçu</th>
                  <th className="py-3 px-4 font-bold">Facture Réf</th>
                  <th className="py-3 px-4 font-bold">Débiteur (Client)</th>
                  <th className="py-3 px-4 font-bold">Date Valeur</th>
                  <th className="py-3 px-4 font-bold text-center">Canal de Règlement</th>
                  <th className="py-3 px-4 font-bold">Référence</th>
                  <th className="py-3 px-4 font-bold text-right">Montant Perçu</th>
                  <th className="py-3 px-4 font-bold text-right">Reverser</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredPayments.map(p => (
                  <tr key={p.id} id={`row-payment-${p.id}`} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {p.paymentNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-650">
                        <Receipt className="h-3.5 w-3.5 text-slate-400" />
                        <span>{p.invoiceNumber}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {p.clientName}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{p.date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${getMethodBadge(p.paymentMethod)}`}>
                        {translateMethod(p.paymentMethod)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-500">
                      {p.reference || <span className="text-slate-300 italic">Aucune</span>}
                    </td>
                    <td className="py-3 px-4 text-right pr-6 font-extrabold text-emerald-600 text-base">
                      {p.amount.toLocaleString()} {settings.currency}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        id={`btn-revert-payment-${p.id}`}
                        size="icon"
                        onClick={() => handleDelete(p.id, p.paymentNumber, p.amount)}
                        title="Rejeter le règlement (Restituer)"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
