export async function createProject(payload: {
  project_type_id: any
  clients?: any[]
  topo_metadata?: any
  financial_details?: any
  field_interventions?: any[]
  office_works?: any[]
}) {
  const token = localStorage.getItem("session_token")

  const response = await fetch("http://localhost:8000/api/v1/add_project", {
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
}

export async function updateProject(projectId: string, payload: any) {
  const token = localStorage.getItem("session_token")

  const response = await fetch(`http://localhost:8000/api/v1/projects/${projectId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export async function getProjects(): Promise<any[]> {
    
    const API_URL = `http://localhost:8000/api/v1/get_projects`
    try {
      const token = localStorage.getItem("session_token")
      const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
    })
  
   if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText)
    }
  
    const data = await response.json()
  
      return data
  
    } catch (error: any) {
      console.error("Erreur dans GetProject:", error.message);
      throw error;
    }
  }