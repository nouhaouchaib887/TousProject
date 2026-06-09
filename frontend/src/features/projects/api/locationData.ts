import { LocationRegion, referenceSystem } from "@/types";

export async function getLocations_() {
    const LOCATIONS_DATA = [
  {
    id:"1",
    name: 'Casablanca-Settat',
    provinces: [
      {id:"1",
        name: 'Casablanca',
        communes: [{id:"1",name:'Anfa'},{ id:"2",name:'Maarif'},{ id:"3",name:'Sidi Belyout'},{id:"1",name: 'Ain Chock'}, {id:"1",name:'Hay Hassani'}]
      },
      {id:"2",
        name: 'Nouaceur',
        communes: [{id:"1",name:'Bouskoura'}, {id:"2",name:'Dar Bouazza'},{id:"3",name: 'Nouaceur'},{id:"4",name: 'Oulad Salah'}]
      },
      {id:"3",
        name: 'Settat',
        communes: [{id:"1",name:'Settat'}, {id:"2",name:'Oulad Said'}, {id:"4",name:'Oulad Mrah'}]
      }
    ]
  },
  {id:"2",
    name: 'Rabat-Salé-Kénitra',
    provinces: [
      {id:"1",
        name: 'Rabat',
        communes: [{id:"1",name:'Agdal-Ryad'},{id:"2",name: 'Souissi'}, {id:"17",name:'Youssoufia'}]
      },
      {id:"12",
        name: 'Salé',
        communes: [{id:"1",name:'Bab Lamrisa'}, {id:"12",name:'Layayda'},{ id:"19",name:'Tabriquet'},{ id:"1",name:'Haine'}]
      },
      {id:"13",
        name: 'Kénitra',
        communes: [{id:"1",name:'Kénitra'}, {id:"18",name:'Mehdya'}, {id:"11",name:'Souk El Arbaa'}]
      }
    ]
  },
   {id:"3",
    name: 'Marrakech-Safi',
    provinces: [
      {id:"1",
        name: 'Marrakech',
        communes: [{id:"1",name:'Gueliz'},{ id:"11",name:'Medina'}, {id:"01",name:'Sidi Youssef Ben Ali'}, {id:"19",name:'Targa'}]
      },
      {id:"12",
        name: 'Safi',
        communes: [{id:"8",name:'Safi'},
           {id:"1",name:'Bouguedra'}, {id:"13",name:'Jemaat Shaim'}]
      }
    ]
  }
];

return LOCATIONS_DATA;
}


export async function getLocations():  Promise<LocationRegion[]> {
  
  const API_URL = `http://localhost:8000/api/v1/get_locations`
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

    return data

  } catch (error: any) {
    console.error("Erreur dans GetProjectTypes:", error.message);
    throw error;
  }
}


export async function getReferenceSystems():  Promise<referenceSystem[]> {
  
  const API_URL = `http://localhost:8000/api/v1/get_ref_systems`
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

    return data

  } catch (error: any) {
    console.error("Erreur dans GetReferenceSystems:", error.message);
    throw error;
  }
}