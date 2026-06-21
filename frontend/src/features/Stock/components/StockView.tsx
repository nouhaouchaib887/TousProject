import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { StockMovement } from '../../../types';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/ui/modal';
import { Info, PlusCircle, ArrowUpRight, ArrowDownLeft, MoveRight, Sliders, RefreshCw, AlertTriangle } from 'lucide-react';

export const StockView: React.FC = () => {
  const { products, movements, searchQuery, adjustStockQuantity, settings } = useDataContext();

  // Modal State
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  // Form Fields
  const [targetProductId, setTargetProductId] = useState('');
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT' | 'ADJUST'>('IN');
  const [qtyChange, setQtyChange] = useState(0);
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustAuthor, setAdjustAuthor] = useState('');

  // Local Search filtering on movements
  const filteredMovements = useMemo(() => {
    if (!searchQuery) return movements;
    const query = searchQuery.toLowerCase().trim();
    return movements.filter(
      m =>
        m.productName.toLowerCase().includes(query) ||
        m.reason.toLowerCase().includes(query) ||
        m.author.toLowerCase().includes(query)
    );
  }, [movements, searchQuery]);

  // Handle manual adjustment form submission
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductId) {
      alert('Veuillez sélectionner un produit à ajuster.');
      return;
    }
    if (qtyChange <= 0 && adjustType !== 'ADJUST') {
      alert('La quantité doit être supérieure à 0.');
      return;
    }
    if (!adjustReason.trim()) {
      alert('Veuillez spécifier la raison de l\'ajustement.');
      return;
    }
    if (!adjustAuthor.trim()) {
      alert('Le nom de l\'exécutant est obligatoire.');
      return;
    }

    adjustStockQuantity(
      targetProductId,
      Number(qtyChange),
      adjustType,
      adjustReason,
      adjustAuthor
    );

    setIsAdjustOpen(false);
  };

  const handleOpenAdjust = () => {
    setTargetProductId(products[0]?.id || '');
    setAdjustType('IN');
    setQtyChange(0);
    setAdjustReason('');
    setAdjustAuthor('Responsable Stock');
    setIsAdjustOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Mini warning strip */}
      {products.some(p => p.stockQuantity <= p.minStockThreshold) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h4 className="font-bold text-sm">Alertes stock bas en cours</h4>
            <p className="text-xs text-amber-700 mt-1">
              Certaines références de votre catalogue ont franchi sous leur seuil de sécurité minimum. Rapprochez-vous du module "Commandes" ou "Fournisseurs" pour réapprovisionner l'inventaire.
            </p>
          </div>
        </div>
      )}

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1/3 column: Mini audit summary list */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="État Global Physique" subtitle="Quantité totale en entrepôt">
            <div className="space-y-4">
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-150">
                <p className="text-3xl font-black text-indigo-750">
                  {products.reduce((acc, p) => acc + p.stockQuantity, 0)}
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Unités Multi-catégories</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">État rapide du Catalogue</p>
                
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg text-emerald-800 text-xs font-semibold">
                  <span>En stock suffisant</span>
                  <span>{products.filter(p => p.stockQuantity > p.minStockThreshold).length} réf.</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg text-amber-800 text-xs font-semibold">
                  <span>Stock limite (Alerte)</span>
                  <span>{products.filter(p => p.stockQuantity <= p.minStockThreshold && p.stockQuantity > 0).length} réf.</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-lg text-rose-800 text-xs font-semibold">
                  <span>Ruputures absolues</span>
                  <span>{products.filter(p => p.stockQuantity === 0).length} réf.</span>
                </div>
              </div>

              <Button
                id="btn-adjust-stock"
                variant="primary"
                size="md"
                className="w-full text-center"
                onClick={handleOpenAdjust}
                icon={<Sliders className="h-4 w-4" />}
              >
                Ajuster/Saisir Stock
              </Button>
            </div>
          </Card>
        </div>

        {/* Right 2/3 column: Movements journal ledger */}
        <div className="lg:col-span-2">
          <Card
            id="stock-movements-card"
            title="Historique des Flux & Mouvements de Stock"
            subtitle={`${filteredMovements.length} entrée(s) de journal enregistré(s)`}
          >
            {filteredMovements.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <RefreshCw className="h-10 w-10 text-slate-350 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">Aucun mouvement de stock indexé</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[460px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="space-y-3">
                  {filteredMovements.map(m => (
                    <div
                      key={m.id}
                      id={`movement-item-${m.id}`}
                      className="p-3 bg-white border border-slate-150 rounded-lg shadow-3xs hover:border-indigo-200 flex items-start justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          m.type === 'IN'
                            ? 'bg-emerald-50 text-emerald-600'
                            : m.type === 'OUT'
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {m.type === 'IN' && <ArrowUpRight className="h-5 w-5" />}
                          {m.type === 'OUT' && <ArrowDownLeft className="h-5 w-5" />}
                          {m.type === 'ADJUST' && <RefreshCw className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{m.productName}</p>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                            <span>Saisi par <span className="font-semibold text-slate-700">{m.author}</span></span>
                            <span>•</span>
                            <span>{m.date}</span>
                          </p>
                          <div className="p-1 px-2 bg-slate-50 border border-slate-150 rounded text-[11px] text-slate-500 mt-1.5">
                            Motif : {m.reason}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-base font-black ${
                          m.type === 'IN'
                            ? 'text-emerald-600'
                            : m.type === 'OUT'
                              ? 'text-rose-600'
                              : 'text-indigo-600'
                        }`}>
                          {m.type === 'IN' ? '+' : m.type === 'OUT' ? '-' : 'Fixé'} {m.quantity}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 whitespace-nowrap">
                          {m.previousQty} <MoveRight className="inline-block h-3 w-3 mx-0.5 text-slate-300" /> {m.newQty}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* modal block for Stock Manual Adjustments */}
      <Modal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} title="Ajuster/Saisir Stock Manuel">
        <form onSubmit={handleAdjustSubmit} id="adjust-stock-form" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sélectionner le Produit *
            </label>
            <select
              value={targetProductId}
              onChange={e => setTargetProductId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Sélectionner l'article --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (SKU: {p.sku}, Actuel: {p.stockQuantity} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Type de Flux / Opération *
              </label>
              <select
                value={adjustType}
                onChange={e => setAdjustType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="IN">Entrée Stock (+)</option>
                <option value="OUT">Sortie Stock (-)</option>
                <option value="ADJUST">Correction Inventaire (Fixer Valeur Directe)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantité *
              </label>
              <input
                type="number"
                value={qtyChange || ''}
                onChange={e => setQtyChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: 10"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Motif de l'Ajustement / Justification *
            </label>
            <input
              type="text"
              value={adjustReason}
              onChange={e => setAdjustReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Réception livraison hebdomadaire, correction perte"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Opérateur exécutant *
            </label>
            <input
              type="text"
              value={adjustAuthor}
              onChange={e => setAdjustAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Responsable Dépôt B"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setIsAdjustOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Appliquer l'Ajustement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
