'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft, Save, Clock } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {Project} from '@/types'
import {ProjectTypeRead} from '@/types'
import {FinancialDetails} from '@/types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import TopoMetadataSection from './components/TopoMetadaSection'
import ClientSection from './components/ClientSection'
import FinancialDetailsSection from './components/FinancialDetailsSection'
import FieldInterventionsSection from './components/fieldInterventionsSection'     
import OverviewSection from './components/overviewSection'
import OfficeWorkSection from './components/officeInterventionsSection'
import { numberToWordsFrench } from '@/lib/numberToWordsFrench'
import {TopoMetadata, Transaction} from '@/types'
import { createProject, updateProject } from '../../api/ProjectService'
import { toast } from "sonner"
import { ProjectTableReadPayload } from '../projectTable/types'


interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
   project?: any // Si on veut pré-remplir le formulaire pour modification
}

export default function AddProjectModal({ isOpen, onClose, onSuccess, project }: AddProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [activeTab, setActiveTab] = useState('topo')
  
  // État pour cibler la transaction spécifique dont on veut générer/afficher le reçu
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)
  const [savedSnapshot, setSavedSnapshot] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
   const [isSaved, setIsSaved] = useState(false)
  // initialize Project Type
  const initialProjectType: ProjectTypeRead = {
    id: "",
    name:"",
    code:"",
    color:"",
    description:"",
    is_active: true,
    is_by_default: false


 }
 // initialize Topo Meta Data
 const initialTopoMetadata: TopoMetadata = {
  projectType: initialProjectType,
  region:{id:"",name:""},
  province:{id:"",name:""},
  commune: {id:"",name:""},
  lieu_dit: {id:"",name:""},
  registry_type: 'I',
  title_number: '',
  title_index: '',
  place_name: '',
  document_type: '',
  designation: '',
  coordinates: [],
  system_coordinates: [],
  reference_system: {
    id: "",
    name:""
  },
  reference_benchmark: '',
  system_zone: 'I',
  system_notes: '',
}

