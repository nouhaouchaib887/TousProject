import { ClientRead } from "@/types";
export async function getClients_(){
    const MOCK_BACKEND_CLIENTS = [
  { id: '101', name: 'Alami Mohamed', cin: 'AB123456', type: 'Particulier' },
  { id: '102', name: 'Bennani Sarah', cin: 'CD789012', type: 'Particulier' },
  { id: '103', name: 'S.A.R.L. Atlas Construction', cin: 'RC45678', type: 'Entreprise' },
  { id: '104', name: 'Oumaima El Fassy', cin: 'EF112233', type: 'Particulier' },
  { id: '105', name: 'Immobilier Confort', cin: 'RC99887', type: 'Entreprise' },
];
return MOCK_BACKEND_CLIENTS;
}

export async function getClients():  Promise<ClientRead[]> {
  
  const API_URL = `http://localhost:8000/api/v1/get_clients`
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
    console.error("Erreur dans GetProjectTypes:", error.message);
    throw error;
  }
}