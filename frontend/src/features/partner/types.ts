export type LegalType = "Moral" |"PHYSICAL"
export interface Partner{
    id?:string
    last_name?:string
    first_name?:string
    full_name?:string
    company_name?:string
    phone_number?:string
    address?:string
    cin?:string
    legal_type: LegalType
    rc?:string
    ice?:string
    credit_limit?: number
    notes?:string
    is_active?: boolean
    is_customer: boolean
    is_supplier: boolean
}