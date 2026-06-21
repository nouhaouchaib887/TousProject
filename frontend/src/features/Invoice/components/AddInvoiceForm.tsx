import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/modal';
import { Client } from '../../../types';

interface AddInvoiceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    clientId: string,
    date: string,
    dueDate: string,
    totalAmount: number,
    nature: string,
    paymentMethod: string
  ) => void;
  invoice:any
  clients: Client[];
  currency: string;
}

export const AddInvoiceForm: React.FC<AddInvoiceFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  invoice,
  clients,
  currency,
}) => {
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [nature, setNature] = useState('Facture de Vente');
  const [paymentMethod, setPaymentMethod] = useState('Virement Bancaire');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset or set defaults when modal opens
  useEffect(() => {
    if (isOpen) {
      setClientId(clients[0]?.id || '');
      setDate(new Date().toISOString().split('T')[0]);
      
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setDueDate(d.toISOString().split('T')[0]);
      
      setTotalAmount(0);
      setNature('Facture de Vente');
      setPaymentMethod('Virement Bancaire');
      setErrors({});
    }
  }, [isOpen, clients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!clientId) newErrors.clientId = 'Veuillez sélectionner un tiers (client)';
    if (!date) newErrors.date = "La date d'émission est obligatoire";
    if (!dueDate) newErrors.dueDate = "La date d'échéance est obligatoire";
    if (totalAmount <= 0) newErrors.amount = 'Le montant TTC doit être supérieur à 0';
    if (!nature.trim()) newErrors.nature = 'La nature de la facture est obligatoire';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(clientId, date, dueDate, totalAmount, nature, paymentMethod);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer une Nouvelle Facture">
      <form onSubmit={handleSubmit} id="add-invoice-form" className="space-y-4">
        {/* Tiers (Client) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Tiers (Client) *
          </label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">-- Sélectionner un tiers --</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `(${c.company})` : ''}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-rose-600 text-xs mt-1 font-medium">{errors.clientId}</p>
          )}
        </div>

        {/* Nature de la Facture */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Nature de la facture *
          </label>
          <select
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="Facture de Vente">Facture de Vente</option>
            <option value="Facture d'Avoir">Facture d'Avoir</option>
            <option value="Facture d'Acompte">Facture d'Acompte</option>
            <option value="Facture de Service">Facture de Service</option>
            <option value="Autre">Autre</option>
          </select>
          {nature === 'Autre' && (
            <input
              type="text"
              placeholder="Spécifiez la nature..."
              className="mt-2 w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setNature(e.target.value)}
            />
          )}
          {errors.nature && (
            <p className="text-rose-600 text-xs mt-1 font-medium">{errors.nature}</p>
          )}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date d'émission *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
            {errors.date && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Date d'échéance *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
            {errors.dueDate && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.dueDate}</p>
            )}
          </div>
        </div>

        {/* Mode de règlement prévu */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Mode de règlement prévu
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="Virement Bancaire">Virement Bancaire</option>
            <option value="Espèces">Espèces</option>
            <option value="Chèque">Chèque</option>
            <option value="Carte Bancaire">Carte Bancaire</option>
            <option value="Traite Bancaire">Traite Bancaire</option>
            <option value="Prélèvement">Prélèvement</option>
          </select>
        </div>

        {/* Montant TTC */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Montant TTC * ({currency})
          </label>
          <input
            type="number"
            value={totalAmount || ''}
            onChange={(e) => setTotalAmount(Number(e.target.value))}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            placeholder="0.00"
            step="0.01"
            min="0.01"
          />
          {errors.amount && (
            <p className="text-rose-600 text-xs mt-1 font-medium">{errors.amount}</p>
          )}
        </div>

        {/* Action Buttons with styling matching requested format */}
        <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-slate-250 text-slate-600 font-medium text-xs hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-[#1d2745] hover:bg-[#161d35] active:bg-[#0f1425] text-white font-semibold text-xs px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer"
          >
            <span className="text-base font-light leading-none -mt-0.5">+</span>
            <span>Enregistrer la Facture</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
