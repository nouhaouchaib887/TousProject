import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  GeoJSON, 
  useMap,
  useMapEvents,
  LayersControl,
  ImageOverlay
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  Filter, 
  Layers, 
  Maximize2, 
  PanelLeftClose, 
  PanelLeftOpen,
  MapPin,
  FileText,
  User,
  Activity,
  Ruler,
  Square,
  Crosshair,
  Navigation,
  ChevronRight,
  Info,
  Library,
  Eye,
  EyeOff,
  RefreshCw,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  projectGeoJSON, 
  cadastreGeoJSON, 
  planAmenagementGeoJSON 
} from '@/features/projects/data/mapMockData';

// Layout components
import AppSidebar from '@/components/layout/AppSideBar';
import Topbar from '@/components/layout/AppTopbar';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Helper component for mouse coordinates
const MouseCoordinates = ({ 
  onMove, 
  format 
}: { 
  onMove: (lat: number, lng: number) => void,
  format: 'wgs84' | 'lambert' 
}) => {
  useMapEvents({
    mousemove(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

// Helper component for FlyTo
const FlyToLocation = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  return null;
};

// Helper component for Resize
const ResizeMap = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [isSidebarOpen, map]);
  return null;
};

const MapModulePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'streets' | 'satellite'>('streets');
  const [mapCenter, setMapCenter] = useState<[number, number]>([33.5731, -7.5898]); // Casablanca
  const [mapZoom, setMapZoom] = useState(13);
  const [mousePos, setMousePos] = useState<{lat: number, lng: number}>({lat: 33.5731, lng: -7.5898});
  const [coordFormat, setCoordFormat] = useState<'wgs84' | 'lambert'>('wgs84');
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);

  // Layers state
  const [layers, setLayers] = useState({
    topo: { visible: true, opacity: 100 },
    cadastre: { visible: true, opacity: 100 },
    amenagement: { visible: true, opacity: 40 },
    archives: { visible: false, opacity: 80 }
  });
  
  const geojsonRef = useRef<any>(null);

  // Status colors mapping
  const statusColors: Record<string, string> = {
    'En cours': '#3b82f6', // blue-500
    'Livré': '#10b981',    // emerald-500
    'Suspendu': '#f59e0b',  // amber-500
    'Facturé': '#6366f1',   // indigo-500
  };

  // Filter projects based on search and status
  const filteredProjects = useMemo(() => {
    return projectGeoJSON.features.filter((feature: any) => {
      const props = feature.properties;
      const geom = feature.geometry;
      
      // Text search
      const matchesText = 
        props.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        props.client.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Coordinate search (check if query matches lat or lng)
      let matchesCoords = false;
      if (geom.type === 'Point') {
        const [lng, lat] = geom.coordinates;
        matchesCoords = lat.toString().includes(searchQuery) || lng.toString().includes(searchQuery);
      }

      const matchesSearch = matchesText || matchesCoords;
      
      const matchesStatus = 
        statusFilter.length === 0 || statusFilter.includes(props.status);
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  // Style for GeoJSON features
  const getFeatureStyle = (feature: any) => {
    const status = feature.properties.status;
    const color = statusColors[status] || '#94a3b8';
    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.6,
      radius: 8
    };
  };

  const pointToLayer = (feature: any, latlng: L.LatLng) => {
    const status = feature.properties.status;
    const color = statusColors[status] || '#94a3b8';
    
    // Custom circle marker
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    });
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties;
    const popupContent = `
      <div class="p-1 min-w-[200px]">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">Réf: ${props.reference}</span>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold text-white uppercase" style="background-color: ${statusColors[props.status]}">
            ${props.status}
          </span>
        </div>
        <h3 class="text-sm font-black text-slate-800 mb-1">${props.client}</h3>
        <p class="text-xs text-slate-500 mb-3">${props.type_travail}</p>
        <div class="border-t border-slate-100 pt-2 flex justify-between items-center">
            <span class="text-[10px] text-slate-400 font-medium">${props.date}</span>
            <button class="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-tight flex items-center gap-1" onclick="console.log('Open project: ${props.reference}')">
                Ouvrir fiche <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
        </div>
      </div>
    `;
    layer.bindPopup(popupContent, {
      className: 'custom-popup',
      maxWidth: 300
    });
  };

  const handleProjectClick = (feature: any) => {
    let coords: [number, number];
    if (feature.geometry.type === 'Point') {
      coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
    } else {
      // For polygon, get the center of the first ring (simplified)
      const ring = feature.geometry.coordinates[0];
      let sumLat = 0, sumLng = 0;
      ring.forEach((c: number[]) => {
        sumLng += c[0];
        sumLat += c[1];
      });
      coords = [sumLat / ring.length, sumLng / ring.length];
    }
    setMapCenter(coords);
    setMapZoom(16);
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'En cours': 'bg-blue-100 text-blue-700',
      'Livré': 'bg-emerald-100 text-emerald-700',
      'Suspendu': 'bg-amber-100 text-amber-700',
      'Facturé': 'bg-indigo-100 text-indigo-700',
    };
    return <Badge className={`text-[9px] font-bold uppercase tracking-tighter ${colors[status] || ''}`}>{status}</Badge>;
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden relative">
          <Topbar />
          
          <main className="flex-1 relative flex overflow-hidden">
            {/* Map sidebar (internal to module) */}
            <div 
              className={cn(
                "h-full transition-all duration-300 bg-white flex flex-col z-20 relative overflow-hidden shrink-0",
                isSidebarOpen ? "w-80 border-r border-slate-200 shadow-xl" : "w-0 border-r-0 shadow-none"
              )}
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3 whitespace-nowrap">
                   <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-200 shrink-0">
                     <Navigation size={18} fill="currentColor" />
                   </div>
                   <div className="flex flex-col">
                      <h1 className="text-sm font-black text-slate-900 uppercase tracking-tight">Projets</h1>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Explorateur</p>
                   </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="h-8 w-8 text-slate-400 hover:text-slate-900 rounded-full"
                >
                  <PanelLeftClose size={18} />
                </Button>
              </div>

              <div className="p-4 space-y-4 overflow-hidden flex flex-col flex-1 min-h-0 bg-slate-50/30">
                {/* Search */}
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-500 transition-colors" size={16} />
                  <Input 
                    placeholder="Rechercher (Réf, Client, X,Y)..." 
                    className="pl-9 h-11 bg-white border-slate-200 rounded-2xl text-xs font-medium focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div className="space-y-2 shrink-0">
                   <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Filtres Statut</span>
                      <Button variant="ghost" className="h-4 p-0 text-[10px] font-bold text-brand-600" onClick={() => setStatusFilter([])}>Tout effacer</Button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {Object.keys(statusColors).map(status => (
                        <button 
                          key={status}
                          onClick={() => {
                              setStatusFilter(prev => 
                                prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                              );
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${
                              statusFilter.includes(status) 
                              ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-100 scale-105' 
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Projects List */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden pt-2 border-t border-slate-100">
                   <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-[11px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-2">
                          <Activity size={14} className="text-brand-600" />
                          Projets ({filteredProjects.length})
                      </span>
                   </div>
                   
                   <ScrollArea className="flex-1 -mx-2 px-2 h-full">
                     <div className="space-y-3 pb-4">
                       {filteredProjects.map((feature: any) => (
                         <Card 
                           key={feature.properties.reference}
                           className="p-3 bg-white border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                           onClick={() => handleProjectClick(feature)}
                         >
                           <div 
                              className="absolute left-0 top-0 bottom-0 w-1" 
                              style={{ backgroundColor: statusColors[feature.properties.status] }}
                           />
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] font-black text-slate-400 tracking-wider">#{feature.properties.reference}</span>
                              {getStatusBadge(feature.properties.status)}
                           </div>
                           <h4 className="text-xs font-black text-slate-800 group-hover:text-brand-600 transition-colors">{feature.properties.client}</h4>
                           <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tight flex items-center gap-1">
                              <MapPin size={10} className="text-slate-400" /> 
                              {feature.properties.type_travail}
                           </p>
                           
                           <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
                              <span className="text-[9px] font-bold text-slate-400">{feature.properties.date}</span>
                              <ChevronRight size={12} className="text-slate-300 group-hover:text-brand-500 transform group-hover:translate-x-1 transition-all" />
                           </div>
                         </Card>
                       ))}
                       {filteredProjects.length === 0 && (
                         <div className="py-12 text-center space-y-3">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
                              <Search size={24} />
                            </div>
                            <p className="text-xs font-bold text-slate-400 italic">Aucun projet trouvé.</p>
                         </div>
                       )}
                     </div>
                   </ScrollArea>
                </div>
              </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative bg-slate-200 overflow-hidden">
              {!isSidebarOpen && (
                <Button 
                  className="absolute top-4 left-4 z-10 bg-white text-slate-900 hover:bg-slate-50 shadow-xl rounded-2xl px-3 border border-slate-200 h-11"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <PanelLeftOpen size={18} className="mr-2" />
                  <span className="text-xs font-black uppercase tracking-tight">Liste Projets</span>
                </Button>
              )}

              {/* Floating Map Controls - Top Center (Search/Coord) */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                 <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 shadow-2xl flex items-center gap-4">
                    <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
                       <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                         {coordFormat === 'wgs84' ? 'WGS84' : 'Lambert'}
                       </span>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-0.5 tracking-tighter">
                            {coordFormat === 'wgs84' ? 'Latitude' : 'X (coord)'}
                          </span>
                          <span className="text-[11px] font-black text-slate-900 tabular-nums">
                            {coordFormat === 'wgs84' ? mousePos.lat.toFixed(6) : (mousePos.lat * 111111).toFixed(2)}
                          </span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-slate-400 uppercase leading-none mb-0.5 tracking-tighter">
                            {coordFormat === 'wgs84' ? 'Longitude' : 'Y (coord)'}
                          </span>
                          <span className="text-[11px] font-black text-slate-900 tabular-nums">
                            {coordFormat === 'wgs84' ? mousePos.lng.toFixed(6) : (mousePos.lng * 111111).toFixed(2)}
                          </span>
                       </div>
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-slate-100 rounded-full text-brand-600"
                        onClick={() => setCoordFormat(prev => prev === 'wgs84' ? 'lambert' : 'wgs84')}
                       >
                         <RefreshCw size={14} className={cn(coordFormat === 'lambert' && "rotate-180 transition-transform")} />
                       </Button>
                    </div>
                 </div>
              </div>

              {/* Floating Tools Controls - Left Side */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 flex flex-col gap-2">
                 <TooltipProvider>
                    <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-2xl flex flex-col gap-1">
                      {[
                        { icon: <Ruler size={18} />, label: "Mesurer distance" },
                        { icon: <Square size={18} />, label: "Calculer surface" },
                        { icon: <Target size={18} />, label: "Cible / Cordonnées" },
                      ].map((tool, i) => (
                        <div key={i}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                                {tool.icon}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <span className="text-xs font-bold uppercase tracking-tight">{tool.label}</span>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                 </TooltipProvider>
              </div>

              {/* Advanced Layer Manager - Bottom Right */}
              <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-3 items-end">
                  {isLayerPanelOpen && (
                    <Card className="mb-4 w-72 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                         <span className="text-xs font-black uppercase tracking-widest text-slate-900">Gestionnaire de Couches</span>
                         <Library size={16} className="text-brand-600" />
                      </div>
                      
                      <ScrollArea className="h-80">
                        <div className="p-4 space-y-6">
                           {/* Base Maps */}
                           <div className="space-y-3">
                             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Fonds de Plan</h4>
                             <div className="grid grid-cols-2 gap-2">
                               <button 
                                 onClick={() => setViewMode('streets')}
                                 className={cn(
                                   "p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all",
                                   viewMode === 'streets' ? "bg-brand-50 border-brand-200 text-brand-700" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                 )}
                               >
                                 <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                   <div className="w-full h-full bg-[url('https://{s}.tile.openstreetmap.org/13/4194/2813.png')] bg-cover" />
                                 </div>
                                 Plan
                               </button>
                               <button 
                                 onClick={() => setViewMode('satellite')}
                                 className={cn(
                                   "p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all",
                                   viewMode === 'satellite' ? "bg-brand-50 border-brand-200 text-brand-700" : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                                 )}
                               >
                                 <div className="w-full h-8 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                   <div className="w-full h-full bg-[url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/4785/3196')] bg-cover" />
                                 </div>
                                 Satellite
                               </button>
                             </div>
                           </div>

                           {/* Overlays */}
                           <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Couches Métier</h4>
                             {[
                               { id: 'topo', label: 'Projets Topo', color: 'bg-brand-500' },
                               { id: 'cadastre', label: 'Mappe Cadastrale', color: 'bg-rose-500' },
                               { id: 'amenagement', label: 'Plan d\'Aménagement', color: 'bg-amber-500' },
                               { id: 'archives', label: 'Archives (Image)', color: 'bg-indigo-500' }
                             ].map((l) => (
                               <div key={l.id} className="space-y-2">
                                 <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                     <button 
                                       onClick={() => setLayers(prev => ({...prev, [l.id]: {...prev[l.id as keyof typeof layers], visible: !prev[l.id as keyof typeof layers].visible}}))}
                                       className={cn(
                                         "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                         layers[l.id as keyof typeof layers].visible ? "bg-brand-600 border-brand-600 text-white" : "border-slate-300"
                                       )}
                                     >
                                       {layers[l.id as keyof typeof layers].visible && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                     </button>
                                     <span className="text-[11px] font-bold text-slate-700">{l.label}</span>
                                   </div>
                                   <div className={cn("w-2 h-2 rounded-full", l.color)} />
                                 </div>
                                 <div className="flex items-center gap-3 pl-6">
                                   <input 
                                     type="range" 
                                     min="0" max="100" 
                                     value={layers[l.id as keyof typeof layers].opacity}
                                     onChange={(e) => setLayers(prev => ({...prev, [l.id]: {...prev[l.id as keyof typeof layers], opacity: parseInt(e.target.value)}}))}
                                     className="flex-1 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                   />
                                   <span className="text-[9px] font-black text-slate-400 tabular-nums w-6">{layers[l.id as keyof typeof layers].opacity}%</span>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>
                      </ScrollArea>
                    </Card>
                  )}

                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
                      className={cn(
                        "h-12 px-6 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl transition-all gap-2",
                        isLayerPanelOpen ? "bg-slate-900 text-white" : "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200"
                      )}
                    >
                        <Library size={18} />
                        📚 Couches
                    </Button>
                    
                    <div className="bg-brand-600 text-white p-3.5 rounded-2xl shadow-2xl shadow-brand-200 cursor-pointer hover:bg-brand-700 transition-all hover:scale-110 active:scale-95 group">
                        <Maximize2 size={20} className="group-hover:rotate-12 transition-all" />
                    </div>
                  </div>
              </div>

              {/* Leaflet Map */}
              <MapContainer 
                center={[33.5731, -7.5898]} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                className="z-0"
              >
                <TileLayer
                  url={viewMode === 'streets' 
                    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  }
                />
                
                <MouseCoordinates onMove={(lat, lng) => setMousePos({lat, lng})} format={coordFormat} />
                <ResizeMap isSidebarOpen={isSidebarOpen} />
                <FlyToLocation center={mapCenter} zoom={mapZoom} />

                {/* Layer 1: Plan d'Aménagement */}
                {layers.amenagement.visible && (
                  <GeoJSON 
                    data={planAmenagementGeoJSON as any}
                    style={(feature: any) => ({
                      fillColor: feature.properties.color,
                      fillOpacity: layers.amenagement.opacity / 100,
                      weight: 1,
                      color: 'white',
                      opacity: 0.5
                    })}
                  />
                )}

                {/* Layer 2: Mappe Cadastrale */}
                {layers.cadastre.visible && (
                  <GeoJSON 
                    data={cadastreGeoJSON as any}
                    style={{
                      fillOpacity: 0,
                      weight: 2,
                      color: 'red',
                      opacity: layers.cadastre.opacity / 100
                    }}
                  />
                )}

                {/* Layer 3: Projets Topo */}
                {layers.topo.visible && (
                  <GeoJSON 
                    key={JSON.stringify(filteredProjects)}
                    data={{
                        type: 'FeatureCollection',
                        features: filteredProjects
                    } as any}
                    style={(feature: any) => ({
                      ...getFeatureStyle(feature),
                      fillOpacity: (layers.topo.opacity / 100) * 0.6,
                      opacity: layers.topo.opacity / 100
                    })}
                    pointToLayer={pointToLayer}
                    onEachFeature={onEachFeature}
                  />
                )}

                {/* Layer 4: Archives (Image Overlay) */}
                {layers.archives.visible && (
                  <ImageOverlay 
                    url="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000"
                    bounds={[[33.570, -7.585], [33.585, -7.600]]}
                    opacity={layers.archives.opacity / 100}
                  />
                )}
              </MapContainer>

              <style dangerouslySetInnerHTML={{ __html: `
                .leaflet-container { background-color: #f1f5f9; }
                .custom-popup .leaflet-popup-content-wrapper {
                  background: rgba(255, 255, 255, 0.95);
                  backdrop-filter: blur(8px);
                  border-radius: 1.25rem;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
                  padding: 4px;
                  border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .custom-popup .leaflet-popup-tip { background: rgba(255, 255, 255, 0.95); }
                .leaflet-popup-close-button { padding: 8px !important; color: #94a3b8 !important; }
              `}} />
            </div>
          </main>
        </div>
      </div>
      <Toaster position="top-right" />
    </SidebarProvider>
  );
};

export default MapModulePage;