// initialize FinincialDetails 
const initialFinancialDetails : FinancialDetails ={

amountType :"HT",
amount_ht: 0,
amount_ttc:0,
vat_rate:20,
is_tax_exempt:false,
is_pro_bono:false,
transactions :[]


}
const [projectForm, setProjectForm] = useState<Project>({
  id: '',
  reference:'',
  clients: [] ,
  topo_metadata: initialTopoMetadata,
  financial_details: initialFinancialDetails,
  field_interventions: [],
  office_works: [],
})
// Extraction du premier client ou fallback vide
  const primaryClient = projectForm.clients && projectForm.clients.length > 0 ? projectForm.clients[0] : null;

  // Sélection de la transaction active pour le reçu (la sélectionnée, ou par défaut la dernière de la liste)
  const activeTransaction = projectForm.financial_details.transactions.find(t => t.id === selectedTransactionId) 
    || projectForm.financial_details.transactions[projectForm.financial_details.transactions.length - 1];
  const STEPS = [
  { id: 1, name: 'Ouverture', description: 'Infos de base' },
  { id: 2, name: 'Terrain', description: 'Sorties Terrain' },
  { id: 3, name: 'Bureau', description: 'Travaux Bureau' },
  { id: 4, name: 'Validation', description: 'Validation finale' },
]
const mapProjectToForm = (project: ProjectTableReadPayload): Project => ({
  id: project.id ?? '',
  reference: project.reference ?? '',

  clients: project.clients ?? [],

  topo_metadata: {
    ...initialTopoMetadata,
    ...(project.topo_metadata ?? {}),

    projectType: {
      id: project.project_type?.id ?? '',
      name: project.project_type?.name ?? '',
      code: '',
      color: '',
      description: '',
      is_active: true,
      is_by_default: false,
    },

    commune: project.topo_metadata?.commune ?? {
      id: project.topo_metadata?.commune?.id ?? '',
      name: project.topo_metadata?.commune?.name ?? '',
    },

    coordinates: project.topo_metadata?.coordinates ?? [],
    system_coordinates: project.topo_metadata?.system_coordinates ?? [],
  },

  financial_details: {
    ...initialFinancialDetails,
    ...(project.financial_details ?? {}),
    amountType: 'HT',
    transactions: project.financial_details?.transactions ?? [],
  },

  field_interventions: project.field_interventions ?? [],
  office_works: project.office_works ?? [],
})
  useEffect(() => {
    if (project && isOpen) {
      // Map project data to form data
      const formData = mapProjectToForm(project)

    setProjectForm(formData)
    console.log("Mapped Form Data:", formData)
    setSavedSnapshot(JSON.stringify(buildPayload(formData)))
    setIsSaved(true)
      
      setCurrentStep(1);
    } else if (isOpen) {
      setProjectForm(projectForm);
      setCurrentStep(1);
      }
  }, [project, isOpen]);
  



 const overviewData = {
  projectID: projectForm.id,

  clients: projectForm.clients,

  projectType: projectForm.topo_metadata.projectType.name,
  localisation:  projectForm.topo_metadata.commune.name,
  amountHT: projectForm.financial_details.amount_ht,
  amountTTC: projectForm.financial_details.amount_ttc,
  vatRate: projectForm.financial_details.vat_rate,
  isTaxExempt: projectForm.financial_details.is_tax_exempt,
  isProBono: projectForm.financial_details.is_pro_bono,
  transactions:  projectForm.financial_details.transactions, 
  field_interventions: projectForm.field_interventions,
  office_works: projectForm.office_works,
  Documents: []
}
 const [selectedTransaction, setSelectedTransaction] =
  useState<Transaction | null>(null)

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
       onSuccess?.({
        ...projectForm,
        clients: projectForm.clients
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
      const projetValid = !!(projectForm.topo_metadata.projectType && projectForm.topo_metadata.commune);
      const clientValid = projectForm.clients && projectForm.clients.length > 0;
      return projetValid && clientValid;
    }
    
    if (currentStep === 2) {
      return projectForm.field_interventions && projectForm.field_interventions.length > 0;
    }
    
    if (currentStep === 3) {
      return projectForm.office_works && projectForm.office_works.length > 0;
    }
    
    return true;
  }

  const buildPayload = (projectForm: Project) => {
  const { amountType, ...financial_details } = projectForm.financial_details

  const {
    projectType,
    commune,
    region,
    province,
    ...topo_metadata_
  } = projectForm.topo_metadata
  console.log("Topo Metadata for Payload:", topo_metadata_)

  return {
    project_type_id: projectType.id,
    project_type_code: projectType.code,
    clients: projectForm.clients,
    topo_metadata: {
      ...topo_metadata_,
      commune_id: commune.id,
      region_id: region.id,
      province_id: province.id,
    },
    financial_details,
    field_interventions: projectForm.field_interventions,
    office_works: projectForm.office_works,
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

const injectCreatedProjectIds = (
  prev: Project,
  createdProject: any
): Project => {
  const savedTransactions = createdProject.financial_details?.transactions ?? []
  const savedTopo = createdProject.topo_metadata
  const savedCoordinates = savedTopo?.coordinates ?? []
  console.log("Saved Topo Metadata from Server:", savedTopo)
  const savedSystemCoordinates = savedTopo?.system_coordinates ?? []
  console.log("Saved Topo Metadata from Server:", savedTopo)
  const savedFieldInterventions = createdProject.field_interventions ?? []
  const savedOfficeWorks = createdProject.office_works ?? []

  return {
    ...prev,
    id: createdProject.id,
    reference: createdProject.reference,

    topo_metadata: {
      ...prev.topo_metadata,
      id: savedTopo?.id ?? prev.topo_metadata.id,

      coordinates: prev.topo_metadata.coordinates.map((coord, index) => ({
        ...coord,
        id: savedCoordinates[index]?.id ?? coord.id,
      })),

      system_coordinates: prev.topo_metadata.system_coordinates.map((coord, index) => ({
        ...coord,
        id: savedSystemCoordinates[index]?.id ?? coord.id,
      })),
    },

    financial_details: {
      ...prev.financial_details,
      id: createdProject.financial_details?.id ?? prev.financial_details.id,

      transactions: prev.financial_details.transactions.map((transaction, index) => ({
        ...transaction,
        id: savedTransactions[index]?.id ?? transaction.id,
        reference_number: savedTransactions[index]?.reference_number?? transaction.reference_number
      })),
    },

    field_interventions: prev.field_interventions.map((intervention, index) => ({
      ...intervention,
      id: savedFieldInterventions[index]?.id ?? intervention.id,
    })),

    office_works: prev.office_works.map((work, index) => ({
      ...work,
      id: savedOfficeWorks[index]?.id ?? work.id,
    })),
  }
}
const handleSave_ = async () => {
  try {
    setIsSaving(true)

    const currentPayload = buildPayload(projectForm)

    if (!projectForm.id) {
      // CREATE
    if (!projectForm.id) {
      try {
        const createdProject = await createProject(currentPayload)

        setProjectForm((prev) => {
          const nextProjectForm = injectCreatedProjectIds(prev, createdProject)
          setSavedSnapshot(JSON.stringify(buildPayload(nextProjectForm)))
          return nextProjectForm
        })

        setIsSaved(true)
        toast.success("Projet créé avec succès")
        return
      } catch (error) {
        console.error(error)
        toast.error("Erreur lors de la création du projet")
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
  "Vous êtes sur le point de modifier un projet déjà enregistré. Voulez-vous continuer ?"
)

  if (!firstConfirm) return

  const secondConfirm = window.confirm(
  "Ces modifications seront enregistrées dans la base de données. Confirmez-vous ?"
)

  if (!secondConfirm) return
try{    
  const updatedProject = await updateProject(
  projectForm.id,
  changedPayload
)
setProjectForm((prev) => {
  const nextProjectForm = injectCreatedProjectIds(
    prev,
    updatedProject
  )

  setSavedSnapshot(JSON.stringify(buildPayload(nextProjectForm)) )

  return nextProjectForm
})
setIsSaved(true)
toast.success("Projet modifié avec succès")

} catch (error) {
      console.error(error)
      toast.error("Erreur lors de la modification du projet")
    }

  } finally {
    setIsSaving(false)
  }
}
  
  const handleSave = async () => {
  // 1. Début de l'enregistrement
  setIsSaving(true);
  setIsSaved(false); // On réinitialise l'état sauvegardé au cas où

  const clients = projectForm.clients
  const { amountType, ...financial_details } = projectForm.financial_details
  const { projectType, commune, ...topo_metadata_ } = projectForm.topo_metadata
  const topo_metadata = { ...topo_metadata_, commune_id: commune.id }
  const field_interventions = projectForm.field_interventions
  const office_works = projectForm.office_works
  const project_type_id = projectType.id
  console.log("Données envoyées au serveur :", {
    clients,
    financial_details,
    topo_metadata,
    field_interventions,
    office_works
  })
  const payload = {
    project_type_id,
    clients,
    topo_metadata,
    financial_details,
    field_interventions,
    office_works,
  }

  console.log("PROJECT PAYLOAD:", payload)

  const createdProject = await createProject(payload)

  //console.log("CREATED PROJECT:", createdProject)

  // 2. MOCK de la réponse du serveur (Génération des IDs)
  const mockProjectId = projectForm.id || `PRJ-${Math.floor(100000 + Math.random() * 900000)}`

  // Génération d'un ID uniquement pour les nouvelles transactions
  const updatedTransactions = projectForm.financial_details.transactions.map((transaction, index) => {
    if (!transaction.id) {
      return {
        ...transaction,
        id: `TX-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`
      }
    }
    return transaction
  })

  // 3. Mise à jour de l'état global du formulaire
  setProjectForm((prev) => ({
    ...prev,
    id: mockProjectId,
    financial_details: {
      ...prev.financial_details,
      transactions: updatedTransactions
    }
  }))

  // 4. Fin de l'enregistrement (placé en dehors de la boucle)
  // Dans un vrai environnement, cela se ferait dans le `.then()` ou après le `await` de votre API
  setIsSaved(true);
  setIsSaving(false);

  console.log("Données enregistrées avec succès !", {
    projectId: mockProjectId,
    transactions: updatedTransactions
  })
}

  
const generateReceiptData = (transaction: Transaction) => {
  const client = projectForm.clients[0]

  return {
    receiptNumber: transaction.payment_mode,

    transactionAmount: transaction.amount,

    paymentMethod: transaction.payment_mode,

    transactionDate: "2025-05-02",
    totalTTC: projectForm.financial_details.amount_ttc,


    clientName:
      client?.client_type === "Moral"
        ? client.company_name
        : `${client?.first_name} ${client?.last_name}`,

    clientIdentifier:
      client?.client_type === "Moral"
        ? client.ice
        : client?.cin,

  }
}

 
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={project ? "Modifier le Projet" : "Nouveau Projet"}
      description={project ? `Modification du dossier ${project.reference}` : "Suivez les étapes pour créer un dossier topographique complet."}
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
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="topo">Projet</TabsTrigger>
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="finance">Paiement</TabsTrigger>
              </TabsList>

              <TopoMetadataSection value={projectForm.topo_metadata} reference = {projectForm.reference} onChange={(updatedTopo) =>
                    setProjectForm((prev) => ({
                    ...prev,
                    topo_metadata: updatedTopo
                    }))
                } />
              <ClientSection value={projectForm.clients} onChange={(updatedClients) =>
                    setProjectForm((prev) => ({
                    ...prev,
                    clients: updatedClients,
                    }))
                }/>

              <FinancialDetailsSection value={projectForm.financial_details}
               isSaved={isSaved} 
                onViewReceipt={(transaction) => {
                    setSelectedTransaction(transaction)
                  }}
                onChange={(updatedPaymentInfo) =>
                    setProjectForm((prev) => ({
                    ...prev,
                    financial_details: updatedPaymentInfo,
                    })) 
                } />
            </Tabs>
          )}

          {currentStep === 2 && (
           <FieldInterventionsSection value= {projectForm.field_interventions} onChange={(updatedfieldInter) =>
                setProjectForm((prev) => ({
                    ...prev,
                    field_interventions: updatedfieldInter
                }))

           }/>
          )}

          {currentStep === 3 && (
            <OfficeWorkSection value={projectForm.office_works} onChange={
                (updatedofficeWorks) =>
                setProjectForm((prev) => ({
                    ...prev,
                    office_works: updatedofficeWorks
                }))
            }/>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Aperçu Général & Validation</h3>
                <Badge  className="bg-brand-50 text-brand-700 border-brand-100 px-3 py-1">
                  Dernière étape
                </Badge>
              </div>

             <OverviewSection value= {overviewData} />
            </div>
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
              {currentStep === 4 ? 'Créer le Projet' : 'Avancer'}
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
      {/* Render Template for Capture - Hidden via overflow and height */}
            <div style={{ height: 0, overflow: 'hidden', position: 'absolute', zIndex: -1000 }}>
              <div 
                id="receipt-template" 
                style={{ 
                  width: '794px', 
                  minHeight: '1123px',
                  padding: '60px', 
                  backgroundColor: 'white', 
                  color: 'black', 
                  fontFamily: 'serif',
                  display: 'block'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', borderBottom: '2px solid #0b273f', paddingBottom: '20px', marginBottom: '30px', gap: '30px' }}>
                  <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="48" stroke="#0b273f" strokeWidth="4"/>
                    <path d="M50 10V90" stroke="#0b273f" strokeWidth="2" strokeDasharray="4 4"/>
                    <path d="M10 50H90" stroke="#0b273f" strokeWidth="2" strokeDasharray="4 4"/>
                    <rect x="35" y="35" width="30" height="30" stroke="#0b273f" strokeWidth="4"/>
                    <circle cx="50" cy="50" r="5" fill="#0b273f"/>
                  </svg>
                  <div style={{ fontSize: '14px', color: '#0b273f', lineHeight: '1.6' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '18px' }}>Cabinet Albiruni des études topographiques — IGT : Mohamed Albiruni</p>
                    <p style={{ margin: '5px 0' }}>ICE : 001234567000089</p>
                    <p style={{ margin: 0 }}>Rabat, Maroc — +212 6 XX XX XX XX — contact@pilotop.ma</p>
                  </div>
                </div>
      
                {/* Title & Metadata */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <h2 style={{ fontSize: '30px', fontWeight: 'bold', textDecoration: 'none', color: '#0b273f', border: '1px solid #0b273f', display: 'inline-block', padding: '10px 40px', margin: '0 auto 20px auto' }}>REÇU DE PAIEMENT</h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', maxWidth: '90%', margin: '0 auto', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <p><strong>N° REÇU :</strong> {selectedTransaction?.reference_number || 'N/A'}</p>
                    <p><strong>DATE :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                  <p style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>RÉFÉRENCE DOSSIER : {projectForm.reference || 'Nouveau Projet'}</p>
                </div>
      
                {/* Content */}
                <div style={{ margin: '30px 0', fontSize: '15px', lineHeight: '1.8' }}>
                  <p style={{ borderBottom: '1px dotted #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
                    <strong>Reçu de M. / Mme / Société :</strong> 
                    <span style={{ marginLeft: '10px', fontSize: '16px' }}>
                      {primaryClient 
                  ? `${primaryClient.first_name} ${primaryClient.last_name} ${primaryClient.cin ? `(CIN: ${primaryClient.cin})` : primaryClient.ice ? `(ICE: ${primaryClient.ice})` : ''}`
                  : '................................................................'}
                    </span>
                  </p>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px', marginBottom: '30px' }}>
                    <tbody>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <td style={{ padding: '15px', border: '1px solid #e2e8f0', width: '60%' }}><strong>Total du Devis / Projet (TTC)</strong></td>
                        <td style={{ padding: '15px', border: '1px solid #e2e8f0', textAlign: 'right', fontSize: '16px' }}>
                         {projectForm.financial_details.amount_ttc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                        </td>
                      </tr>
                      <tr style={{ backgroundColor: '#f1f5f9' }}>
                        <td style={{ padding: '15px', border: '1px solid #e2e8f0' }}><strong>Montant encaissé</strong></td>
                        <td style={{ padding: '15px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#0f172a' }}>
                         {(selectedTransaction?.amount || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                        </td>
                      </tr>
                     
                    </tbody>
                  </table>
      
                  <div style={{ marginTop: '30px', padding: '10px 0' }}>
                    <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic' }}>
                      Arrêté le présent reçu à la somme de : <br/>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginTop: '10px', color: '#0b273f' }}>
                       {numberToWordsFrench(selectedTransaction?.amount || 0)}
                      </span>
                    </p>
                  </div>
      
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                    <p><strong>Mode de paiement :</strong> {selectedTransaction?.payment_mode || 'Non spécifié'}</p>
                    <p><strong>Motif :</strong> {projectForm.topo_metadata.projectType.name || 'Prestation Topographique'}</p>
                  </div>
                  <p style={{ marginTop: '10px' }}><strong>Objet :</strong> Levé de la propriété sise à {projectForm.topo_metadata.place_name || projectForm.topo_metadata.commune.name || '...'}</p>
                </div>
      
                {/* Signatures */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '80px' }}>
                  <div style={{ textAlign: 'center', width: '250px' }}>
                    <p style={{ paddingBottom: '10px', marginBottom: '100px', fontWeight: 'bold' }}>LA DIRECTION</p>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>(Signature et Cachet)</p>
                  </div>
                  <div style={{ textAlign: 'center', width: '250px' }}>
                    <p style={{ paddingBottom: '10px', marginBottom: '100px', fontWeight: 'bold' }}>LE CLIENT</p>
                    <p style={{ fontSize: '10px', color: '#64748b' }}>(Signature précédée de la mention "Lu et approuvé")</p>
                  </div>
                </div>
      
                <div style={{ marginTop: '100px', fontSize: '10px', color: '#94a3b8', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                  Bureau d'Études Topographiques agréé par l'Ordre National des Ingénieurs Géomètres Topographes (ONIGT).
                </div>
              </div>
            </div>
    </Modal>
  )
}
