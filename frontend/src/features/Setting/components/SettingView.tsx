import React, { useState } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Settings as SettingsIcon, Save, Info, RefreshCw, Undo } from 'lucide-react';

export const ParametresView: React.FC = () => {
  const { settings, updateSettings } = useDataContext();

  // Settings State Hooks
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [currency, setCurrency] = useState(settings.currency);
  const [lowStockAlert, setLowStockAlert] = useState(settings.lowStockAlert);
  const [taxRate, setTaxRate] = useState(settings.taxRate);

  const [notifVisible, setNotifVisible] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifVisible(true);
    setTimeout(() => setNotifVisible(false), 3000);
  };

  const handleResetToDefault = () => {
    if (window.confirm("Restituer les paramètres d'usine ? Vous perdrez la personnalisation de devise.")) {
      setCompanyName('StockManager Pro S.A.R.L');
      setCurrency('MAD');
      setLowStockAlert(true);
      setTaxRate(20);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* alert success floating bar */}
      {notifVisible && (
        <div id="settings-save-success" className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between text-xs font-semibold animate-bounce gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-600 rounded-full"></span>
            <span>Configuration sauvegardée et propagée avec succès aux devises applicatives !</span>
          </div>
        </div>
      )}

      {/* Main Configurations Card */}
      <Card
        id="settings-form-card"
        title="Paramètres de l'entreprise"
        subtitle="Réglez les variables fiscales et d'affichage de facturation"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Raison Sociale / Nom d'Entreprise
              </label>
              <input
                id="input-company-name"
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-205 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: MyCompany S.A."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Symbole de Devise par défaut
                </label>
                <select
                  id="select-currency"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-205 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="MAD">MAD (Dirham Marocain)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="USD">USD ($ - Dollar US)</option>
                  <option value="DZD">DZD (Dinar Algérien)</option>
                  <option value="TND">TND (Dinar Tunisien)</option>
                  <option value="XOF">FCFA (Franc CFA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Taux de TVA Standard (%)
                </label>
                <input
                  id="input-tax-rate"
                  type="number"
                  value={taxRate}
                  onChange={e => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-205 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="checkbox-low-stock-alert"
                    type="checkbox"
                    checked={lowStockAlert}
                    onChange={e => setLowStockAlert(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-xs">
                  <label htmlFor="checkbox-low-stock-alert" className="font-bold text-slate-700 uppercase tracking-wider cursor-pointer">
                    Contrôle des seuils de sécurité de stock
                  </label>
                  <p className="text-slate-400 font-medium mt-1">
                    Déclenche un clignotement rouge sur le panneau de stock dès qu'une référence passe sous le seuil d'alarme.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
            <Button
              id="btn-settings-reset"
              variant="ghost"
              type="button"
              className="text-slate-400 hover:text-slate-600 text-xs"
              onClick={handleResetToDefault}
              icon={<Undo className="h-3.5 w-3.5" />}
            >
              Réinitialiser
            </Button>

            <Button
              id="btn-settings-save"
              variant="primary"
              type="submit"
              icon={<Save className="h-4 w-4" />}
            >
              Enregistrer Configuration
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Notice card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 space-y-2">
        <h4 className="font-bold flex items-center gap-1.5 text-blue-900 uppercase tracking-wider">
          <Info className="h-4 w-4 text-blue-500" />
          <span>Note d'Architecture (SOLID SRP)</span>
        </h4>
        <p className="leading-relaxed text-blue-755">
          Modifiant cette devise répercutera instantanément tous les affichages financiers des modules de Factures, Trésorerie, et Catalogue d'Articles de manière transparente via l'inversion de dépendance appliquée à notre fournisseur central d'états d'exécution.
        </p>
      </div>
    </div>
  );
};
