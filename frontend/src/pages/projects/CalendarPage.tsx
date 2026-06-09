import React, { useState, useMemo } from 'react';
import MainLayout from '../../features/dashboard/components/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  LayoutGrid, 
  MapPin, 
  Clock, 
  FileText, 
  CreditCard,
  Target,
  CheckCircle2,
  Check,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Landmark,
  Users
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import ProjectDetailPanel from '@/features/projects/components/projectTable/ProjectDetailPanel';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// MOCK DATA (Ideally this comes from a central store or API)
const MOCK_PROJECTS = [
  { 
    id: 'PRJ-2024-001', 
    status: 'En cours', 
    type: 'Bornage', 
    createdAt: '2024-03-10',
    client: { firstName: 'Jean', lastName: 'Dupont', phone: '+212 600-000000', cin: 'AB123456', email: 'jean@example.com' },
    details: { landStatus: 'immatriculed', commune: 'Casablanca', coordinates: '33.5731° N, 7.5898° W' },
    payment: { amountHT: 5000, amountTTC: 6000, advance: 2000, remaining: 4000, status: 'Partiel' }
  },
  { 
    id: 'PRJ-2024-002', 
    status: 'Terminé', 
    type: 'Levé Topo', 
    createdAt: '2024-03-15',
    client: { firstName: 'Sarah', lastName: 'Lahlou', phone: '+212 600-111111', cin: 'CD789012', email: 'sarah@example.com' },
    details: { landStatus: 'requisition', commune: 'Rabat', coordinates: '34.0209° N, 6.8416° W' },
    payment: { amountHT: 8000, amountTTC: 9600, advance: 8000, remaining: 0, status: 'Réglé' }
  },
];

// Mock activities derived from projects
const FIELD_INTERVENTIONS = [
  { id: 'FI-1', projectId: 'PRJ-2024-001', date: '2024-03-12', type: 'Terrain', title: 'Sortie Bornage' },
  { id: 'FI-2', projectId: 'PRJ-2024-002', date: '2024-03-18', type: 'Terrain', title: 'Levé Complémentaire' },
];

const OFFICE_TASKS = [
  { id: 'OT-1', projectId: 'PRJ-2024-001', date: '2024-03-14', type: 'Bureau', title: 'Calculs & Mise en plan' },
  { id: 'OT-2', projectId: 'PRJ-2024-002', date: '2024-03-20', type: 'Bureau', title: 'Dépôt e-foncier' },
];

