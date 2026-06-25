'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X ,Trash2, CheckCircle, AlertTriangle, ChevronDown, Sparkles, Check} from 'lucide-react'
import { TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {InvoiceCreate, InvoiceMetaData,InvoiceItem, Product,Transaction,InvoiceTableRead, InvoiceItemsDataSection} from '../../types'
import {getItems, getProductCategories, generateInvoiceItems} from '../../api/invoiceService'
import { SearchableSelect } from '@/components/ui/searchableSelect'
import { se } from 'date-fns/locale'
import { MenuItem } from '@base-ui/react'
import { toast } from "sonner"

interface InvoiceItemsSectionProps {
  value: InvoiceItemsDataSection
  onChange: (value: InvoiceItemsDataSection) => void
}
export default function InvoiceItemsSection({ value, onChange }: InvoiceItemsSectionProps) {
  const [newItem, setNewItem] = useState<any>({
    selectedItem: null,
    unit: '',
    quantity :0,
    amount_type: 'HT',
    amount_ttc:0,
    amount_ht:0,
    vat_rate: 20

    
})
const initialNewItem = {
    selectedItem: null,
    unit: '',
    quantity :0,
    amount_type: 'HT',
    amount_ttc:0,
    amount_ht:0,
    vat_rate: 20

}
  const [isEditing, setIsEditing] = useState(false) 
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [isGenrating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
   const [selectedGenCategories, setSelectedGenCategories] = useState<string[]>([]);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState<boolean>(false);
  
const articlesSum = {
  ht: (value.invoice_items ?? []).reduce(
    (sum, item) => sum + ((item.quantity ?? 1)* (item.amount_ht ?? 0)),
    0
  ),

  ttc: (value.invoice_items ?? []).reduce(
    (sum, item) => sum + ((item.quantity ?? 1)*(item.amount_ttc ?? 0)),
    0
  ),

  vat: (value.invoice_items ?? []).reduce(
    (sum, item) =>
      sum +
      ((item.quantity ?? 1)*((item.amount_ttc ?? 0) - (item.amount_ht ?? 0))),
    0
  ),
}
const differenceTTC = (value.amount_ttc ?? 0) - (articlesSum.ttc ?? 0)
  // Add Article draft list
 const handleAddItem = (e: React.FormEvent) => {
     e.preventDefault();
  if (!newItem.selectedItem?.id) return

  const itemToAdd = {
    local_id: crypto.randomUUID(),
    item: newItem.selectedItem,
    unit: newItem.unit,
    quantity: Number(newItem.quantity ?? 0),
    amount_type: newItem.amount_type,
    amount_ht: Number(newItem.amount_ht ?? 0),
    amount_ttc: Number(newItem.amount_ttc ?? 0),
    vat_rate: Number(newItem.vat_rate ?? 0),
  }

  onChange({
    ...value,
    invoice_items: [
      ...(value.invoice_items ?? []),
      itemToAdd,
    ],
  })

  setNewItem(initialNewItem)
}

  const handleRemoveItem = (localId: string) => {
  onChange({
    ...value,
    invoice_items: (value.invoice_items ?? []).filter(
      (item) => item.local_id !== localId
    ),
  })
}
const [availableItems, setAvailableItems] = useState<any[]>([])

  useEffect(() => {
    async function fetchAvailableItems() {
      const data = await getItems()
      setAvailableItems(data)
    }

    fetchAvailableItems()
  }, [])

  const [availableCategories, setAvailableCategories] = useState<any[]>([])

  useEffect(() => {
    async function fetchAvailableCategories() {
      const data = await getProductCategories()
      setAvailableCategories(data)
    }

    fetchAvailableCategories()
  }, [])
    const selectedCategories = availableCategories.filter((cat) =>
    selectedGenCategories.includes(cat.id)
  )

  const handleGenerateItems = async () => {
  try {
    setIsGenerating(true)

    const target_amount = value.amount_ttc
    
      // GENERATGE
    if (target_amount) {
      try {
        const invoice_items = await generateInvoiceItems(target_amount)

        onChange({
          ...value,
          invoice_items: invoice_items
        }
          
        )

        setIsGenerated(true)
        toast.success("Facture créé avec succès")
        return
      } catch (error) {
        console.error(error)
        toast.error("Erreur lors de la génération des articles")
        return
      }
      finally {
    setIsGenerating(false)
  }
    }
  } catch (error) {
    console.error(error)
    toast.error("Erreur lors de la génération des articles")
  }

}

  
 

 const InvoiceTypeLabels: Record<any, string> = {
  V: 'Vente',
  A: 'Achat',
}
  return (
<div className="space-y-6 animate-fade-in">
              
              {/* BLOCK 1: MAIN AMOUNT SETUP */}
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-[#e2e8f0] space-y-4 animate-fade-in">
                <p className="text-[11px] font-black text-[#1d2745] uppercase tracking-wider border-b border-slate-100 pb-2">Montants Globaux de la facture</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Type montant */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Base saisie</label>
                    <Select
                      value={value.amount_type}
                      onValueChange={(val) => {
                        if (!val) return;
                        onChange({
                        ...value,
                        amount_type: val,

        })
                      }}
                    >
                      <SelectTrigger className="w-full h-10 px-5 border border-slate-200 bg-slate-50/50 text-slate-700 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745] transition-all flex items-center justify-between cursor-pointer">
                        <SelectValue placeholder="Base de saisie..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-1 text-slate-700 focus:outline-none max-h-60 overflow-y-auto">
                        <SelectItem value="TTC" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Montant TTC</SelectItem>
                        <SelectItem value="HT" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Montant HT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Valeur */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Montant global (DH)</label>
                    <input
                      type="number"
                      value={value.amount_type === "HT" ? value.amount_ht : value.amount_ttc}
                      onChange={(e) => {
                        const amount = Number(e.target.value)
                        if (value.amount_type === 'HT') {
                            onChange({
                                ...value,
                                amount_ht: amount,
                                amount_ttc: (amount + (value.total_vat??0))
                                
                            }

                            )
                        
                        } else {
                            onChange({
                                ...value,
                                amount_ttc: amount,
                                amount_ht :(amount - (value.total_vat??0))
                            }

                            )
                        }
                        }}
                      placeholder="0.00"
                      className="w-full px-5 py-3 border border-[#e2e8f0] bg-white text-slate-700 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745]"
                    />
                  </div>
                  {/* TVA Rate */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Total de TVA</label>
                    <input
                    type="number"
                    value={value.total_vat}
                    onChange={(e) => {
                        const total_vat = Number(e.target.value)

                        if (value.amount_type === "HT") {
                            const amount_ttc = (value.amount_ht ?? 0) + total_vat

                            onChange({
                                ...value,
                                total_vat,
                                amount_ttc,
                            })
                        } else {
                            const amount_ht = (value.amount_ttc ?? 0) - total_vat

                            onChange({
                                ...value,
                                total_vat,
                                amount_ht,
                            })
                        }
                        }}
                         placeholder="0.00"
                      className="w-full px-5 py-3 border border-[#e2e8f0] bg-white text-slate-700 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745]"
                    />
                  </div>
                </div>

                {/* Automatic calculations display card */}
                <div className="bg-white border border-[#e2e8f0] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-around gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[9px] mb-1">Base Hors Taxe (HT)</span>
                    <span className="font-extrabold text-[#1d2745] text-sm">{value.amount_ht?.toLocaleString()} DH</span>
                  </div>
                  <div className="font-bold text-slate-200">/</div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase block text-[9px] mb-1">TVA cumulée</span>
                    <span className="font-extrabold text-[#1d2745] text-sm">{value.total_vat?.toLocaleString()} DH</span>
                  </div>
                  <div className="font-bold text-slate-200">/</div>
                  <div className="bg-emerald-50/40 border border-emerald-100 px-5 py-2 rounded-full text-center">
                    <span className="text-emerald-600 font-extrabold uppercase block text-[9px] mb-0.5">Cible TTC recalculé</span>
                    <span className="font-black text-emerald-800 text-sm">{value.amount_ttc?.toLocaleString()} DH</span>
                  </div>
                </div>
              </div>

              {/* BLOCK 2: PRODUCTS ITEMS FORM AND TABLE */}
              <div className="border border-[#e2e8f0] rounded-3xl p-6 space-y-4 animate-fade-in bg-white">
                <p className="text-[11px] font-black text-[#1d2745] uppercase tracking-wider border-b border-slate-100 pb-2">Détails des Articles</p>
                 {/* AUTO-GENERATION BLOCK */}
                <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-3xl space-y-4">
                  <div>
                    <p className="text-xs font-bold text-[#1d2745] flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500 animate-pulse" />
                      Génération automatique 
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sélectionnez les catégories ci-dessous pour composer instantanément des articles équivalant exactement à la cible TTC de {value.amount_ttc?.toLocaleString()} DH.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="sm:col-span-2 relative">
                      <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Choisir les catégories *</label>
                      
                      <button
                        type="button"
                        onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                        className="w-full h-10 px-5 border border-slate-200 bg-white text-slate-700 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745] transition-all flex items-center justify-between cursor-pointer"
                      >
                         <span>
                          {selectedCategories.length === 0
                          ? "Toutes les catégories"
                          : selectedCategories.length === 1
                          ? selectedCategories[0].reference
                          : `${selectedCategories.length} catégories sélectionnées (${selectedCategories
                          .map((cat) => cat.reference)
                          .join(", ")})`}
                          </span>
                        <ChevronDown size={14} className="text-slate-400 shrink-0 ml-1" />
                      </button>

                      {isCatDropdownOpen && (
                        <>
                          {/* Invisible backdrop to close the dropdown */}
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsCatDropdownOpen(false)}
                          />
                          
                          {/* Dropdown list */}
                          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-1.5 text-slate-700 focus:outline-none max-h-60 overflow-y-auto z-50 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                          <button
                          type="button"
                          onClick={() => {
                          setSelectedGenCategories([])
                          }}
                          className="w-full flex items-center justify-between cursor-pointer hover:bg-slate-50 py-2.5 px-3.5 rounded-xl transition-all font-semibold text-xs text-left"
                          >
                          <span>Toutes les catégories</span>
                          {selectedGenCategories.length === 0 && (
                          <Check size={14} className="text-[#1d2745] shrink-0" />
                            )}
                          </button>

                          <div className="h-px bg-slate-100 my-1"></div>

                          {availableCategories.map((cat) => {
                          const isSelected = selectedGenCategories.includes(cat.id)

                          return (
                            <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                            setSelectedGenCategories((prev) =>
                            isSelected
                            ? prev.filter((id) => id !== cat.id)
                            : [...prev, cat.id]
                            )
                          }}
                          className="w-full flex items-center justify-between cursor-pointer hover:bg-slate-50 py-2.5 px-3.5 rounded-xl transition-all font-semibold text-xs text-left"
                            >
                          <span className="truncate">{cat.label}</span>

                          {isSelected && (
                          <Check size={14} className="text-[#1d2745] shrink-0" />
                          )}
                          </button>
                          )
                          })}
                        </div>
                        </>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleGenerateItems}
                        className="w-full sm:w-auto px-6 h-10 bg-[#1d2745] hover:bg-opacity-90 text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs transition-all"
                      >
                        <Sparkles size={14} className="text-amber-300" />
                        <span>Générer la liste</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center py-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-white px-3 relative z-10">Ou ajouter manuellement</span>
                  <div className="h-px bg-slate-100 -mt-2"></div>
                </div>
                {/* Form to add item */}
                <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100 items-end">
                  {/* Produit available */}
                  <div >
                    
                    <SearchableSelect
                                            label="Produit référencé *"
                                            placeholder="Sélectionner un produit..."
                                            options={availableItems.map((p) => ({
                                            id: p.id,
                                            name: p.label
                    
                                              }))}
                                            value={newItem.selectedItem?.id || ''}
                                            onChange={(id) => {
                                            const item = availableItems.find((i) => i.id === id)
                    
                                            if (!item) return
                    
                                             setNewItem({
                                                ...newItem,
                                                selectedItem: item,
                                                })
                           
                                              }}
                                          />
                                          
                    
                  </div>

                  {/* Quantité */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Quantité</label>
                    <input
                      type="number"
                      value={newItem.quantity|| ''}
                      onChange={(e) => 
                        
                        setNewItem({
                            ...newItem,
                            quantity: e.target.value ,
                              })
                            }
                      min="1"
                       className="w-full h-10 px-5 border border-[#e2e8f0] bg-white text-slate-700 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745]"
                    />
                  </div>

                  {/* Unité du produit */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Unité</label>
                    <Select
                      value={newItem.unit|| ''}
                      onValueChange={(val) => {
                        if (!val) return;
                        setNewItem({
                            ...newItem,
                            unit: val,
                              })
                            }}
                    
                    >
                      <SelectTrigger className="w-full h-10 px-5 border border-slate-200 bg-slate-50/50 text-slate-705 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745] transition-all flex items-center justify-between cursor-pointer">
                        <SelectValue placeholder="Unité..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-1 text-slate-700 focus:outline-none max-h-60 overflow-y-auto">
                        <SelectItem value="pcs" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Pièce (pcs)</SelectItem>
                        <SelectItem value="kg" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Kilo (kg)</SelectItem>
                        <SelectItem value="litres" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Litres</SelectItem>
                        <SelectItem value="boîtes" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Boîtes</SelectItem>
                        <SelectItem value="heures" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">Heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Base de prix (HT/TTC) */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">Base Prix</label>
                    <Select
                      value={newItem.amount_type|| ''}
                      onValueChange={(val) => {
                        if (!val) return;
                        setNewItem({
                            ...newItem,
                            amount_type: val,
                              })
                            }}
                      
                    >
                      <SelectTrigger className="w-full h-10 px-5 border border-slate-200 bg-slate-50/50 text-slate-705 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745] transition-all flex items-center justify-between cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-1 text-slate-700 focus:outline-none max-h-60 overflow-y-auto">
                        <SelectItem value="TTC" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">TTC</SelectItem>
                        <SelectItem value="HT" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">HT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Prix Unitaire */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">P.U.</label>
                    <input
                      type="number"
                      value={newItem.amount_type === "HT" ? newItem.amount_ht : newItem.amount_ttc}
                      onChange={(e) => {
                        const amount = Number(e.target.value)
  
                        if (newItem.amount_type === 'HT') {
                            setNewItem({
                                ...newItem,
                                amount_ht: amount,
                                amount_ttc: amount * (1 + ((newItem.vat_rate?? 0)/100))
                            })
                        
                        } else {
                            setNewItem({
                                ...newItem,
                                amount_ttc: amount,
                                amount_ht: amount * (1 - ((newItem.vat_rate?? 0)/100))
                            }

                            )
                        }
                        }}
                      placeholder="0.00"
                      className="w-full h-10 px-5 border border-[#e2e8f0] bg-white text-slate-700 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745]"
                    />
                  </div>

                  {/* TVA */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-[#8fa0b5] uppercase tracking-wider mb-2">TVA</label>
                    <Select
                      value={String(newItem.vat_rate)}
                      onValueChange={(val) => {
                        if (!val) return;
                        if (newItem.amount_type === 'HT') {
                        setNewItem({
                            ...newItem,
                            vat_rate :Number(val),
                            amount_ttc: newItem.amount_ht * (1 + ((newItem.vat_rate?? 0)/100))

                        })}
                        else {
                            setNewItem({
                            ...newItem,
                            vat_rate :Number(val),
                            amount_ht: newItem.amount_ttc * (1 - ((newItem.vat_rate?? 0)/100))

                        })

                        }
                    }}
                    >
                      <SelectTrigger className="w-full h-10 px-5 border border-slate-200 bg-slate-50/50 text-slate-705 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#1d2745]/10 focus:border-[#1d2745] transition-all flex items-center justify-between cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-1 text-slate-700 focus:outline-none max-h-60 overflow-y-auto">
                        <SelectItem value="20" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">20%</SelectItem>
                        <SelectItem value="10" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">10%</SelectItem>
                        <SelectItem value="0" className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl transition-all font-semibold text-xs justify-start">0%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add action */}
                   <div className="sm:col-span-3 flex justify-end mt-2 animate-fade-in">
                    <button
                      type="submit"
                      disabled={!newItem.selectedItem?.id}
                      className="px-6 py-2.5 bg-[#1d2745] hover:bg-opacity-90 text-white rounded-full text-xs font-bold disabled:opacity-40 flex items-center gap-1.5 cursor-pointer shadow-3xs transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter l'article</span>
                    </button>
                  </div>
                </form>

                {/* Display items list */}
                {value.invoice_items?.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400 font-medium">Aucun article n'a été inséré pour le moment.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase bg-slate-50/50">
                          <th className="p-2">Produit</th>
                          <th className="p-2 text-center">Quantité</th>
                          <th className="p-2 text-center">Unité</th>
                          <th className="p-2 text-right">P.U</th>
                          <th className="p-2 text-center">TVA</th>
                          <th className="p-2 text-right">T.HT</th>
                          <th className="p-2 text-right">T.TTC</th>
                          <th className="p-2 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-102">
                        {value.invoice_items?.map((art) => (
                          <tr key={art.id} className="hover:bg-slate-50/60">
                            <td className="p-2 font-bold text-slate-800">{art.item?.label}</td>
                            <td className="p-2 text-center font-semibold">{art.quantity}</td>
                            <td className="p-2 text-center text-slate-500">{art.unit}</td>
                            <td className="p-2 text-right text-slate-700 font-mono">
                              {art.amount_ht?.toLocaleString()} DH <span className="text-[10px] text-slate-405">{art.amount_type}</span>
                            </td>
                            <td className="p-2 text-center text-slate-600 font-bold">{art.vat_rate}%</td>
                            <td className="p-2 text-right text-slate-750 font-mono font-medium">{((art.quantity ?? 1) * (art.amount_ht ?? 0)).toLocaleString()} DH</td>
                            <td className="p-2 text-right text-slate-900 font-mono font-bold">{((art.quantity ?? 1) * (art.amount_ttc ?? 0)).toLocaleString()} DH</td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(art.local_id!)}
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

              {/* BLOCK 3: CALCULATION COMPARISON CARD */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
                
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Somme HT cumulée (Articles):</span>
                    <span className="font-mono">
                        {articlesSum.ht.toLocaleString()} DH
                        </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 border-b border-slate-200 pb-3">
                    <span>Somme TTC cumulée (Articles):</span>
                    <span className="font-mono text-slate-900">{articlesSum.ttc.toLocaleString()} DH</span>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                     <span className="font-bold text-slate-700">Écart calculé (Différence):</span>
                    <div className="flex items-center gap-1.5 font-bold">
                      {differenceTTC !== 0 ? (
                        <div className="flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-[11px] font-bold">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Différence: {differenceTTC.toLocaleString()} DH</span>
                        </div>
                      ) : (
                          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-bold animate-pulse">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Montant équilibré (0.00 DH)</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

            </div>
             
             
  )
}