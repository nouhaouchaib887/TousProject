'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X } from 'lucide-react'
import { TabsContent } from '@/components/ui/tabs'
import { Dialog,DialogTrigger, DialogContent, DialogHeader,DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {InvoiceCreate, InvoiceMetaData,InvoiceItem, Transaction,InvoiceTableRead} from '../../types'
import { PartnerForm } from '@/features/partner/components/partnerForm'

import { SearchableSelect } from '@/components/ui/searchableSelect'
import { se } from 'date-fns/locale'

interface InvoiceMetaDataSectionProps {
  value: InvoiceMetaData
  reference: any
  onChange: (value: InvoiceMetaData) => void
}


export default function InvoiceMetaDataSection({ value, onChange, reference }: InvoiceMetaDataSectionProps) {
 
  const [partners, setPartners] = useState<any[]>([])

  const handlePartnerSuccess = (partner: any) => {
    

    onChange({
      ...value,
      partner: partner,
    })
  }



 const InvoiceTypeLabels: Record<any, string> = {
  V: 'Vente',
  A: 'Achat',
}
  return (

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
  <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">
    N° Facture
  </Label>
  <Input
    value={reference ?? value.reference ?? ""}
    onChange={(e) => onChange({
        ...value,
        reference: e.target.value,
      })}
    className="h-10 bg-slate-50/50 border-slate-200"
  />
</div>

<div className="space-y-2">
  <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">
    Type de document
  </Label>

  <Select
    value={value.invoice_type ?? ""}
    onValueChange={(val) => {
      if (!val) return
      onChange({
        ...value,
        invoice_type: val,
      })
    }}
  >
    <SelectTrigger className="w-full h-10 bg-slate-50/50 border-slate-200">
      <SelectValue placeholder="Sélectionner..." />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="VENTE">Facture client</SelectItem>
      <SelectItem value="ACHAT">Facture fournisseur</SelectItem>
    </SelectContent>
  </Select>
</div>

                 
                    {/* Date de Facturation */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Date de Facturation</Label>
                  <Input
                    type="date"
                    value={value.invoice_date}
                    onChange={(e) =>  onChange({
                          ...value,
                          invoice_date: e.target.value,
                          })}
                    className="h-11 bg-white border-slate-200"
                  />
                </div>
                 {/* Date d ECHEANCE */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">Date d'Echéance</Label>
                  <Input
                    type="date"
                    value={value.due_date}
                    onChange={(e) =>  onChange({
                          ...value,
                          due_date: e.target.value,
                          })}
                    className="h-11 bg-white border-slate-200"
                  />
                </div>
                    <div className="col-span-2">
                    <SearchableSelect
                        label="Tiers *"
                        placeholder="Sélectionner un tiers..."
                        options={partners.map((p) => ({
                        id: p.id,
                        name: p.last_name

                          }))}
                        value={value.partner?.id || ''}
                        onChange={(id) => {
                        const partnerObj = partners.find((p) => p.id === id)

                        if (!partnerObj) return

                        onChange({
                          ...value,
                          partner: partnerObj,
                          })
                          }}
                      />
                    <div className="flex justify-end mt-1">
                       <Dialog>
                        <DialogTrigger >
                            
                          <Button variant="outline" className="font-bold text-[10px] tracking-wider uppercase text-[#1d2745] flex items-center gap-1 hover:opacity-80 transition-all cursor-pointer">
                            <Plus className="h-3 w-3" /> Nouveau
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-card">
                          <DialogHeader className="p-8 pb-4 shrink-0 bg-muted/30 border-b border-border">
                            <DialogTitle className="text-xl font-semibold text-brand-500 uppercase tracking-tight">Nouveau Client</DialogTitle>
                          </DialogHeader>
                          <div className="p-8 pt-6 overflow-hidden flex flex-col min-h-0 bg-card">
                            <PartnerForm onPartnerCreate={handlePartnerSuccess} />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="col-span-2 space-y-4">
  <div className="space-y-2">
    <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">
      Mode de règlement prévu
    </Label>

    <Select
      value={value.payment_method}
      onValueChange={(val) => {
        if (!val) return

        onChange({
          ...value,
          payment_method: val,
          expected_check_number: val === "CHEQUE" ? value.expected_check_number : "",
          expected_check_date: val === "CHEQUE" ? value.expected_check_date : "",
        })
      }}
    >
      <SelectTrigger className="w-full h-10 bg-slate-50/50 border-slate-200">
        <SelectValue placeholder="Sélectionner..." />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="CHEQUE">Chèque</SelectItem>
        <SelectItem value="VIREMENT">Virement</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {value.payment_method === "CHEQUE" && (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">
          N° Chèque
        </Label>

        <Input
          value={value.expected_check_number ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              expected_check_number: e.target.value,
            })
          }
          className="h-10 bg-slate-50/50 border-slate-200"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">
          Date du chèque
        </Label>

        <Input
          type="date"
          value={value.expected_check_date ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              expected_check_date: e.target.value,
            })
          }
          className="h-10 bg-slate-50/50 border-slate-200"
        />
      </div>
    </div>
  )}
</div>
                  </div>
                </div>
             
             
  )
}