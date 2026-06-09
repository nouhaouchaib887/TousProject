'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { numberToWordsFrench } from '@/lib/numberToWordsFrench'
import { Search, Plus, ChevronRight, ChevronLeft, Save, X, Info, User, MapPin, CreditCard, ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, FileText, Calendar, Building2, Wallet, Eye, Printer, Download, Check } from 'lucide-react'
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
import { toast } from 'sonner' 
import { ScrollArea } from '@/components/ui/scroll-area'


const PROJECT_TYPES = [
  { id: '1', name: 'Levé Topographique', abbreviation: 'LT', color: '#0b273f' },
  { id: '2', name: 'Bornage', abbreviation: 'BR', color: '#10b981' },
  { id: '3', name: 'Cadrage', abbreviation: 'CD', color: '#f59e0b' },
  { id: '4', name: 'Mise en concordance', abbreviation: 'MC', color: '#8b5cf6' },
  { id: '5', name: 'Copropriété', abbreviation: 'CP', color: '#ec4899' },
  { id: '6', name: 'V.R.D', abbreviation: 'VRD', color: '#f43f5e' },
];

const LOCATIONS_DATA = [
  {
    name: 'Casablanca-Settat',
    provinces: [
      {
        name: 'Casablanca',
        communes: ['Anfa', 'Maarif', 'Sidi Belyout', 'Ain Chock', 'Hay Hassani']
      },
      {
        name: 'Nouaceur',
        communes: ['Bouskoura', 'Dar Bouazza', 'Nouaceur', 'Oulad Salah']
      },
      {
        name: 'Settat',
        communes: ['Settat', 'Oulad Said', 'Oulad Mrah']
      }
    ]
  },
  {
    name: 'Rabat-Salé-Kénitra',
    provinces: [
      {
        name: 'Rabat',
        communes: ['Agdal-Ryad', 'Souissi', 'Youssoufia']
      },
      {
        name: 'Salé',
        communes: ['Bab Lamrisa', 'Layayda', 'Tabriquet', 'Haine']
      },
      {
        name: 'Kénitra',
        communes: ['Kénitra', 'Mehdya', 'Souk El Arbaa']
      }
    ]
  },
   {
    name: 'Marrakech-Safi',
    provinces: [
      {
        name: 'Marrakech',
        communes: ['Gueliz', 'Medina', 'Sidi Youssef Ben Ali', 'Targa']
      },
      {
        name: 'Safi',
        communes: ['Safi', 'Bouguedra', 'Jemaat Shaim']
      }
    ]
  }
];
const MOCK_BACKEND_CLIENTS = [
  { id: '101', name: 'Alami Mohamed', cin: 'AB123456', type: 'Particulier' },
  { id: '102', name: 'Bennani Sarah', cin: 'CD789012', type: 'Particulier' },
  { id: '103', name: 'S.A.R.L. Atlas Construction', cin: 'RC45678', type: 'Entreprise' },
  { id: '104', name: 'Oumaima El Fassy', cin: 'EF112233', type: 'Particulier' },
  { id: '105', name: 'Immobilier Confort', cin: 'RC99887', type: 'Entreprise' },
];
const STEPS = [
  { id: 1, name: 'Ouverture', description: 'Infos de base' },
  { id: 2, name: 'Terrain', description: 'Sorties Terrain' },
  { id: 3, name: 'Bureau', description: 'Travaux Bureau' },
  { id: 4, name: 'Validation', description: 'Validation finale' },
]

