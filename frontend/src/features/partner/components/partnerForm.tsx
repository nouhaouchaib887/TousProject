'use client'

import * as React from 'react'
import { useState, useRef, useCallback } from 'react'
import Webcam from "react-webcam"
const WebcamComponent = Webcam as any;
import { Camera, Upload, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {Checkbox} from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {Partner} from '../types'
import { cn } from '@/lib/utils'
import { addClient, uploadCin, updateClient, getQualities } from '@/features/Client/api/clientService'
import { toast } from "sonner" 

export function PartnerForm({ onPartnerCreate, partner }: { onPartnerCreate?: (partner:Partner) => void; partner?: any }) {
   const [formData, setFormData] = useState({
      first_name: partner?.first_name || '',
      last_name: partner?.last_name || '',
      cin: partner?.cin || '',
      company_name: partner?.company_name || '',
      ice: partner?.ice || '',
      rc: partner?.rc || '',
      phone_number: partner?.phone_number || '',
      email: partner?.email || '',
      address: partner?.address || '',
      city: partner?.city || '',
      notes: partner?.notes || '',
      credit_limit: partner?.credit_limit || 0,
      is_supplier: partner?.is_supplier || false,
      is_customer: partner?.is_customer || false,
      is_active: partner?.is_active || true

    })
    const [cinFile, setCinFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false)
    const [clientType, setClientType] = useState(partner?.client_type || 'Physique')
    const [showCamera, setShowCamera] = useState(false)
    const webcamRef = useRef<Webcam>(null)

    const [suggestedQualites, setSuggestedQualites] = useState<any[]>([])

React.useEffect(() => {
  async function fetchQualities() {
    try {
      const qualities = await getQualities()
      setSuggestedQualites(qualities)
    } catch (error) {
      console.error("Error fetching qualities", error)
    }
  }

  fetchQualities()
}, [])


    const base64ToFile = (base64: string, filename: string) => {
      const arr = base64.split(',')
      const mime = arr[0].match(/:(.*?);/)![1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    }

    const capturePhoto = useCallback(() => {
      const imageSrc = webcamRef.current?.getScreenshot()
      if (imageSrc) {
        const file = base64ToFile(imageSrc, `scan_cin_${Date.now()}.jpg`)
        setCinFile(file)
        setShowCamera(false)
        toast.success("Photo capturée !")
      }
    }, [webcamRef])


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setLoading(true)
      const isEdit = !!partner;
      try {
    //if (!cinFile) {
    //  toast.error("Fichier manquant", { description: "Veuillez uploader le CIN." });
    //  return; // ⚠️ Important: sortir avant la suite
   // } 
      
    // 1️⃣ Sanitize helper
    const sanitizeValue = (value: string) => {
      if (value === null || value === undefined) return undefined;
      const v = value.trim();
      return v === "" ? undefined : v; 
    };

    

    // 2️⃣ Payload client (JSON)
    const clientPayload = {
   // ⚠️ doit matcher l'enum backend: PHYSICAL / MORAL
      first_name: sanitizeValue(formData.first_name),
      last_name: sanitizeValue(formData.last_name),
      cin: sanitizeValue(formData.cin),
      phone_number: sanitizeValue(formData.phone_number),
      email: sanitizeValue(formData.email) ,
      address: sanitizeValue(formData.address),
      company_name: clientType === "Morale" ? sanitizeValue(formData.company_name) : null,
      ice: clientType === "Morale" ? sanitizeValue(formData.ice) : null,
      rc: clientType === "Morale" ? sanitizeValue(formData.rc) : null,
      legal_type: clientType,
      city: sanitizeValue(formData.city),
      credit_limit: Number(formData.credit_limit) || 0,
      notes: sanitizeValue(formData.notes),
      is_active: formData.is_active,
      is_customer: formData.is_customer,
      is_supplier: formData.is_supplier,
    };
    console.log("client payload:", clientPayload)

    let result;
        if (isEdit) {
          result = await updateClient(partner.id, clientPayload);
          if (cinFile) {
          const attachment = await uploadCin(cinFile,partner.id);
        }
          
          toast.success("Client mis à jour !", {
            description: `${formData.first_name} ${formData.last_name} a été modifié avec succès.`,}
          );
          
        
        } else {
    // 4️⃣ Étape 2 : Création du client avec attachment_id
       result = await addClient(clientPayload);
       console.log("client", result)
       
        if (result?.id && cinFile) {
          const attachment = await uploadCin(cinFile,result.id);
        }
       
          

        // 5️⃣ Succès
          toast.success("Client créé !", {
          description: `${formData.first_name} ${formData.last_name} a été ajouté avec succès.`,
       });
  }

    onPartnerCreate?.(result);
    if (!isEdit) {
          setFormData({
            first_name: "",
            last_name: "",
            cin: "",
            company_name: "",
            ice: "",
            rc: "",
            phone_number: "",
            email: "",
            address: "",
            city:"",
            credit_limit:0,
            notes:'',
            is_active: true,
            is_customer: false,
            is_supplier: false

          });
          setCinFile(null);
        }


  } catch (err : any) {
     toast.error(partner ? "Erreur de modification" : "Erreur de création", {
    description: err.message || "Impossible de communiquer avec le serveur.",
    });
    console.error("Détails de l'erreur:", err);

    } finally {
      setLoading(false);
    }
  }
    return (
    <form onSubmit={handleSubmit}  className="space-y-5 max-h-[80vh] overflow-y-auto px-1 py-1 text-slate-900">
      <div className="border-t border-slate-100 pt-4 space-y-4">
        <p className="text-[11px] font-bold text-[#1d2745] uppercase tracking-wider">Informations Générales</p>
      {/* 1. Legal Type Selector */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Type de Tiers / Partenaire
        </label>
        <Select 
          value={clientType} 
          onValueChange={(val) => {
            if (val === 'Physique' || val === 'Morale') {
              setClientType(val);
            }
          }}
        >
          <SelectTrigger className="w-full h-11 bg-slate-50/50 border border-slate-200 text-slate-900 rounded-xl focus:ring-slate-900/20 px-3 flex justify-between items-center text-sm">
            <SelectValue placeholder="Sélectionner..." />
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-200 shadow-md rounded-lg">
            <SelectItem value="Physique">Physique (Particulier)</SelectItem>
            <SelectItem value="Morale">Morale (Entreprise)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 2. Primary Fields (Physique vs Morale) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Prénom {clientType === 'Physique' && '*'}
          </label>
          <input 
            type="text"
            placeholder="Prénom" 
            className="w-full h-11 px-3.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm" 
            value={formData.first_name}
            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
            required={clientType === 'Physique'}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Nom {clientType === 'Physique' && '*'}
          </label>
          <input 
            type="text"
            placeholder="Nom" 
            className="w-full h-11 px-3.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm" 
            value={formData.last_name}
            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
            required={clientType === 'Physique'}
          />
        </div>

        <div className="col-span-1 sm:col-span-2 space-y-1.5">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
            CIN / Passeport
          </label>
          <input 
            type="text"
            placeholder="Ex: AB123456" 
            className="w-full h-11 px-3.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 font-mono text-sm" 
            value={formData.cin}
            onChange={(e) => setFormData({...formData, cin: e.target.value})}
          />
        </div>
      </div>

      {/* Corporate Info Section if Morale */}
      {clientType === 'Morale' && (
        <div className="space-y-4 p-4 bg-slate-50 border border-slate-150 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Nom de l&apos;Entreprise *
            </label>
            <input 
              type="text"
              placeholder="Ex: ElectroPro S.A.R.L" 
              className="w-full h-11 px-3.5 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm" 
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              required={clientType === 'Morale'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                ICE 
              </label>
              <input 
                type="text"
                placeholder="Ex: 001234567890123" 
                className="w-full h-11 px-3.5 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 font-mono text-sm" 
                value={formData.ice}
                onChange={(e) => setFormData({...formData, ice: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                RC (Registre de Commerce)
              </label>
              <input 
                type="text"
                placeholder="Ex: RC Casablanca 12345" 
                className="w-full h-11 px-3.5 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 font-mono text-sm" 
                value={formData.rc}
                onChange={(e) => setFormData({...formData, rc: e.target.value})}
              />
            </div>
          </div>
        </div>
      )}
      </div>

     

      {/* 4. Contact & Location Information */}
      <div className="border-t border-slate-100 pt-4 space-y-4">
        <p className="text-[11px] font-bold text-[#1d2745] uppercase tracking-wider">Coordonnées & Localisation</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Téléphone portable *
            </label>
            <input 
              type="text"
              placeholder="Ex: +212 661-123456" 
              className="w-full h-11 px-3.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm" 
              value={formData.phone_number}
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Courriel (Email)
            </label>
            <input 
              type="email"
              placeholder="Ex: contact@email.ma" 
              className="w-full h-11 px-3.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Ville
            </label>
            <input 
              type="text"
              placeholder="Ex: Casablanca" 
              className="w-full h-11 px-3.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm" 
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Adresse physique complète
            </label>
            <textarea 
              placeholder="Rue, Quartier, Code postal, Ville..." 
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm resize-none" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* 5. Business Settings (Credit Limit, Roles, and Notes) */}
      <div className="border-t border-slate-100 pt-4 space-y-4">
        <p className="text-[11px] font-bold text-[#1d2745] uppercase tracking-wider">Paramètres de Gestion & Crédit</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Limite de Crédit (Maximum)
            </label>
            <input 
              type="number"
              placeholder="0 (Pas de limite)" 
              className="w-full h-11 px-3.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm" 
              value={formData.credit_limit}
              onChange={(e) => setFormData({...formData, credit_limit: Number(e.target.value)})}
            />
          </div>

          <div className="space-y-1.5 flex flex-col justify-end">
            <div className="flex items-center gap-2 h-11 px-1">
      
               <Checkbox 
                    id="is_active" 
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({...formData,is_active: !!checked})}
                    className="h-5 w-5 rounded-lg border-slate-200 transition-all focus-visible:ring-emerald-500 data-checked:bg-emerald-500 data-checked:border-emerald-500 data-checked:text-white"
                    />
                 <Label htmlFor="is_active" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Activer</Label>
      
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-4  p-3 rounded-xl">
            <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="is_purchasable"
              className="h-4.5 w-4.5 rounded accent-brand-500 focus:ring-2 focus:ring-brand-200 cursor-pointer"
              checked={formData.is_customer}
              onChange={(e) => setFormData({...formData, is_customer: e.target.checked})}
            />
            <label htmlFor="is_purchasable" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              Client
            </label>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="is_sellable"
              className="h-4.5 w-4.5 rounded accent-brand-500 focus:ring-2 focus:ring-brand-200 cursor-pointer"
              checked={formData.is_supplier}
              onChange={(e) => setFormData({...formData, is_supplier: e.target.checked})}
            />
            <label htmlFor="is_sellable" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
              Fournisseur
            </label>
          </div>
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Notes internes / Observations
            </label>
            <textarea 
              placeholder="Remarques complémentaires..." 
              rows={2}
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 text-slate-900 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 text-sm resize-none" 
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-100 mt-6 sticky bottom-0 bg-white dark:bg-white py-4">
          <Button type="submit" className="w-full h-12 bg-[#0B1739] hover:bg-[#1E293B] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-slate-900/20 transition-all" disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
               partner ? 'Enregistrer les modifications' : 'Créer la fiche tiers'
            )}
          </Button>
        </div>
    </form>
        
    )
}