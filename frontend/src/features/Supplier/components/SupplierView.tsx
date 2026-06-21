import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Fournisseur } from '../../../types';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/ui/modal';
import { PlusCircle, Edit2, Trash2, Mail, Phone, MapPin, User, Package } from 'lucide-react';

export const FournisseursView: React.FC = () => {
  const { suppliers, searchQuery, addSupplier, editSupplier, deleteSupplier } = useDataContext();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Fournisseur | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formContactName, setFormContactName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  // Error State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery) return suppliers;
    const query = searchQuery.toLowerCase().trim();
    return suppliers.filter(
      s =>
        s.name.toLowerCase().includes(query) ||
        s.contactName.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.phone.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query)
    );
  }, [suppliers, searchQuery]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formName.trim()) newErrors.name = 'Le nom du fournisseur est obligatoire';
    if (!formContactName.trim()) newErrors.contactName = 'Le nom du responsable contact est obligatoire';
    if (!formEmail.trim()) {
      newErrors.email = "L'adresse email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formEmail)) {
      newErrors.email = "L'adresse email n'est pas valide";
    }
    if (!formPhone.trim()) newErrors.phone = 'Le numéro de téléphone est obligatoire';
    if (!formAddress.trim()) newErrors.address = "L'adresse physique est obligatoire";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenAdd = () => {
    setFormName('');
    setFormContactName('');
    setFormEmail('');
    setFormPhone('');
    setFormAddress('');
    setFormStatus('active');
    setErrors({});
    setIsAddOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    addSupplier({
      name: formName,
      contactName: formContactName,
      email: formEmail,
      phone: formPhone,
      address: formAddress,
      status: formStatus,
    });

    setIsAddOpen(false);
  };

  const handleOpenEdit = (sup: Fournisseur) => {
    setEditingSupplier(sup);
    setFormName(sup.name);
    setFormContactName(sup.contactName);
    setFormEmail(sup.email);
    setFormPhone(sup.phone);
    setFormAddress(sup.address);
    setFormStatus(sup.status);
    setErrors({});
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier || !validateForm()) return;

    editSupplier({
      ...editingSupplier,
      name: formName,
      contactName: formContactName,
      email: formEmail,
      phone: formPhone,
      address: formAddress,
      status: formStatus,
    });

    setIsEditOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le fournisseur ${name} ?`)) {
      deleteSupplier(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium">Fournisseurs d'approvisionnement et d'import</p>
        </div>
        <Button
          id="btn-add-supplier"
          variant="primary"
          onClick={handleOpenAdd}
          icon={<PlusCircle className="h-4 w-4" />}
        >
          Ajouter un Fournisseur
        </Button>
      </div>

      {/* Main card list */}
      <Card
        id="suppliers-list-card"
        title="Liste des Fournisseurs"
        subtitle={`${filteredSuppliers.length} fournisseur(s) répertorié(s)`}
      >
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <Package className="h-10 w-10 text-slate-350 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Aucun fournisseur trouvé</p>
            <p className="text-slate-400 text-xs mt-1">
              Modifiez votre filtrage de recherche ou ajoutez un partenaire de livraison ci-dessus.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold bg-slate-50/50">
                  <th className="py-3 px-4 font-bold">Fournisseur</th>
                  <th className="py-3 px-4 font-bold">Contact principal</th>
                  <th className="py-3 px-4 font-bold">Coordonnées</th>
                  <th className="py-3 px-4 font-bold">Adresse</th>
                  <th className="py-3 px-4 font-bold text-center">Produits fournis</th>
                  <th className="py-3 px-4 font-bold text-center">Statut</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredSuppliers.map(sup => (
                  <tr key={sup.id} id={`row-supplier-${sup.id}`} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{sup.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">ID: {sup.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-755">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{sup.contactName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{sup.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{sup.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-1.5 text-xs text-slate-600 max-w-xs">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{sup.address}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {sup.productsSuppliedCount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                        sup.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {sup.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          id={`btn-edit-supplier-${sup.id}`}
                          variant="secondary"
                          size="icon"
                          onClick={() => handleOpenEdit(sup)}
                          title="Éditer"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          id={`btn-delete-supplier-${sup.id}`}
                          variant="danger"
                          size="icon"
                          onClick={() => handleDelete(sup.id, sup.name)}
                          title="Supprimer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* modal block for Add Supplier */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Ajouter un Fournisseur d'Approvisionnement">
        <form onSubmit={handleCreate} id="add-supplier-form" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nom du Fournisseur / Compagnie *
            </label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: TechDistri Corporation"
            />
            {errors.name && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nom complet du contact physique *
            </label>
            <input
              type="text"
              value={formContactName}
              onChange={e => setFormContactName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Hans Muller"
            />
            {errors.contactName && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.contactName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Adresse email pro *
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="contact@fournisseur.com"
              />
              {errors.email && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Numéro de téléphone *
              </label>
              <input
                type="text"
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+33 1 4X XX XX XX"
              />
              {errors.phone && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Adresse physique complète *
            </label>
            <textarea
              value={formAddress}
              onChange={e => setFormAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Avenue des Champs Elysées, Paris..."
            />
            {errors.address && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Statut du partenariat
            </label>
            <select
              value={formStatus}
              onChange={e => setFormStatus(e.target.value as 'active' | 'inactive')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="active">Actif (Défaut)</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setIsAddOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Ajouter Fournisseur
            </Button>
          </div>
        </form>
      </Modal>

      {/* modal block for Edit Supplier */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Mettre à jour le Fournisseur">
        {editingSupplier && (
          <form onSubmit={handleUpdate} id="edit-supplier-form" className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nom du Fournisseur / Compagnie *
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
                Nom complet du contact physique *
              </label>
              <input
                type="text"
                value={formContactName}
                onChange={e => setFormContactName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.contactName && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.contactName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Adresse email pro *
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.email && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Numéro de téléphone *
                </label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.phone && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Adresse physique complète *
              </label>
              <textarea
                value={formAddress}
                onChange={e => setFormAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              {errors.address && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Statut du partenariat
              </label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value as 'active' | 'inactive')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
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
