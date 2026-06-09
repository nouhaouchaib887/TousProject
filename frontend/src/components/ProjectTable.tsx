import React from 'react';
import { Project } from '../types';
import StatusBadge from './StatusBadge';
import { MapPin, Phone, User, CreditCard, Users as UsersIcon, Info } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse text-left min-w-[1400px]">
          <thead>
            {/* Grouped Headers */}
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th colSpan={3} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100">
                <div className="flex items-center gap-2">
                  <Info size={14} />
                  Informations Projet
                </div>
              </th>
              <th colSpan={4} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  Informations Client
                </div>
              </th>
              <th colSpan={5} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} />
                  Paiement & Facturation
                </div>
              </th>
              <th colSpan={2} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100">
                <div className="flex items-center gap-2">
                  <UsersIcon size={14} />
                  Interventions
                </div>
              </th>
              <th colSpan={3} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  Détails Fonciers
                </div>
              </th>
            </tr>
            {/* Column Headers */}
            <tr className="bg-white border-b border-slate-200">
              {/* Project */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100">Statut</th>
              
              {/* Client */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Nom</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Prénom</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Téléphone</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100">CIN</th>
              
              {/* Payment */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">HT</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">TTC</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Avance</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Reste</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100">Statut Paiement</th>
              
              {/* Interventions */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Équipe Terrain</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 border-r border-slate-100">Équipe Bureau</th>
              
              {/* Details */}
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Statut Foncier</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Commune</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600">Coordonnées</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                {/* Project */}
                <td className="px-6 py-4 text-sm font-bold text-slate-900">{project.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{project.type}</td>
                <td className="px-6 py-4 border-r border-slate-100">
                  <StatusBadge status={project.status} type="project" />
                </td>

                {/* Client */}
                <td className="px-6 py-4 text-sm text-slate-600">{project.client.lastName}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{project.client.firstName}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" />
                    {project.client.phone}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 border-r border-slate-100 font-mono">{project.client.cin}</td>

                {/* Payment */}
                <td className="px-6 py-4 text-sm text-slate-600">{project.payment.amountHT.toLocaleString()} DH</td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-900">{project.payment.amountTTC.toLocaleString()} DH</td>
                <td className="px-6 py-4 text-sm text-emerald-600 font-medium">{project.payment.advance.toLocaleString()} DH</td>
                <td className="px-6 py-4 text-sm text-rose-600 font-medium">{project.payment.remaining.toLocaleString()} DH</td>
                <td className="px-6 py-4 border-r border-slate-100">
                  <StatusBadge status={project.payment.status} type="payment" />
                </td>

                {/* Interventions */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {project.teams.fieldTeam.map((member, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                        {member}
                      </span>
                    ))}
                    {project.teams.fieldTeam.length === 0 && <span className="text-slate-400 text-xs italic">Non assigné</span>}
                  </div>
                </td>
                <td className="px-6 py-4 border-r border-slate-100">
                   <div className="flex flex-wrap gap-1">
                    {project.teams.officeTeam.map((member, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                        {member}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Details */}
                <td className="px-6 py-4 text-sm text-slate-600">{project.details.landStatus}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{project.details.commune}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500 text-xs">{project.details.coordinates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
