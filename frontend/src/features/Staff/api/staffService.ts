
import {staffRead} from '@/types'
export const addStaff = async (staffData: any) => {
 const API_URL = `http://localhost:8000/api/v1/add_staff`; // À adapter selon ton env

  try {
  const payload = {
    ...staffData
  };
  const token = localStorage.getItem("session_token")
  const response = await fetch(`http://localhost:8000/api/v1/add_staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

    const result = await response.json();

    if (!response.ok) {
      // Gère les erreurs de validation (422) ou les erreurs métier (400)
      // FastAPI renvoie souvent les détails dans result.detail
      const errorMessage = Array.isArray(result.detail) 
        ? result.detail[0].msg 
        : result.detail || "Une erreur est survenue";
        
      throw new Error(errorMessage);
    }

    return result; // Retourne le client créé avec son ID
  } catch (error: any) {
    console.error("Erreur dans Add  Staff:", error.message);
    throw error;
  }
};

export async function getStaff():  Promise<staffRead[]> {
  
  const API_URL = `http://localhost:8000/api/v1/get_staff`
  try {
    const token = localStorage.getItem("session_token")
    const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
       //Authorization: `Bearer ${token}`,
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

export async function getRoles():  Promise<staffRead[]> {
  
  const API_URL = `http://localhost:8000/api/v1/get_roles`
  try {
    const token = localStorage.getItem("session_token")
    const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
       //Authorization: `Bearer ${token}`,
    },
  })

 if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  const data = await response.json()

    return data

  } catch (error: any) {
    console.error("Erreur dans GetRoles:", error.message);
    throw error;
  }
}



