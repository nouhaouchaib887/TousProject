import { ClientType, PaymentStatus, ProjectStatus, registryType, roleRead, systemZone,staffRead, taskCategory, staffWithRole } from "@/types";

export interface ReferenceSystem {
    id?:string;
    name:string;

}
export interface LieuDit{
    id?:string;
    name:string;
}
export interface clientReadTable {
    id?:string;
    first_name: string;
    last_name: string;
    phone_number: string;
    client_type?: 'Moral' | 'Physical';
    email?: string;
    cin: string;
    company_name?: string;
    ice?: string;
    rc?: string;
}


export interface financialDetailsReadTable {
    id?:string;
    amount_ttc: number;
    amount_ht: number;
    vat_rate: number;
    is_tax_exempt: boolean;
    is_pro_bono: boolean;
    balance: number;
    payment_status: PaymentStatus;
    total_paid: number;
    transactions?: [];
}



export interface fieldInterventionReadTable {
    id?:string;
    staff_with_roles: staffWithRole[]; // Ex: [{"name": "John Doe", "role": "Topographe"}, ...]
    intervention_date: string; // ISO date string
    observations?: string;
}

export interface officeWorkReadTable {
    id?:string;
    staff_with_roles: staffWithRole[]; // Ex: [{"name": "John Doe", "role": "Topographe"}, ...]
    task_date: string; // ISO date string
    description?: string;
    task_category?: taskCategory; // Ex: "Bureau d'études", "Conception", etc.
    time_spent_hour?: number;
}

export interface Coordinartes {
    id?:string;
    x: number;
    y: number;
    s: boolean; // Indique si ce sont des coordonnées système ou de référence
}

export interface topometadataReadTable {
    id?:string;
    status: ProjectStatus; // Brouillon, Validé, Phase Terrain, Phase Bureau, Clôturé
    registry_type?: registryType; // Titre foncier, Certificat d'urbanisme, etc.
    title_number?: string; // Numéro du titre foncier ou certificat
    title_index?: string; // Index du titre si applicable
    document_type?: string; // Ex: "Pour Moulkia"
    designation?: string; // Désignation si le type de registre est "Autre"
    created_at: string; // Date de création
    updated_at: string; // Date de mise à jour
    updated_by_id?: string; // ID de l'utilisateur qui a effectué la dernière mise à jour (pour audit)
    commune?: {id: string, name: string}; // Liste des communes associées
    place_name?: string; // Lieu-dit
    coordinates: Coordinartes[]; // Coordonnées de référence
    reference_system?: ReferenceSystem; // Ex: "Lambert 93", "WGS 84"
    lieu_dit?: LieuDit;
    reference_benchmark?: string; // Point de référence pour les altitudes
    system_zone?: systemZone; // Zone Lambert (I, II, III, IV)
    system_coordinates?: Coordinartes[];
}

 export interface ProjectTableReadPayload {
    id: string; 
    reference: string;
    project_type: {id: string, name: string} | null; // Ex: {"id": "uuid", "name": "Type Name"} ou null si non défini
    status: ProjectStatus;
    created_at: string;
    updated_at: string;
    updated_by?: {id: string, full_name: string}; // Pour afficher le nom de l'utilisateur qui a effectué la dernière mise à jour
    clients: clientReadTable[];
    financial_details?: financialDetailsReadTable;
    field_interventions?: fieldInterventionReadTable[];
    office_works?: officeWorkReadTable[];
    topo_metadata?: topometadataReadTable;
}




    