// Simple Searchable Select Component
interface SearchableSelectProps {
  options: string[] | { id: string, name: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  disabled?: boolean;
}

function SearchableSelect({ options, value, onChange, placeholder, label, disabled }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(opt => {
    const name = typeof opt === 'string' ? opt : opt.name;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const displayValue = typeof options[0] === 'object' 
    ? (options as any[]).find(o => o.id === value)?.name || value
    : value;

  return (
    <div className="relative space-y-1.5">
      {label && <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">{label}</Label>}
      <div 
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-sm transition-all focus-within:ring-2 focus-within:ring-brand-500 cursor-pointer overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={cn("truncate", !value && "text-slate-400")}>
          {displayValue || placeholder}
        </span>
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                autoFocus
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-xs border-none bg-slate-50 focus-visible:ring-0"
              />
            </div>
          </div>
          <ScrollArea className="max-h-[200px]">
            <div className="p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => {
                  const val = typeof opt === 'string' ? opt : opt.id;
                  const name = typeof opt === 'string' ? opt : opt.name;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-slate-50 transition-colors",
                        (typeof opt === 'string' ? opt === value : opt.id === value) && "bg-brand-50 text-brand-600"
                      )}
                      onClick={() => {
                        onChange(val);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <span className="font-medium">{name}</span>
                      { (typeof opt === 'string' ? opt === value : opt.id === value) && <Check className="h-3 w-3" />}
                    </div>
                  );
                })
              ) : (
                                <div className="px-3 py-4 text-center text-xs text-slate-400 italic">
                  Aucun résultat
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}



const availableAgents = [
  { id: '1', name: 'Ahmed Hassan' },
  { id: '2', name: 'Fatima Zahra' },
  { id: '3', name: 'Mohamed Ali' },
  { id: '4', name: 'Aziz Karim' },
]

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (data: any) => void
   project?: any // Si on veut pré-remplir le formulaire pour modification
}

export default function AddProjectModal({ isOpen, onClose, onSuccess, project }: AddProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [activeTab, setActiveTab] = useState('topo')
  const initialFormData = {
    clientCin: '',
    description: '',
    budget: '',
    projectName: '',
    projectType: '',
    projectAbbreviation: '',
    projectColor: '#0b273f',
    isSelectedByDefault: false,
    region: '',
    province: '',
    commune: '',
    propertyName: '',
    clientName: '',
    amount: 0,
    amountType: 'HT',
    tva: '20',
    isFree: false,
    landType: '',
    titleType: '',
    titleNumber: '',
    titleIndex: '',
    documentType: '',
    designation: '',
    coordinateX: '',
    coordinateY: '',
    advance: 0,
    transactions: [],
    interventions: [],
    officeInterventions: [],
    parcelles: [],
    coordonnées_s: [],
    attachmentSystem: {
      subsystem: '',
      zone: '',
      reference: '',
      observations: '',
    }
  }
  const [formData, setFormData] = useState<any>(initialFormData)
  const [activeReceiptTransaction, setActiveReceiptTransaction] = useState<any>(null);
  const [isPaymentSaved, setIsPaymentSaved] = useState(false)
    const [isSavingPayment, setIsSavingPayment] = useState(false)
   const [receiptNumber, setReceiptNumber] = useState('')
  const [receiptDate, setReceiptDate] = useState('')
  const [savedSnapshot, setSavedSnapshot] = useState<string>('')
   useEffect(() => {
    if (isOpen) {
      const currentFullState = JSON.stringify({ formData, selectedClients });
      setSavedSnapshot(currentFullState);
      
      // Reset payment status if it's a new project or reset
      if (!project) {
        setIsPaymentSaved(false);
      }
    }
  }, [isOpen]);

  const isFormDirty = () => {
    const currentFullState = JSON.stringify({ formData, selectedClients });
    return currentFullState !== savedSnapshot;
  };

  // Helper function to convert number to words in French (Simple version)
  const numberToWordsFr = (num: number): string => {
    if (num === 0) return 'Zéro';
    
    const units = ['', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf'];
    const tens = ['', 'Dix', 'Vingt', 'Trente', 'Quarante', 'Cinquante', 'Soixante', 'Soixante-dix', 'Quatre-vingt', 'Quatre-vingt-dix'];
    
    // This is a very basic implementation for typical payment amounts
    // For a real production app, it would be better to use a library or a complete algorithm
    if (num < 10) return units[num];
    if (num < 100) {
      if (num === 71) return 'Soixante et onze';
      if (num === 81) return 'Quatre-vingt-un';
      if (num === 91) return 'Quatre-vingt-onze';
      const t = Math.floor(num / 10);
      const u = num % 10;
      return tens[t] + (u > 0 ? (u === 1 && t < 8 ? ' et un' : '-' + units[u].toLowerCase()) : '');
    }
    
    // For now, let's returning a formatted string if complex
    return num.toLocaleString('fr-FR') + ' Dirhams';
  }
  const handleGenerateReceipt = async (transaction?: any) => {
    if (transaction) {
      setActiveReceiptTransaction(transaction);
      setReceiptNumber(transaction.receiptNumber);
      setReceiptDate(transaction.receiptDate);
    } else if (formData.transactions.length > 0) {
      // Fallback to last transaction if none provided (for the main button)
      const lastT = formData.transactions[formData.transactions.length - 1];
      setActiveReceiptTransaction(lastT);
      setReceiptNumber(lastT.receiptNumber || 'PENDING');
      setReceiptDate(lastT.receiptDate || new Date().toLocaleString('fr-FR'));
    }

    // Small delay to ensure state updates are reflected in the DOM before capture
    setTimeout(async () => {
      try {
        const { toCanvas } = await import('html-to-image');
      const { default: jsPDF } = await import('jspdf');

      const receiptElement = document.getElementById('receipt-template');
      if (!receiptElement) return;

      // Force render properties for capture
      const options = {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      };

      const canvas = await toCanvas(receiptElement, options);
      const dataUrl = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
    }, 100);
  };
  const handleSavePayment = () => {
    // Mock validation
    
    setIsSavingPayment(true);
    // Mock API call
    setTimeout(() => {
      const year = new Date().getFullYear();
      // Mark current transactions as saved
      const updatedTransactions = formData.transactions.map((t: any) => {
        if (!t.isSaved) {
          const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          return {
            ...t,
            isSaved: true,
            receiptNumber: `REC-${year}-${num}`,
            receiptDate: new Date().toLocaleString('fr-FR')
          };
        }
        return t;
      });

      setFormData({
        ...formData,
        transactions: updatedTransactions
      });
      setIsPaymentSaved(true);
      setIsSavingPayment(false);
       // Update snapshot after successful save
      const currentFullState = JSON.stringify({ formData, selectedClients });
      setSavedSnapshot(currentFullState);
    }, 1500);
  }
 const handleCommuneChange = (val: string) => {
    // Find region and province for this commune
    let foundRegion = '';
    let foundProvince = '';

    for (const region of LOCATIONS_DATA) {
      for (const province of region.provinces) {
        if (province.communes.includes(val)) {
          foundRegion = region.name;
          foundProvince = province.name;
          break;
        }
      }
      if (foundRegion) break;
    }
    setFormData((prev: any) => ({
      ...prev,
      commune: val,
      region: foundRegion || prev.region,
      province: foundProvince || prev.province
    }));
  };



  useEffect(() => {
    if (project && isOpen) {
      // Map project data to form data
      setFormData({
        ...initialFormData,
        projectName: project.id || '',
        projectType: project.type || '',
        region: project.details?.region || '',
        province: project.details?.province || '',
        commune: project.details?.commune || '',
        clientName: project.client ? `${project.client.firstName} ${project.client.lastName}` : '',
        amount: project.payment?.amountHT || 0,
        advance: project.payment?.advance || 0,
        landType: project.details?.landStatus || '',
        // ... add more mappings as needed
        
      });
       // Load current clients
      if (project.clients) {
        setSelectedClients(project.clients.map((c: any) => ({
          id: c.id || c.cin,
          name: `${c.firstName} ${c.lastName}`,
          ...c
        })));
      } else if (project.client) {
        const c = project.client;
        setSelectedClients([{
          id: c.id || c.cin,
          name: `${c.firstName} ${c.lastName}`,
          ...c
        }]);
      } else {
        setSelectedClients([]);
      }
      setCurrentStep(1);
    } else if (isOpen) {
      setFormData(initialFormData);
      setCurrentStep(1);
      setSelectedClients([]);
      }
  }, [project, isOpen]);
  const [validationChecks, setValidationChecks] = useState<any>({
    cin: false,
    immatricule: false,
    projection: false,
    documents: false,
    photos: false,
    coordinates: false,
    budget: false,
    agents: false,
  })

  const [availableTypes, setAvailableTypes] = useState([
    { name: 'Levé Topographique', abbreviation: 'LT', color: '#0b273f', isDefault: false },
    { name: 'Bornage', abbreviation: 'BR', color: '#10b981', isDefault: false },
    { name: 'Cadrage', abbreviation: 'CD', color: '#f59e0b', isDefault: false }
  ])
  const [newProjectType, setNewProjectType] = useState<any>({
    name: '',
    abbreviation: '',
    color: '#0b273f',
    isDefault: false,
  })

  const [selectedClients, setSelectedClients] = useState<any[]>([])
  const [newTransaction, setNewTransaction] = useState<any>({
    amount: 0,
    paymentMethod: "espèce",
    file: null,
  })

  const [newIntervention, setNewIntervention] = useState<any>({
    agents: [],
    agentsWithRoles: [],
    date: '',
    observations: '',
    file: null,
    selectedAgent: '',
    agentRole: '',
  })

  const [newOfficeIntervention, setNewOfficeIntervention] = useState<any>({
    agentsWithRoles: [],
    date: '',
    category: '',
    timeSpent: '',
    description: '',
    file: null,
    selectedAgent: '',
    agentRole: '',
  })

  const handleClientSuccess = (newClient: any) => {
    setSelectedClients([...selectedClients, newClient])
  };

   const handleAddTransaction = () => {
    if (newTransaction.amount > 0) {
      const transaction = {
        id: `trans_${Date.now()}`,
        date: new Date().toLocaleDateString('fr-FR'),
        amount: newTransaction.amount,
        paymentMethod: newTransaction.paymentMethod,
        file: newTransaction.file,
      };

      setFormData((prev: any) => ({
        ...prev,
        transactions: [...prev.transactions, transaction]
      }));

      setNewTransaction({ amount: 0, paymentMethod: "espèce", file: null });
      const fileInput = document.getElementById('transaction-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleRemoveTransaction = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      transactions: prev.transactions.filter((t: any) => t.id !== id)
    }));
  };

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
       onSuccess?.({
        ...formData,
        clients: selectedClients
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
      const projetValid = !!(formData.projectType && formData.commune);
      const clientValid = selectedClients && selectedClients.length > 0;
      return projetValid && clientValid;
    }
    
    if (currentStep === 2) {
      return formData.interventions && formData.interventions.length > 0;
    }
    
    if (currentStep === 3) {
      return formData.officeInterventions && formData.officeInterventions.length > 0;
    }
    
    return true;
  }

  const validationItems = [
    { id: "cin", label: "CIN du client fourni et validé" },
    { id: "immatricule", label: "Propriété immatriculée et titre vérifié" },
    { id: "projection", label: "Projection et système de coordonnées validés" },
    { id: "documents", label: "Tous les documents terrain sont attachés" },
    { id: "photos", label: "Photos et preuves visuelles collectées" },
    { id: "coordinates", label: "Coordonnées GPS et limites du site confirmées" },
    { id: "budget", label: "Budget et conditions de paiement acceptés" },
    { id: "agents", label: "Agents terrain et bureau assignés" },
  ];

  const totalItems = validationItems.length;
  const completedItems = Object.values(validationChecks).filter(Boolean).length;
  const progressPercentage = (completedItems / totalItems) * 100;

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setValidationChecks({
      ...validationChecks,
      [id]: checked
    });
  };
   const provincesForRegion = LOCATIONS_DATA.find(r => r.name === formData.region)?.provinces || [];
  const communesForProvince = provincesForRegion.find(p => p.name === formData.province)?.communes || [];

  const handleRegionChange = (val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      region: val,
      province: '',
      commune: ''
    }));
  };

  const handleProvinceChange = (val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      province: val,
      commune: ''
    }));
  };
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={project ? "Modifier le Projet" : "Nouveau Projet"}
      description={project ? `Modification du dossier ${project.id}` : "Suivez les étapes pour créer un dossier topographique complet."}
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

              <TabsContent value="topo" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Nom du Projet</Label>
                    <Input disabled placeholder={`PROJ-${Date.now().toString().slice(-6)}`} className="mt-1" />
                  </div>

                  <div className="col-span-2">
                    <SearchableSelect
                      label="Type de Projet *"
                      placeholder="Sélectionner un type..."
                      options={PROJECT_TYPES}
                      value={PROJECT_TYPES.find(t => t.name === formData.projectType)?.id || ''}
                      onChange={(id) => {
                        const typeObj = PROJECT_TYPES.find(t => t.id === id);
                        if (typeObj) {
                          setFormData({ 
                            ...formData, 
                            projectType: typeObj.name,
                            projectAbbreviation: typeObj.abbreviation,
                            projectColor: typeObj.color,
                            isSelectedByDefault: !!(typeObj as any).isDefault
                          })
                        }
                      }}
                    />
                    <div className="flex justify-end mt-1">
                      <Dialog>
                        <DialogTrigger >
                           <Button size="sm" variant="ghost" className="h-7 text-[10px] font-bold uppercase text-brand-600 hover:text-brand-700 hover:bg-brand-50 gap-1 px-2">
                            <Plus className="h-3 w-3" />
                            Nouveau Type
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Définir un Nouveau Type de Projet</DialogTitle>
                            <DialogDescription>
                              Configurez les paramètres par défaut pour ce nouveau type.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2 space-y-2">
                                <Label>Nom du Type *</Label>
                                <Input 
                                  placeholder="Ex: Levé Topographique" 
                                  value={newProjectType.name}
                                  onChange={(e) => setNewProjectType({...newProjectType, name: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Abréviation *</Label>
                                <Input 
                                  placeholder="Ex: LT" 
                                  value={newProjectType.abbreviation}
                                  onChange={(e) => setNewProjectType({...newProjectType, abbreviation: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Couleur associée</Label>
                                <div className="flex gap-2">
                                  <Input 
                                    type="color" 
                                    className="w-10 h-10 p-1"
                                    value={newProjectType.color}
                                    onChange={(e) => setNewProjectType({...newProjectType, color: e.target.value})}
                                  />
                                  <Input 
                                    value={newProjectType.color}
                                    onChange={(e) => setNewProjectType({...newProjectType, color: e.target.value})}
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="is-default-type" 
                                checked={newProjectType.isDefault}
                                onCheckedChange={(checked) => setNewProjectType({...newProjectType, isDefault: !!checked})}
                              />
                              <Label htmlFor="is-default-type">Sélectionner par défaut pour les dossiers de ce type</Label>
                            </div>
                            <Button className="w-full bg-brand-600 hover:bg-brand-700" onClick={() => {
                              if (newProjectType.name) {
                                // Simulate adding to backend list
                                PROJECT_TYPES.push({
                                  id: (PROJECT_TYPES.length + 1).toString(),
                                  name: newProjectType.name,
                                  abbreviation: newProjectType.abbreviation,
                                  color: newProjectType.color
                                });
                                setFormData({
                                  ...formData, 
                                  projectType: newProjectType.name,
                                  projectAbbreviation: newProjectType.abbreviation,
                                  projectColor: newProjectType.color,
                                  isSelectedByDefault: newProjectType.isDefault
                                })
                                setNewProjectType({ name: '', abbreviation: '', color: '#0b273f', isDefault: false })
                              }
                            }}>Enregistrer le Type</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>



                  <div>
                     <SearchableSelect
                      label="Région *"
                      placeholder="Sélectionner une région..."
                      options={LOCATIONS_DATA.map(r => r.name)}
                      value={formData.region}
                      onChange={handleRegionChange}
                    />
                  </div>

                  <div>
                     <SearchableSelect
                      label="Province *"
                      placeholder="Sélectionner une province..."
                      options={provincesForRegion.map(p => p.name)}
                      value={formData.province}
                      onChange={handleProvinceChange}
                      disabled={!formData.region}
                    />
                  </div>

                  <div>
                     <SearchableSelect
                      label="Commune *"
                      placeholder="Rechercher ou sélectionner..."
                      options={formData.province 
                        ? communesForProvince 
                        : LOCATIONS_DATA.flatMap(r => r.provinces.flatMap(p => p.communes))
                      }
                      value={formData.commune}
                      onChange={handleCommuneChange}
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase text-slate-500">Nom de la Propriété</Label>
                    <Input
                      placeholder="Ex: Terrain Al Karama"
                      value={formData.propertyName || ''}
                      onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold uppercase text-slate-500">Statut Foncier</Label>
                    <Select value={formData.landType} onValueChange={(val) => setFormData({ ...formData, landType: val })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immatriculed">Immatriculé</SelectItem>
                        <SelectItem value="requisition">Réquisition</SelectItem>
                        <SelectItem value="moulkia">Moulkia</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Immatriculé & Réquisition */}
                  {(formData.landType === 'immatriculed' || formData.landType === 'requisition') && (
                    <>
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500">N° Titre</Label>
                        <Input
                          placeholder="Numéro du titre"
                          value={formData.titleNumber || ''}
                          onChange={(e) => setFormData({ ...formData, titleNumber: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500">Indice</Label>
                        <Input
                          placeholder="Indice"
                          value={formData.titleIndex || ''}
                          onChange={(e) => setFormData({ ...formData, titleIndex: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}

                  {/* Moulkia */}
                  {formData.landType === 'moulkia' && (
                    <div className="col-span-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Type de Document</Label>
                      <Input
                        placeholder="Ex: Acte de vente, Dahir..."
                        value={formData.documentType || ''}
                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* Autre */}
                  {formData.landType === 'other' && (
                    <div className="col-span-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Désignation</Label>
                      <Input
                        placeholder="Désignation du document..."
                        value={formData.designation || ''}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
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
                          setFormData({
                            ...formData,
                            parcelles: [...(formData.parcelles || []), { x: '', y: '' }]
                          })
                        }}
                        className="gap-1 px-3"
                      >
                        <Plus className="h-4 w-4" />
                        Ajouter Parcelle
                      </Button>
                    </div>

                    {(formData.parcelles || []).length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-slate-100 rounded-xl text-center">
                        <p className="text-xs text-slate-400 italic">Aucune parcelle ajoutée</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.parcelles.map((parcelle: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-end p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex-1">
                              <Label className="text-[10px] font-bold uppercase text-slate-400">Parcelle {idx + 1} - X</Label>
                              <Input
                                placeholder="Ex: 31.6295"
                                type="number"
                                step="0.0001"
                                value={parcelle.x}
                                onChange={(e) => {
                                  const updated = [...formData.parcelles]
                                  updated[idx] = { ...updated[idx], x: e.target.value }
                                  setFormData({ ...formData, parcelles: updated })
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
                                  const updated = [...formData.parcelles]
                                  updated[idx] = { ...updated[idx], y: e.target.value }
                                  setFormData({ ...formData, parcelles: updated })
                                }}
                                className="mt-1 h-9 text-sm bg-white"
                              />
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  parcelles: formData.parcelles.filter((_: any, i: number) => i !== idx)
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
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500">Sous-système</Label>
                        <Select 
                          value={formData.attachmentSystem?.subsystem} 
                          onValueChange={(val) => setFormData({
                            ...formData,
                            attachmentSystem: { ...(formData.attachmentSystem || {}), subsystem: val }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="merchich">Merchich</SelectItem>
                            <SelectItem value="sahara">Sahara</SelectItem>
                            <SelectItem value="rif">Rif</SelectItem>
                            <SelectItem value="atlas">Atlas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Zone */}
                      <div>
                        <Label className="text-xs font-bold uppercase text-slate-500">Zone</Label>
                        <Select 
                          value={formData.attachmentSystem?.zone} 
                          onValueChange={(val) => setFormData({
                            ...formData,
                            attachmentSystem: { ...(formData.attachmentSystem || {}), zone: val }
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Sélectionner..." />
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
                          value={formData.attachmentSystem?.reference || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            attachmentSystem: { ...(formData.attachmentSystem || {}), reference: e.target.value }
                          })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* Coordonnées de système */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold uppercase text-slate-400">Coordonnées de système</h4>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              coordonnées_s: [...(formData.coordonnées_s || []), { x: '', y: '' }]
                            })
                          }}
                          className="gap-1 h-8 px-3"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Ajouter Coordonnées
                        </Button>
                      </div>

                      {(formData.coordonnées_s || []).length === 0 ? (
                        <div className="p-6 border-2 border-dashed border-slate-100 rounded-xl text-center">
                          <p className="text-xs text-slate-300 italic">Aucune coordonnée système</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formData.coordonnées_s.map((coord: any, idx: number) => (
                            <div key={idx} className="flex gap-4 items-end p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex-1">
                                <Label className="text-[10px] font-bold uppercase text-slate-400">Coord {idx + 1} - X</Label>
                                <Input
                                  placeholder="X"
                                  type="number"
                                  step="0.0001"
                                  value={coord.x}
                                  onChange={(e) => {
                                    const updated = [...formData.coordonnées_s]
                                    updated[idx] = { ...updated[idx], x: e.target.value }
                                    setFormData({ ...formData, coordonnées_s: updated })
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
                                    const updated = [...formData.coordonnées_s]
                                    updated[idx] = { ...updated[idx], y: e.target.value }
                                    setFormData({ ...formData, coordonnées_s: updated })
                                  }}
                                  className="mt-1 h-8 text-sm bg-white"
                                />
                              </div>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    coordonnées_s: formData.coordonnées_s.filter((_: any, i: number) => i !== idx)
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
                        value={formData.attachmentSystem?.observations || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            attachmentSystem: { ...(formData.attachmentSystem || {}), observations: e.target.value }
                          })
                        }}
                        className="mt-1 w-full p-2 border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[80px]"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

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
                          options={MOCK_BACKEND_CLIENTS.filter(c => !selectedClients.find(sc => sc.id === c.id)).map(c => ({
                            id: c.id,
                            name: `${c.name} (${c.cin})`
                          }))}
                          value=""
                          onChange={(id) => {
                            const client = MOCK_BACKEND_CLIENTS.find(c => c.id === id)
                            if (client) setSelectedClients([...selectedClients, { ...client, id: client.id }])
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

                    {selectedClients.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Clients Sélectionnés</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedClients.map(c => (
                            <Badge key={c.id}  className="gap-2 py-2 px-3 bg-white border border-slate-100 shadow-sm transition-all group hover:border-brand-200">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700">{c.name}</span>
                                <span className="text-[9px] text-slate-400">{c.cin}</span>
                              </div>
                              <X 
                                size={14} 
                                className="cursor-pointer text-slate-300 hover:text-rose-500 transition-colors" 
                                onClick={() => setSelectedClients(selectedClients.filter(sc => sc.id !== c.id))} 
                              />
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="finance" className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Row 1: Amount & Type */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Type de Montant</Label>
                    <Select value={formData.amountType} onValueChange={(val) => setFormData({ ...formData, amountType: val })}>
                      <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HT">Montant HT</SelectItem>
                        <SelectItem value="TTC">Montant TTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Montant Base (DH)</Label>
                    <Input 
                      type="number" 
                      disabled={formData.isFree}
                      value={formData.isFree ? 0 : formData.amount} 
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} 
                      className="h-10 bg-slate-50/50 border-slate-200" 
                    />
                  </div>

                  {/* Row 2: TVA & Gratuit */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">TVA</Label>
                    <Select 
                      disabled={formData.isFree}
                      value={formData.tva} 
                      onValueChange={(val) => setFormData({ ...formData, tva: val })}
                    >
                      <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="Exonéré">Exonéré</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end pb-2">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-slate-100/50 rounded-lg border border-slate-200 w-full h-10">
                      <Checkbox 
                        id="isFree" 
                        checked={formData.isFree} 
                        onCheckedChange={(checked) => setFormData({ ...formData, isFree: !!checked, amount: checked ? 0 : formData.amount })}
                      />
                      <Label htmlFor="isFree" className="text-sm font-medium cursor-pointer">Projet Gratuit</Label>
                    </div>
                  </div>

                  {/* Row 3: Avance */}
                  <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Avance (DH)</Label>
                    <Input 
                      type="number" 
                      disabled={formData.isFree}
                      value={formData.advance} 
                      onChange={(e) => setFormData({ ...formData, advance: parseFloat(e.target.value) || 0 })} 
                      className="h-10 bg-brand-50/30 border-brand-100 focus:ring-brand-500" 
                    />
                  </div>
                </div>

                {/* Calculation Summary */}
                {!formData.isFree && (
                  <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 shadow-xl">
                    <div className="flex justify-between items-center text-xs opacity-70">
                      <span>Montant HT</span>
                      <span className="font-mono">
                        {formData.amountType === 'HT' 
                          ? formData.amount.toLocaleString() 
                          : (formData.tva === 'Exonéré' ? formData.amount : formData.amount / (1 + (parseInt(formData.tva) / 100))).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs opacity-70">
                      <span>TVA ({formData.tva}{formData.tva === 'Exonéré' ? '' : '%'})</span>
                      <span className="font-mono">
                        {(formData.amountType === 'HT' 
                          ? (formData.tva === 'Exonéré' ? 0 : formData.amount * (parseInt(formData.tva) / 100))
                          : (formData.amount - (formData.tva === 'Exonéré' ? formData.amount : formData.amount / (1 + (parseInt(formData.tva) / 100))))).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider">Total TTC</span>
                      <span className="text-lg font-black tracking-tight">
                        {(formData.amountType === 'TTC' 
                          ? formData.amount 
                          : (formData.amount + (formData.tva === 'Exonéré' ? 0 : formData.amount * (parseInt(formData.tva) / 100)))).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/20 pt-2 bg-brand-600/20 -mx-4 px-4 pb-2 rounded-b-xl">
                      <span className="text-xs font-bold text-brand-300 uppercase italic">Reste à payer</span>
                      <span className="text-xl font-black text-white">
                        {(() => {
                           const totalTTC = formData.amountType === 'TTC' 
                           ? formData.amount 
                           : (formData.amount + (formData.tva === 'Exonéré' ? 0 : formData.amount * (parseInt(formData.tva) / 100)));
                           const totalTransactions = formData.transactions.reduce((sum: number, t: any) => sum + t.amount, 0);
                           const reste = totalTTC - formData.advance - totalTransactions;
                           return reste.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        })()} DH
                      </span>
                    </div>
                  </div>
                )}

                {/* Detailed Transactions */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard size={18} className="text-slate-400" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Nouvelle Transaction</h4>
                  </div>
                  
                  <Card className="p-4 bg-slate-50/50 border-slate-200 rounded-2xl space-y-4 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-slate-400">Montant (DH)</Label>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          value={newTransaction.amount || ''} 
                          onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})} 
                          className="h-10 bg-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase text-slate-400">Type</Label>
                        <Select 
                          value={newTransaction.paymentMethod} 
                          onValueChange={(val) => setNewTransaction({...newTransaction, paymentMethod: val})}
                        >
                          <SelectTrigger className="h-10 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="espèce">Espèce</SelectItem>
                            <SelectItem value="chèque">Chèque</SelectItem>
                            <SelectItem value="virement">Virement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase text-slate-400">Justificatif (Document)</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="transaction-file"
                          type="file" 
                          onChange={(e) => setNewTransaction({...newTransaction, file: e.target.files?.[0] || null})}
                          className="h-10 bg-white pt-2 text-xs" 
                        />
                        <Button 
                          className="h-10 bg-slate-900 shadow-lg shadow-slate-200" 
                          onClick={handleAddTransaction}
                        >
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* List of Transactions */}
                  <div className="space-y-2">
                    {formData.transactions.map((t: any) => (
                      <div key={t.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-brand-200 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                            <ArrowDownLeft size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{t.amount.toLocaleString()} DH</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              {t.paymentMethod} • {t.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                         {t.isSaved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateReceipt(t)}
                              className="h-8 text-[9px] font-black uppercase text-blue-600 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200 gap-1 rounded-lg transition-all shadow-sm shadow-blue-50"
                            >
                              <Eye size={12} />
                              Voir Reçu
                            </Button>
                          )}
                          {t.file && (
                            <Badge  className="bg-slate-50 text-slate-500 font-bold text-[9px] gap-1 px-2 py-0.5 border-slate-100">
                              <FileText size={10} /> PDF
                            </Badge>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-full"
                            onClick={() => handleRemoveTransaction(t.id)}
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {currentStep === 2 && (
            <Card className="p-6 border border-slate-200">
              <h3 className="text-lg font-bold mb-6 text-slate-900 uppercase tracking-wide text-sm">Interventions Terrain</h3>
              
              {/* List of Interventions */}
              <div className="space-y-4 mb-6">
                {formData.interventions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-slate-500">Interventions ajoutées</Label>
                    {formData.interventions.map((intervention: any, idx: number) => (
                      <div key={intervention.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">Intervention {idx + 1} - {intervention.date}</p>
                          <p className="text-xs text-slate-500 italic">
                            {intervention.agentsWithRoles?.map((ar: any) => availableAgents.find(a => a.id === ar.agentId)?.name).join(', ') || 'Aucun agent'}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              interventions: formData.interventions.filter((i: any) => i.id !== intervention.id),
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
              </div>

              {/* Add New Intervention */}
              <div className="space-y-6 p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                <div className="space-y-4">
                  <Label className="font-bold text-xs uppercase text-slate-500">Agents & Rôles *</Label>
                  
                  {/* List of selected agents with roles */}
                  {newIntervention.agentsWithRoles && newIntervention.agentsWithRoles.length > 0 && (
                    <div className="space-y-2">
                      {newIntervention.agentsWithRoles.map((agentRole: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                          <div className="flex-1 text-sm">
                            <p className="font-bold text-slate-900">{availableAgents.find(a => a.id === agentRole.agentId)?.name}</p>
                            <p className="text-xs text-slate-500 uppercase font-medium">Rôle: {agentRole.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNewIntervention({
                                ...newIntervention,
                                agentsWithRoles: newIntervention.agentsWithRoles.filter((_: any, i: number) => i !== idx),
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
                        value={newIntervention.selectedAgent || ''} 
                        onValueChange={(val) => setNewIntervention({ ...newIntervention, selectedAgent: val })}
                      >
                        <SelectTrigger className="h-10 bg-white">
                          <SelectValue placeholder="Choisir..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAgents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase">Rôle</Label>
                      <Input
                        placeholder="Ex: Chef équipe"
                        value={newIntervention.agentRole || ''}
                        onChange={(e) => setNewIntervention({ ...newIntervention, agentRole: e.target.value })}
                        className="h-10 text-sm bg-white"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (newIntervention.selectedAgent && newIntervention.agentRole) {
                        const updatedAgentsWithRoles = [...(newIntervention.agentsWithRoles || [])]
                        updatedAgentsWithRoles.push({
                          agentId: newIntervention.selectedAgent,
                          role: newIntervention.agentRole,
                        })
                        setNewIntervention({
                          ...newIntervention,
                          agentsWithRoles: updatedAgentsWithRoles,
                          selectedAgent: '',
                          agentRole: '',
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
                    value={newIntervention.date}
                    onChange={(e) => setNewIntervention({ ...newIntervention, date: e.target.value })}
                    className="h-11 bg-white border-slate-200"
                  />
                </div>

                {/* Observations */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold text-xs uppercase text-slate-500">Observations</Label>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {(newIntervention.observations || '').length}/500
                    </span>
                  </div>
                  <textarea
                    placeholder="Saisir des observations sur l'intervention (500 caractères max)..."
                    value={newIntervention.observations || ''}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setNewIntervention({ ...newIntervention, observations: e.target.value })
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
                        setNewIntervention({
                          ...newIntervention,
                          file: e.target.files?.[0] || null,
                        })
                      }
                      className="h-11 bg-white border-slate-200 pt-2 cursor-pointer"
                    />
                  </div>
                  {newIntervention.file && (
                    <div className="flex items-center gap-2 p-2 bg-brand-50 rounded-lg text-brand-700">
                      <FileText size={14} />
                      <span className="text-xs font-medium truncate">
                        {newIntervention.file.name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Add Button */}
                <Button
                  onClick={() => {
                    if ((newIntervention.agentsWithRoles?.length || 0) > 0 && newIntervention.date) {
                      const intervention = {
                        id: Date.now().toString(),
                        agentsWithRoles: newIntervention.agentsWithRoles,
                        date: newIntervention.date,
                        observations: newIntervention.observations,
                        file: newIntervention.file,
                      }
                      setFormData({
                        ...formData,
                        interventions: [...formData.interventions, intervention],
                      })
                      // Réinitialiser tous les champs
                      setNewIntervention({ 
                        agents: [],
                        agentsWithRoles: [],
                        date: '', 
                        observations: '',
                        file: null,
                        selectedAgent: '',
                        agentRole: ''
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
          )}

          {currentStep === 3 && (
            <Card className="p-6 border border-slate-200">
              <h3 className="text-lg font-bold mb-6 text-slate-900 uppercase tracking-wide text-sm">Interventions Bureau</h3>
              
              {/* List of Office Interventions */}
              <div className="space-y-4 mb-6">
                {formData.officeInterventions.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-bold text-xs uppercase text-slate-500">Interventions bureau ajoutées</Label>
                    {formData.officeInterventions.map((intervention: any, idx: number) => (
                      <div key={intervention.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900">
                            Intervention {idx + 1} - {intervention.date}
                          </p>
                          <p className="text-xs text-slate-500 italic">
                            {intervention.agentsWithRoles?.map((ar: any) => availableAgents.find(a => a.id === ar.agentId)?.name).join(', ') || 'Aucun agent'} {intervention.category ? `• ${intervention.category}` : ''}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              officeInterventions: formData.officeInterventions.filter(
                                (i: any) => i.id !== intervention.id
                              ),
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
              </div>

              {/* Add New Office Intervention */}
              <div className="space-y-6 p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                <div className="space-y-4">
                  <Label className="font-bold text-xs uppercase text-slate-500">Agents & Rôles *</Label>
                  
                  {/* List of selected agents with roles */}
                  {newOfficeIntervention.agentsWithRoles && newOfficeIntervention.agentsWithRoles.length > 0 && (
                    <div className="space-y-2">
                      {newOfficeIntervention.agentsWithRoles.map((agentRole: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                          <div className="flex-1 text-sm">
                            <p className="font-bold text-slate-900">{availableAgents.find(a => a.id === agentRole.agentId)?.name}</p>
                            <p className="text-xs text-slate-500 uppercase font-medium">Rôle: {agentRole.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNewOfficeIntervention({
                                ...newOfficeIntervention,
                                agentsWithRoles: newOfficeIntervention.agentsWithRoles.filter((_: any, i: number) => i !== idx),
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
                        value={newOfficeIntervention.selectedAgent || ''} 
                        onValueChange={(val) => setNewOfficeIntervention({ ...newOfficeIntervention, selectedAgent: val })}
                      >
                        <SelectTrigger className="h-10 bg-white">
                          <SelectValue placeholder="Choisir..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAgents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-bold text-slate-400 uppercase">Rôle</Label>
                      <Input
                        placeholder="Ex: Dessinateur"
                        value={newOfficeIntervention.agentRole || ''}
                        onChange={(e) => setNewOfficeIntervention({ ...newOfficeIntervention, agentRole: e.target.value })}
                        className="h-10 text-sm bg-white"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (newOfficeIntervention.selectedAgent && newOfficeIntervention.agentRole) {
                        const updatedAgentsWithRoles = [...(newOfficeIntervention.agentsWithRoles || [])]
                        updatedAgentsWithRoles.push({
                          agentId: newOfficeIntervention.selectedAgent,
                          role: newOfficeIntervention.agentRole,
                        })
                        setNewOfficeIntervention({
                          ...newOfficeIntervention,
                          agentsWithRoles: updatedAgentsWithRoles,
                          selectedAgent: '',
                          agentRole: '',
                        })
                      }
                    }}
                    className="w-full text-xs font-bold uppercase gap-2 py-5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter Agent
                  </Button>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase text-slate-500">Date de la Tâche *</Label>
                  <Input
                    type="date"
                    value={newOfficeIntervention.date}
                    onChange={(e) =>
                      setNewOfficeIntervention({
                        ...newOfficeIntervention,
                        date: e.target.value,
                      })
                    }
                    className="h-11 bg-white border-slate-200"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase text-slate-500">Catégorie de Tâche *</Label>
                  <Input
                    placeholder="Ex: Analyse, Rapport, Nettoyage données..."
                    value={newOfficeIntervention.category}
                    onChange={(e) =>
                      setNewOfficeIntervention({
                        ...newOfficeIntervention,
                        category: e.target.value,
                      })
                    }
                    className="h-11 bg-white border-slate-200"
                  />
                </div>

                {/* Time Spent */}
                <div className="space-y-2">
                  <Label className="font-bold text-xs uppercase text-slate-500">Temps Passé (heures)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 2.5"
                    step="0.5"
                    min="0"
                    value={newOfficeIntervention.timeSpent}
                    onChange={(e) =>
                      setNewOfficeIntervention({
                        ...newOfficeIntervention,
                        timeSpent: e.target.value,
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
                      (newOfficeIntervention.agentsWithRoles?.length || 0) > 0 &&
                      newOfficeIntervention.date &&
                      newOfficeIntervention.category
                    ) {
                      const intervention = {
                        id: Date.now().toString(),
                        agentsWithRoles: newOfficeIntervention.agentsWithRoles,
                        date: newOfficeIntervention.date,
                        category: newOfficeIntervention.category,
                        timeSpent: newOfficeIntervention.timeSpent,
                        description: newOfficeIntervention.description,
                        file: newOfficeIntervention.file,
                      }
                      setFormData({
                        ...formData,
                        officeInterventions: [...formData.officeInterventions, intervention],
                      })
                      // Réinitialiser tous les champs
                      setNewOfficeIntervention({
                        agentsWithRoles: [],
                        date: '',
                        category: '',
                        timeSpent: '',
                        description: '',
                        file: null,
                        selectedAgent: '',
                        agentRole: '',
                      })
                    }
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2 py-6 rounded-xl font-bold uppercase tracking-wider text-xs"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter intervention bureau
                </Button>
              </div>
            </Card>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Aperçu Général & Validation</h3>
                <Badge  className="bg-brand-50 text-brand-700 border-brand-100 px-3 py-1">
                  Dernière étape
                </Badge>
              </div>

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
                          <span className="text-slate-500">Type :</span>
                          <span className="font-bold text-slate-900">{formData.projectType || 'Non spécifié'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Propriété :</span>
                          <span className="font-bold text-slate-900 truncate max-w-[150px]">{formData.propertyName || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Localisation :</span>
                          <span className="font-bold text-slate-900">{formData.commune}, {formData.province}</span>
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
                        {selectedClients.length > 0 ? (
                          selectedClients.map((client, i) => (
                            <div key={i} className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                              {client.name}
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
                          <p className="text-sm font-black text-slate-900">{(formData.amountType === 'HT' ? formData.amount : (formData.amount / (1 + (parseInt(formData.tva) / 100)))).toLocaleString()} DH</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">TVA ({formData.tva}%)</span>
                          <p className="text-sm font-bold text-slate-600">{(formData.amount * (parseInt(formData.tva) / 100)).toLocaleString()} DH</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-brand-400">Total TTC</span>
                          <p className="text-lg font-black text-brand-600">{formData.amount.toLocaleString()} DH</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-4 -mb-4 p-4 rounded-b-xl">
                        <span className="text-xs font-bold text-slate-500">Avance (Total transactions) :</span>
                        <Badge className="bg-emerald-500 text-white border-0 shadow-sm font-black">
                          {formData.transactions.reduce((acc: number, t: any) => acc + t.amount, 0).toLocaleString()} DH
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
                      {formData.interventions.length > 0 ? (
                        formData.interventions.map((i: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-brand-500" />
                              <div>
                                <p className="text-[11px] font-bold text-slate-900">Sortie du {i.date}</p>
                                <p className="text-[10px] text-slate-500">
                                  {i.agentsWithRoles?.map((ar: any) => availableAgents.find(a => a.id === ar.agentId)?.name).join(', ')}
                                </p>
                              </div>
                            </div>
                            {i.file && <Badge  className="text-[10px] h-5">Fichier inclus</Badge>}
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
                      {formData.officeInterventions.length > 0 ? (
                        formData.officeInterventions.map((i: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-brand-500" />
                              <div>
                                <p className="text-[11px] font-bold text-slate-900">{i.category || 'Tâche Bureau'} - {i.date}</p>
                                <p className="text-[10px] text-slate-500">
                                  {i.agentsWithRoles?.map((ar: any) => availableAgents.find(a => a.id === ar.agentId)?.name).join(', ')}
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
                      ...formData.interventions.filter((i: any) => i.file).map((i: any) => ({ name: i.file.name, type: 'Terrain', date: i.date })),
                      ...formData.officeInterventions.filter((i: any) => i.file).map((i: any) => ({ name: i.file.name, type: 'Bureau', date: i.date })),
                      ...formData.transactions.filter((t: any) => t.file).map((t: any) => ({ name: t.file.name, type: 'Paiement', date: t.date }))
                    ].length > 0 ? (
                      [
                        ...formData.interventions.filter((i: any) => i.file).map((i: any) => ({ name: i.file.name, type: 'Terrain', date: i.date })),
                        ...formData.officeInterventions.filter((i: any) => i.file).map((i: any) => ({ name: i.file.name, type: 'Bureau', date: i.date })),
                        ...formData.transactions.filter((t: any) => t.file).map((t: any) => ({ name: t.file.name, type: 'Paiement', date: t.date }))
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
              disabled={!isFormDirty() || isSavingPayment}
              onClick={() => {
                 
                  handleSavePayment();
  
              }}
              className="rounded-xl bg-slate-100 text-slate-500 font-bold uppercase text-[10px] px-6 h-10 flex items-center gap-2 hover:bg-slate-200 hover:text-slate-700 transition-all disabled:opacity-50"
            >
              {isSavingPayment ? <Clock size={14} className="animate-spin text-brand-600" /> : <Save size={14} />}
              {isSavingPayment ? 'Enregistrement...' : 'Enregistrer'}
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
              <p><strong>N° REÇU :</strong> {receiptNumber}</p>
              <p><strong>DATE :</strong> {receiptDate}</p>
            </div>
            <p style={{ marginTop: '15px', fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>RÉFÉRENCE DOSSIER : {formData.projectName || 'NS'}</p>
          </div>

          {/* Content */}
          <div style={{ margin: '30px 0', fontSize: '15px', lineHeight: '1.8' }}>
            <p style={{ borderBottom: '1px dotted #ccc', paddingBottom: '10px', marginBottom: '20px' }}>
              <strong>Reçu de M. / Mme / Société :</strong> 
              <span style={{ marginLeft: '10px', fontSize: '16px' }}>
                {selectedClients.length > 0 
                  ? selectedClients.map(c => `${c.name} ${c.cin ? `(CIN: ${c.cin})` : c.ice ? `(ICE: ${c.ice})` : ''}`).join(', ') 
                  : '................................................................'}
              </span>
            </p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px', marginBottom: '30px' }}>
              <tbody>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <td style={{ padding: '15px', border: '1px solid #e2e8f0', width: '60%' }}><strong>Total du Devis / Projet (TTC)</strong></td>
                  <td style={{ padding: '15px', border: '1px solid #e2e8f0', textAlign: 'right', fontSize: '16px' }}>
                    {(() => {
                      const totalTTC = formData.amountType === 'TTC' 
                        ? formData.amount 
                        : (formData.amount + (formData.tva === 'Exonéré' ? 0 : formData.amount * (parseInt(formData.tva) / 100)));
                      return totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 });
                    })()} MAD
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#f1f5f9' }}>
                  <td style={{ padding: '15px', border: '1px solid #e2e8f0' }}><strong>Montant encaissé</strong></td>
                  <td style={{ padding: '15px', border: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 'bold', fontSize: '18px', color: '#0f172a' }}>
                    {(() => {
                        // Show the specific transaction amount, or the last one, or the advance as a fallback
                      const amount = activeReceiptTransaction 
                        ? activeReceiptTransaction.amount 
                        : (formData.transactions.length > 0 
                            ? formData.transactions[formData.transactions.length - 1].amount 
                            : formData.advance);
                      return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 });
                    })()} MAD
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '15px', border: '1px solid #e2e8f0' }}><strong>Reste à payer</strong></td>
                  <td style={{ padding: '15px', border: '1px solid #e2e8f0', textAlign: 'right', color: '#e11d48', fontWeight: 'bold' }}>
                    {(() => {
                      const totalTTC = formData.amountType === 'TTC' 
                        ? formData.amount 
                        : (formData.amount + (formData.tva === 'Exonéré' ? 0 : formData.amount * (parseInt(formData.tva) / 100)));
                      const totalPaid = formData.advance + formData.transactions.reduce((sum: number, t: any) => sum + t.amount, 0);
                      const reste = totalTTC - totalPaid;
                      return reste.toLocaleString('fr-FR', { minimumFractionDigits: 2 });
                    })()} MAD
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '30px', padding: '10px 0' }}>
              <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic' }}>
                Arrêté le présent reçu à la somme de : <br/>
                <span style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginTop: '10px', color: '#0b273f' }}>
                  {(() => {
                    const totalPaid = formData.advance + formData.transactions.reduce((sum: number, t: any) => sum + t.amount, 0);
                    return numberToWordsFrench(totalPaid);
                  })()}
                </span>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
              <p><strong>Mode de paiement :</strong> {formData.transactions.length > 0 ? formData.transactions[formData.transactions.length - 1].paymentMethod : 'Virement / Chèque'}</p>
              <p><strong>Motif :</strong> {formData.projectType || 'Prestation Topographique'}</p>
            </div>
            <p style={{ marginTop: '10px' }}><strong>Objet :</strong> Levé de la propriété {formData.propertyName || 'Sise à ' + (formData.commune || 'Casablanca')}</p>
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
