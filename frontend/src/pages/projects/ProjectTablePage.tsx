import React, { useEffect, useState } from 'react';
import MainLayout from '../../features/dashboard/components/MainLayout';
import ProjectTable from '@/features/projects/components/projectTable/projectTable';
import { ProjectTableReadPayload, ProjectTableReadPayload as TableProject } from '@/features/projects/components/projectTable/types';
import { MOCK_PROJECTS } from '@/features/projects/components/mockProjects';
import { Button } from '@/components/ui/button';
import { Plus, MapPin, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import AddProjectModal from '@/features/projects/components/addProjects/AddProjectModal2';
import AddClientModal from '@/features/Client/components/AddClientModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Link } from 'react-router-dom';
import { getProjects } from '@/features/projects/api/ProjectService';

export default function ProjectTablePage() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<any>(null);
   const [clientToEdit, setClientToEdit] = useState<any>(null);
  
 const [projects, setProjects] = useState<ProjectTableReadPayload[]>([])
const [filteredProjects, setFilteredProjects] = useState<ProjectTableReadPayload[]>([])
useEffect(() => {
  async function fetchProjects() {
    const data = await getProjects()
    setProjects(data)
    setFilteredProjects(data)
  }

  fetchProjects()
}, [])

  const handleEditProject = (project: any) => {
    setProjectToEdit(project);
    setIsAddModalOpen(true);
  };

  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    let result = [...projects];
    console.log("Filtered Projects:", result);

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(p => p.project_type?.name === typeFilter);
    }

    if (startDate) {
      result = result.filter(p => p.created_at >= startDate);
    }

    if (endDate) {
      result = result.filter(p => p.created_at <= endDate);
    }

    setFilteredProjects(result);
  }, [statusFilter, typeFilter, startDate, endDate]);

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const statuses = Array.from(new Set(projects.map(p => p.status)));
  const types = Array.from(new Set(projects.map(p => p.project_type?.name)));
const handleDuplicateProject = (project: any) => {
    const newProject = {
      ...project,
      id: `${project.id}-COPY`,
      created_at: new Date().toISOString().split('T')[0]
    };
    setFilteredProjects([newProject, ...filteredProjects]);
  };

  const handleDeleteProject = (project: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet ${project.id} ?`)) {
      setFilteredProjects(filteredProjects.filter(p => p.id !== project.id));
    }
  };
  const handleEditClient = (client: any) => {
    setClientToEdit({
      ...client,
      first_name: client.firstName,
      last_name: client.lastName,
      client_type: client.client_type || 'Physique'
    });
    setIsClientModalOpen(true);
  };
   return (
    <MainLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Projets</h1>
            <p className="text-muted-foreground text-slate-500 font-medium">
              Gestion de vos projets 
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                setProjectToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200"
            >
              <Plus size={18} />
              Nouveau Projet
            </Button>
             <Button 
              variant="outline"
              className="flex items-center gap-2 bg-white border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
            >
              <Link to="/projects/calendar">
                <CalendarIcon size={18} />
              </Link>
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2 bg-white border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
            >
              <Link to="/projects/map">
                <MapPin size={18} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-xs tracking-widest">
              <Filter size={14} className="text-brand-600" />
              <span>Filtres</span>
            </div>
            {(statusFilter !== 'all' || typeFilter !== 'all' || startDate || endDate) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-7 px-2 text-[10px] uppercase font-black tracking-tighter text-slate-400 hover:text-brand-600 hover:bg-brand-50"
              >
                Réinitialiser
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut</label>
              <Select value={statusFilter} onValueChange={(value) => value !== null && setStatusFilter(value)}>
                <SelectTrigger className="w-full bg-slate-50/50 border-slate-100 rounded-xl focus:ring-brand-500/20">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de mission</label>
              <Select value={typeFilter} onValueChange={(value) => value !== null && setTypeFilter(value)}>
                <SelectTrigger className="w-full bg-slate-50/50 border-slate-100 rounded-xl focus:ring-brand-500/20">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Du</label>
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-slate-50/50 border-slate-100 rounded-xl focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Au </label>
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-slate-50/50 border-slate-100 rounded-xl focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <ProjectTable projects={filteredProjects as unknown as TableProject[]} 
         onEdit={handleEditProject} onDelete={handleDeleteProject}
          onDuplicate={handleDuplicateProject}
          onEditClient={handleEditClient}/>

        {/* Add Project Modal */}
        <AddProjectModal 
          isOpen={isAddModalOpen} 
          onClose={() => {
            setIsAddModalOpen(false);
            setProjectToEdit(null);
          }} 
          project={projectToEdit}
        />
 {/* Add/Edit Client Modal */}
        <AddClientModal 
          isOpen={isClientModalOpen}
          onClose={() => {
            setIsClientModalOpen(false);
            setClientToEdit(null);
          }}
          client={clientToEdit}
          onSuccess={(client) => {
            // Update the project list with the new client info if needed
            setFilteredProjects(filteredProjects.map(p => {
              if (p.clients[0].cin === client.cin) {
                return {
                  ...p,
                  client: {
                    ...p.clients[0],
                    firstName: client.first_name,
                    lastName: client.last_name,
                    ...client
                  }
                };
              }
              return p;
            }));
          }}
        />
      </div>
    </MainLayout>
  );
}