const TRANSACTIONS = [
  { id: 'TR-1', projectId: 'PRJ-2024-001', date: '2024-03-10', type: 'Transaction', title: 'Acompte reçu' },
  { id: 'TR-2', projectId: 'PRJ-2024-002', date: '2024-03-25', type: 'Transaction', title: 'Solde réglé' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 2, 1)); // March 2024 for demo
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('overview');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleEventClick = (projectId: string, tab: string) => {
    const project = MOCK_PROJECTS.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setInitialTab(tab);
      setIsPanelOpen(true);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Aggregate all events
  const events = useMemo(() => {
    const evs: any[] = [];
    
    MOCK_PROJECTS.forEach(p => {
      // Creation
      evs.push({ date: parseISO(p.createdAt), type: 'create', title: `Création: ${p.id}`, project: p, tab: 'overview' });
      // Validation if finished
      if (p.status === 'Terminé') {
        evs.push({ date: parseISO(p.createdAt), type: 'validate', title: `Validé: ${p.id}`, project: p, tab: 'overview', icon: CheckCircle2 });
      }
    });

    FIELD_INTERVENTIONS.forEach(f => {
      evs.push({ date: parseISO(f.date), type: 'terrain', title: f.title, projectId: f.projectId, tab: 'missions', icon: MapPin });
    });

    OFFICE_TASKS.forEach(o => {
      evs.push({ date: parseISO(o.date), type: 'bureau', title: o.title, projectId: o.projectId, tab: 'missions', icon: Clock });
    });

    TRANSACTIONS.forEach(t => {
      evs.push({ date: parseISO(t.date), type: 'transaction', title: t.title, projectId: t.projectId, tab: 'billing', icon: CreditCard });
    });

    return evs;
  }, []);

  const getEventsForDay = (day: Date) => {
    return events.filter(e => isSameDay(e.date, day));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-brand-500 uppercase tracking-tight">Calendrier d'Activité</h1>
            <p className="text-muted-foreground text-slate-400 text-sm font-medium">
              Suivi temporel des projets, missions et transactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
                variant="outline"
                className="flex items-center gap-2 bg-white border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 shadow-sm"
              >
                <Link to="/projects">
                  <LayoutGrid size={18} />
                </Link>
            </Button>
            <div className="flex items-center bg-white border border-slate-100 rounded-xl shadow-sm p-1 ml-4">
              <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9 rounded-lg">
                <ChevronLeft size={18} />
              </Button>
              <div className="px-4 font-bold text-sm text-slate-700 min-w-[140px] text-center uppercase tracking-widest">
                {format(currentDate, 'MMMM yyyy', { locale: fr })}
              </div>
              <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 rounded-lg">
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Card: Events */}
          <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CalendarIcon size={20} />
            </div>
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold text-slate-900 leading-none">32</div>
              <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight mt-1">Événements</p>
              <p className="text-[10px] text-slate-400 font-medium">ce mois</p>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-emerald-500 uppercase">
                <TrendingUp size={10} />
                12% <span className="text-slate-300">VS FÉV.</span>
              </div>
            </div>
          </div>

          {/* Card: Validations */}
          <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-800 shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold text-slate-900 leading-none">12</div>
               <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight mt-1">Validations</p>
              <p className="text-[10px] text-slate-400 font-medium">prévues</p>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-500 uppercase">
                <TrendingUp size={10} />
               8% <span className="text-slate-300">VS FÉV.</span>
              </div>
            </div>
          </div>

          {/* Card: Payments */}
          <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-800 shrink-0">
              <Landmark size={20} />
            </div>
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold text-slate-900 leading-none">4</div>
                <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight mt-1">Paiements</p>
              <p className="text-[10px] text-slate-400 font-medium">en attente</p>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-500 uppercase">
                <TrendingDown size={10} />
                  2% <span className="text-slate-300">VS FÉV.</span>
              </div>
            </div>
          </div>

          {/* Card: Missions */}
          <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-800 shrink-0">
              <MapPin size={24} />
            </div>
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold text-slate-900 leading-none">18</div>
               <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight mt-1">Missions</p>
              <p className="text-[10px] text-slate-400 font-medium">programmées</p>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-500 uppercase">
                <TrendingUp size={10} />
               5% <span className="text-slate-300">VS FÉV.</span>
              </div>
            </div>
          </div>

          {/* Card: Delays */}
          <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-800 shrink-0">
              <Clock size={20} />
            </div>
            <div className="flex flex-col items-start">
              <div className="text-2xl font-bold text-slate-900 leading-none">3</div>
 <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-tight mt-1">Retards</p>
              <p className="text-[10px] text-slate-400 font-medium">à traiter</p>
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-500 uppercase">
                <TrendingDown size={10} />
                1% <span className="text-slate-300">VS FÉV.</span>
              </div>
            </div>
          </div>
        </div>

       
        {/* Main Content Area: Calendar + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Calendar Grid */}
          <div className="flex-grow bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden order-2 lg:order-1">
            <div className="grid grid-cols-7 border-b border-slate-100">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                
                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "min-h-[160px] p-2 border-r border-b border-slate-50 transition-colors",
                      !isCurrentMonth ? "bg-slate-50/30" : "bg-white",
                      isSameDay(day, new Date(2024, 2, 6)) && "bg-brand-50/20"
                    )}
                  >
                    <div className="flex justify-between items-center mb-2 px-1">
                      <span className={cn(
                        "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full",
                        isSameDay(day, new Date(2024, 2, 6)) ? "bg-brand-500 text-white shadow-md shadow-brand-200" : "text-slate-400"
                      )}>
                        {format(day, 'd')}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      {dayEvents.map((event, eventIdx) => {
                        const Icon = event.icon || FileText;
                        let colorClass = "bg-slate-100 border-slate-200 text-slate-700";
                        
                        if (event.type === 'create' || event.type === 'validate') colorClass = "bg-emerald-50 border-emerald-100 text-emerald-700";
                        if (event.type === 'terrain') colorClass = "bg-brand-50 border-brand-100 text-brand-700";
                        if (event.type === 'bureau') colorClass = "bg-blue-50 border-blue-100 text-blue-700";
                        if (event.type === 'transaction') colorClass = "bg-amber-50 border-amber-100 text-amber-700";
  
                        return (
                          <button
                            key={eventIdx}
                            onClick={() => handleEventClick(event.project?.id || event.projectId, event.tab)}
                            title={event.title}
                            className={cn(
                              "w-full text-left p-1.5 rounded-lg border text-[9px] font-bold truncate flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]",
                              colorClass
                            )}
                          >
                            <Icon size={10} className="shrink-0" />
                            <span className="truncate">{event.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's Agenda Sidebar */}
          <aside className="w-full lg:w-[340px] shrink-0 sticky top-6 order-1 lg:order-2">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl p-5 h-fit">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-[13px] font-medium text-slate-900 uppercase tracking-widest">Aujourd'hui</h3>
                  <p className="text-xs font-normaltext-slate-400 mt-1">Mercredi 6 mars 2024</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <CalendarIcon size={20} />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-[10px] font-medium text-slate-900 uppercase">4 événements</span>
                <div className="flex-grow h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[40%] h-full bg-slate-800 rounded-full" />
                </div>
              </div>

              <div className="space-y-0 relative before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                {/* Event 1 */}
                <div className="relative pl-10 pb-8 group">
                  <div className="absolute left-[5px] top-2 w-[7px] h-[7px] rounded-full bg-slate-800 ring-4 ring-white z-10" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-900">09:00</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-[13px] font-medium text-slate-800">Mission terrain</h4>
                      <p className="text-[10px] font-normal text-slate-500 uppercase tracking-tight">MT-090</p>
                      <p className="text-[11px] text-slate-400 mt-1">Levés topographiques</p>
                      <div className="flex items-center gap-1 mt-2 text-slate-400">
                        <MapPin size={10} />
                        <span className="text-[10px] font-normal">Ouled Fayet, Alger</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="relative pl-10 pb-8 group">
                  <div className="absolute left-[5px] top-2 w-[7px] h-[7px] rounded-full bg-slate-800 ring-4 ring-white z-10" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-900">11:30</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-[13px] font-medium text-slate-800">Paiement à valider</h4>
                      <p className="text-[10px] font-normal text-slate-500 uppercase tracking-tight">FAC-2024-018</p>
                      <p className="text-[11px] text-slate-400 mt-1">Client: BTP Ouest</p>
                      <Badge className="bg-slate-50 text-slate-600 border-none rounded-lg text-[9px] font-black uppercase px-2 mt-2">
                        Priorité moyenne
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="relative pl-10 pb-8 group">
                  <div className="absolute left-[5px] top-2 w-[7px] h-[7px] rounded-full bg-slate-800 ring-4 ring-white z-10" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-900">14:30</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-[13px] font-medium text-slate-800">Rapport bureau</h4>
                      <p className="text-[10px] font-normal text-slate-500 uppercase tracking-tight">LEV-047</p>
                      <p className="text-[11px] text-slate-400 mt-1">Traitement des données</p>
                      <div className="flex items-center gap-1 mt-2 text-slate-400">
                        <Users size={10} />
                        <span className="text-[10px] font-normal">Équipe bureau</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="relative pl-10 pb-4 group">
                  <div className="absolute left-[5px] top-2 w-[7px] h-[7px] rounded-full bg-slate-800 ring-4 ring-white z-10" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-900">16:00</span>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-[13px] font-medium text-slate-800">Validation</h4>
                      <p className="text-[10px] font-normal text-slate-500 uppercase tracking-tight">PRJ-205</p>
                      <p className="text-[11px] text-slate-400 mt-1">Lotissement El Yasmine</p>
                      <Badge className="bg-slate-50 text-slate-600 border-none rounded-lg text-[9px] font-black uppercase px-2 mt-2">
                        Priorité basse
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6 bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 rounded-2xl py-6 flex items-center justify-between group shadow-sm">
                <span className="text-[13px] font-medium uppercase tracking-tight">Voir tous les événements</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </aside>
        </div>

        <ProjectDetailPanel 
          project={selectedProject}
          isOpen={isPanelOpen}
          initialTab={initialTab}
          onClose={() => setIsPanelOpen(false)}
          onEdit={() => setIsPanelOpen(false)}
        />
      </div>
    </MainLayout>
  );
}
