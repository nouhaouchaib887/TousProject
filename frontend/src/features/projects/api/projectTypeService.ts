import { ProjectTypeCreate, ProjectTypeRead } from "@/types";

// features/projects/api/projectTypesApi.ts
export async function get_ProjectTypes() {
  
    const PROJECT_TYPES = [
  { id: '1', name: 'Levé Topographique', code: 'LT', color: '#0b273f', description: "", isByDefault:false, isActive:true },
  { id: '2', name: 'Bornage', code: 'BR', color: '#10b981' , description: "", isByDefault:false, isActive:true},
  { id: '3', name: 'Cadrage', code: 'CD', color: '#f59e0b' , description: "", isByDefault:false, isActive:true},
  { id: '4', name: 'Mise en concordance', code: 'MC', color: '#8b5cf6', description: "", isByDefault:false, isActive:true },
  { id: '5', name: 'Copropriété', code: 'CP', color: '#ec4899' , description: "", isByDefault:false, isActive:true},
  { id: '6', name: 'V.R.D', code: 'VRD', color: '#f43f5e', description: "", isByDefault:false, isActive:true },
];

    return PROJECT_TYPES;
}

export async function createProjectType(newType: ProjectTypeCreate) {
    // Here you would make an API call to create the project type in your backend
    const API_URL = `http://localhost:8000/api/v1/add_project_type`; // À adapter selon ton env

  try {
  const payload = {
    ...newType
  };
 
  const token = localStorage.getItem("session_token")

  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  return response.json()
  } catch (error: any) {
    console.error("Erreur dans AddProjectType:", error.message);
    throw error;
  }
};


export async function getProjectTypes():  Promise<ProjectTypeRead[]> {
  
  const API_URL = `http://localhost:8000/api/v1/get_project_types`
  try {
    const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  })

 if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  const data = await response.json()

    return data.map((item: any) => ({
      ...item
    }))

  } catch (error: any) {
    console.error("Erreur dans GetProjectTypes:", error.message);
    throw error;
  }
}