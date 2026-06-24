'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X ,Trash2, CheckCircle, AlertTriangle} from 'lucide-react'
import { TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {InvoiceCreate, InvoiceMetaData,InvoiceItem, Product,Transaction} from '../../types'
import {getItems} from '../../api/invoiceService'
import { SearchableSelect } from '@/components/ui/searchableSelect'
import { se } from 'date-fns/locale'
import { MenuItem } from '@base-ui/react'

interface InvoiceTransactionSectionProps {
  value: Transaction []
  invoice_amount: any
  onChange: (value: Transaction []) => void
}
export default function TransactionSection({ value,invoice_amount, onChange }: InvoiceTransactionSectionProps) {
  const [newTransaction, setNewTransaction] = useState<any>({
    reference:'',
    amount: 0,
    payment_method: "CHEQUE",
    payment_reference: "",
    payment_date: "",
    check_date: "",
})
const initialNewTransaction = {
    reference:'',
    amount: 0,
    payment_method: "CHEQUE",
    payment_reference: "",
    payment_date: "",
    check_date: "",

}
  const [isEditing, setIsEditing] = useState(false) 
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
const transactionsSum = (value ?? []).reduce(
  (sum, trans) => sum + (trans.amount ?? 0),
  0
)

const difference = invoice_amount - transactionsSum
  // Add Article draft list
 const handleAddTransaction = (e: React.FormEvent) => {
     e.preventDefault();
  if (!newTransaction.amount) return
  if (!newTransaction.payment_method) return
  if (!newTransaction.payment_date) return

  const transactionToAdd = {
    local_id: crypto.randomUUID(),
    amount: newTransaction.amount,
    payment_method: newTransaction.payment_method,
    payment_reference: newTransaction.payment_reference,
    payment_date: newTransaction.payment_date,
    check_date: newTransaction.check_date,
  }

   onChange([
    ...(value ?? []),
    transactionToAdd,
  ])


  setNewTransaction(initialNewTransaction)
}

  const handleRemoveTransaction = (localId: string) => {
  onChange(
    (value ?? []).filter(
      (transaction) => transaction.local_id !== localId
    )
  )
}


  return (
<div className="space-y-6 animate-fade-in">
              <div className="p-6 bg-slate-50/50 border border-[#e2e8f0] rounded-3xl space-y-4">
                <p className="text-[11px] font-black text-[#1d2745] uppercase tracking-wider border-b border-slate-100 pb-2">Formulaire d'enregistrement des règlements</p>

                <form onSubmit={handleAddTransaction} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                  {/* Référence read only */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Règlement Réf.</label>
                    <input
                      type="text"
                      value={`REG-DRAFT-${value.length + 1}`}
                      readOnly
                      className="w-full px-5 py-3 border border-[#e2e8f0] bg-slate-100/60 text-slate-400 font-mono rounded-full text-xs"
                    />
                  </div>

                  {/* Montant */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Montant (DH) *</label>
                    <Input
                      type="number"
                      value={newTransaction.amount || ''}
                      onChange={(e) => setNewTransaction({
                        ...newTransaction,
                        amount:  Number(e.target.value)
                      }
                       )}
                      placeholder="0.00"
                      step="0.01"
                      className="w-full px-5 py-3 border border-[#e2e8f0] bg-white text-slate-700 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10"
                    />
                  </div>

                  {/* Mode */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Mode de règlement</label>
                    <Select
                      value={newTransaction.payment_method}
                      onValueChange={(val) => {
                        if (!val) return;
                        setNewTransaction({
                          ...newTransaction,
                          payment_method: val 
        
                        }
                          
                          
                          );
                      }}
                    >
                      <SelectTrigger className="w-full h-10 px-5 border border-slate-200 bg-slate-50/50 text-slate-700 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 transition-all flex items-center justify-between cursor-pointer">
                        <SelectValue placeholder="Mode..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-1 text-slate-700 focus:outline-none max-h-60 overflow-y-auto">
                        <SelectItem value="CHEQUE" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Chèque</SelectItem>
                        <SelectItem value="CASH" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Espèces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Date de règlement</label>
                    <input
                      type="date"
                      value={newTransaction.payment_date}
                      onChange={(e) => setNewTransaction({
                        ...newTransaction,
                        payment_date: e.target.value})}
                      className="w-full px-5 py-3 border border-[#e2e8f0] bg-white text-slate-705 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10"
                    />
                  </div>
                    {/* Réf ID Transaction */}
                   {newTransaction.payment_method === "CHEQUE" && (
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Référence Bancaire (ID Transaction / N° Chèque)</label>
                    <Input
                      type="text"
                      className="w-full px-5 py-3 border border-[#e2e8f0] bg-white text-slate-750 rounded-full text-xs font-semibold focus:outline-none"
                      value={newTransaction.payment_reference}
                      onChange={(e) => setNewTransaction({
                        ...newTransaction,
                        payment_reference: e.target.value
                      }
                        )}
                      placeholder="Ex: CHQ-890283, ID VRT_9281"
                    />
                  </div>
                   ) }

                  {/* Button + Ajouter */}
                  <div className="sm:col-span-1 justify-end flex">
                    <button
                      type="submit"
                      disabled={newTransaction.amount <= 0}
                      className="w-full py-3 bg-[#1d2745] hover:bg-opacity-95 disabled:opacity-40 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-3xs"
                    >
                      + Ajouter
                    </button>
                  </div>
                </form>
              </div>

              {/* Added payments tables */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-4">
                <p className="text-xs font-black text-[#1d2745] uppercase tracking-wider">Liste des règlements appliqués à la saisie</p>

                {value.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-405 font-medium">Aucun règlement n'a été rattaché à cette facture.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase bg-slate-50/50">
                          <th className="p-2">Réf. règlement</th>
                          <th className="p-2">Date d'encaissement</th>
                          <th className="p-2 text-center">Mode</th>
                          <th className="p-2">Référence Bancaire</th>
                          <th className="p-2 text-right">Montant appliqué</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-105">
                        {value.map((p, idx) => (
                          <tr key={p.id} className="hover:bg-slate-50/40">
                            <td className="p-2 font-mono font-bold text-slate-700">REG-DRAFT-{idx + 1}</td>
                            <td className="p-2 text-slate-600">{p.payment_date}</td>
                            <td className="p-2 text-center uppercase font-bold text-[#1d2745] text-[10px]">
                              {p.payment_method === 'bank_transfer' ? 'Virement' : p.payment_method === 'CASH' ? 'Espèces' : p.payment_method === 'CHEQUE' ? 'Chèque' : 'CB'}
                            </td>
                            <td className="p-2 text-slate-500 italic">{p.reference}</td>
                            <td className="p-2 text-right font-bold text-emerald-700">{p.amount.toLocaleString()} DH</td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveTransaction(p.local_id!)}
                                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Summary recap table */}
              <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col sm:flex-row justify-around gap-4 text-xs font-bold">
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] mb-1">Montant TTC Facturé</span>
                  <span className="text-slate-800 text-sm font-black">{invoice_amount.toLocaleString()} DH</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] mb-1">Total Réglé (Acomptes)</span>
                  <span className="text-emerald-600 text-sm font-black">{transactionsSum.toLocaleString()} DH</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] mb-1">Reste à recouvrer</span>
                  <span className={`text-sm font-black ${difference > 0 ? 'text-[#1d2745]' : 'text-emerald-700'}`}>
                    {difference.toLocaleString()} DH
                  </span>
                </div>
              </div>

            </div>
             
             
  )
}