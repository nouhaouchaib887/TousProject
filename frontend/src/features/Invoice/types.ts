interface InvoiceItem{
    id?:string;
    item?:string;
    unit?:string
    quantity?:number
    amount_type:string;
    amount_ttc?:number
    amount_ht?:number
    vat_rate?:number
    
}
interface Transaction{
    id?:string;
    amount:number;
    payment_method?:string
    payment_date?:string
    
}
interface Partner{
    id?:string
    last_name?:string
    first_name?:string
    phone_number?:string
}
export interface InvoiceTableRead {
    id?:string;
    invoice_type?:string
    due_date:string;
    invoice_date:string
    partner?:Partner
    reference?:string;
    amount_type:string;
    amount_ttc?:number
    amount_ht?:number
    vat_rate?:number
    payment_method?:string
    status?:string
    payment_status?:string
    invoice_items?: InvoiceItem[]
    transactions?: Transaction[]

}