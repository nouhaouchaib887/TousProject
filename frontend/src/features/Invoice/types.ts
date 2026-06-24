
export interface Product{
    id?: string
    label?:string
    reference?:string
}


export interface InvoiceItem{
    id?:string;
    local_id?:string
    item?:Product;
    unit?:string
    quantity?:number
    amount_type:string;
    amount_ttc?:number
    amount_ht?:number
    vat_rate?:number
    
}
export interface Transaction{
    id?:string;
    reference?:string;
    local_id?:string;
    amount:number;
    payment_method?:string
    payment_reference?:string
    payment_date?:string
    check_date?:string 
    
}
export interface Partner{
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
    total_vat?:number
    payment_method?:string
    payment_reference?:string
    expected_check_date?:string 
    status?:string
    payment_status?:string
    invoice_items: InvoiceItem[]
    transactions: Transaction[]

}

export interface InvoiceMetaData {
    reference?:string
    due_date:string;
    invoice_date:string
    partner?:Partner
    invoice_type?:string;
    payment_method?:string
    expected_check_number?: string
    expected_check_date?: string
}
export interface InvoiceCreate {
    id?:string
    invoice_metadata: InvoiceMetaData
    invoice_items: InvoiceItemsDataSection
    transactions: Transaction[]


}

export interface InvoiceItemsDataSection{
    invoice_items?: InvoiceItem []
    amount_type:string;
    amount_ttc?:number
    amount_ht?:number
    total_vat?: number
}