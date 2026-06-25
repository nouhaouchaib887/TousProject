export interface ProductCategory {
    id?:string
    label: string

}


export interface ProductCreate{
    id?:string
    label:string
    product_category: ProductCategory
    unit: string
    margin_rate: number
    vat_rate: number
    min_stock_level: number
    is_purchasable: boolean
    is_sellable: boolean
}