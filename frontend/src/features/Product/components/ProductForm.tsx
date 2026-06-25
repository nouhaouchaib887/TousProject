"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import { toast } from "sonner"
import { useDataContext } from '../../../services/DataContext'
import { ProductCreate } from '../types'
import {getProductCategories} from '../../Invoice/api/invoiceService'





export function ProductForm({ 
  onProductCreate, 
  product 
}: { 
  onProductCreate?: (product: ProductCreate) => void; 
  product?: ProductCreate | null 
}) {
  const { addProduct, editProduct, suppliers, settings } = useDataContext();
  const isEdit = !!product;


  const [formData, setFormData] = useState({
    label: product?.label || '',
    product_category: product?.product_category || null,
    margin_rate: product?.margin_rate !== undefined ? product.margin_rate : 20,
    vat_rate: product?.vat_rate !== undefined ? product.vat_rate : 20,
    min_stock_level: product?.min_stock_level !== undefined ? product.min_stock_level : 5,
    unit: product?.unit || 'Unités',
    is_purchasable: product?.is_purchasable !== undefined ? product.is_purchasable : true,
    is_sellable: product?.is_sellable !== undefined ? product.is_sellable : true
  });

  const [loading, setLoading] = useState(false);
   const [selectedGenCategories, setSelectedGenCategories] = useState<string[]>([]);
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
  
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      toast.error("La désignation du produit est obligatoire");
      return;
    }
    

    setLoading(true);

    try {
     

      const productPayload: any = {
        label: formData.label,
        product_category_id: formData.product_category?.id,
        margin_rate: Number(formData.margin_rate),
        vat_rate: Number(formData.vat_rate),
        min_stock_level: Number(formData.min_stock_level),
        unit: formData.unit,
        is_purchasable: formData.is_purchasable,
        is_sellable: formData.is_sellable,
      };

      if (isEdit && product) {
        editProduct({
          ...product,
          ...productPayload,
        });
        toast.success("Produit mis à jour !", {
          description: `${formData.label} a été modifié avec succès.`,
        });
        if (onProductCreate) {
          onProductCreate({ ...product, ...productPayload });
        }
      } else {
        
        const newProduct = {
          ...productPayload,
          
        };

        addProduct(newProduct);
        toast.success("Produit créé !", {
          description: `${formData.label} a été ajouté au catalogue.`,
        });
        if (onProductCreate) {
          onProductCreate(newProduct);
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1 py-1">
        
        {/* Section: Informations générales */}
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
          <p className="text-[11px] font-black text-[#1d2745] uppercase tracking-wider border-b border-slate-100 pb-2">Informations Générales</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Désignation de l'article *
              </label>
              <input 
                type="text" 
                required
                placeholder="Ex: Clavier Mécanique RGB" 
                className="w-full h-11 px-3.5 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm font-semibold" 
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Catégorie *
              </label>
              <Select
                value={formData.product_category?.id ?? ""}
                onValueChange={(value) => {
                const category = availableCategories.find((c) => c.id === value)

                if (!category) return

                setFormData({
                    ...formData,
                    product_category: category,
                            })
                        }}
            >
            <SelectTrigger className="w-full h-10 px-5 border border-slate-200 bg-slate-50/50 text-slate-705 rounded-full text-xs font-semibold">
            <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>

            <SelectContent className="bg-white border border-[#e2e8f0] rounded-2xl shadow-xl p-1 max-h-60 overflow-y-auto">
                {availableCategories.map((category) => (
                <SelectItem
                    key={category.id}
                    value={category.id}
                    className="cursor-pointer hover:bg-slate-50 py-2.5 px-3 rounded-xl text-xs"
                >
                    {category.label}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Unité de Base *
              </label>
              <Select 
                value={formData.unit || ""}
                onValueChange={(value) => {
                     if (!value) return
                     setFormData({ ...formData, unit: value })
                }
                   
                   
                }
              >
                <SelectTrigger className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/20">
                  <SelectValue placeholder="Choisir l'unité de conditionnement" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                  <SelectItem value="Unités" className="text-slate-700 hover:bg-slate-50 cursor-pointer">Unités (pcs)</SelectItem>
                  <SelectItem value="Kilogrammes" className="text-slate-700 hover:bg-slate-50 cursor-pointer">Kilogrammes (kg)</SelectItem>
                  <SelectItem value="Litres" className="text-slate-700 hover:bg-slate-50 cursor-pointer">Litres (L)</SelectItem>
                  <SelectItem value="Mètres" className="text-slate-700 hover:bg-slate-50 cursor-pointer">Mètres (m)</SelectItem>
                  <SelectItem value="Boîtes" className="text-slate-700 hover:bg-slate-50 cursor-pointer">Boîtes (Box)</SelectItem>
                  <SelectItem value="Paires" className="text-slate-700 hover:bg-slate-50 cursor-pointer">Paires</SelectItem>
                  <SelectItem value="Heures" className="text-slate-700 hover:bg-slate-50 cursor-pointer">Heures (h)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section: Tarification et Marges */}
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
          <p className="text-[11px] font-black text-[#1d2745] uppercase tracking-wider border-b border-slate-100 pb-2">Tarification & Fiscalité</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Marge Commerciale (%)
              </label>
              <input 
                type="number" 
                step="0.1"
                placeholder="20" 
                className="w-full h-11 px-3.5 bg-white border border-slate-200 text-indigo-600 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm font-bold" 
                value={formData.margin_rate}
                onChange={(e) => setFormData({...formData, margin_rate: Number(e.target.value)})}
              
              />
            </div>
             <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Taux de TVA (%) *
              </label>
              <Select 
                value={String(formData.vat_rate)} 
                onValueChange={(value) => setFormData({ ...formData, vat_rate: Number(value) })}
              >
                <SelectTrigger className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/20">
                  <SelectValue placeholder="Taux de TVA" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                  <SelectItem value="20" className="text-slate-700 hover:bg-slate-50 cursor-pointer">20% (Taux standard)</SelectItem>
                  <SelectItem value="14" className="text-slate-700 hover:bg-slate-50 cursor-pointer">14% (Taux intermédiaire)</SelectItem>
                  <SelectItem value="10" className="text-slate-700 hover:bg-slate-50 cursor-pointer">10% (Taux réduit)</SelectItem>
                  <SelectItem value="7" className="text-slate-700 hover:bg-slate-50 cursor-pointer">7% (Taux bas)</SelectItem>
                  <SelectItem value="0" className="text-slate-700 hover:bg-slate-50 cursor-pointer">0% (Exonéré)</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

        </div>

        {/* Section: Stock et Seuil */}
        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
          <p className="text-[11px] font-black text-[#1d2745] uppercase tracking-wider border-b border-slate-100 pb-2">Gestion des Stocks</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Stock Minimum (Seuil d'Alerte) *
              </label>
              <input 
                type="number" 
                min="0"
                required
                placeholder="5" 
                className="w-full h-11 px-3.5 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm font-semibold" 
                value={formData.min_stock_level}
                onChange={(e) => setFormData({...formData, min_stock_level: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>

        {/* Section: Règles de vente & d'achat */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="is_purchasable"
              className="h-4.5 w-4.5 rounded accent-brand-500 focus:ring-2 focus:ring-brand-200 cursor-pointer"
              checked={formData.is_purchasable}
              onChange={(e) => setFormData({...formData, is_purchasable: e.target.checked})}
            />
            <label htmlFor="is_purchasable" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              Achetable 
            </label>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="is_sellable"
              className="h-4.5 w-4.5 rounded accent-brand-500 focus:ring-2 focus:ring-brand-200 cursor-pointer"
              checked={formData.is_sellable}
              onChange={(e) => setFormData({...formData, is_sellable: e.target.checked})}
            />
            <label htmlFor="is_sellable" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              Vendable
            </label>
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white py-4">
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-[#1d2745] hover:bg-[#161d35] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              {isEdit ? 'Enregistrer les modifications' : 'Créer la Fiche Produit'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
