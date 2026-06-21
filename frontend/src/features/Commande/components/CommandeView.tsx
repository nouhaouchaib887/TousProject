import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Commande, CommandeProduct } from '../../../types';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/ui/modal';
import { PlusCircle, ShoppingCart, Calendar, Eye, FileSpreadsheet, Package, AlertTriangle, CheckCircle, Tag } from 'lucide-react';

export const CommandesView: React.FC = () => {
  const { orders, clients, products, searchQuery, addOrder, updateOrderStatus, settings } = useDataContext();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Commande | null>(null);

  // Form Fields - Add Order
  const [formClientId, setFormClientId] = useState('');
  const [basketItems, setBasketItems] = useState<CommandeProduct[]>([]);
  const [orderStatus, setOrderStatus] = useState<Commande['status']>('completed');

  // Basket Line items temporary fields
  const [formProductId, setFormProductId] = useState('');
  const [formProductQty, setFormProductQty] = useState(1);

  // Error State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const query = searchQuery.toLowerCase().trim();
    return orders.filter(
      o =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.clientName.toLowerCase().includes(query)
    );
  }, [orders, searchQuery]);

  // Handle adding product to temporary basket
  const handleAddToBasket = () => {
    if (!formProductId) {
      alert('Veuillez sélectionner un article.');
      return;
    }
    if (formProductQty <= 0) {
      alert('La quantité doit être supérieure à 0.');
      return;
    }

    const matchedProduct = products.find(p => p.id === formProductId);
    if (!matchedProduct) return;

    // Check inventory availability (alert if insufficient, but allow for extreme flexibility if needed)
    if (matchedProduct.stockQuantity < formProductQty) {
      if (!window.confirm(`Stock insuffisant (${matchedProduct.stockQuantity} disponible). Voulez-vous quand même forcer la commande ?`)) {
        return;
      }
    }

    // Check if product is already in basket
    const existsIndex = basketItems.findIndex(i => i.productId === formProductId);
    if (existsIndex > -1) {
      const updated = [...basketItems];
      updated[existsIndex].quantity += Number(formProductQty);
      setBasketItems(updated);
    } else {
      setBasketItems(prev => [
        ...prev,
        {
          productId: formProductId,
          productName: matchedProduct.name,
          quantity: Number(formProductQty),
          unitPrice: matchedProduct.price
        }
      ]);
    }

    // Reset line state
    setFormProductId('');
    setFormProductQty(1);
  };

  const handleRemoveFromBasket = (index: number) => {
    setBasketItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const basketTotal = useMemo(() => {
    return basketItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  }, [basketItems]);

  const handleOpenAdd = () => {
    setFormClientId(clients[0]?.id || '');
    setBasketItems([]);
    setFormProductId('');
    setFormProductQty(1);
    setOrderStatus('completed');
    setErrors({});
    setIsAddOpen(true);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formClientId) newErrors.clientId = 'Veuillez désigner le client.';
    if (basketItems.length === 0) newErrors.basket = 'Veuillez au moins ajouter un produit dans le panier.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const chosenClient = clients.find(c => c.id === formClientId);
    if (!chosenClient) return;

    addOrder({
      clientId: formClientId,
      clientName: chosenClient.name,
      products: basketItems,
      totalAmount: basketTotal,
      status: orderStatus
    });

    setIsAddOpen(false);
  };

  const handleOpenDetails = (order: Commande) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusTransition = (orderId: string, status: Commande['status']) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium font-sans">Passation, expédition et flux de ventes de marchandises</p>
        </div>
        <Button
          id="btn-add-order"
          variant="primary"
          onClick={handleOpenAdd}
          icon={<PlusCircle className="h-4 w-4" />}
        >
          Créer un Bon de Commande
        </Button>
      </div>

      {/* Main card representation */}
      <Card
        id="orders-list-card"
        title="Journal des Commandes"
        subtitle={`${filteredOrders.length} commande(s) répertoriée(s)`}
      >
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <ShoppingCart className="h-10 w-10 text-slate-350 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Aucun bon de commande recensé</p>
            <p className="text-slate-400 text-xs mt-1">
              Filtrez votre terme clé en haut recherchable ou créez-en une nouvelle commande ci-dessus.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold bg-slate-50/50">
                  <th className="py-3 px-4 font-bold">Réf Commande</th>
                  <th className="py-3 px-4 font-bold">Acheteur (Client)</th>
                  <th className="py-3 px-4 font-bold">Date Création</th>
                  <th className="py-3 px-4 font-bold text-center">Nombre d'articles</th>
                  <th className="py-3 px-4 font-bold text-right">Montant Global</th>
                  <th className="py-3 px-4 font-bold text-center">État d'expédition</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredOrders.map(order => (
                  <tr key={order.id} id={`row-order-${order.id}`} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{order.clientName}</div>
                      <div className="text-[10px] text-indigo-500 font-medium">ID Client: {order.clientId}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{order.date}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-705 pr-5">
                      {order.products.reduce((sum, p) => sum + p.quantity, 0)}
                    </td>
                    <td className="py-3 px-4 text-right pr-6 font-extrabold text-slate-900 text-base">
                      {order.totalAmount.toLocaleString()} {settings.currency}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        order.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                          : order.status === 'shipping'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-250'
                            : order.status === 'pending'
                              ? 'bg-amber-50 text-amber-500 border border-amber-250'
                              : 'bg-rose-50 text-rose-700 border border-rose-250'
                      }`}>
                        <span>
                          {order.status === 'completed' ? 'Livré / Complété' : order.status === 'shipping' ? 'En livraison' : order.status === 'pending' ? 'Attente validation' : 'Annulé'}
                        </span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          id={`btn-view-order-${order.id}`}
                          variant="secondary"
                          size="sm"
                          icon={<Eye className="h-4 w-4" />}
                          onClick={() => handleOpenDetails(order)}
                        >
                          Fiche
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* modal block for Add Order */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Saisir un Nouveau Bon d'Ordre" maxSizeClass="max-w-xl">
        <form onSubmit={handleCreateOrder} id="add-order-form" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Client Acheteur d'origine *
            </label>
            <select
              value={formClientId}
              onChange={e => setFormClientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Sélectionner l'acheteur --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>
            {errors.clientId && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.clientId}</p>}
          </div>

          {/* Form Segment: Basket Composition */}
          <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <Package className="h-4 w-4 text-slate-400" />
              <span>Composition du Bon</span>
            </h4>

            {/* Selector fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">
                  Sélectionner l'article
                </label>
                <select
                  value={formProductId}
                  onChange={e => setFormProductId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choisir un produit --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price} {settings.currency}, Stock : {p.stockQuantity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-550 uppercase mb-1">
                  Quantité
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formProductQty || ''}
                    onChange={e => setFormProductQty(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none"
                    min="1"
                  />
                  <Button
                    id="btn-add-line-to-basket"
                    variant="secondary"
                    type="button"
                    className="text-xs px-2.5"
                    onClick={handleAddToBasket}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>
            </div>

            {/* Basket list display */}
            {basketItems.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic py-2">Votre panier est vide. Utilisez le champ ci-dessus.</p>
            ) : (
              <div className="border border-slate-150 rounded-lg bg-white overflow-hidden text-xs divide-y divide-slate-100">
                {basketItems.map((item, index) => (
                  <div key={index} className="p-2.5 flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-800">{item.productName}</p>
                      <p className="text-[10px] text-slate-400">
                        {item.quantity} x {item.unitPrice} {settings.currency}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900">
                        {(item.quantity * item.unitPrice).toLocaleString()} {settings.currency}
                      </span>
                      <button
                        type="button"
                        className="text-rose-500 hover:text-rose-700 font-bold px-1 rounded hover:bg-rose-50 cursor-pointer"
                        onClick={() => handleRemoveFromBasket(index)}
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ))}

                {/* Summaries */}
                <div className="p-3 bg-indigo-50/50 flex justify-between items-center text-sm font-bold border-t border-slate-200">
                  <span className="text-slate-650 flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>Total Estimé</span>
                  </span>
                  <span className="text-indigo-600 font-black text-base">
                    {basketTotal.toLocaleString()} {settings.currency}
                  </span>
                </div>
              </div>
            )}
            {errors.basket && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.basket}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Statut initial de la commande
            </label>
            <select
              value={orderStatus}
              onChange={e => setOrderStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="completed">Livré / Complété (Soustrait le stock, émet la facture) - Défaut</option>
              <option value="shipping">En Transit / Livraison d'entrepôt (Soustrait le stock, émet la facture)</option>
              <option value="pending">En attente d'approbation (Stock non déduit)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setIsAddOpen(false)}>
              Fermer
            </Button>
            <Button variant="primary" type="submit">
              Valider et Enregistrer l'Ordre
            </Button>
          </div>
        </form>
      </Modal>

      {/* modal block for Details View */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title={`Fiche de Commande - ${selectedOrder?.orderNumber}`} maxSizeClass="max-w-xl">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">CLIENT :</span>
                <span className="font-semibold text-slate-800 block text-sm">{selectedOrder.clientName}</span>
                <span className="text-slate-400 block">ID Client : {selectedOrder.clientId}</span>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-slate-400 font-bold block">DATE :</span>
                <span className="font-semibold text-slate-800 block text-sm">{selectedOrder.date}</span>
                <span className="text-slate-400 block">ID Commande : {selectedOrder.id}</span>
              </div>
            </div>

            <div className="border border-slate-150 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Articles Commandés</span>
                <span className="text-xs bg-indigo-50 border border-indigo-150 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full">
                  {selectedOrder.products.reduce((count, p) => count + p.quantity, 0)} pièces
                </span>
              </div>
              <div className="divide-y divide-slate-100 text-sm">
                {selectedOrder.products.map((p, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{p.productName}</p>
                      <p className="text-xs text-slate-400">{p.quantity} x {p.unitPrice.toLocaleString()} {settings.currency}</p>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      {(p.quantity * p.unitPrice).toLocaleString()} {settings.currency}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50/50 border-t border-slate-150 flex justify-between items-center font-bold">
                <span className="text-sm text-slate-755">Prix global commandes TTC :</span>
                <span className="text-lg font-black text-indigo-650">
                  {selectedOrder.totalAmount.toLocaleString()} {settings.currency}
                </span>
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Mises à Jour du statut expédition (SOLID transactionnel)</span>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  id="btn-status-pending"
                  variant={selectedOrder.status === 'pending' ? 'warning' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusTransition(selectedOrder.id, 'pending')}
                  disabled={selectedOrder.status === 'pending'}
                >
                  Suspendre
                </Button>
                <Button
                  id="btn-status-shipping"
                  variant={selectedOrder.status === 'shipping' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusTransition(selectedOrder.id, 'shipping')}
                  disabled={selectedOrder.status === 'shipping'}
                >
                  Expédier
                </Button>
                <Button
                  id="btn-status-completed"
                  variant={selectedOrder.status === 'completed' ? 'success' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusTransition(selectedOrder.id, 'completed')}
                  disabled={selectedOrder.status === 'completed'}
                >
                  Compléter / Livrer
                </Button>
                <Button
                  id="btn-status-cancelled"
                  variant={selectedOrder.status === 'cancelled' ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusTransition(selectedOrder.id, 'cancelled')}
                  disabled={selectedOrder.status === 'cancelled'}
                >
                  Annuler la Commande
                </Button>
              </div>
              <span className="text-[10px] text-indigo-600 block mt-1 font-semibold leading-relaxed">
                * Note : Valider un retour "Annulé" restitue automatiquement la marchandise en inventaire. Expédier ou Livrer la déduit.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" onClick={() => setIsDetailsOpen(false)}>Fermer</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
