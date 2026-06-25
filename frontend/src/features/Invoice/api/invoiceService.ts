
import{InvoiceCreate, InvoiceTableRead} from '../types'
export const getInvoices = async (): Promise<InvoiceTableRead[]> => {
  return [
    {
      id: "inv-001",
      invoice_type: "Facture Client",
      reference: "FC-2026-0001",
      invoice_date: "2026-06-21",
      due_date: "2026-07-21",
      amount_type: "HT",
      amount_ht: 12000,
      amount_ttc: 14400,
      total_vat: 2400,
      payment_method: "Virement",
      status: "Validée",
      payment_status: "Partiel",
      partner: {
        id: "p-001",
        last_name: "Alaoui",
        first_name: "Ahmed",
        phone_number: "0612345678",
      },
      invoice_items: [
        {
          id: "item-001",
          item:{'label': "Clavier Logitech"} ,
          unit: "Pièce",
          quantity: 10,
          amount_type: "HT",
          amount_ht: 2000,
          amount_ttc: 2400,
          vat_rate: 20,
        },
        {
          id: "item-002",
          item: {'label':"Souris HP"},
          unit: "Pièce",
          quantity: 20,
          amount_type: "HT",
          amount_ht: 10000,
          amount_ttc: 12000,
          vat_rate: 20,
        },
      ],
      transactions: [
        {
          id: "tr-001",
          amount: 5000,
          payment_method: "Espèces",
          payment_date: "2026-06-21",
        },
      ],
    },
    {
      id: "inv-002",
      invoice_type: "Facture Fournisseur",
      reference: "FF-2026-0001",
      invoice_date: "2026-06-20",
      due_date: "2026-07-20",
      amount_type: "TTC",
      amount_ht: 8000,
      amount_ttc: 9600,
      total_vat: 1600,
      payment_method: "Chèque",
      status: "Brouillon",
      payment_status: "Impayé",
      partner: {
        id: "p-002",
        last_name: "Atlas Bureau",
        first_name: "",
        phone_number: "0522123456",
      },
      invoice_items: [],
      transactions: [],
    },
  ];
};
const API_URL = "http://localhost:8000/api/v1";

export async function createInvoice(payload: any) {
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

export async function updateInvoice(invoiceId: string, payload: any) {
  const token = localStorage.getItem("session_token")

  const response = await fetch(`http://localhost:8000/api/v1/projects/${invoiceId}`, {
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


export const getItems = async () => {
  return [
    {
      id: "1",
      label: "Ordinateur Portable HP",
      reference: "PRD-001",
    },
    {
      id: "2",
      label: "Écran Dell 24 pouces",
      reference: "PRD-002",
    },
    {
      id: "3",
      label: "Clavier Logitech K120",
      reference: "PRD-003",
    },
    {
      id: "4",
      label: "Souris Sans Fil HP",
      reference: "PRD-004",
    },
    {
      id: "5",
      label: "Imprimante Canon G3410",
      reference: "PRD-005",
    },
  ]
}

export const getProductCategories = async () => {
  return [
    {
      id: "cat-1",
      reference: "ELEC",
      label: "Électricité",
    },
    {
      id: "cat-2",
      reference: "PLOMB",
      label: "Plomberie",
    },
    {
      id: "cat-3",
      reference: "MAT",
      label: "Matériaux de construction",
    },
    {
      id: "cat-4",
      reference: "PEINT",
      label: "Peinture",
    },
    {
      id: "cat-5",
      reference: "QUINC",
      label: "Quincaillerie",
    },
    {
      id: "cat-6",
      reference: "OUTIL",
      label: "Outillage",
    },
    {
      id: "cat-7",
      reference: "HYD",
      label: "Hydraulique",
    },
    {
      id: "cat-8",
      reference: "ASSAIN",
      label: "Assainissement",
    },
    {
      id: "cat-9",
      reference: "BUREAU",
      label: "Fournitures de bureau",
    },
    {
      id: "cat-10",
      reference: "INFO",
      label: "Informatique",
    },
    {
      id: "cat-11",
      reference: "SECU",
      label: "Sécurité",
    },
    {
      id: "cat-12",
      reference: "JARD",
      label: "Jardinage",
    },
    {
      id: "cat-13",
      reference: "NETT",
      label: "Produits de nettoyage",
    },
    {
      id: "cat-14",
      reference: "MOB",
      label: "Mobilier",
    },
    {
      id: "cat-15",
      reference: "CONS",
      label: "Consommables",
    },
  ]
}
export const generateInvoiceItems = async (target_amount: any) => {
 return [
  {
    id: "1",
    local_id: "tmp-1",
    item: {
      id: "p1",
      reference: "CIM001",
      label: "Ciment CPJ35",
    },
    unit: "BAG",
    quantity: 20,
    amount_type: "HT",
    amount_ht: 1200,
    amount_ttc: 1440,
    vat_rate: 20,
  },
  {
    id: "2",
    local_id: "tmp-2",
    item: {
      id: "p2",
      reference: "ELEC001",
      label: "Câble électrique 2.5mm",
    },
    unit: "METER",
    quantity: 100,
    amount_type: "HT",
    amount_ht: 500,
    amount_ttc: 600,
    vat_rate: 20,
  },
  {
    id: "3",
    local_id: "tmp-3",
    item: {
      id: "p3",
      reference: "PEINT001",
      label: "Peinture blanche",
    },
    unit: "BOX",
    quantity: 5,
    amount_type: "HT",
    amount_ht: 750,
    amount_ttc: 900,
    vat_rate: 20,
  },
  {
    id: "4",
    local_id: "tmp-4",
    item: {
      id: "p4",
      reference: "PLOMB001",
      label: "Tuyau PVC",
    },
    unit: "METER",
    quantity: 50,
    amount_type: "HT",
    amount_ht: 400,
    amount_ttc: 480,
    vat_rate: 20,
  },
  {
    id: "5",
    local_id: "tmp-5",
    item: {
      id: "p5",
      reference: "SAB001",
      label: "Sable fin",
    },
    unit: "TON",
    quantity: 3,
    amount_type: "HT",
    amount_ht: 900,
    amount_ttc: 1080,
    vat_rate: 20,
  },
]
}
