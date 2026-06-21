import React, { useState, useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Client } from '../../../types';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/ui/modal';
import { PlusCircle, Edit2, Trash2, Search, Mail, Phone, MapPin, Building, ShieldAlert, Users } from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, searchQuery, addClient, editClient, deleteClient, settings } = useDataContext();

  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');

  // Input Error State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filter calculations (Global Search query matches client name, company, email or phone)
  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const query = searchQuery.toLowerCase().trim();
    return clients.filter(
      c =>
        c.name.toLowerCase().includes(query) ||
        c.company.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query)
    );
  }, [clients, searchQuery]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formName.trim()) newErrors.name = 'Le nom complet est obligatoire';
    if (!formCompany.trim()) newErrors.company = "Le nom de l'entreprise est obligatoire";
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
    setFormCompany('');
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

    addClient({
      name: formName,
      company: formCompany,
      email: formEmail,
      phone: formPhone,
      address: formAddress,
      status: formStatus,
    });

    setIsAddOpen(false);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormCompany(client.company);
    setFormEmail(client.email);
    setFormPhone(client.phone);
    setFormAddress(client.address);
    setFormStatus(client.status);
    setErrors({});
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !validateForm()) return;

    editClient({
      ...editingClient,
      name: formName,
      company: formCompany,
      email: formEmail,
      phone: formPhone,
      address: formAddress,
      status: formStatus,
    });

    setIsEditOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client ${name} ?`)) {
      deleteClient(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium">Répertoire global des partenaires d'achat</p>
        </div>
        <Button
          id="btn-add-client"
          variant="primary"
          onClick={handleOpenAdd}
          icon={<PlusCircle className="h-4 w-4" />}
        >
          Ajouter un Client
        </Button>
      </div>

      {/* Main Grid table */}
      <Card
        id="clients-list-card"
        title="Liste des Clients"
        subtitle={`${filteredClients.length} client(s) trouvé(s)`}
      >
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <Users className="h-10 w-10 text-slate-350 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Aucun client trouvé</p>
            <p className="text-slate-400 text-xs mt-1">
              Essayez de reformuler votre recherche ou cliquer ci-dessus pour en insérer un nouveau.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold bg-slate-50/50">
                  <th className="py-3 px-4 font-bold">Client / Entreprise</th>
                  <th className="py-3 px-4 font-bold">Coordonnées</th>
                  <th className="py-3 px-4 font-bold">Adresse</th>
                  <th className="py-3 px-4 font-bold text-center">Commandes</th>
                  <th className="py-3 px-4 font-bold text-right">Chiffre d'affaires</th>
                  <th className="py-3 px-4 font-bold text-center">Statut</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredClients.map(client => (
                  <tr key={client.id} id={`row-client-${client.id}`} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{client.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="h-3 w-3" />
                        <span>{client.company}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>{client.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-1.5 text-xs text-slate-600 max-w-xs">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{client.address}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium pr-6">
                      {client.totalOrders}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {client.totalSpent.toLocaleString()} {settings.currency}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
                        client.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {client.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          id={`btn-edit-client-${client.id}`}
                          variant="secondary"
                          size="icon"
                          onClick={() => handleOpenEdit(client)}
                          title="Éditer le client"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          id={`btn-delete-client-${client.id}`}
                          variant="danger"
                          size="icon"
                          onClick={() => handleDelete(client.id, client.name)}
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

      {/* modal block for Add Client */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Créer un Nouveau Client">
        <form onSubmit={handleCreate} id="add-client-form" className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nom complet *
            </label>
            <input
              type="text"
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Youssef El Amrani"
            />
            {errors.name && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nom de l'entreprise / SARL *
            </label>
            <input
              type="text"
              value={formCompany}
              onChange={e => setFormCompany(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: SARL ElectroPro"
            />
            {errors.company && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.company}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Courriel (Email) *
              </label>
              <input
                type="email"
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="youssef@compagnie.ma"
              />
              {errors.email && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Téléphone portable *
              </label>
              <input
                type="text"
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+212 66X-XXXXXX"
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
              placeholder="Boulevard d'Anfa, Casablanca..."
            />
            {errors.address && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Statut du client
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
              Ajouter Client
            </Button>
          </div>
        </form>
      </Modal>

      {/* modal block for Edit Client */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Mettre à jour le Client">
        {editingClient && (
          <form onSubmit={handleUpdate} id="edit-client-form" className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nom complet *
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
                Nom de l'entreprise / SARL *
              </label>
              <input
                type="text"
                value={formCompany}
                onChange={e => setFormCompany(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.company && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.company}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Courriel (Email) *
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
                  Téléphone portable *
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
                Statut du client
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
