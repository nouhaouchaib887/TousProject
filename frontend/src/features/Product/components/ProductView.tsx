import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Produit } from '../../../types';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/ui/modal';
import { PlusCircle, Edit2, Trash2, Tag, AlertTriangle, HelpCircle, Layers } from 'lucide-react';

export const ProduitsView: React.FC = () => {
  const { products, suppliers, searchQuery, addProduct, editProduct, deleteProduct, settings } = useDataContext();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produit | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formBuyPrice, setFormBuyPrice] = useState(0);
  const [formStockQuantity, setFormStockQuantity] = useState(0);
  const [formMinStockThreshold, setFormMinStockThreshold] = useState(10);
  const [formUnit, setFormUnit] = useState('Unités');
  const [formSupplierId, setFormSupplierId] = useState('');

  // Error State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter calculations: Matches input search against Name, SKU, and Category
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const query = searchQuery.toLowerCase().trim();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formName.trim()) newErrors.name = 'Le nom du produit est obligatoire';
    if (!formSku.trim()) newErrors.sku = 'Le code SKU unique est obligatoire';
    if (!formCategory.trim()) newErrors.category = 'La catégorie de produit est obligatoire';
    if (formPrice <= 0) newErrors.price = 'Le prix de vente de détail doit être supérieur à 0';
    if (formBuyPrice < 0) newErrors.buyPrice = "Le prix d'achat d'acquisition doit être positif";
    if (formStockQuantity < 0) newErrors.stockQuantity = 'La quantité initiale en stock ne peut pas être négative';
    if (formMinStockThreshold < 0) newErrors.minStockThreshold = 'Le seuil de sécurité ne peut pas être négatif';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormSku(`PR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
    setFormCategory('');
    setFormPrice(0);
    setFormBuyPrice(0);
    setFormStockQuantity(0);
    setFormMinStockThreshold(5);
    setFormUnit('Unités');
    setFormSupplierId(suppliers[0]?.id || '');
    setErrors({});
    setIsAddOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedSupplier = suppliers.find(s => s.id === formSupplierId);

    addProduct({
      name: formName,
      sku: formSku,
      category: formCategory,
      price: Number(formPrice),
      buyPrice: Number(formBuyPrice),
      stockQuantity: Number(formStockQuantity),
      minStockThreshold: Number(formMinStockThreshold),
      unit: formUnit,
      supplierId: formSupplierId || undefined,
      supplierName: selectedSupplier ? selectedSupplier.name : undefined,
    });

    setIsAddOpen(false);
  };

  const handleOpenEdit = (prod: Produit) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormSku(prod.sku);
    setFormCategory(prod.category);
    setFormPrice(prod.price);
    setFormBuyPrice(prod.buyPrice);
    setFormStockQuantity(prod.stockQuantity);
    setFormMinStockThreshold(prod.minStockThreshold);
    setFormUnit(prod.unit);
    setFormSupplierId(prod.supplierId || '');
    setErrors({});
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !validateForm()) return;

    const selectedSupplier = suppliers.find(s => s.id === formSupplierId);

    editProduct({
      ...editingProduct,
      name: formName,
      sku: formSku,
      category: formCategory,
      price: Number(formPrice),
      buyPrice: Number(formBuyPrice),
      stockQuantity: Number(formStockQuantity),
      minStockThreshold: Number(formMinStockThreshold),
      unit: formUnit,
      supplierId: formSupplierId || undefined,
      supplierName: selectedSupplier ? selectedSupplier.name : undefined,
    });

    setIsEditOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}" ?`)) {
      deleteProduct(id);
    }
  };

  // Helper calculation of margins
  const calculateMarginPercent = (sellPrice: number, buyPrice: number) => {
    if (sellPrice <= 0) return 0;
    return Math.round(((sellPrice - buyPrice) / sellPrice) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Références</p>
            <p className="text-2xl font-black text-slate-800">{products.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Stock Limite / Alerte</p>
            <p className="text-2xl font-black text-amber-600">
              {products.filter(p => p.stockQuantity <= p.minStockThreshold && p.stockQuantity > 0).length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <AlertTriangle className="h-5 w-5 animate-bounce" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ruptures de Stock</p>
            <p className="text-2xl font-black text-rose-600">
              {products.filter(p => p.stockQuantity === 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium">Catalogue de produits répertoriés en inventaire</p>
        </div>
        <Button
          id="btn-add-product"
          variant="primary"
          onClick={handleOpenAdd}
          icon={<PlusCircle className="h-4 w-4" />}
        >
          Nouveau Produit
        </Button>
      </div>

      {/* Main card representation */}
      <Card
        id="products-list-card"
        title="Catalogue des Articles"
        subtitle={`${filteredProducts.length} référence(s) affichée(s)`}
      >
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <Tag className="h-10 w-10 text-slate-350 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Aucun produit trouvé</p>
            <p className="text-slate-400 text-xs mt-1">
              Modifiez vos filtres de recherche en haut, ou créez un nouvel article.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold bg-slate-50/50">
                  <th className="py-3 px-4 font-bold">Produit / SKU</th>
                  <th className="py-3 px-4 font-bold">Catégorie</th>
                  <th className="py-3 px-4 font-bold text-right">Prix d'Achat</th>
                  <th className="py-3 px-4 font-bold text-right">Prix de Vente</th>
                  <th className="py-3 px-4 font-bold text-center">Taux de Marge</th>
                  <th className="py-3 px-4 font-bold text-center">Quantité Stock</th>
                  <th className="py-3 px-4 font-bold text-center">Liaison Fournisseur</th>
                  <th className="py-3 px-4 font-bold text-center">Statut</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredProducts.map(p => {
                  const marginPercent = calculateMarginPercent(p.price, p.buyPrice);
                  return (
                    <tr key={p.id} id={`row-product-${p.id}`} className="hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{p.name}</div>
                        <div className="font-mono text-xs text-slate-400 mt-0.5">{p.sku}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-md border border-slate-200 font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right pr-6 font-medium text-slate-600">
                        {p.buyPrice.toLocaleString()} {settings.currency}
                      </td>
                      <td className="py-3 px-4 text-right pr-6 font-bold text-slate-900 animate-fade">
                        {p.price.toLocaleString()} {settings.currency}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          marginPercent > 40
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : marginPercent > 20
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {marginPercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="font-bold text-slate-800">
                          {p.stockQuantity} <span className="text-xs text-slate-400 font-normal">{p.unit}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Mín: {p.minStockThreshold}</div>
                      </td>
                      <td className="py-3 px-4 text-center text-xs text-slate-500">
                        {p.supplierName ? (
                          <span className="font-semibold text-indigo-650">{p.supplierName}</span>
                        ) : (
                          <span className="text-slate-400 italic">Aucun</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                          p.status === 'in_stock'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                            : p.status === 'low_stock'
                              ? 'bg-amber-50 text-amber-700 border border-amber-250'
                              : 'bg-rose-50 text-rose-700 border border-rose-250 animate-pulse'
                        }`}>
                          {p.status === 'in_stock' ? 'En Stock' : p.status === 'low_stock' ? 'Bas Stock' : 'Rupture'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            id={`btn-edit-product-${p.id}`}
                            variant="secondary"
                            size="icon"
                            onClick={() => handleOpenEdit(p)}
                            title="Éditer la fiche"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            id={`btn-delete-product-${p.id}`}
                        
                            size="icon"
                            onClick={() => handleDelete(p.id, p.name)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* modal block for Add Product */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Créer un Produit en Catalogue">
        <form onSubmit={handleCreate} id="add-product-form" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Désignation de l'article *
              </label>
              <input
                type="text"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Clavier Mécanique RGB"
              />
              {errors.name && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Code SKU unique *
              </label>
              <input
                type="text"
                value={formSku}
                onChange={e => setFormSku(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              {errors.sku && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.sku}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Catégorie *
              </label>
              <input
                type="text"
                value={formCategory}
                onChange={e => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Périphériques, Écrans, Stockage"
              />
              {errors.category && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Unité de Conditionnement
              </label>
              <select
                value={formUnit}
                onChange={e => setFormUnit(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="Unités">Unités (pcs)</option>
                <option value="Mètres">Mètres</option>
                <option value="Litres">Litres</option>
                <option value="Kilogrammes">Kilogrammes</option>
                <option value="Boîtes">Boîtes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Prix de vente Public * ({settings.currency})
              </label>
              <input
                type="number"
                value={formPrice || ''}
                onChange={e => setFormPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
                step="0.01"
              />
              {errors.price && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Prix d'Achat Fournisseur * ({settings.currency})
              </label>
              <input
                type="number"
                value={formBuyPrice || ''}
                onChange={e => setFormBuyPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
                step="0.01"
              />
              {errors.buyPrice && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.buyPrice}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Quantité en stock initiale *
              </label>
              <input
                type="number"
                value={formStockQuantity || ''}
                onChange={e => setFormStockQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
              {errors.stockQuantity && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.stockQuantity}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Seuil de sécurité (Alerte bas stock) *
              </label>
              <input
                type="number"
                value={formMinStockThreshold || ''}
                onChange={e => setFormMinStockThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="5"
              />
              {errors.minStockThreshold && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.minStockThreshold}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Fournisseur assigné (SOLID DIP)
            </label>
            <select
              value={formSupplierId}
              onChange={e => setFormSupplierId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">-- Aucun fournisseur --</option>
              {suppliers.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.contactName})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setIsAddOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter de l'inventaire
            </Button>
          </div>
        </form>
      </Modal>

      {/* modal block for Edit Product */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Mettre à jour le Produit">
        {editingProduct && (
          <form onSubmit={handleUpdate} id="edit-product-form" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Désignation de l'article *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.name && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Code SKU (Réglo-Unique) *
                </label>
                <input
                  type="text"
                  value={formSku}
                  onChange={e => setFormSku(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                {errors.sku && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.sku}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Catégorie *
                </label>
                <input
                  type="text"
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.category && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Unité de Conditionnement
                </label>
                <select
                  value={formUnit}
                  onChange={e => setFormUnit(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Unités">Unités (pcs)</option>
                  <option value="Mètres">Mètres</option>
                  <option value="Litres">Litres</option>
                  <option value="Kilogrammes">Kilogrammes</option>
                  <option value="Boîtes">Boîtes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Prix de Vente Public * ({settings.currency})
                </label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={e => setFormPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  step="0.01"
                />
                {errors.price && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Prix d'Achat Fournisseur * ({settings.currency})
                </label>
                <input
                  type="number"
                  value={formBuyPrice}
                  onChange={e => setFormBuyPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  step="0.01"
                />
                {errors.buyPrice && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.buyPrice}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stock Physique Actuel
                </label>
                <input
                  type="number"
                  value={formStockQuantity}
                  onChange={e => setFormStockQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 border-indigo-400 bg-slate-50/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  title="Note: modifier ce stock va directement journaliser un mouvement dans le panneau de stock."
                />
                <span className="text-[10px] text-indigo-600 font-semibold mt-1 block">La modification génère un journal de stock.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Seuil d'alerte critique *
                </label>
                <input
                  type="number"
                  value={formMinStockThreshold}
                  onChange={e => setFormMinStockThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Fournisseur officiel liasse
              </label>
              <select
                value={formSupplierId}
                onChange={e => setFormSupplierId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">-- Aucun fournisseur --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <Button variant="secondary" type="button" onClick={() => setIsEditOpen(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Enregistrer modifications
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
