'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {  User, MapPin, ArrowUpRight,FileText, Calendar, Building2, Wallet} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { OverviewData } from '@/types'



interface overviewSectionProps {
  value: OverviewData;
}

 
export default function AddOverviewSection({value }: overviewSectionProps) {
 
  return (
    
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100/50 p-1 rounded-xl">
                  <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Général
                  </TabsTrigger>
                  <TabsTrigger value="interventions" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Interventions
                  </TabsTrigger>
                  <TabsTrigger value="docs" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    Documents
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Infos Générales */}
                <TabsContent value="general" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 border-slate-200 shadow-sm bg-white">
                      <div className="flex items-center gap-3 mb-3 text-brand-600">
                        <div className="p-2 bg-brand-50 rounded-lg">
                          <Building2 size={18} />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">Le Projet</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Projet :</span>
                          <span className="font-bold text-slate-900 truncate max-w-[150px]">{value.projectID || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Type :</span>
                          <span className="font-bold text-slate-900">{value.projectType || 'Non spécifié'}</span>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Localisation :</span>
                          <span className="font-bold text-slate-900">{value.localisation || 'N/A'}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4 border-slate-200 shadow-sm bg-white">
                      <div className="flex items-center gap-3 mb-3 text-brand-600">
                        <div className="p-2 bg-brand-50 rounded-lg">
                          <User size={18} />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">Client(s)</h4>
                      </div>
                      <div className="space-y-1">
                        {value.clients.length > 0 ? (
                          value.clients.map((client, i) => (
                            <div key={i} className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                              {client.first_name} {client.last_name} ({client.cin})
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Aucun client sélectionné</span>
                        )}
                      </div>
                    </Card>

                    <Card className="p-4 border-slate-200 shadow-sm bg-white md:col-span-2">
                      <div className="flex items-center gap-3 mb-3 text-brand-600">
                        <div className="p-2 bg-brand-50 rounded-lg">
                          <Wallet size={18} />
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">Finances & Paiement</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Montant HT</span>
                          <p className="text-sm font-black text-slate-900">{(value.amountHT).toLocaleString()} DH</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">TVA ({value.vatRate}%)</span>
                          <p className="text-sm font-bold text-slate-600">{(value.vatRate).toLocaleString()} DH</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-brand-400">Total TTC</span>
                          <p className="text-lg font-black text-brand-600">{value.amountTTC.toLocaleString()} DH</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-4 -mb-4 p-4 rounded-b-xl">
                        <span className="text-xs font-bold text-slate-500">Avance (Total transactions) :</span>
                        <Badge className="bg-emerald-500 text-white border-0 shadow-sm font-black">
                          {value.transactions.reduce((acc: number, t: any) => acc + t.amount, 0).toLocaleString()} DH
                        </Badge>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Tab 2: Interventions */}
                <TabsContent value="interventions" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Terrain */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-brand-600">
                        <MapPin size={16} />
                        <h4 className="font-bold text-xs uppercase tracking-wider">Terrain</h4>
                      </div>
                      {value.fieldInterventions.length > 0 ? (
                        value.fieldInterventions.map((i: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-brand-500" />
                              <div>
                                <p className="text-[11px] font-bold text-slate-900">Sortie du {i.date}</p>
                                <p className="text-[10px] text-slate-500">
                                 {/*{i.agentsWithRoles?.map((ar: any) => availableAgents.find(a => a.id === ar.agentId)?.name).join(', ')}*/}
                                </p>
                              </div>
                            </div>
                            {i.documentItem?.fileUrl && <Badge  className="text-[10px] h-5">Fichier inclus</Badge>}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-[10px] text-slate-400 italic">Aucune intervention terrain</p>
                        </div>
                      )}
                    </div>

                    {/* Bureau */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 text-brand-600">
                        <Building2 size={16} />
                        <h4 className="font-bold text-xs uppercase tracking-wider">Bureau</h4>
                      </div>
                      {value.officeWorks.length > 0 ? (
                        value.officeWorks.map((i: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-brand-500" />
                              <div>
                                <p className="text-[11px] font-bold text-slate-900">{i.category || 'Tâche Bureau'} - {i.date}</p>
                                <p className="text-[10px] text-slate-500">
                                 {/*{i.agentsWithRoles?.map((ar: any) => availableAgents.find(a => a.id === ar.agentId)?.name).join(', ')}*/}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-brand-600">{i.timeSpent || '0'}h</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <p className="text-[10px] text-slate-400 italic">Aucune intervention bureau</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Documents */}
                <TabsContent value="docs" className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {/* Collect all files from interventions and transactions */}
                    {[
                      ...value.fieldInterventions.filter((i: any) => i.documentItem?.fileUrl).map((i: any) => ({ name: i.documentItem.name, type: 'Terrain', date: i.intervention_date })),
                      ...value.officeWorks.filter((i: any) => i.documentItem?.fileUrl).map((i: any) => ({ name: i.documentItem.name, type: 'Bureau', date: i.date })),
                      ...value.transactions.filter((t: any) => t.documentItem?.fileUrl).map((t: any) => ({ name: t.documentItem.name, type: 'Paiement', date: t.date }))
                    ].length > 0 ? (
                      [
                        ...value.fieldInterventions.filter((i: any) => i.documentItem?.fileUrl).map((i: any) => ({ name: i.documentItem.name, type: 'Terrain', date: i.intervention_date })),
                        ...value.officeWorks.filter((i: any) => i.documentItem?.fileUrl).map((i: any) => ({ name: i.documentItem.name, type: 'Bureau', date: i.date })),
                        ...value.transactions.filter((t: any) => t.documentItem?.fileUrl).map((t: any) => ({ name: t.documentItem.name, type: 'Paiement', date: t.date }))
                      ].map((doc, idx) => (
                        <Card key={idx} className="p-3 border-slate-100 hover:border-brand-200 transition-colors flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-500 rounded-lg transition-colors">
                              <FileText size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{doc.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase font-medium">{doc.type} • {doc.date}</p>
                            </div>
                          </div>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-brand-600">
                            <ArrowUpRight size={14} />
                          </Button>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <FileText size={32} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-xs text-slate-400 font-medium">Aucun document téléchargé</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
          
  )
}
