
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