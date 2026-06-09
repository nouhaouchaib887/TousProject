'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'
import { TabsContent } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { getProjectTypes } from '../../../api/projectTypeService'
    import { getLocations , getReferenceSystems} from '../../../api/locationData'
import { LocationRegion, registryType, systemZone, TopoMetadata , referenceSystem, Region, Province} from '@/types'
import { SearchableSelect } from '../ui/searchableSelect'
import { ProjectTypeCreateDialog } from './addProjectType'
import { se } from 'date-fns/locale'
import {Commune} from '@/types'
const PROJECT_TYPES = getProjectTypes(); // This would be your API call to fetch project types
const LOCATIONS_DATA = getLocations(); // This would be your API call to fetch regions, provinces, and communes

interface TopoMetadataSectionProps {
  value: TopoMetadata
  reference: any
  onChange: (value: TopoMetadata) => void
}
export default function TopoMetadataSection({ value, onChange, reference }: TopoMetadataSectionProps) {
 
  const [projectTypes, setProjectTypes] = useState<any[]>([])

  useEffect(() => {
    async function fetchProjectTypes() {
      const data = await getProjectTypes()
      console.log("PROJECT TYPES:", data)
      setProjectTypes(data)
    }

    fetchProjectTypes()
  }, [])
  const [locationsData, setLocationsData] = useState<LocationRegion[]>([])
  const[referenceSystems, setReferenceSystem] = useState<referenceSystem[]>([])

  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedCommune, setSelectedCommune] = useState('')

useEffect(() => {
  async function fetchLocations() {
    const data = await getLocations()
    setLocationsData(data)

  }

  fetchLocations()
}, [])
useEffect(() => {
  async function fetchReferenceSystems() {
    const data = await getReferenceSystems()
    setReferenceSystem(data)

  }

   fetchReferenceSystems()
}, [])

useEffect(() => {
    setSelectedRegion(value.region.name|| '')
    setSelectedProvince(value.province.name || '')
    setSelectedCommune(value.commune?.name || '')
  }, [value.region, value.province, value.commune])

// Get cascading lists based on loaded locationsData state
  const provincesForRegion = locationsData.find(r => r.name === selectedRegion)?.provinces || []
  const communesForProvince = provincesForRegion.find(p => p.name === selectedProvince)?.communes || []
  const lieuDitsForCommune = communesForProvince.find(c => c.name === selectedCommune)?.lieu_dits || []
  const selectedCommuneObj = communesForProvince.find(
  (c) => c.name === selectedCommune
)

