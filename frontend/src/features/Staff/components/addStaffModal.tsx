import * as React from 'react';
import  { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Briefcase, User, Phone, Mail, Award, ChevronRight , Loader2 } from 'lucide-react';
import { addStaff } from '../api/staffService';
import {getUsers} from '../../User/api/userService'
interface AddCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (collaborator: any) => void;
}



// Proposed job titles (titre du poste)
const POSTE_TITLES = [
  { id: 'igt', name: 'Ingénieur Géomètre Topographe (IGT)' },
  { id: 'tech_topo', name: 'Technicien Principal Topographe' },
  { id: 'dessinateur', name: 'Dessinateur Projeteur' },
  { id: 'chef_brigade', name: 'Chef de Brigade Topographique' },
  { id: 'aide_topo', name: 'Aide Topographe' },
  { id: 'assistant_dir', name: 'Assistant(e) de Direction' },
];

export default function AddCollaboratorModal({ isOpen, onClose, onSuccess }: AddCollaboratorModalProps) {
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    phone_number: '',
    email: '',
    job_title: '',
    speciality: '',
    hiring_date: new Date().toISOString().split('T')[0],
    user_id: '',
  });
  // Dictionary of available users (id, name)
    const [availableUsers, setAvailableUsers] = useState<any[]>([])

  useEffect(() => {
    async function fetchAvailableUsers() {
      const data = await getUsers()
      setAvailableUsers(data)
    }

    fetchAvailableUsers()
  }, [])
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.last_name.trim() || !formData.first_name.trim()) {
      toast.error('Veuillez remplir au moins le nom et le prénom.');
      return;
    }

    setIsSubmitting(true);

    const apiPayload = {
      ...formData
    };
    console.log(apiPayload)

    // Simulated API call to POST /api/collaborators
   try {
    // 4️⃣ Étape 2 : Création du client avec attachment_id
        const result = await addStaff(apiPayload);
    
        // 5️⃣ Succès
        toast.success("Collaborateur créé !", {
          description: `${formData.first_name} ${formData.last_name} a été ajouté avec succès.`,
        });
         setIsSubmitting(false)
   }
   catch (err : any) {
        toast.error( "Erreur de création", {
       description: err.message || "Impossible de communiquer avec le serveur.",
       });
       setIsSubmitting(false)
       console.error("Détails de l'erreur:", err);
   
       } finally {
         
       }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-h-[92vh] flex flex-col p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white dark:bg-white text-slate-900 dark:text-slate-900">
        {/* Modal Header */}
        <div className="p-4 pb-4 shrink-0 bg-slate-50/80 dark:bg-slate-50/80 border-b border-slate-100 dark:border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-brand-600 dark:bg-blue-950/40">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-[#0B1739] dark:text-[#0B1739] uppercase tracking-tight">
                Nouveau Collaborateur
              </DialogTitle>
            </div>
          </div>
        </div>

        {/* Modal Content / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 pt-4 space-y-2">
          
          {/* Section 1: Informations Personnelles */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="h-4 w-4 text-brand-500" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informations Personnelles</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Prénom *</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="Ex: Amine"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-slate-200 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Nom *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Ex: Alaoui"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className="rounded-xl border-slate-200 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone_number" className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Téléphone</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                    <Phone className="h-4 w-4" />
                  </span>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    placeholder="Ex: +212 600-000000"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="pl-9 rounded-xl border-slate-200 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Email professionnel</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                    <Mail className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Ex: a.alaoui@pitop.ma"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-9 rounded-xl border-slate-200 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Détails du Poste & Embauche */}
          <div className="space-y-4  pt-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Briefcase className="h-4 w-4 text-brand-500" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Poste & Recrutement</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Titre du poste *</Label>
                <Select
                  value={formData.job_title}
                  onValueChange={(val) => handleSelectChange('job_title', val)}
                >
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs py-5">
                    <SelectValue placeholder="Sélectionner le titre du poste" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {POSTE_TITLES.map((title) => (
                      <SelectItem key={title.id} value={title.name} className="text-xs">
                        {title.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="speciality" className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Spécialité</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                    <Award className="h-4 w-4" />
                  </span>
                  <Input
                    id="speciality"
                    name="speciality"
                    placeholder="Ex: Bornage Foncier, SIG, GPS, etc."
                    value={formData.speciality}
                    onChange={handleInputChange}
                    className="pl-9 rounded-xl border-slate-200 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="hiring_date" className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Date d'embauche *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <Input
                    id="hiring_date"
                    name="hiring_date"
                    type="date"
                    required
                    value={formData.hiring_date}
                    onChange={handleInputChange}
                    className="pl-9 rounded-xl border-slate-200 focus:ring-brand-500 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 ml-1">Utilisateur associé</Label>
                
                <Select
                  value={formData.user_id}
                  onValueChange={(val) => handleSelectChange('user_id', val)}
                >
                  <SelectTrigger className="rounded-xl border-slate-200 text-xs py-5">
                    <SelectValue placeholder="Lier à un compte utilisateur">
      {
        availableUsers.find(u => u.id === formData.user_id)
          ? `${availableUsers.find(u => u.id === formData.user_id)?.firstname} ${
              availableUsers.find(u => u.id === formData.user_id)?.lastname
            }`
          : ''
      }
    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {availableUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id} className="text-xs">
                        {user.firstname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

           {/* Footer Action Buttons inside form */}
          <div className="pt-4 flex items-center justify-center border-t border-slate-100 shrink-0">
           
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#131926] hover:bg-black text-white font-bold uppercase tracking-wider text-[11px] px-10 h-10 flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                 
                  Créer le collaborateur
                   <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
