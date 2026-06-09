export async function getTasks() {
    const availableTasks = [
  {
    id: "DATA_PROCESSING",
    name: "Traitement des données terrain",
  },
  {
    id: "CAD_DRAWING",
    name: "Dessin DAO / CAO",
  },
  {
    id: "CALCULATIONS",
    name: "Calculs topographiques",
  },
  {
    id: "BOUNDARY_ANALYSIS",
    name: "Analyse foncière et limites",
  },
  {
    id: "PLAN_PRODUCTION",
    name: "Établissement des plans",
  },
  {
    id: "REPORT_WRITING",
    name: "Rédaction des rapports",
  },
  {
    id: "DOCUMENT_PREPARATION",
    name: "Préparation des dossiers administratifs",
  },
  {
    id: "QUALITY_CONTROL",
    name: "Contrôle et validation technique",
  },
  {
    id: "CLIENT_REVISIONS",
    name: "Corrections et modifications client",
  },
  {
    id: "ARCHIVING",
    name: "Archivage et classement",
  },
  {
    id: "COORDINATE_SYSTEM",
    name: "Gestion des systèmes de coordonnées",
  },
  {
    id: "GIS_PROCESSING",
    name: "Traitement SIG",
  },
  {
    id: "PHOTOGRAMMETRY",
    name: "Photogrammétrie / Drone",
  },
  {
    id: "MODELING_3D",
    name: "Modélisation 3D",
  },
  {
    id: "OTHER",
    name: "Autre",
  },
]
return availableTasks;
}

