'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Plus, X, Info, } from 'lucide-react'
import { TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ClientForm } from '@/features/Client/components/clientForm'
import { ClientData } from '@/types'
import { getClients } from '../../../api/clientData'
import { SearchableSelect } from '../ui/searchableSelect'






interface ClientSectionProps {
  value: ClientData [];
  onChange: (value: ClientData[]) => void;
}

export default function ClientSection({ value, onChange }: ClientSectionProps) {
  
  
  const handleClientSuccess = (newClient: any) => {
 onChange([...value, newClient])
  };
  
  const [availableClients, setAvailableClients] = useState<any[]>([])
  
    useEffect(() => {
      async function fetchClients() {
        const data = await getClients()
        setAvailableClients(data)
      }
  
      fetchClients()
    }, [])

  return (
    
              <TabsContent value="client" className="space-y-6">
                 <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Recherchez un client existant par son nom ou son CIN. Si le client n'existe pas, créez-en un nouveau.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                       <SearchableSelect
                          label="Rechercher un Client *"
                          placeholder="Rechercher par nom ou CIN..."
                          options={availableClients
                          .filter((c) => !value.find((selected) => selected.id === c.id))
                          .map((c) => ({
                           id: c.id,
                          name: `${c.first_name} ${c.last_name}  (${c.cin})`,
                          }))
                                  }
                          value=""
                          onChange={(id) => {
                          const client = availableClients.find((c) => c.id === id)

                            if (!client) return

                          onChange([...value, client])
                                }}
                              />
                      </div>
                      <Dialog>
                        <DialogTrigger >
                          <Button variant="outline" className="h-11 gap-2 rounded-xl border-slate-200 bg-white shadow-sm hover:bg-slate-50">
                            <Plus size={16} /> Nouveau
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-card">
                          <DialogHeader className="p-8 pb-4 shrink-0 bg-muted/30 border-b border-border">
                            <DialogTitle className="text-xl font-semibold text-brand-500 uppercase tracking-tight">Nouveau Client</DialogTitle>
                          </DialogHeader>
                          <div className="p-8 pt-6 overflow-hidden flex flex-col min-h-0 bg-card">
                            <ClientForm onClientCreate={handleClientSuccess} />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {value.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Clients Sélectionnés</Label>
                        <div className="flex flex-wrap gap-2">
                          {value.map(c => (
                            <Badge key={c.id}  className="gap-2 py-2 px-3 bg-white border border-slate-100 shadow-sm transition-all group hover:border-brand-200">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700">{c.last_name}  {c.first_name} </span>
                                <span className="text-[9px] text-slate-400">{c.cin}</span>
                              </div>
                              <X 
                                size={14} 
                                className="cursor-pointer text-slate-300 hover:text-rose-500 transition-colors" 
                                onClick={() =>onChange(value.filter((sc) => sc.id !== c.id))} 
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>        
  )
}
