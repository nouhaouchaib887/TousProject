export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  totalOrders: number;
  totalSpent: number;
}

export interface Fournisseur {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  productsSuppliedCount: number;
}

export interface Produit {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; // Selling Price
  buyPrice: number; // Acquisition Price
  stockQuantity: number;
  minStockThreshold: number;
  unit: string; // e.g., 'pcs', 'kg', 'liters', 'boxes'
  status: 'in_stock' | 'out_of_stock' | 'low_stock';
  supplierId?: string;
  supplierName?: string;
}

export interface CommandeProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Commande {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  products: CommandeProduct[];
  totalAmount: number;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
}

export interface Facture {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
  nature?: string;
  paymentMethod?: string;
}

export interface Paiement {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  date: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'check';
  reference?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  date: string;
  reason: string;
  author: string;
  previousQty: number;
  newQty: number;
}

export interface SystemSettings {
  companyName: string;
  currency: string;
  lowStockAlert: boolean;
  taxRate: number;
  language: 'fr' | 'en';
}

export type ActiveModule =
  | 'dashboard'
  | 'factures'
  | 'paiements'
  | 'clients'
  | 'fournisseurs'
  | 'produits'
  | 'stock'
  | 'commandes'
  | 'banques_caisses'
  | 'rapports'
  | 'parametres';
