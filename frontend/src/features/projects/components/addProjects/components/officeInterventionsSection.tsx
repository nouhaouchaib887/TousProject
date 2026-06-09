'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { numberToWordsFrench } from '@/lib/numberToWordsFrench'
import { Search, Plus, ChevronRight, ChevronLeft, Save, X, Info, User, MapPin, CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, FileText, Calendar, Building2, Wallet, Eye, Printer, Download, Check, Pencil } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientForm } from '@/features/Client/components/clientForm'
import { cn } from '@/lib/utils'
import { officeWork } from '@/types'
import { getAgents} from '../../../api/agentsData'
import { getStaff, getRoles } from '../../../../Staff/api/staffService'
import {getTasks} from '../../../api/taskData'


interface officeWorkSectionProps {
  value: officeWork [];
    onChange: (value: officeWork []) => void;
}

export default function OfficeWorkSection({ value,onChange }: officeWorkSectionProps) {

  const [newOfficeIntervention, setNewOfficeIntervention] = useState<any>({
    staff_with_roles: [],
    task_category:null,
    description: '',
    time_spent_hour:0,
    documentItem: '',
    task_date: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingOfficeInterventionId, setEditingOfficeInterventionId] = useState<string | null>(null)
  const [editAgentSelection, setEditAgentSelection] = useState<any>({
    selectedAgent: null,
    selectedAgentRole: null,
  })
  const toDateInputValue = (date?: string) => {
    if (!date) return ""
    return date.split("T")[0].split(" ")[0]
  }
const [availableAgents, setAvailableAgents] = useState<any[]>([])

  useEffect(() => {
    async function fetchAvailableAgents() {
      const data = await getStaff()
      setAvailableAgents(data)
    }

    fetchAvailableAgents()
  }, [])
  const [availableRoles, setAvailableRoles] = useState<any[]>([])
  
    useEffect(() => {
      async function fetchAvailableRoles() {
        const data = await getRoles()
        setAvailableRoles(data)
      }
  
      fetchAvailableRoles()
    }, [])
const [availableTasks, setAvailableTasks] = useState<any[]>([])
  
    useEffect(() => {
      async function fetchAvailableTasks() {
        const data = await getTasks()
        setAvailableTasks(data)
      }
  
      fetchAvailableTasks()
    }, [])
  return (
         
            <Card className="p-6 border border-slate-200">
                         <h3 className="text-lg font-bold mb-6 text-slate-900 uppercase tracking-wide text-sm">Interventions Bureau</h3>
                         
              
             {/* List of Interventions */}
                          <div className="space-y-4 mb-6">
                                          {value.length > 0 && (
                                            <div className="space-y-2">
                                              <Label className="font-bold text-xs uppercase text-slate-500">Interventions ajoutées</Label>
                                              {value.map((intervention: any, idx: number) => {
                                                const isEditing = editingOfficeInterventionId === intervention.id;
                                                return (
                                                  <div key={intervention.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                      <div className="flex-1">
                                                        <p className="text-sm font-bold text-slate-900">Intervention {idx + 1} - {intervention.task_date || 'Sans date'}</p>
                                                        <p className="text-xs text-slate-500 italic">
                                                           {intervention.staff_with_roles?.map((ar: any) => ar.agent?.full_name).join(", ") || "Aucun agent"}
                                                        </p>
                                                        {intervention.observations && !isEditing && (
                                                          <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">Desc: {intervention.description}</p>
                                                        )}
                                                      </div>
                                                      <div className="flex items-center gap-1.5">
                                                        <Button
                                                          type="button"
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => {
                                                            if (isEditing) {
                                                              setEditingOfficeInterventionId(null);
                                                            } else {
                                                              setEditingOfficeInterventionId(intervention.id);
                                                            }
                                                          }}
                                                          className={cn(
                                                            "text-[#0B1739] hover:bg-[#0B1739]/5 h-8 w-8 p-0 rounded-full flex items-center justify-center transition-colors",
                                                            isEditing && "bg-[#0B1739]/10"
                                                          )}
                                                          title={isEditing ? "Fermer les détails" : "Modifier / Voir les détails"}
                                                        >
                                                          <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                          type="button"
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => {
                                                            if (isEditing) {
                                                              setEditingOfficeInterventionId(null);
                                                            }
                                                           onChange(value.filter((_, i) => i !== idx))
                                                          }}
                                                          className="text-slate-400 hover:text-rose-500 h-8 w-8 p-0 rounded-full"
                                                          title="Supprimer"
                                                        >
                                                          <X className="w-4 h-4" />
                                                        </Button>
                                                      </div>
                                                    </div>
                          
                                                    {isEditing && (
                                                      <div className="pt-4 border-t border-slate-200/60 space-y-4 bg-white/50 p-3 rounded-lg">
                                                        {/* 1. Date */}
                                                        <div className="space-y-1">
                                                          <Label className="text-[10px] font-bold text-slate-400 uppercase">Date de Sortie *</Label>
                                                          <Input
                                                            type="date"
                                                          value={toDateInputValue(intervention.task_date)}
                                                            onChange={(e) => {
                                                              const updated = value.map((i: any) => 
                                                                i.id === intervention.id ? { ...i, task_date: e.target.value } : i
                                                              );
                                                              onChange(updated);
                                                            }}
                                                            className="h-10 bg-white border-slate-200"
                                                          />
                                                        </div>
                                                        {/* Category */}
                    <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase text-slate-500">Catégorie de Tâche *</Label>
                        <Select 
                                     value={intervention.task_category?.id || ''}
                                      onValueChange={(task_category_id) => {
                                      const task_category = availableTasks.find((a) => a.id === task_category_id)
                                      if (!task_category) return
            
                                      const updated = value.map((i: any) => 
                                                                i.id === intervention.id ? { ...i, task_category: task_category } : i
                                                              );
                                                              onChange(updated);
                                        }}
                                  >
                                    <SelectTrigger className="h-10 bg-white">
                                      <SelectValue placeholder="Choisir..." >
                                         {intervention.task_category?.name}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableTasks.map((task_category) => (
                                        <SelectItem key={task_category.id} value={task_category.id}>
                                          {task_category.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                    </div>
                
                {/* Time Spent */}
                <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-slate-500">Temps Passé (heures)</Label>
                    <Input
                        type="number"
                        placeholder="Ex: 2.5"
                        step="0.5"
                        min="0"
                        value={intervention.time_spent_hour}
                        onChange={(e) => {
                          const updated = value.map((i: any) => 
                            i.id === intervention.id ? { ...i, time_spent_hour: e.target.value } : i
                          );
                          onChange(updated);
                        }}
                        className="h-11 bg-white border-slate-200"
                      />
                    </div>
                                                        {/* 2. Description */}
                                                        <div className="space-y-1">
                                                          <Label className="text-[10px] font-bold text-slate-400 uppercase">Description</Label>
                                                          <textarea
                                                            placeholder="Description..."
                                                            value={intervention.description || ''}
                                                            onChange={(e) => {
                                                              const updated = value.map((i: any) => 
                                                                i.id === intervention.id ? { ...i, description: e.target.value } : i
                                                              );
                                                              onChange(updated);
                                                            }}
                                                            className="w-full p-3 border border-slate-200 rounded-xl text-xs resize-none bg-white min-h-[80px]"
                                                            rows={2}
                                                          />
                                                        </div>
                          
                                                        {/* 3. File upload info / change */}
                                                        <div className="space-y-1">
                                                          <Label className="text-[10px] font-bold text-slate-400 uppercase">Fichier joint</Label>
                                                          <Input
                                                            type="file"
                                                            onChange={(e) => {
                                                              const updated = value.map((i: any) => 
                                                                i.id === intervention.id ? { ...i, file: e.target.files?.[0] || null } : i
                                                              );
                                                              onChange(updated);
                                                            }}
                                                            className="h-10 bg-white border-slate-200 pt-1.5 text-xs font-medium"
                                                          />
                                                          {intervention.file && (
                                                            <div className="flex items-center gap-2 p-1.5 bg-brand-50 rounded-lg text-brand-700 text-xs">
                                                              <FileText size={12} />
                                                              <span className="truncate flex-1 font-medium">{intervention.file.name}</span>
                                                            </div>
                                                          )}
                                                        </div>
                          
                                                        {/* 4. Agents list with inline editing for this intervention */}
                                                        <div className="space-y-2 pt-2 border-t border-slate-200/60">
                                                          <Label className="text-[10px] font-bold text-slate-400 uppercase">Agents & Rôles</Label>
                                                          {intervention.staff_with_roles && intervention.staff_with_roles.length > 0 && (
                                                            <div className="space-y-1.5">
                                                              {intervention.staff_with_roles.map((agentRole: any, idx2: number) => (
                                                                <div key={idx2} className="flex items-center gap-1.5 p-2 bg-white border border-slate-100 rounded-lg text-xs">
                                                                  <span className="font-bold text-slate-800 flex-1">
                                                                    {availableAgents.find(a => a.id === agentRole.agent?.id)?.full_name} ({agentRole.role?.name})
                                                                  </span>
                                                                  <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                      const updated = value.map((i: any) => {
                                                                        if (i.id === intervention.id) {
                                                                          return {
                                                                            ...i,
                                                                            staff_with_roles: i.staff_with_roles.filter((_: any, idx3: number) => idx3 !== idx2)
                                                                          };
                                                                        }
                                                                        return i;
                                                                      });
                                                                      onChange(updated);
                                                                    }}
                                                                    className="text-slate-400 hover:text-rose-500 h-6 w-6 p-0 rounded-full"
                                                                  >
                                                                    <X className="w-3 h-3" />
                                                                  </Button>
                                                                </div>
                                                              ))}
                                                            </div>
                                                          )}
                          
                                                          {/* Inline agent addition */}
                                                          <div className="grid grid-cols-2 gap-2 mt-2">
                                                            <Select 
                                                            value={editAgentSelection.selectedAgent?.id || ''}
                                                            onValueChange={(agent_id) => {
                                                            const agent = availableAgents.find((a) => a.id === agent_id)
                                                            if (!agent) return
                          
                                                            setEditAgentSelection((prev: any) => ({
                                                            ...prev,
                                                            selectedAgent: agent,
                                            }))
                                                        }}
                                                            >
                                                              <SelectTrigger className="h-8 text-xs bg-white">
                                                                <SelectValue placeholder="Choisir..." >
                                                                  {editAgentSelection.selectedAgent?.full_name}
                                                    </SelectValue>
                                                              </SelectTrigger>
                                                              <SelectContent>
                                                    {availableAgents.map((agent) => (
                                                      <SelectItem key={agent.id} value={agent.id}>
                                                        {agent.full_name}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                            </Select>
                                                            <div className="flex gap-1.5">
                                                              <Select 
                                                   value={editAgentSelection.selectedAgentRole?.id || ''}
                                                   onValueChange={(role_id) => {
                                                    const role = availableRoles.find((r) => r.id === role_id)
                                                  if (!role) return
                          
                                                setEditAgentSelection((prev: any) => ({
                                                ...prev,
                                                selectedAgentRole: role,
                                                }))
                              }}
                                                >
                                                  <SelectTrigger className="h-10 bg-white">
                                                    <SelectValue placeholder="Choisir..." >
                                                       {editAgentSelection.selectedAgentRole?.name}
                                                   </SelectValue>
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {availableRoles.map((role) => (
                                                      <SelectItem key={role.id} value={role.id}>
                                                        {role.name}
                                                      </SelectItem>
                                                    ))}
                                                  </SelectContent>
                                                </Select>
                                                              <Button
                                                                type="button"
                                                                size="sm"
                                                                onClick={() => {
                                                                  if (editAgentSelection.selectedAgent && editAgentSelection.selectedAgentRole)  {
                                                                    const updated = value.map((i: any) => {
                                                                      if (i.id === intervention.id) {
                                                                        const existingRoles = i.staff_with_roles || [];
                                                                        return {
                                                                          ...i,
                                                                          staff_with_roles: [...existingRoles, {
                                                                            agent: editAgentSelection.selectedAgent,
                                                                            role: editAgentSelection.selectedAgentRole,
                                                                          }]
                                                                        };
                                                                      }
                                                                      return i;
                                                                    });
                                                                    onChange(updated);
                                                                    setEditAgentSelection({ ...editAgentSelection, selectedAgent: '', selectedAgentRole: '' });
                                                                  }
                                                                }}
                                                                className="h-8 bg-[#0B1739] hover:bg-brand-600 text-white font-bold text-[10px] uppercase px-2 rounded-lg flex items-center justify-center"
                                                              >
                                                                <Plus className="w-3.5 h-3.5" />
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                          
            
                          {/* Add New Intervention */}
                          <div className="space-y-6 p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                            <div className="space-y-4">
                              <Label className="font-bold text-xs uppercase text-slate-500">Agents & Rôles *</Label>
                              
                              {/* List of selected agents with roles */}
                              {newOfficeIntervention.staff_with_roles && newOfficeIntervention.staff_with_roles.length > 0 && (
                                <div className="space-y-2">
                                  {newOfficeIntervention.staff_with_roles.map((item: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                  <div className="flex-1 text-sm">
                                  <p className="font-bold text-slate-900">{item.agent.full_name}</p>
                                  <p className="text-xs text-slate-500 uppercase font-medium">Rôle: {item.role.name}</p>
                                      </div>
                                      
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setNewOfficeIntervention({
                                            ...newOfficeIntervention,
                                            staff_with_roles: newOfficeIntervention.staff_with_roles.filter((_: any, i: number) => i !== idx),
                                          })
                                        }}
                                        className="text-slate-400 hover:text-rose-500"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
            
                              {/* Add new agent row */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-[10px] font-bold text-slate-400 uppercase">Agent</Label>
                                  <Select 
                                     value={newOfficeIntervention.selectedAgent?.id || ''}
                                      onValueChange={(agent_id) => {
                                      const agent = availableAgents.find((a) => a.id === agent_id)
                                      if (!agent) return
            
                                      setNewOfficeIntervention({
                                        ...newOfficeIntervention,
                                        selectedAgent: agent,
                                          })
                                        }}
                                  >
                                    <SelectTrigger className="h-10 bg-white">
                                      <SelectValue placeholder="Choisir..." >
                                         {newOfficeIntervention.selectedAgent?.full_name}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableAgents.map((agent) => (
                                        <SelectItem key={agent.id} value={agent.id}>
                                          {agent.full_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[10px] font-bold text-slate-400 uppercase">Rôle</Label>
                                 <Select 
                                     value={newOfficeIntervention.selectedAgentRole?.id || ''}
                                      onValueChange={(role_id) => {
                                      const agentRole = availableRoles.find((a) => a.id === role_id)
                                      if (!agentRole) return
            
                                      setNewOfficeIntervention({
                                        ...newOfficeIntervention,
                                        selectedAgentRole: agentRole,
                                          })
                                        }}
                                  >
                                    <SelectTrigger className="h-10 bg-white">
                                      <SelectValue placeholder="Choisir..." >
                                         {newOfficeIntervention.selectedAgentRole?.name}
                                     </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableRoles.map((role) => (
                                        <SelectItem key={role.id} value={role.id}>
                                          {role.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (newOfficeIntervention.selectedAgent && newOfficeIntervention.selectedAgentRole) {
                                    const updatedStaffWithRoles = [...(newOfficeIntervention.staff_with_roles || [])]
                                    updatedStaffWithRoles.push({
                                 
                                   agent: newOfficeIntervention.selectedAgent,
                                   role: newOfficeIntervention.selectedAgentRole,
            
                                    })
                                    setNewOfficeIntervention({
                                      ...newOfficeIntervention,
                                      staff_with_roles: updatedStaffWithRoles,
                                      selectedAgent: null,
                                      selectedAgentRole: null,
                                    })
                                  }
                                }}
                                className="w-full text-xs font-bold uppercase gap-2 py-5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Ajouter Agent au groupe
                              </Button>
                            </div>
            

                {/* Date */}
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase text-slate-500">Date de Sortie *</Label>
                  <Input
                    type="date"
                    value={newOfficeIntervention.task_date}
                    onChange={(e) => setNewOfficeIntervention({ ...newOfficeIntervention, task_date: e.target.value })}
                    className="h-11 bg-white border-slate-200"
                  />
                </div>

                  {/* Category */}
                    <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase text-slate-500">Catégorie de Tâche *</Label>
                        <Select 
                                     value={newOfficeIntervention.task_category?.id || ''}
                                      onValueChange={(task_category_id) => {
                                      const task_category = availableTasks.find((a) => a.id === task_category_id)
                                      if (!task_category) return
            
                                      setNewOfficeIntervention({
                                        ...newOfficeIntervention,
                                        task_category: task_category,
                                          })
                                        }}
                                  >
                                    <SelectTrigger className="h-10 bg-white">
                                      <SelectValue placeholder="Choisir..." >
                                         {newOfficeIntervention.task_category?.name}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableTasks.map((task_category) => (
                                        <SelectItem key={task_category.id} value={task_category.id}>
                                          {task_category.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                    </div>
                
                {/* Time Spent */}
                <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-slate-500">Temps Passé (heures)</Label>
                    <Input
                        type="number"
                        placeholder="Ex: 2.5"
                        step="0.5"
                        min="0"
                        value={newOfficeIntervention.time_spent_hour}
                        onChange={(e) =>
                            setNewOfficeIntervention({
                                ...newOfficeIntervention,
                                time_spent_hour: e.target.value,
                                })
                            }
                            className="h-11 bg-white border-slate-200"
                            />
                        </div>
                
                {/* Description */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label className="font-bold text-xs uppercase text-slate-500">Description</Label>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {(newOfficeIntervention.description || '').length}/500
                            </span>
                    </div>
                    <textarea
                    placeholder="Saisir une description détaillée de la tâche (500 caractères max)..."
                    value={newOfficeIntervention.description || ''}
                    onChange={(e) => {
                        if (e.target.value.length <= 500) {
                            setNewOfficeIntervention({
                            ...newOfficeIntervention,
                            description: e.target.value,
                                })
                            }
                            }}
                    className="w-full p-4 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white min-h-[100px]"
                    rows={3}
                 />
                 </div>
                
                               
                {/* File Upload */}
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase text-slate-500">Fichier à attacher</Label>
                  <div className="relative">
                    <Input
                      type="file"
                      onChange={(e) =>
                        setNewOfficeIntervention({
                          ...newOfficeIntervention,
                          file: e.target.files?.[0] || null,
                        })
                      }
                      className="h-11 bg-white border-slate-200 pt-2 cursor-pointer"
                    />
                  </div>
                  {newOfficeIntervention.file && (
                    <div className="flex items-center gap-2 p-2 bg-brand-50 rounded-lg text-brand-700">
                      <FileText size={14} />
                      <span className="text-xs font-medium truncate">
                        {newOfficeIntervention.file.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <Button
                  onClick={() => {
               
    if (
      newOfficeIntervention.staff_with_roles.length > 0 &&
      newOfficeIntervention. task_date
    ) {
      onChange([
        ...value,
        {
          staff_with_roles: newOfficeIntervention.staff_with_roles,
          task_date: newOfficeIntervention. task_date,
          time_spent_hour: newOfficeIntervention.time_spent_hour,
          task_category:  newOfficeIntervention.task_category,
          description: newOfficeIntervention.description,
          //documentItem: newOfficeIntervention.file?.name || '',
        },
      ])

      setNewOfficeIntervention({
        staff_with_roles: [],
        description: '',
        attachmentUrl: '',
         task_date: '',
        file: null,
      })
    }
  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 py-6 rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter cette intervention
                </Button>
              </div>
            </Card>
          )

}
