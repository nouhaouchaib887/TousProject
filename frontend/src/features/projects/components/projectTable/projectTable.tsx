import React, { useState } from 'react';
import StatusBadge from '../../../../components/StatusBadge';
import { MapPin, Phone, User, CreditCard, Users as UsersIcon, Info, Eye, Copy, Trash2, ExternalLink } from 'lucide-react';
import ProjectDetailPanel from './ProjectDetailPanel';

type ProjectStatus = "Brouillon" | "Validé" | "Phase Terrain" | "Phase Bureau" | "Clôturé";
type PaymentStatus = "Impayé" | "Partiel" | "Payé";
import { ProjectTableReadPayload } from './types';



interface ProjectTableProps {
  projects: ProjectTableReadPayload[];
  onEdit?: (project: any) => void;
  onDelete?: (p: any) => void;
  onDuplicate?: (p: any) => void;
  onEditClient?: (c: any) => void ;
}

export default function ProjectTable({ projects, onEdit,onDelete, onDuplicate, onEditClient  }: ProjectTableProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectTableReadPayload | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpenDetails = (project: ProjectTableReadPayload) => {
    setSelectedProject(project);
    setIsPanelOpen(true);
  };
  const getFieldTeam = (project: any) =>
  project.field_interventions
    ?.flatMap(
      (intervention: any) =>
        intervention.staff_with_roles || []
    ) ?? []

const getOfficeTeam = (project: any) =>
  project.office_works
    ?.flatMap(
      (work: any) =>
        work.staff_with_roles || []
    ) ?? []
  

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left min-w-[1400px]">
          <thead>
            {/* Grouped Headers */}
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th colSpan={3} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-2">
                    <Info size={14} />
                    Informations du Projet
                  </span>
                </div>
              </th>
              <th colSpan={4} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  Informations du Client
                </div>
              </th>
              <th colSpan={5} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} />
                  Paiement & Facturation
                </div>
              </th>
              <th colSpan={2} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <UsersIcon size={14} />
                  Interventions
                </div>
              </th>
              <th colSpan={3} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  Détails du Terrain
                </div>
              </th>
              <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                Actions
              </th>
            </tr>
            {/* Column Headers */}
            <tr className="bg-white border-b border-slate-200">
              {/* Project */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Référence</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100 whitespace-nowrap">Status</th>
              
              {/* Client */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Nom</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Prénom</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Téléphone</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100 whitespace-nowrap">Numéro d'ID (CIN)</th>
              
              {/* Payment */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Montant HT</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Montant TTC</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Avance</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Reste à payer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100 whitespace-nowrap">Status du Paiement</th>
              
              {/* Interventions */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Equipe de Terrain</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100 whitespace-nowrap">Equipe de Bureau</th>
              
              {/* Details */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Status du Terrain</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Commune</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap">Coordonnées</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => handleOpenDetails(project)}
              >
                
                {/* Project */}
                <td className="px-6 py-4 text-sm font-bold text-slate-900 whitespace-nowrap">{project.reference}</td>
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{project.project_type?.name}</td>
                <td className="px-6 py-4 border-r border-slate-100 whitespace-nowrap">
                  <StatusBadge status={project.status} type="project" />
                </td>

                {/* Client */}
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{project.clients[0].last_name}</td>
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{project.clients[0].first_name}</td>
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400 shrink-0" />
                    {project.clients[0].phone_number}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100 font-mono whitespace-nowrap">{project.clients[0].cin}</td>

                {/* Payment */}
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{project.financial_details?.amount_ht.toLocaleString()} DH</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">{project.financial_details?.amount_ttc.toLocaleString()} DH</td>
                <td className="px-6 py-4 text-sm text-emerald-600 font-medium whitespace-nowrap">{project.financial_details?.total_paid.toLocaleString()} DH</td>
                <td className="px-6 py-4 text-sm text-rose-600 font-medium whitespace-nowrap">{project.financial_details?.balance.toLocaleString()} DH</td>
                <td className="px-6 py-4 border-r border-slate-100 whitespace-nowrap">
                  <StatusBadge status={project.financial_details?.payment_status} type="payment" />
                </td>

                {/* Interventions */}
                <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex flex-wrap gap-1">
    {getFieldTeam(project).map((member: any, i: number) => (
  <span
    key={i}
    className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium whitespace-nowrap"
  >
    {member.agent?.full_name} ({member.role?.name})
  </span>
))}

    {getFieldTeam(project).length === 0 && (
  <span className="text-slate-400 text-xs italic whitespace-nowrap">
    Non assigné
  </span>
)}
  </div>
</td>
                <td className="px-6 py-4 border-r border-slate-100 whitespace-nowrap">
                    <div className="flex flex-nowrap gap-1">
                    {getOfficeTeam(project).map((member: any, i: number) => (
                <span
                 key={i}
                 className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium whitespace-nowrap"
                  >
                      {member.agent?.full_name} ({member.role?.name})
                </span>
))}
                    {getOfficeTeam(project).length === 0 && <span className="text-slate-400 text-xs italic whitespace-nowrap">Non assigné</span>}
                  </div>
                </td>

                {/* Details */}
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{project.topo_metadata?.registry_type}</td>
                <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{project.topo_metadata?.commune?.name}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500 text-xs whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                {project.topo_metadata?.coordinates?.map((coord: any, i: number) => (
      <span
        key={i}
        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium whitespace-nowrap font-mono"
      >
        ({coord.x}, {coord.y})
      </span>
    ))}

    {(!project.topo_metadata?.coordinates ||
      project.topo_metadata.coordinates.length === 0) && (
      <span className="text-slate-400 text-xs italic whitespace-nowrap">
        Aucune coordonnée
      </span>
    )}
  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                   <div className="flex items-center justify-end gap-1">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(project);
                    }}
                   className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-all"
                      title="Voir détails"
                  >
                    <Eye size={18} />
                  </button>
                  
                  <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate?.(project);
                      }}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="Dupliquer"
                    >
                      <Copy size={18} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(project);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Supprimer"
                    >
                       <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

      <ProjectDetailPanel 
        project={selectedProject}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onEdit={(project) => {
          setIsPanelOpen(false);
          onEdit?.(project);
        }}
        onDelete={(project) => {
          setIsPanelOpen(false);
          onDelete?.(project);
        }}
         onDuplicate={(project) => {
          setIsPanelOpen(false);
          onDuplicate?.(project);
        }}
        onEditClient={(client) => {
          setIsPanelOpen(false);
          onEditClient?.(client);
        }}
        
      />
    </>
  );
}
