'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft, Save, Clock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {InvoiceCreate, InvoiceMetaData,InvoiceItem, Transaction,InvoiceTableRead, InvoiceItemsDataSection} from '../types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { numberToWordsFrench } from '@/lib/numberToWordsFrench'
import { toast } from "sonner"
import { createInvoice, updateInvoice } from '../api/invoiceService'
import InvoiceMetaDataSection from "./addInvoiceSection/invoiceMetadataSection"
import InvoiceItemsSection from "./addInvoiceSection/invoiceItemsSection"
import InvoiceTransactionSection from "./addInvoiceSection/invoiceTransactionSection"
interface AddInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
   invoice?: InvoiceTableRead // Si on veut pré-remplir le formulaire pour modification
}

export default function AddInvoiceModal({ isOpen, onClose, onSuccess, invoice }: AddInvoiceModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  // État pour cibler la transaction spécifique dont on veut générer/afficher le reçu
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [selectedInvoiceItemId, setSelectedInvoiceItemId] = useState<string | null>(null)
  const [savedSnapshot, setSavedSnapshot] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  
 // initialize Topo Meta Data
 const initialInvoiceMetadata: InvoiceMetaData = {
  reference: "",
  due_date:"",
  invoice_date:"",
  partner: {
    id:"",
    first_name:"",
    last_name:"",
  },
  invoice_type: 'ACHAT',
  payment_method: 'CHEQUE',
  expected_check_number: '',
  expected_check_date: ''
}

 const initialInvoiceItems: InvoiceItemsDataSection = {
  invoice_items:[],
    amount_type:'HT',
    amount_ttc:0,
    amount_ht:0,
    total_vat: 0
}


const [invoiceForm, setInvoiceForm] = useState<InvoiceCreate>({
  id: '',
  invoice_metadata:initialInvoiceMetadata,
 invoice_items: initialInvoiceItems ,
  transactions: [] ,
})


  // Sélection de la transaction active pour le reçu (la sélectionnée, ou par défaut la dernière de la liste)
 const activeInvoiceItem = (invoiceForm.invoice_items?.invoice_items|| []).find(
  (it) => it.id === selectedInvoiceItemId
)
const activeTransaction = (invoiceForm?.transactions || []).find(
  (t) => t.id === selectedTransactionId
)
   // || projectForm.financial_details.transactions[projectForm.financial_details.transactions.length - 1];
  const STEPS = [
  { id: 1, name: 'Informations Générales', description: 'Infos de base' },
  { id: 2, name: 'Articles & Montants', description: 'Détails des montants des articles' },
  { id: 3, name: 'Réglements', description: 'réglements' }
]
const mapInvoiceToForm = (invoice: InvoiceTableRead): InvoiceCreate=> ({
  id: invoice.id ?? '',
  invoice_metadata: {
    reference: invoice.reference ?? '',
    partner: invoice?.partner,
    invoice_date: invoice.invoice_date ?? '',
    due_date: invoice.due_date ?? '',
    payment_method: invoice.payment_method,
    expected_check_number: invoice.payment_reference ,
    expected_check_date: invoice.expected_check_date
  },

  invoice_items: {
    amount_type: 'HT',
    amount_ttc: invoice.amount_ttc,
    amount_ht: invoice.amount_ht,
    total_vat: invoice.total_vat,
    invoice_items: invoice?.invoice_items},
  transactions: invoice?.transactions

})
  useEffect(() => {
    if (invoice && isOpen) {
      // Map project data to form data
      const formData = mapInvoiceToForm(invoice)

    setInvoiceForm(formData)
    console.log("Mapped Form Data:", formData)
    setSavedSnapshot(JSON.stringify(buildPayload(formData)))
    setIsSaved(true)
      
      setCurrentStep(1);
    } else if (isOpen) {
      setInvoiceForm(invoiceForm);
      setCurrentStep(1);
      }
  }, [invoice, isOpen]);
  



 const [selectedTransaction, setSelectedTransaction] =
  useState<any| null>(null)

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
       onSuccess?.({
        ...invoiceForm
      })
      onClose()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepComplete = () => {
    if (currentStep === 1) {
      const invoiceValid = !!(invoiceForm.invoice_metadata?.invoice_date && invoiceForm.invoice_metadata?.due_date);
      
      return invoiceValid;
    }
    
    if (currentStep === 2) {
      return invoiceForm.invoice_items?.invoice_items && invoiceForm.invoice_items.invoice_items.length > 0;
    }
    
    if (currentStep === 3) {
      return invoiceForm.transactions && invoiceForm.transactions.length > 0;
    }
    
    return true;
  }

  const buildPayload = (invoiceForm: InvoiceCreate) => {
  const invoice_items = invoiceForm.invoice_items
  const transactions = invoiceForm.transactions
  const cleanTransactions = (transactions ?? []) .map((trans: any) => {
  const { local_id, ...cleantrans} = trans

  return {
    ...cleantrans,
  }
})
  const cleanInvoiceItems = (invoice_items?.invoice_items?? []).map((it: any) => {
  const { local_id, amount_type, ...cleanIt } = it

  return {
    ...cleanIt,
  }
})

  return {
    
    invoice_items: cleanInvoiceItems ,
    transactions: cleanTransactions
  }
}

const getChangedPayload = (currentPayload: any, savedPayload: any) => {
  if (!savedPayload) return currentPayload

  const changed: any = {}

  Object.keys(currentPayload).forEach((key) => {
    if (JSON.stringify(currentPayload[key]) !== JSON.stringify(savedPayload[key])) {
      changed[key] = currentPayload[key]
    }
  })

  return changed
}

const injectCreatedInvoiceIds = (
  prev: InvoiceCreate,
  createdInvoice: InvoiceTableRead
): InvoiceCreate=> {
  const savedTransactions = createdInvoice.transactions ?? []
  const savedInvoiceItems = createdInvoice.invoice_items
 

  return {
    ...prev,
    id: createdInvoice.id,
    invoice_items:
    
   { 
    ...prev.invoice_items,
    
    invoice_items: prev.invoice_items?.invoice_items?.map((invoiceItem, index) => {
  const savedInvoiceItem = savedInvoiceItems[index]

  return {
    ...invoiceItem,

    id: savedInvoiceItem?.id || invoiceItem.id,

} 
})
  },
  transactions: prev.transactions?.map((transaction, index) => {
  const savedTransaction = savedTransactions[index]

  return {
    ...transaction,

    id: savedTransaction?.id || transaction.id,

} }),
  
  }
}
const handleSave_ = async () => {
  try {
    setIsSaving(true)

    const currentPayload = buildPayload(invoiceForm)
    console.log("build Payload", currentPayload)

    if (!invoiceForm.id) {
      // CREATE
    if (!invoiceForm.id) {
      try {
        const createdInvoice = await createInvoice(currentPayload)

        setInvoiceForm((prev) => {
          const nextInvoiceForm = injectCreatedInvoiceIds(prev, createdInvoice)
          setSavedSnapshot(JSON.stringify(buildPayload(nextInvoiceForm)))
          return nextInvoiceForm
        })

        setIsSaved(true)
        toast.success("Facture créé avec succès")
        return
      } catch (error) {
        console.error(error)
        toast.error("Erreur lors de la création de la facture")
        return
      }
    }
    }

    const savedPayload = savedSnapshot ? JSON.parse(savedSnapshot) : null
    console.log(`current Paload: ${currentPayload}`)
    console.log(currentPayload)
    const changedPayload = getChangedPayload(currentPayload, savedPayload)
  
    if (Object.keys(changedPayload).length === 0) {
      toast.info("Aucune modification à enregistrer")
      return
    }
    console.log(`changed Payload:`)
    console.log(changedPayload)
    const firstConfirm = window.confirm(
  "Vous êtes sur le point de modifier une facture déjà enregistré. Voulez-vous continuer ?"
)

  if (!firstConfirm) return

  const secondConfirm = window.confirm(
  "Ces modifications seront enregistrées dans la base de données. Confirmez-vous ?"
)

  if (!secondConfirm) return
try{    
  const updatedInvoice = await updateInvoice(
  invoiceForm.id,
  changedPayload
)
setInvoiceForm((prev) => {
  const nextInvoiceForm = injectCreatedInvoiceIds(
    prev,
    updatedInvoice
  )
 

  setSavedSnapshot(JSON.stringify(buildPayload(nextInvoiceForm)) )

  return nextInvoiceForm
})
setIsSaved(true)
toast.success("Facture modifiée avec succès")

} catch (error) {
      console.error(error)
      toast.error("Erreur lors de la modification de la facture")
    }

  } finally {
    setIsSaving(false)
  }
}
  
 
  
const generateReceiptData = (
  InvoiceItems: InvoiceItem []
) => {
  const client = invoiceForm.invoice_metadata?.partner

  return {
    receiptNumber: "transaction.id"
  }
}

 
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={invoice ? "Modifier la Facture" : "Nouvelle Facture"}
      description={invoice ? `Modification du dossier ${invoice.reference}` : "Suivez les étapes pour créer une facture complète."}
      maxWidth="2xl"
    >
      <div className="p-6 space-y-8">
        {/* Step Indicator */}
        <div className="flex justify-between items-start gap-4 relative">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1 z-10">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all mb-2",
                  step.id <= currentStep ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
                )}
              >
                {step.id}
              </div>
              <div className="text-center">
                <h4 className="font-bold text-[10px] uppercase tracking-wider text-slate-900">{step.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 hidden sm:block">{step.description}</p>
              </div>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-100 -z-0 mx-10">
            <div 
              className="h-full bg-brand-600 transition-all duration-300" 
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">

          {currentStep === 1 && (
           <InvoiceMetaDataSection value= {invoiceForm.invoice_metadata} reference={invoiceForm.invoice_metadata.reference} onChange={(updatedInvoiceMetaData) =>
                setInvoiceForm((prev) => ({
                    ...prev,
                    invoice_metadata: updatedInvoiceMetaData
                }))

           }/>
          )}

          {currentStep === 2 && (
           <InvoiceItemsSection value= {invoiceForm.invoice_items} onChange={(updatedInvoiceItems) =>
                setInvoiceForm((prev) => ({
                    ...prev,
                    invoice_items: updatedInvoiceItems
                }))

           }/>
          )}
          {currentStep === 3 && (
           <InvoiceTransactionSection value= {invoiceForm.transactions} invoice_amount ={invoiceForm.invoice_items?.amount_ttc} onChange={(updatedTransaction) =>
                setInvoiceForm((prev) => ({
                    ...prev,
                   transactions: updatedTransaction
                }))

           }/>
          )}

        </div>

       {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex justify-start">
            <Button 
              variant="outline"
              onClick={currentStep > 1 ? handleBack : onClose}
              className="rounded-xl border-slate-100 text-slate-600 font-bold uppercase text-[10px] px-4 h-10 flex items-center gap-2 hover:bg-slate-50 transition-all"
            >
              <ChevronLeft size={14} />
              Retour
            </Button>
          </div>
<div className="flex items-center gap-3">
            <Button 
              variant="ghost"
              disabled={false}
              onClick={() => {
              handleSave_()
                
  
              }}
              className="rounded-xl bg-slate-100 text-slate-500 font-bold uppercase text-[10px] px-6 h-10 flex items-center gap-2 hover:bg-slate-200 hover:text-slate-700 transition-all disabled:opacity-50"
            >
              {isSaving ? <Clock size={14} className="animate-spin text-brand-600" /> : <Save size={14} />}
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={!isStepComplete()}
              className="rounded-xl bg-slate-900 hover:bg-black text-white font-bold uppercase text-[10px] px-8 h-10 flex items-center gap-2 shadow-lg shadow-slate-200 transition-all disabled:opacity-50"
            >
              {currentStep === 3 ? 'Valider la facture' : 'Avancer'}
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
      
            
    </Modal>
  )
}