const suggestedLieuDits = selectedCommuneObj?.lieu_dits ?.map(l => l.name) || []
  console.log("Locations Data:", locationsData)
  console.log("Provinces for Region:", provincesForRegion)
  console.log("Communes for Province:", communesForProvince)

  console.log("Suggested Lieu Dits:", suggestedLieuDits)
  // Adapted Handlers for hierarchy & cascading
  const handleRegionChange = (regionName: string) => {
    const region = locationsData.find(r => r.name === regionName)
    setSelectedRegion(regionName)
    setSelectedProvince('')
    setSelectedCommune('')

    onChange({
      ...value,
      region: {id: region?.id || "", name: region?.name || ""},
      province: {id:"",name:""},
      commune:  {id:"",name:""}
    })
  }

  const handleProvinceChange = (provinceName: string) => {
    const province = provincesForRegion.find(p => p.name === provinceName)
    if (!province) return

    setSelectedProvince(province.name)
    setSelectedCommune('')

    onChange({
      ...value,
      province: {id: province.id, name: province.name},
      commune: {id:"",name:""}
    })
  }

  const handleCommuneChange = (communeName: string) => {
  let foundRegion = { id: "", name: "" }
  let foundProvince = { id: "", name: "" }
  let communeObj: Commune = { id: "", name: "" }

  for (const region of locationsData) {
    for (const province of region.provinces) {
      const commune = province.communes.find((c) => c.name === communeName)

      if (commune) {
        foundRegion = { id: region.id, name: region.name }
        foundProvince = { id: province.id, name: province.name }
        communeObj = commune
        break
      }
    }

    if (foundRegion.id) break
  }

  if (!communeObj.id) return
  
  setSelectedCommune(communeObj.name)
  setSelectedRegion(foundRegion.name)
  setSelectedProvince(foundProvince.name)

  onChange({
    ...value,
    commune: communeObj,
    region: foundRegion,
    province: foundProvince,
    lieu_dit: { id: "", name: "" },
  })
}
 const handleLieuDitBlur = () => {
    if (value.lieu_dit && value.lieu_dit.name.trim()) {
      const trimmed = value.lieu_dit.name.trim()
      if (!suggestedLieuDits.includes(trimmed)) {
        const updated = [trimmed, ...suggestedLieuDits]
        localStorage.setItem('lieu_dits_history', JSON.stringify(updated.slice(0, 50)))
      }
    }
  }

 const landTypeLabels: Record<registryType, string> = {
  I: 'Immatriculé',
  R: 'Réquisition',
  M: 'Moulkia',
  O: 'Autre',
}
  return (

              <TabsContent value="topo" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Référence du Projet</Label>
                    <Input disabled placeholder={reference } className="mt-1" />
                  </div>

                  <div className="col-span-2">
                    <SearchableSelect
                        label="Type de Projet *"
                        placeholder="Sélectionner un type..."
                        options={projectTypes.map((t) => ({
                        id: t.id,
                        name: t.name,
                          }))}
                        value={value.projectType?.id || ''}
                        onChange={(id) => {
                        const typeObj = projectTypes.find((t) => t.id === id)

                        if (!typeObj) return

                        onChange({
                          ...value,
                          projectType: typeObj,
                          })
                          }}
                      />
                    <div className="flex justify-end mt-1">
                      <ProjectTypeCreateDialog
                        onCreated={(createdType) => {
                        setProjectTypes((prev) => [...prev, createdType])

                      onChange({
                        ...value,
                      projectType : createdType,
                })
          }}
                    />
                    </div>
                  </div>



                   {/* Region */}
                  <div className="space-y-1.5">
          <SearchableSelect
            label="Région *"
            placeholder="Sélectionner une région..."
            options={locationsData.map(r => r.name)}
            value={selectedRegion}
            onChange={handleRegionChange}
          />
        </div>

        {/* Province */}
        <div className="space-y-1.5">
          <SearchableSelect
            label="Province *"
            placeholder="Sélectionner une province..."
            options={provincesForRegion.map(p => p.name)}
            value={selectedProvince}
            onChange={handleProvinceChange}
            disabled={!selectedRegion}
          />
        </div>

        {/* Commune */}
        <div className="col-span-2 space-y-1.5">
          <SearchableSelect
            label="Commune *"
            placeholder="Rechercher ou sélectionner..."
            options={selectedProvince 
              ? communesForProvince.map(c => c.name) 
              : selectedRegion
                ? provincesForRegion.flatMap(p => p.communes.map(c => c.name))
              : locationsData.flatMap(r => r.provinces.flatMap(p => p.communes.map(c => c.name)))
            }
            value={selectedCommune}
            onChange={handleCommuneChange}
          />
        </div>
        {/* Lieu-dit */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Lieu-dit</Label>
          <Input 
            list="lieu-dit-suggestions"
            value={value.lieu_dit?.name || ''} 
            onBlur={handleLieuDitBlur}
            onChange={(e) =>
  onChange({
    ...value,
    lieu_dit: {
      id: value.lieu_dit?.id ?? "",
      name: e.target.value,
    },
  })
}
          
            placeholder="Saisir ou choisir..."
            className="h-11 bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-xl"
          />
          <datalist id="lieu-dit-suggestions">
            {suggestedLieuDits.map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

        {/* Superficie */}
        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Superficie</Label>
          <Input 
            value={value.superficie || ''} 
            onChange={(e) => onChange({ ...value, superficie: parseFloat(e.target.value) || 0 })} 
            placeholder="Ex: 500 m² ou 2 Ha"
            className="h-11 bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-xl"
          />
        </div>
        {/* Nom de la Propriété & Statut Foncier */}
                  <div>
                    <Label className="text-xs font-bold uppercase text-slate-500">Nom de la Propriété</Label>
                    <Input
                      placeholder="Ex: Terrain Al Karama"
                      value={value.place_name || ''}
                      onChange={(e) =>
      onChange({
        ...value,
        place_name: e.target.value,
      })
    }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase text-slate-500">Statut Foncier</Label>
                   <Select
                        value={value.registry_type ?? ''}
                        onValueChange={(val) =>
                            onChange({
                            ...value,
                           registry_type : val as  registryType,
                        })
                }
                >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner..." > 
                          {landTypeLabels[value.registry_type ]}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="I">Immatriculé</SelectItem>
                        <SelectItem value="R">Réquisition</SelectItem>
                        <SelectItem value="M">Moulkia</SelectItem>
                        <SelectItem value="O">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Immatriculé & Réquisition */}
                  {(value.registry_type  === 'I' || value.registry_type  === 'R') && (
                    <>
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500">N° Titre</Label>
                        <Input
                          placeholder="Numéro du titre"
                          value={value.title_number  || ''}
                          onChange={(e) => onChange({
                            ...value,
                            title_number: e.target.value,
                        })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500">Indice</Label>
                        <Input
                          placeholder="Indice"
                          value={value.title_index || ''}
                          onChange={(e) => onChange({
                            ...value,
                            title_index: e.target.value,
                        })}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}

                  {/* Moulkia */}
                  {value.registry_type  === 'M' && (
                    <div className="col-span-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Type de Document</Label>
                      <Input
                        placeholder="Ex: Acte de vente, Dahir..."
                        value={value.document_type || ''}
                        onChange={(e) => onChange({
                          ...value,
                          document_type: e.target.value,
                        })}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* Autre */}
                  {value.registry_type  === 'O' && (
                    <div className="col-span-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Désignation</Label>
                      <Input
                        placeholder="Désignation du document..."
                        value={value.designation || ''}
                        onChange={(e) => onChange({
                          ...value,
                          designation: e.target.value,
                        })}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* SECTION PARCELLES - Coordonnées multiples */}
                  <div className="col-span-2 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold">Coordonnées des Parcelles</h3>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          onChange({
                            ...value,
                            coordinates: [
                            ...value.coordinates,
                            {
                                x: 0,
                                y: 0,
                                s: false,
                                    },
                        ],
                          })
                        }}
                        className="gap-1 px-3"
                      >
                        <Plus className="h-4 w-4" />
                        Ajouter Parcelle
                      </Button>
                    </div>

                    {(value.coordinates || []).length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-xl text-center">
                        <p className="text-xs text-slate-400 italic">Aucune parcelle ajoutée</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {value.coordinates.map((parcelle: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-end p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex-1">
                              <Label className="text-[10px] font-bold uppercase text-slate-400">Parcelle {idx + 1} - X</Label>
                              <Input
                                placeholder="Ex: 31.6295"
                                type="number"
                                step="0.0001"
                                value={parcelle.x}
                                onChange={(e) => {
                                  const updated = [...value.coordinates]
                                  updated[idx] = { ...updated[idx], x: parseFloat(e.target.value) }
                                  onChange({ ...value, coordinates: updated })
                                }}
                                className="mt-1 h-9 text-sm bg-white"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-[10px] font-bold uppercase text-slate-400">Y</Label>
                              <Input
                                placeholder="Ex: -7.5898"
                                type="number"
                                step="0.0001"
                                value={parcelle.y}
                                onChange={(e) => {
                                  const updated = [...value.coordinates]
                                  updated[idx] = { ...updated[idx], y: parseFloat(e.target.value) }
                                  onChange({ ...value, coordinates: updated })
                                }}
                                className="mt-1 h-9 text-sm bg-white"
                              />
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                onChange({
                                    ...value,
                                     coordinates: value.coordinates.filter((_, i) => i !== idx),
                                })
                              }}
                              className="h-9 w-9 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION SYSTÈME DE RATTACHEMENT */}
                  <div className="col-span-2 mt-6 border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-semibold mb-4">Système de Rattachement</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Sous-système */}
                      <div className="space-y-1.5">
         <Label className="text-xs font-bold uppercase text-slate-500">Sous-système</Label>
          <Input 
            list="sous-systemes-suggestions"
            value={value.reference_system?.name || ''} 
            onChange={(e) =>
  onChange({
    ...value,
    reference_system: {
      id: value.reference_system?.id ?? "",
      name: e.target.value,
    },
  })
}
          
            placeholder="Saisir ou choisir..."
            className="h-11 bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-xl"
          />
          <datalist id="sous-systeme-suggestions">
            {referenceSystems.map(l => l.name) || [].map((item, idx) => (
              <option key={idx} value={item} />
            ))}
          </datalist>
        </div>

                    

                      {/* Zone */}
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500">Zone</Label>
                        <Select 
                          value={value.system_zone}
                          onValueChange={(val) => onChange({
                            ...value,
                            system_zone: val as systemZone,
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner..." >
                              
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Zone 1</SelectItem>
                            <SelectItem value="2">Zone 2</SelectItem>
                            <SelectItem value="3">Zone 3</SelectItem>
                            <SelectItem value="4">Zone 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Référence */}
                      <div className="col-span-2">
                        <Label className="text-xs font-bold uppercase text-slate-500">Référence</Label>
                        <Input
                          placeholder="Référence du système de rattachement"
                          value={value.reference_benchmark || ''}
                          onChange={(e) => onChange({
                            ...value,
                            reference_benchmark: e.target.value
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Coordonnées de système */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase text-slate-400">Coordonnées de référence</h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onChange({
                              ...value,
                              system_coordinates: [
                                ...value.system_coordinates,
                                {
                                  x: 0,
                                  y: 0,
                                  s: true,
                                }
                              ]
                            })
                          }}
                          className="gap-1 h-8 px-3"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Ajouter Coordonnées
                        </Button>
                      </div>

                      {(value.system_coordinates || []).length === 0 ? (
                        <div className="p-6 border-2 border-dashed border-slate-100 rounded-xl text-center">
                          <p className="text-xs text-slate-300 italic">Aucune coordonnée système</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {value.system_coordinates.map((coord: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-end p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex-1">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Coord {idx + 1} - X</Label>
                                <Input
                                  placeholder="X"
                                  type="number"
                                  step="0.0001"
                                  value={coord.x}
                                  onChange={(e) => {
                                    const updated = [...value.system_coordinates]
                                    updated[idx] = { ...updated[idx], x: parseFloat(e.target.value) }
                                    onChange({ ...value, system_coordinates: updated })
                                  }}
                                  className="mt-1 h-8 text-sm bg-white"
                                />
                              </div>
                              <div className="flex-1">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Y</Label>
                                <Input
                                  placeholder="Y"
                                  type="number"
                                  step="0.0001"
                                  value={coord.y}
                                  onChange={(e) => {
                                    const updated = [...value.system_coordinates]
                                    updated[idx] = { ...updated[idx], y: parseFloat(e.target.value) }
                                    onChange({ ...value, system_coordinates: updated })
                                  }}
                                  className="mt-1 h-8 text-sm bg-white"
                                />
                              </div>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    onChange({
                                    ...value,
                                        system_coordinates: value.system_coordinates.filter((_, i) => i !== idx),
                                })
                                }}
                                className="h-8 w-8 text-rose-500"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Observations System */}
                    <div className="col-span-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Observations</Label>
                      <textarea
                        placeholder="Notes sur le système de rattachement..."
                        value={value. system_notes || ''}
                        onChange={(e) => {
                            onChange({
                            ...value,
                            system_notes: e.target.value,
                        })
                        }}
                        className="mt-1 w-full p-2 border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[80px]"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

             
  )
}
