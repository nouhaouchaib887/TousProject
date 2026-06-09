
export const addClient = async (clientData: any, attachmentId:  string) => {
 const API_URL = `http://localhost:8000/api/v1/add_client`; // À adapter selon ton env

  try {
  const payload = {
    ...clientData,
    attachment_id: attachmentId,
  };

  const response = await fetch(`http://localhost:8000/api/v1/add_client`, {
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
    console.error("Erreur dans AddClient:", error.message);
    throw error;
  }
};

export async function uploadCin(file: File) {
  const token = localStorage.getItem("session_token");

  if (!token) {
    throw new Error("Non authentifié");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`http://localhost:8000/api/v1/upload_cin`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erreur lors de l’upload du CIN");
  }
   return data;
  
}
export const updateClient = async (clientId: string, clientData: any, attachmentId?: string) => {
  console.log('Updating client:', clientId, clientData, 'with attachment:', attachmentId);
  return {
    id: clientId,
    ...clientData,
    attachmentId: attachmentId || 'existing_attachment_id'
  };
};


export async function getQualities():  Promise<any[]> {
  
  const API_URL = `http://localhost:8000/api/v1/get_qualities`
  try {
    const token = localStorage.getItem("session_token")
    const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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