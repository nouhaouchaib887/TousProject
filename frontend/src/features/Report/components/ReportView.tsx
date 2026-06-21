import React, { useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Card } from '../../../components/ui/card';
import { BarChart3, TrendingUp, ShieldAlert, Award, PiggyBank, RefreshCw, BarChart } from 'lucide-react';

export const RapportsView: React.FC = () => {
  const { products, invoices, clients, movements, settings } = useDataContext();

  // Financial audit metrics
  const stats = useMemo(() => {
    // 1. Warehouse Asset Value
    let totalStockOriginalValue = 0; // Purchase assets (Acquisition)
    let totalStockEstimatedValue = 0; // Asset potential sales (Revente)
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      totalStockOriginalValue += p.buyPrice * p.stockQuantity;
      totalStockEstimatedValue += p.price * p.stockQuantity;
      if (p.stockQuantity === 0) {
        outOfStockCount++;
      } else if (p.stockQuantity <= p.minStockThreshold) {
        lowStockCount++;
      }
    });

    const expectedProfit = totalStockEstimatedValue - totalStockOriginalValue;

    // 2. Billing ledger stats of cashflow
    let totalInvoiced = 0;
    let totalCollected = 0;
    invoices.forEach(i => {
      totalInvoiced += i.totalAmount;
      totalCollected += i.paidAmount;
    });

    const outstandingDebt = totalInvoiced - totalCollected;

    // 3. Category aggregations
    const categoryCounts: { [key: string]: { original: number, count: number } } = {};
    products.forEach(p => {
      if (!categoryCounts[p.category]) {
        categoryCounts[p.category] = { original: 0, count: 0 };
      }
      categoryCounts[p.category].original += p.buyPrice * p.stockQuantity;
      categoryCounts[p.category].count++;
    });

    const categoryList = Object.keys(categoryCounts).map(cat => ({
      name: cat,
      value: categoryCounts[cat].original,
      count: categoryCounts[cat].count
    })).sort((a, b) => b.value - a.value);

    return {
      totalStockOriginalValue,
      totalStockEstimatedValue,
      expectedProfit,
      totalInvoiced,
      totalCollected,
      outstandingDebt,
      lowStockCount,
      outOfStockCount,
      categoryList
    };
  }, [products, invoices]);

  // SVG Chart calculation parameters
  const chartHeight = 200;
  const maxCategoryValue = Math.max(...stats.categoryList.map(c => c.value), 1000);

  return (
    <div className="space-y-6">
      {/* Upper core summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <PiggyBank className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Actif Entrepôt (Achat)</p>
            <p className="text-xl font-bold text-slate-800">
              {stats.totalStockOriginalValue.toLocaleString()} <span className="text-xs font-semibold">{settings.currency}</span>
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Valeur d'acquisition brute</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Potentiel de Vente</p>
            <p className="text-xl font-bold text-emerald-650">
              {stats.totalStockEstimatedValue.toLocaleString()} <span className="text-xs font-semibold">{settings.currency}</span>
            </p>
            <p className="text-[10px] text-emerald-555 font-medium mt-0.5">
              Marge virtuelle attendue : <span className="font-bold">+{stats.expectedProfit.toLocaleString()} {settings.currency}</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Taux de Liquidité</p>
            <p className="text-xl font-bold text-slate-800">
              {stats.totalInvoiced ? Math.round((stats.totalCollected / stats.totalInvoiced) * 100) : 0}%
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              Reçu: {stats.totalCollected.toLocaleString()} {settings.currency}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg shrink-0">
            <ShieldAlert className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Santé du catalogue</p>
            <p className="text-xl font-bold text-rose-600">
              {stats.outOfStockCount} Ruptures
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{stats.lowStockCount} articles en stock bas</p>
          </div>
        </div>
      </div>

      {/* Analytics grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution horizontal weights */}
        <Card title="Répartition Financière par Catégorie" subtitle="Valeur cumulée d'inventaire d'achat par famille">
          {stats.categoryList.length === 0 ? (
            <p className="text-slate-400 text-xs italic">Aucune catégorie répertoriée.</p>
          ) : (
            <div className="space-y-4">
              {stats.categoryList.map((cat, idx) => {
                const percentage = Math.round((cat.value / maxCategoryValue) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-755">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                        <span>{cat.name} ({cat.count} articles)</span>
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {cat.value.toLocaleString()} {settings.currency}
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 3)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Visual sales balance gauge */}
        <Card title="Recouvrement de Facturation" subtitle="Flux financier de trésorerie">
          <div className="flex flex-col items-center justify-center h-full py-2 space-y-6">
            <div className="relative h-44 w-44 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center p-3">
              {/* Central text representation */}
              <div className="text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Recouvré</span>
                <span className="text-2xl font-black text-emerald-600 block">
                  {stats.totalInvoiced ? Math.round((stats.totalCollected / stats.totalInvoiced) * 100) : 0}%
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">d'encaissement</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 text-center divide-x divide-slate-150 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase block tracking-wider">Perçu</span>
                <span className="text-lg font-black text-emerald-600 block">
                  {stats.totalCollected.toLocaleString()} {settings.currency}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase block tracking-wider">Encours Créance</span>
                <span className="text-lg font-black text-rose-500 block">
                  {stats.outstandingDebt.toLocaleString()} {settings.currency}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Lower activity checklist log */}
      <Card title="Aperçu des 6 derniers flux logistiques" subtitle="Audit en temps réel">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold bg-slate-50/50">
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Désignation</th>
                <th className="py-2.5 px-4 text-center">Type</th>
                <th className="py-2.5 px-4 text-center">Volume</th>
                <th className="py-2.5 px-4">Motif d'indexation</th>
                <th className="py-2.5 px-4">Utilisateur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650">
              {movements.slice(0, 6).map((m, index) => (
                <tr key={index} id={`row-movement-audit-${index}`} className="hover:bg-slate-50/50">
                  <td className="py-2 px-4 font-medium">{m.date}</td>
                  <td className="py-2 px-4 font-semibold text-slate-800">{m.productName}</td>
                  <td className="py-2 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                      m.type === 'IN'
                        ? 'bg-emerald-50 text-emerald-700'
                        : m.type === 'OUT'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-indigo-50 text-indigo-750'
                    }`}>
                      {m.type === 'IN' ? 'Entrée' : m.type === 'OUT' ? 'Sortie' : 'Correction'}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-center font-bold text-slate-800">{m.quantity}</td>
                  <td className="py-2 px-4 text-slate-500 line-clamp-1 truncate max-w-xs">{m.reason}</td>
                  <td className="py-2 px-4 font-medium">{m.author}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
