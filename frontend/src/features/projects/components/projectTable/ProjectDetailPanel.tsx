import React, { useState, useEffect } from "react"
import { Sheet } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  FileText, 
  CreditCard, 
  User, 
  Map, 
  Download, 
  ExternalLink, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Info
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import StatusBadge from "@/components/StatusBadge"
import { cn } from "@/lib/utils"
import { ProjectTableReadPayload } from "./types"

interface ProjectDetailPanelProps {
  project: ProjectTableReadPayload | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (project: any) => void
  onDelete?: (project: ProjectTableReadPayload) => void;
  onDuplicate?: (project: ProjectTableReadPayload) => void;
  onEditClient?: (client: any) => void
   initialTab?: string
}

export default function ProjectDetailPanel({ project, isOpen, onClose, onEdit, onEditClient, initialTab = "overview" }: ProjectDetailPanelProps) {
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab)
    }
    console.log("Project Detail Panel Opened with Project:", project)
  }, [isOpen, initialTab])
  if (!project) return null

  // Mock transactions for display
  const transactions = [
    { id: "TR-001", type: "Advance", date: "2024-03-15", amount: project.financial_details?.total_paid, status: "Completed", method: "Bank Transfer" },
    { id: "TR-002", type: "Partial", date: "2024-03-28", amount: 5000, status: "Pending", method: "Check" },
  ]
   const fieldInterventions = [
    { 
      id: "INT-F-001", 
      date: "2024-03-14", 
      agents: [
        { name: "Ahmed Alami", role: "Chef de Brigade" },
        { name: "Youssef Benani", role: "Opérateur" },
        { name: "Said Naciri", role: "Chauffeur/Aide" }
      ],
      observations: "Bornage effectué selon le plan de masse. Les bornes B1 à B4 sont en place.",
      type: "Bornage"
    },
    { 
      id: "INT-F-002", 
      date: "2024-03-20", 
      agents: [
        { name: "Ahmed Alami", role: "Chef de Brigade" },
        { name: "Karim Tazi", role: "Assistant" }
      ],
      observations: "Levé complémentaire de la façade sud à la demande du client.",
      type: "Levé"
    }]

    const officeInterventions = [
    {
      id: "INT-B-001",
      category: "Calculs de Structure",
      timeSpent: "4h 30min",
      description: "Traitement des données brutes du levé et compensation du cheminement.",
      agents: ["Mohammed Slaoui", "Amine Idrissi"]
    },
    {
      id: "INT-B-002",
      category: "Dessin & DAO",
      timeSpent: "6h 00min",
      description: "Établissement du plan de situation et du plan de masse définitif.",
      agents: ["Laila Mansouri"]
    },
    {
      id: "INT-B-003",
      category: "Administratif",
      timeSpent: "1h 15min",
      description: "Dépôt du dossier numérique sur la plateforme e-foncier.",
       agents: ["Mohammed Slaoui"]
    }
  ]

  // Mock documents
  const documents = [
    { name: "Carte Nationale (CIN)", type: "PDF", size: "1.2 MB", date: "2024-03-10", category: "Client" },
    { name: "Titre Foncier (Copie)", type: "JPG", size: "2.4 MB", date: "2024-03-12", category: "Land" },
    { name: "Justificatif de Propriété", type: "PDF", size: "0.8 MB", date: "2024-03-12", category: "Land" },
  ]

  return (
    <Sheet 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Projet ${project.reference}`}
      description={`${project.project_type?.name} - ${project.clients[0].first_name} ${project.clients[0].last_name}`}
    >
      <div className="p-6 pt-2">
        <button 
          onClick={() => onEdit?.(project)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-brand-50 text-brand-600 rounded-xl font-bold text-sm hover:bg-brand-100 transition-all mb-6 border border-brand-100"
        >
          <FileText size={18} />
          Modifier les informations du dossier
        </button>
      <Tabs  value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" >Aperçu</TabsTrigger>
           <TabsTrigger value="missions" >Missions</TabsTrigger>
           <TabsTrigger value="billing" >Facturation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="land" >Foncier</TabsTrigger>
        </TabsList>

        {/* --- OVERVIEW --- */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Statut Projet</p>
              <div className="mt-2">
                <StatusBadge status={project.status} type="project" />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Paiement</p>
              <div className="mt-2">
                <StatusBadge status={project.financial_details?.payment_status} type="payment" />
              </div>
            </div>
          </div>

          <section>
            <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <User size={16} className="text-brand-600" />
               Clients Associés
              </h3>
            </div>
            <div className="space-y-4">
              {(Array.isArray(project.clients) ? project.clients : [project.clients]).map((client: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                        {client.first_name[0]}{client.last_name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{client.first_name} {client.last_name}</p>
                        <p className="text-xs text-slate-500">{client.phone_number}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onEditClient?.(client)}
                      className="p-2 hover:bg-white rounded-lg text-brand-600 transition-colors border border-transparent hover:border-brand-100"
                      title="Détails & Modification"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">CIN</p>
                      <p className="text-xs font-mono font-medium">{client.cin || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Type</p>
                      <p className="text-xs font-medium">{client.client_type || 'Physique'}</p>
                    </div>
                     </div>
                </div>
              ))}

            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Map size={16} className="text-brand-600" />
              Localisation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Commune</span>
                <span className="font-medium text-slate-900">{project.topo_metadata?.commune?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Coordonnées</span>
                <span className="font-medium font-mono text-slate-900">{project.topo_metadata?.coordinates?.map((coord: any) => `${coord.x}, ${coord.y}`).join(' / ')}</span>
              </div>
            </div>
          </section>
        </TabsContent>
 {/* --- MISSIONS (FIELD & OFFICE) --- */}
        <TabsContent value="missions" className="space-y-8">
          {/* Section: Terrain */}
          <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar size={16} className="text-brand-600" />
              Missions Terrain
            </h3>
            <Badge  className="bg-brand-50 text-brand-600 border-brand-100">
              {fieldInterventions.length} Missions
            </Badge>
          </div>
           <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {fieldInterventions.map((mission, idx) => (
              <div key={mission.id} className="relative pl-10">
                <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border-2 border-brand-500 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                </div>
                
                <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">
                      {mission.type}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{mission.date}</span>
                  </div>
                   <div className="space-y-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-2">Équipe d'intervention</p>
                      <div className="flex flex-wrap gap-2">
                        {mission.agents.map((agent, i) => (
                          <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                            <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold">
                              {agent.name[0]}
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-900 leading-none">{agent.name}</p>
                              <p className="text-[9px] text-slate-500 leading-none mt-1">{agent.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Observations Terrain</p>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        "{mission.observations}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 border-2 border-dashed border-brand-100 rounded-xl text-brand-600 text-sm font-medium hover:bg-brand-50 transition-all">
            + Planifier une nouvelle mission
          </button>
            </div>

          <div className="border-t border-slate-100 pt-8">
            {/* Section: Bureau */}
            <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-blue-600" />
              Travaux de Bureau
            </h3>
            <Badge  className="bg-blue-50 text-blue-600 border-blue-100">
              {officeInterventions.length} Tâches
            </Badge>
          </div>

          <div className="space-y-3">
            {officeInterventions.map((task) => (
              <div key={task.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-200 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{task.category}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">ID: {task.id}</p>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    <Clock size={12} />
                    <span className="text-xs font-bold font-mono">{task.timeSpent}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {task.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {task.agents.map((agent, i) => (
                      <div 
                        key={i} 
                        className="w-7 h-7 rounded-full border-2 border-white bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]"
                        title={agent}
                      >
                        {agent[0]}
                      </div>
                       ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium italic">
                    {task.agents.length} intervenant{task.agents.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-3 border-2 border-dashed border-blue-100 rounded-xl text-blue-600 text-sm font-medium hover:bg-blue-50 transition-all">
            + Plannifier une nouvelle tâche de bureau
          </button>
           </div>
          </div>
        </TabsContent>
        {/* --- BILLING --- */}
        <TabsContent value="billing" className="space-y-6">
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-brand-700 font-medium">Total TTC</p>
                <h4 className="text-3xl font-bold text-brand-900 mt-1">{project.financial_details?.amount_ttc.toLocaleString()} DH</h4>
              </div>
              <div className="text-right">
                <p className="text-xs text-brand-600">Reste à payer</p>
                <p className="text-lg font-bold text-rose-600">{project.financial_details?.balance.toLocaleString()} DH</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-brand-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-600" 
                style={{ width: `${(project.financial_details?.total_paid && project.financial_details?.amount_ttc) ? (project.financial_details?.total_paid / project.financial_details?.amount_ttc) * 100 : 0}%` }}
              />
            </div>
          </div>

          <section>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Historique des Transactions</h3>
            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      t.type === "Advance" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {t.type === "Advance" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{t.type}</p>
                      <p className="text-xs text-slate-500">{t.date} • {t.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">+{t.amount?.toLocaleString()} DH</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {t.status === "Completed" ? (
                        <CheckCircle2 size={12} className="text-emerald-500" />
                      ) : (
                        <Clock size={12} className="text-amber-500" />
                      )}
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        t.status === "Completed" ? "text-emerald-600" : "text-amber-600"
                      )}>{t.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* --- DOCUMENTS --- */}
        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc, i) => (
              <div key={i} className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-500">{doc.type} • {doc.size} • Ajouté le {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                    <Download size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm font-medium hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all mt-4">
            + Ajouter un document
          </button>
        </TabsContent>

        {/* --- LAND DETAILS --- */}
        <TabsContent value="land" className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 text-white">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Numéro de Titre Foncier</p>
            <h4 className="text-2xl font-mono font-bold mt-2">TF 45892 / 24</h4>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none">Vérifié</Badge>
              <span className="text-xs text-slate-400">Dernière mise à jour: 12/03/2024</span>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Détails Techniques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Superficie</p>
                <p className="text-sm font-medium text-slate-900">450 m²</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Statut</p>
                <p className="text-sm font-medium text-slate-900">{project.topo_metadata?.registry_type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Type de Terrain</p>
                <p className="text-sm font-medium text-slate-900">Urbain (R+2)</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Bornage</p>
                <p className="text-sm font-medium text-slate-900">Effectué le 14/03</p>
              </div>
            </div>
          </section>

          <section className="p-4 rounded-xl border border-amber-100 bg-amber-50">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Info size={16} />
              Notes Foncier
            </h3>
            <p className="mt-2 text-xs text-amber-800 leading-relaxed">
              Le dossier nécessite une validation supplémentaire de la part de la conservation foncière concernant la limite Nord-Est.
            </p>
          </section>
        </TabsContent>
      </Tabs>
      </div>
    </Sheet>
  )
}
