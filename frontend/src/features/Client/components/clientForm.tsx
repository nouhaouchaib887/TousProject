'use client'

import * as React from 'react'
import { useState, useRef, useCallback } from 'react'
import Webcam from "react-webcam"
import { Camera, Upload, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { addClient, uploadCin, updateClient, getQualities } from '@/features/Client/api/clientService'
import { toast } from "sonner" 

export function ClientForm({ onClientCreate, client }: { onClientCreate?: (client: any) => void; client?: any }) {
   const [formData, setFormData] = useState({
      first_name: client?.first_name || '',
      last_name: client?.last_name || '',
      cin: client?.cin || '',
      company_name: client?.company_name || '',
      ice: client?.ice || '',
      rc: client?.rc || '',
      quality: {id:'', name:''},
      phone_number: client?.phone_number || '',
      email: client?.email || '',
      address: client?.address || ''
    })
    const [cinFile, setCinFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false)
    const [clientType, setClientType] = useState(client?.client_type || 'Physique')
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

const handleQualityBlur = () => {
  const typedName = formData.quality?.name?.trim()

  if (!typedName) return

  const existingQuality = suggestedQualites.find(
    (q: any) => q.name === typedName
  )

  setFormData({
    ...formData,
    quality: existingQuality
      ? { id: existingQuality.id, name: existingQuality.name }
      : { id: "", name: typedName },
  })
}
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
      const isEdit = !!client;
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
      client_type: clientType, // ⚠️ doit matcher l'enum backend: PHYSICAL / MORAL
      first_name: sanitizeValue(formData.first_name),
      last_name: sanitizeValue(formData.last_name),
      cin: sanitizeValue(formData.cin),
      phone_number: sanitizeValue(formData.phone_number),
      email: sanitizeValue(formData.email) ,
      address: sanitizeValue(formData.address),
      company_name: clientType === "Morale" ? sanitizeValue(formData.company_name) : null,
      ice: clientType === "Morale" ? sanitizeValue(formData.ice) : null,
      rc: clientType === "Morale" ? sanitizeValue(formData.rc) : null,
      quality: formData.quality
    };

    // 3️⃣ Étape 1 : Upload du CIN
    let attachmentId = client?.attachmentId;
        if (cinFile) {
          const attachment = await uploadCin(cinFile); 
          attachmentId = attachment.id;
        }
         let result;
        if (isEdit) {
          result = await updateClient(client.id, clientPayload, attachmentId);
          toast.success("Client mis à jour !", {
            description: `${formData.first_name} ${formData.last_name} a été modifié avec succès.`,
          });
        } else {
    // 4️⃣ Étape 2 : Création du client avec attachment_id
       result = await addClient(clientPayload, attachmentId);

    // 5️⃣ Succès
    toast.success("Client créé !", {
      description: `${formData.first_name} ${formData.last_name} a été ajouté avec succès.`,
    });
  }

    onClientCreate?.(result);
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
            quality:{id:"", name:""}
          });
          setCinFile(null);
        }


  } catch (err : any) {
     toast.error(client ? "Erreur de modification" : "Erreur de création", {
    description: err.message || "Impossible de communiquer avec le serveur.",
    });
    console.error("Détails de l'erreur:", err);

    } finally {
      setLoading(false);
    }
  }
    return (
      <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto px-4 py-2 custom-scrollbar  bg-white dark:bg-white text-slate-900 dark:text-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">Prénom *</Label>
            <Input 
              placeholder="Prénom" 
              className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-slate-900/20" 
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Nom *</Label>
            <Input 
              placeholder="Nom" 
              className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400  rounded-xl focus:ring-slate-900/20" 
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              required
            />
          </div>
          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400  ml-1">CIN </Label>
            <Input 
              placeholder="Ex: AB123456" 
              className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400  rounded-xl focus:ring-slate-900/20 font-mono" 
              value={formData.cin}
              onChange={(e) => setFormData({...formData, cin: e.target.value})}
            />
          </div>



          <div className="col-span-1 sm:col-span-2 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">Document d'identité (CIN/Passport) </Label>
              <div className="flex bg-slate-100 dark:bg-slate-100 p-1 rounded-lg">
                 <Button 
                   type="button" 
                   variant="ghost" 
                   size="sm" 
                   className={cn(
                     "h-7 px-3 text-[10px] uppercase font-bold tracking-tight rounded-md transition-all",
                     !showCamera ? 'bg-white dark:bg-white/10 shadow-sm text-slate-900 dark:text-slate-900' : 'text-slate-400'
                   )}
                   onClick={() => setShowCamera(false)}
                 >
                   Fichier
                 </Button>
                 <Button 
                   type="button" 
                   variant="ghost" 
                   size="sm" 
                   className={cn(
                     "h-7 px-3 text-[10px] uppercase font-bold tracking-tight rounded-md transition-all",
                     showCamera ? 'bg-white dark:bg-white/10 shadow-sm text-slate-900 dark:text-slate-900' : 'text-slate-400'
                   )}
                   onClick={() => setShowCamera(true)}
                 >
                   Scanner
                 </Button>
              </div>
            </div>

            <div className="mt-1 flex flex-col gap-2">
              {!showCamera ? (
                <div className="relative group">
                  <Input 
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-2 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400  rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-50/50 transition-all text-xs pr-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) setCinFile(file)
                    }}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-900 transition-colors">
                    <Upload size={16} />
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col gap-2">
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-100 bg-black shadow-inner">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={0.92}
                      videoConstraints={{ facingMode: "environment" }}
                      className="w-full h-full object-cover"
                      disablePictureInPicture={true}
                      forceScreenshotSourceSize={false}
                      imageSmoothing={true}
                      mirrored={false}
                      onUserMedia={() => {}}
                      onUserMediaError={() => {}}
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white/20 m-6 rounded-xl pointer-events-none"></div>
                  </div>
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={capturePhoto}
                    className="w-full text-[10px] uppercase font-bold tracking-widest h-10 bg-[#0B1739] hover:bg-[#1E293B] text-white rounded-xl"
                  >
                    <Camera className="size-4 mr-2" />
                    Capturer la photo
                  </Button>
                </div>
              )}

              {cinFile && (
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-500/10 border border-slate-100 dark:border-slate-100 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-slate-900 dark:text-slate-900" />
                    <span className="text-xs text-slate-700 dark:text-slate-700 font-medium truncate max-w-[200px]">
                      {cinFile.name.startsWith('scan_cin') ? "Capture prête" : cinFile.name}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="text-[10px] uppercase font-bold text-slate-400  dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-500 transition-colors"
                    onClick={() => setCinFile(null)}
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">Type de client</Label>
            <Select value={clientType} onValueChange={(value) => value && setClientType(value)}>
              <SelectTrigger className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 rounded-xl focus:ring-slate-900/20">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="Physique">Physique</SelectItem>
                <SelectItem value="Morale" >Morale</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">Qualité</Label>
            <Input
  list="qualite-suggestions"
  value={formData.quality?.name || ""}
  onChange={(e) =>
    setFormData({
      ...formData,
      quality: {
        id: "",
        name: e.target.value,
      },
    })
  }
  onBlur={handleQualityBlur}
  placeholder="Ex: Propriétaire, Héritier..."
  className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-slate-900/20"
/>
           <datalist id="qualite-suggestions">
  {suggestedQualites.map((item: any) => (
    <option key={item.id} value={item.name} />
  ))}
</datalist>
          </div>
          {clientType === 'Morale' && (
            <>
              <div className="col-span-1 sm:col-span-2 space-y-1.5 animate-in fade-in slide-in-from-top-2">
                 <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">Nom de l&apos;Entreprise *</Label>
                <Input 
                  placeholder="Nom commercial" 
                  className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-slate-900/20" 
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">ICE </Label>
                <Input 
                  placeholder="15 chiffres" 
                  className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-slate-900/20 font-mono" 
                  value={formData.ice}
                  onChange={(e) => setFormData({...formData, ice: e.target.value})}
                />
              </div>
              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">RC </Label>
                <Input 
                  placeholder="Registre de Commerce" 
                  className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-slate-900/20 font-mono" 
                  value={formData.rc}
                  onChange={(e) => setFormData({...formData, rc: e.target.value})}
                />
              </div>
            </>
          )}
          
          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">Téléphone *</Label>
            <Input 
              placeholder="+212 6..." 
              className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-slate-900/20" 
              value={formData.phone_number}
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
              required
            />
          </div>
          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400 ml-1">Email</Label>
            <Input 
              placeholder="contact@email.com" 
              className="h-11 bg-slate-50/50 dark:bg-slate-50/50 border-slate-100 dark:border-slate-100 text-slate-900 dark:text-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-400 rounded-xl focus:ring-slate-900/20" 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-100 mt-6 sticky bottom-0 bg-white dark:bg-white py-4">
          <Button type="submit" className="w-full h-12 bg-[#0B1739] hover:bg-[#1E293B] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-slate-900/20 transition-all" disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
               client ? 'Enregistrer les modifications' : 'Créer la fiche client'
            )}
          </Button>
        </div>
      </form>
    )
}
