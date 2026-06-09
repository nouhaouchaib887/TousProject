import { Project } from './types';

export const MOCK_PROJECTS: any[] = [
  {
    id: "PRJ-2024-001",
    projectType: "Lotissement",
    status: "Phase Terrain",
    client: {
      firstName: "Ahmed",
      lastName: "Alami",
      phone: "06 61 22 33 44",
      cin: "BJ123456"
    },
    payment: {
      amountHT: 15000,
      amountTTC: 18000,
      advance: 5000,
      remaining: 13000,
      status: "Partiel"
    },
    teams: {
      fieldTeam: ["Yassine (Chef)", "Omar"],
      officeTeam: ["Sara"]
    },
    details: {
      landStatus: "Titre Foncier",
      commune: "Dar Bouazza",
      coordinates: "33.523, -7.812"
    },
    createdAt: "2024-03-15"
  },
  {
    id: "PRJ-2024-002",
    projectType: "Mise à jour",
    status: "Validé",
    client: {
      firstName: "Fatima",
      lastName: "Zahra",
      phone: "06 70 11 22 33",
      cin: "K456789"
    },
    payment: {
      amountHT: 8000,
      amountTTC: 9600,
      advance: 0,
      remaining: 9600,
      status: "Impayé"
    },
    teams: {
      fieldTeam: ["Khalid"],
      officeTeam: ["Sara", "Mehdi"]
    },
    details: {
      landStatus: "Melk",
      commune: "Bouskoura",
      coordinates: "33.448, -7.648"
    },
    createdAt: "2024-03-20"
  },
  {
    id: "PRJ-2024-003",
    type: "Bornage",
    status: "Brouillon",
    client: {
      firstName: "Mohamed",
      lastName: "Idrissi",
      phone: "06 55 44 33 22",
      cin: "G987654"
    },
    payment: {
      amountHT: 3500,
      amountTTC: 4200,
      advance: 4200,
      remaining: 0,
      status: "Payé"
    },
    teams: {
      fieldTeam: [],
      officeTeam: ["Mehdi"]
    },
    details: {
      landStatus: "Réquisition",
      commune: "Mohammedia",
      coordinates: "33.683, -7.384"
    },
    createdAt: "2024-04-01"
  }
];
