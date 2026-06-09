export type ProjectStatus = 'Brouillon' | 'Validé' | 'Phase Terrain' | 'Phase Bureau' | 'Clôturé';
export type PaymentStatus = 'Impayé' | 'Partiel' | 'Payé' | undefined;     
export type paymentMode = 'Espèce' | 'Chèque' | 'Virement' | 'Versement' | 'Carte';
export type registryType = 'I' | 'R' | 'M' | 'O';
export type systemZone = 'I' | 'II' | 'III' | 'IV';

export type TvaSelectValue = 'EXEMPT' | '10' | '20';
export type amountType = 'HT' | 'TTC'
export type ClientType = "Moral" |"PHYSICAL"
export interface ClientInfo {
  firstName: string;
  lastName: string;
  phone: string;
  cin: string;
}

export interface referenceSystem{
  id?: string;
  name:string
}
export interface ProjectTypeCreate {
  name: string;
  code: string;
  description:string;
  color: string;
  is_by_default?: boolean;
  is_active?: boolean
}
export interface ProjectTypeRead {
  id?:string;
  name: string;
  code: string;
  description:string;
  color: string;
  is_by_default?: boolean;
  is_active?: boolean;
  created_at?: string
}


export interface ClientRead {
  id?:string;
  first_name: string;
  last_name: string;
  client_type: ClientType;
  cin?:string;
  company_ame?: string;
  ice?:string;
  rc?:string;
  phone_number?:string;
  email?:string;
  address?:string;

}
export interface province {
  id:string;
  name: string;
  communes: commune[];
}
export interface commune{
  id:string;
  name: string;
  lieu_dits: LieuDit[];
}
export interface LocationRegion {
  id:string;
  name: string;
  provinces: province[];
}


export interface PaymentInfo {
  amount_ht: number;
  amount_ttc: number;
  advance: number;
  remaining: number;
  status: PaymentStatus;
}

export interface TeamInfo {
  fieldTeam: string[];
  officeTeam: string[];
}

export interface TechnicalDetails {
  landStatus: string;
  commune: string;
  coordinates: string;
}

export interface FinancialDetails {
  id?:string;
  amountType: amountType
  amount_ht: number;
  amount_ttc: number;
  vat_rate: number;
  is_tax_exempt: boolean;
  is_pro_bono: boolean;
 transactions: Transaction [];
}

export interface Transaction {
  id?:string;
  reference_number?:string
  amount: number;
  payment_mode: paymentMode;
  is_confirmed: boolean;
  documentItem?: DocumentItem;
}

export interface coordinate {
  id?:string;
  x: number;
  y: number;
  s: boolean;
}
export interface Region {
  id:string;
  name: string;
}
export interface Province {
  id:string;
  name: string;
}
export interface LieuDit {
  id?:string;
  name: string;
}
export interface Commune {
  id: string;
  name: string;
}
export interface TopoMetadata {
  id?:string;
  projectType: ProjectTypeRead;
  region: Region;
  province: Province;
  commune: Commune;
  lieu_dit?: LieuDit;
  superficie?: number;
  registry_type: registryType;
  title_number: string;
  title_index: string;
  place_name: string;
  document_type: string;
  designation: string;
  coordinates: coordinate[];
  system_coordinates: coordinate[];
  reference_system: referenceSystem;
  reference_benchmark: string;
  system_zone: systemZone;
  system_notes: string;
}
export interface staffWithRole {
  id?:string;
  agent: staffRead;
  role: roleRead;
}
export interface taskCategory{
  id: string;
  name:string;
}

export interface staffRead {
  id: string;
  full_name:string;

}
export interface officeWork {
  id?:string;
  staff_with_roles: staffWithRole [];
  task_category?: taskCategory;
  description?: string;
  task_date:string;
  time_spent_hour?:number;
  //documentItem: DocumentItem;
}

export interface roleRead{
  id:string;
  name:string;
}

export interface userRead{
  id:string;
  lastname:string;
  firstname:string;
}
export interface fieldIntervention {
  id?:string;
  staff_with_roles: staffWithRole [];
  intervention_date: string;
  observations?: string;
  //documentItem: DocumentItem;

}
interface DocumentItem {
  id: string;
  name: string;
  fileUrl: string;
  mimeType: string;
}
export interface OverviewData {
  projectID: string;
  projectType: string;
  localisation: string;
  clients: ClientData[];
  amountHT: number;
  amountTTC: number;
  vatRate: number;
  isTaxExempt: boolean;
  isProBono: boolean;
  transactions: Transaction [];
  field_interventions: fieldIntervention [];
  office_works: officeWork [];
  Documents: DocumentItem [];

}

export interface ClientData {
  id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  cin: string;
  client_type?: 'Moral' | 'Physical';
  company_name?: string;
  ice?: string;
  rc?: string;
  email?: string;

  
}

export interface ProjectCreate {
  clients : ClientData []
  field_interventions: fieldIntervention [];
  office_works: officeWork [];
  financial_details: FinancialDetails;
  topo_metadata: TopoMetadata;
}

export interface Project {
  id: string;
  reference?:string;
  clients : ClientData []
  field_interventions: fieldIntervention [];
  office_works: officeWork [];
  financial_details: FinancialDetails;
  topo_metadata: TopoMetadata;
}
