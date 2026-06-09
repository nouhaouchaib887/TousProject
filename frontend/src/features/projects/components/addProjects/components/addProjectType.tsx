'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getCurrentUser } from '@/features/Auth/api/authService'
import { createProjectType } from '../../../api/projectTypeService'
import {ProjectTypeCreate} from '@/types'
import { toast } from "sonner"

interface ProjectTypeCreateDialogProps {
  onCreated: (projectType: ProjectTypeCreate) => void
}

export function ProjectTypeCreateDialog({ onCreated }: ProjectTypeCreateDialogProps) {
  const [newProjectType, setNewProjectType] = useState({
    name: '',
    code: '',
    description:'',
    color: '#0b273f',
    is_by_default: false,
    is_active: true
  })



  const handleCreate = async () => {
  if (!newProjectType.name) {
    toast.error("Le nom du type est obligatoire")
    return
  }

  try {
    

    const createdType = await createProjectType(newProjectType)

    onCreated(createdType)

    toast.success("Type de projet créé avec succès")

    setNewProjectType({
      name: '',
      code: '',
      color: '#0b273f',
      description: '',
      is_by_default: false,
      is_active: true,
    })

  } catch (error) {
    toast.error("Erreur lors de la création du type")
    console.error(error)
  }
}

  return (

    <Dialog>
      <DialogTrigger  >
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-[10px] font-bold uppercase text-brand-600"
        >
          <Plus className="h-3 w-3" />
          Nouveau Type
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-card">
        <DialogHeader className="p-8 pb-4 shrink-0 bg-muted/30 border-b border-border">
        <DialogTitle className="text-xl font-bold uppercase tracking-tight text-slate-800">Nouveau Type de Projet</DialogTitle>
        
        </DialogHeader>
        <div className="p-8 pt-6 space-y-6 bg-card text-slate-800">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Nom du Type *</Label>
                    <Input 
                      placeholder="Ex: Levé Topographique" 
                      className="h-11 bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-xl focus-visible:ring-brand-500"
                      value={newProjectType.name}
                      onChange={(e) => setNewProjectType({...newProjectType, name: e.target.value})}
                    />
                  </div>
                                
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Abréviation *</Label>
                    <Input 
                      placeholder="Ex: LT" 
                      className="h-11 bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-xl focus-visible:ring-brand-500 font-mono"
                      value={newProjectType.code}
                      onChange={(e) => setNewProjectType({...newProjectType, code: e.target.value})}
                      />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Couleur associée</Label>
                      <div className="flex gap-2 items-center">
                        <div className="relative w-11 h-11 shrink-0 rounded-xl border border-slate-100 bg-slate-50/50 overflow-hidden flex items-center justify-center">
                          <Input 
                            type="color" 
                            className="absolute inset-0 w-full h-full p-0 cursor-pointer border-none scale-150"
                            value={newProjectType.color}
                            onChange={(e) => setNewProjectType({...newProjectType, color: e.target.value})}
                            />
                        </div>
                    <Input 
                      value={newProjectType.color}
                      onChange={(e) => setNewProjectType({...newProjectType, color: e.target.value})}
                      className="h-11 bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-xl font-mono text-xs uppercase"
                      placeholder="#0b273f"
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Description</Label>
                      <textarea 
                        placeholder="Description détaillée de ce type de projet..." 
                        className="min-h-[80px] w-full p-3 bg-slate-50/50 border border-slate-100 dark:border-white/10 rounded-xl text-sm focus-visible:outline-none focus:ring-2 focus:ring-brand-500 resize-none transition-all placeholder:text-slate-400"
                        value={newProjectType.description}
                        onChange={(e) => setNewProjectType({...newProjectType, description: e.target.value})}
                        />
                    </div>
                  </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50/55 rounded-2xl border border-slate-100/90">
                <div className="flex items-center gap-2.5">
                  <Checkbox 
                    id="is-active-type" 
                    checked={newProjectType.is_active}
                    onCheckedChange={(checked) => setNewProjectType({...newProjectType, is_active: !!checked})}
                    className="h-5 w-5 rounded-lg border-slate-200 transition-all focus-visible:ring-emerald-500 data-checked:bg-emerald-500 data-checked:border-emerald-500 data-checked:text-white"
                    />
                 <Label htmlFor="is-active-type" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Activer le type</Label>
                </div>

              <div className="flex items-center gap-2.5">
                <Checkbox 
                  id="is-default-type" 
                  checked={newProjectType.is_by_default}
                  onCheckedChange={(checked) => setNewProjectType({...newProjectType, is_by_default: !!checked})}
                  className="h-5 w-5 rounded-lg border-slate-200 transition-all focus-visible:ring-emerald-500 data-checked:bg-emerald-500 data-checked:border-emerald-500 data-checked:text-white"
                />
                <Label htmlFor="is-default-type" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Sélectionner par défaut</Label>
              </div>
            </div>
        </div>

        <Button 
          className="w-full h-11 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all uppercase text-xs tracking-wider" 
          onClick={handleCreate}
        >
      Enregistrer le Type
        </Button>
      </div>
      </DialogContent>
    </Dialog>
  )
}
    