
import {userRead} from '@/types'

export async function getUsers():  Promise<userRead[]> {
  
  const API_URL = `http://localhost:8000/api/v1/get_users`
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

