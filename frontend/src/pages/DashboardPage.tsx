import React from 'react';
import MainLayout from '../features/dashboard/components/MainLayout';
import { 
  Plus, 
  UserPlus, 
  Users, 
  FileText, 
  FolderKanban, 
  Receipt, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AddProjectModal from '@/features/projects/components/addProjects/AddProjectModal2';
import AddClientModal from '@/features/Client/components/AddClientModal';
import AddStaffModal from '@/features/Staff/components/addStaffModal'

const QUICK_ACTIONS = [
  { id: 'new-project', title: 'Nouveau Projet', icon: Plus, color: 'bg-emerald-50 text-emerald-600' },
  { id: 'new-client', title: 'Nouveau Client', icon: UserPlus, color: 'bg-brand-50 text-brand-500' },
  { id: 'new-collab', title: 'Nouveau Collaborateur', icon: Users, color: 'bg-slate-50 text-slate-500' },
  { id: 'new-invoice', title: 'Nouvelle facture', icon: FileText, color: 'bg-emerald-50 text-emerald-600' },
];

const STATS = [
  { 
    title: 'Projets en cours', 
    value: '24', 
    trend: '+3 ce mois', 
    icon: FolderKanban,
    iconColor: 'text-slate-400'
  },
  { 
    title: 'Factures en attente', 
    value: '12', 
    trend: '45 000 €', 
    icon: Receipt,
    iconColor: 'text-slate-400'
  },
  { 
    title: 'Employés actifs', 
    value: '8', 
    trend: '+1 cette semaine', 
    icon: Users,
    iconColor: 'text-slate-400'
  },
  { 
    title: 'Chiffre d\'affaires', 
    value: '125 400 €', 
    trend: '+12% vs mois dernier', 
    icon: TrendingUp,
    iconColor: 'text-slate-400'
  },
];

const RECENT_PROJECTS = [
  {
    id: 'PRJ-2024-0156',
    name: 'Lotissement Beaumont',
    client: 'SCI Les Jardins',
    status: 'En cours',
    statusColor: 'bg-blue-100 text-blue-700',
    time: 'Aujourd\'hui'
  },
  {
    id: 'PRJ-2024-0155',
    name: 'Bornage Parcelle 456',
    client: 'M. Alami',
    status: 'En attente',
    statusColor: 'bg-amber-100 text-amber-700',
    time: 'Aujourd\'hui'
  },
  {
    id: 'PRJ-2024-0154',
    name: 'Mise à jour Titre 12345',
    client: 'Mme. Idrissi',
    status: 'Terminé',
    statusColor: 'bg-emerald-100 text-emerald-700',
    time: 'Hier'
  }
];

const RECENT_ACTIVITY = [
  {
    id: 1,
    type: 'project',
    text: 'Projet PRJ-2024-0154 marqué comme terminé',
    time: 'Il y a 2h',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500'
  },
  {
    id: 2,
    type: 'invoice',
    text: 'Facture F-2024-0145 payée - 2 500 €',
    time: 'Il y a 3h',
    icon: Receipt,
    iconColor: 'text-blue-500'
  },
  {
    id: 3,
    type: 'reminder',
    text: 'Rappel: Dossier PRJ-2024-0148 en attente de...',
    time: 'Il y a 5h',
    icon: Clock,
    iconColor: 'text-amber-500'
  }
];

export default function DashboardPage() {
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = React.useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = React.useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<any>(null);

  const handleActionClick = (actionId: string) => {
    if (actionId === 'new-project') {
      setIsAddProjectModalOpen(true);
      setSelectedProject(null);
    } else if (actionId === 'new-client') {
      setIsAddClientModalOpen(true);
    }
    else if (actionId ==='new-collab'){
      setIsAddStaffModalOpen(true)
    }
      };
  const handleProjectClick = (project: any) => {
    // Map dashboard project format to the format expected by the modal or mock details
    const fullProject = {
      id: project.id,
      name: project.name,
      type: project.name.includes('Bornage') ? 'Bornage' : 'Levé Topographique',
      status: project.status,
      client: {
        firstName: project.client.split(' ')[0],
        lastName: project.client.split(' ').slice(1).join(' '),
      },
      details: {
        commune: 'Casablanca', // Default or mocked
        landStatus: project.status === 'Terminé' ? 'immatriculed' : 'requisition'
      },
      payment: {
        amountHT: 5000,
        advance: 2000
      }
      };
    setSelectedProject(fullProject);
    setIsAddProjectModalOpen(true);
  };
  return (
    <MainLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-brand-500 uppercase tracking-tight">Tableau de bord</h1>
          <p className="text-slate-400 text-sm font-medium">Bienvenue sur PiloTop. Voici un aperçu de votre activité.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map((action, idx) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleActionClick(action.id)}
            >
              <Card className="p-6 hover:shadow-md transition-all cursor-pointer group border-slate-200 rounded-2xl shadow-sm">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon size={24} />
                  </div>
                  <span className="text-[10px] font-medium uppercase text-brand-500 tracking-widest">{action.title}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <AddProjectModal 
          isOpen={isAddProjectModalOpen} 
          onClose={() => {
            setIsAddProjectModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          onSuccess={(data) => {
            console.log('Project created:', data);
            setIsAddProjectModalOpen(false);
            setSelectedProject(null);
          }}
          
        />

        <AddClientModal 
          isOpen={isAddClientModalOpen}
          onClose={() => setIsAddClientModalOpen(false)}
          onSuccess={(data) => {
            console.log('Client created:', data);
            setIsAddClientModalOpen(false);
          }}
        />

        <AddStaffModal 
          isOpen={isAddStaffModalOpen}
          onClose={() => setIsAddStaffModalOpen(false)}
          onSuccess={(data) => {
            console.log('staff created:', data);
            setIsAddStaffModalOpen(false);
          }}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
            >
              <Card className="p-6 border-slate-200 rounded-2xl shadow-sm bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{stat.title}</p>
                    <p className="text-2xl font-semibold text-brand-500">{stat.value}</p>
                  </div>
                  <stat.icon size={20} className={stat.iconColor} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{stat.trend}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1">
                <h2 className="text-xs font-semibold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                   Projets récents
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">Les derniers dossiers créés ou modifiés</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-[10px] uppercase font-semibold tracking-tighter text-brand-500 hover:text-brand-600 hover:bg-brand-50">
                Voir tout <ChevronRight size={14} className="ml-1" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {RECENT_PROJECTS.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + idx * 0.1 }}
                >
                  <Card className="p-4 hover:bg-slate-50 transition-colors cursor-pointer border-slate-200 rounded-2xl shadow-sm group bg-white"
                   onClick={() => handleProjectClick(project)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-brand-500">{project.name}</span>
                            <Badge className={`${project.statusColor} border-none font-semibold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md`}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{project.id} • {project.client}</p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-[10px] font-medium text-slate-400 uppercase">{project.time}</span>
                        <ArrowUpRight size={14} className="text-slate-300 group-hover:text-brand-600 transition-colors" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <div className="space-y-1 mb-2">
              <h2 className="text-xs font-semibold text-brand-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                Activité récente
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">Dernières actions sur la plateforme</p>
            </div>

            <Card className="p-6 border-slate-200 rounded-2xl shadow-sm bg-white">
              <div className="space-y-8 relative">
                {/* Timeline Line */}
                <div className="absolute left-2.5 top-2 bottom-2 w-px bg-slate-100" />
                
                {RECENT_ACTIVITY.map((activity, idx) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + idx * 0.1 }}
                    className="relative flex gap-4 pl-8"
                  >
                    <div className={`absolute left-0 top-1 p-1 rounded-full bg-white border-2 border-slate-50 ${activity.iconColor} z-10 shadow-sm`}>
                      <activity.icon size={12} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-700 font-medium leading-snug">{activity.text}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-8 h-9 text-[10px] uppercase font-semibold tracking-widest border-slate-200 text-slate-400 hover:text-brand-500 hover:border-brand-100 hover:bg-brand-50 rounded-xl">
                Charger plus d'activités
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
