import { Client, Fournisseur, Produit, Commande, Facture, Paiement, StockMovement, SystemSettings } from '../types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c-1',
    name: 'Youssef El Amrani',
    company: 'SARL ElectroPro',
    email: 'youssef@electropro.ma',
    phone: '+212 661-234567',
    address: 'Anfa, Boulevard d\'Anfa, Casablanca',
    status: 'active',
    totalOrders: 15,
    totalSpent: 45200,
  },
  {
    id: 'c-2',
    name: 'Bouchra Benslimane',
    company: 'Boutique L\'Étoile',
    email: 'contact@letoile.ma',
    phone: '+212 662-987654',
    address: 'Gauthier, Rue Tarik Ibn Ziad, Casablanca',
    status: 'active',
    totalOrders: 8,
    totalSpent: 12400,
  },
  {
    id: 'c-3',
    name: 'Ahmad Al-Mansouri',
    company: 'Alimentation Bilal',
    email: 'ahmad.bilal@gmail.com',
    phone: '+212 650-112233',
    address: 'Agdal, Avenue de France, Rabat',
    status: 'active',
    totalOrders: 3,
    totalSpent: 3500,
  },
  {
    id: 'c-4',
    name: 'Karima Touazi',
    company: 'Tech Solutions S.A.R.L',
    email: 'k.touazi@techsolutions.ma',
    phone: '+212 660-556677',
    address: 'Sidi Maârouf, Bouskoura, Casablanca',
    status: 'inactive',
    totalOrders: 0,
    totalSpent: 0,
  }
];

export const INITIAL_SUPPLIERS: Fournisseur[] = [
  {
    id: 'f-1',
    name: 'TechDistri Europe',
    contactName: 'Hans Muller',
    email: 'info@techdistri.com',
    phone: '+33 1 42 68 53 00',
    address: 'Rue de la Paix, Paris, France',
    status: 'active',
    productsSuppliedCount: 12,
  },
  {
    id: 'f-2',
    name: 'SomaLog Maroc',
    contactName: 'Morad Bennani',
    email: 'm.bennani@somalog.co.ma',
    phone: '+212 522-889900',
    address: 'Zone Industrielle, Mohammedia',
    status: 'active',
    productsSuppliedCount: 6,
  },
  {
    id: 'f-3',
    name: 'Global Supply Import',
    contactName: 'Jane Zhao',
    email: 'logistics@globalsupply.cn',
    phone: '+86 21 6123 4567',
    address: 'Pudong New District, Shanghai, China',
    status: 'inactive',
    productsSuppliedCount: 0,
  }
];

export const INITIAL_PRODUCTS: Produit[] = [
  {
    id: 'p-1',
    name: 'Ecran PC 27" IPS QHD (144Hz)',
    sku: 'PR-SCR-27',
    category: 'Écrans',
    price: 3200,
    buyPrice: 2100,
    stockQuantity: 45,
    minStockThreshold: 10,
    unit: 'Unités',
    status: 'in_stock',
    supplierId: 'f-1',
    supplierName: 'TechDistri Europe'
  },
  {
    id: 'p-2',
    name: 'Souris Sans Fil Ergonomique MX 3',
    sku: 'PR-MSE-MX3',
    category: 'Périphériques',
    price: 950,
    buyPrice: 600,
    stockQuantity: 8,
    minStockThreshold: 15,
    unit: 'Unités',
    status: 'low_stock',
    supplierId: 'f-1',
    supplierName: 'TechDistri Europe'
  },
  {
    id: 'p-3',
    name: 'Clavier Mécanique RGB Azerty',
    sku: 'PR-KBD-RGB',
    category: 'Périphériques',
    price: 1200,
    buyPrice: 800,
    stockQuantity: 24,
    minStockThreshold: 5,
    unit: 'Unités',
    supplierId: 'f-2',
    supplierName: 'SomaLog Maroc',
    status: 'in_stock'
  },
  {
    id: 'p-4',
    name: 'Câble HDMI 2.1 Ultra High Speed 2m',
    sku: 'PR-CAB-HD21',
    category: 'Câbles',
    price: 250,
    buyPrice: 90,
    stockQuantity: 0,
    minStockThreshold: 20,
    unit: 'Mètres',
    supplierId: 'f-2',
    supplierName: 'SomaLog Maroc',
    status: 'out_of_stock'
  },
  {
    id: 'p-5',
    name: 'Disque SSD Externe 1To NVMe USB-C',
    sku: 'PR-SSD-1TB',
    category: 'Stockage',
    price: 1500,
    buyPrice: 950,
    stockQuantity: 62,
    minStockThreshold: 10,
    unit: 'Unités',
    supplierId: 'f-1',
    supplierName: 'TechDistri Europe',
    status: 'in_stock'
  }
];

export const INITIAL_ORDERS: Commande[] = [
  {
    id: 'o-1001',
    orderNumber: 'CMD-2026-001',
    clientId: 'c-1',
    clientName: 'SARL ElectroPro',
    date: '2026-06-12',
    products: [
      { productId: 'p-1', productName: 'Ecran PC 27" IPS QHD (144Hz)', quantity: 10, unitPrice: 3200 },
      { productId: 'p-2', productName: 'Souris Sans Fil Ergonomique MX 3', quantity: 5, unitPrice: 950 }
    ],
    totalAmount: 36750,
    status: 'completed'
  },
  {
    id: 'o-1002',
    orderNumber: 'CMD-2026-002',
    clientId: 'c-2',
    clientName: 'Boutique L\'Étoile',
    date: '2026-06-18',
    products: [
      { productId: 'p-3', productName: 'Clavier Mécanique RGB Azerty', quantity: 4, unitPrice: 1200 },
      { productId: 'p-5', productName: 'Disque SSD Externe 1To NVMe USB-C', quantity: 2, unitPrice: 1500 }
    ],
    totalAmount: 7800,
    status: 'shipping'
  },
  {
    id: 'o-1003',
    orderNumber: 'CMD-2026-003',
    clientId: 'c-3',
    clientName: 'Alimentation Bilal',
    date: '2026-06-19',
    products: [
      { productId: 'p-2', productName: 'Souris Sans Fil Ergonomique MX 3', quantity: 10, unitPrice: 950 }
    ],
    totalAmount: 9500,
    status: 'pending'
  }
];

export const INITIAL_INVOICES: Facture[] = [
  {
    id: 'i-201',
    invoiceNumber: 'FAC-2026-001',
    clientId: 'c-1',
    clientName: 'SARL ElectroPro',
    date: '2026-06-12',
    dueDate: '2026-07-12',
    totalAmount: 36750,
    paidAmount: 36750,
    status: 'paid'
  },
  {
    id: 'i-202',
    invoiceNumber: 'FAC-2026-002',
    clientId: 'c-2',
    clientName: 'Boutique L\'Étoile',
    date: '2026-06-18',
    dueDate: '2026-07-18',
    totalAmount: 7800,
    paidAmount: 3000,
    status: 'partial'
  },
  {
    id: 'i-203',
    invoiceNumber: 'FAC-2026-003',
    clientId: 'c-3',
    clientName: 'Alimentation Bilal',
    date: '2026-06-19',
    dueDate: '2026-07-19',
    totalAmount: 9500,
    paidAmount: 0,
    status: 'unpaid'
  }
];

export const INITIAL_PAYMENTS: Paiement[] = [
  {
    id: 'pay-301',
    paymentNumber: 'PAI-2026-001',
    invoiceId: 'i-201',
    invoiceNumber: 'FAC-2026-001',
    clientName: 'SARL ElectroPro',
    date: '2026-06-12',
    amount: 36750,
    paymentMethod: 'bank_transfer',
    reference: 'VMT-EPRO-39281'
  },
  {
    id: 'pay-302',
    paymentNumber: 'PAI-2026-002',
    invoiceId: 'i-202',
    invoiceNumber: 'FAC-2026-002',
    clientName: 'Boutique L\'Étoile',
    date: '2026-06-18',
    amount: 3000,
    paymentMethod: 'credit_card',
    reference: 'STRIPE-921829'
  }
];

export const INITIAL_MOVEMENTS: StockMovement[] = [
  {
    id: 'm-401',
    productId: 'p-1',
    productName: 'Ecran PC 27" IPS QHD (144Hz)',
    type: 'IN',
    quantity: 50,
    date: '2026-06-01',
    reason: 'Import conteneur maritime - réception initialisée',
    author: 'Admin',
    previousQty: 0,
    newQty: 50
  },
  {
    id: 'm-402',
    productId: 'p-1',
    productName: 'Ecran PC 27" IPS QHD (144Hz)',
    type: 'OUT',
    quantity: 10,
    date: '2026-06-12',
    reason: 'Livraison commande CMD-2026-001',
    author: 'Admin',
    previousQty: 50,
    newQty: 40
  },
  {
    id: 'm-403',
    productId: 'p-2',
    productName: 'Souris Sans Fil Ergonomique MX 3',
    type: 'IN',
    quantity: 18,
    date: '2026-06-02',
    reason: 'Réception fournisseur TechDistri',
    author: 'Logistique',
    previousQty: 0,
    newQty: 18
  },
  {
    id: 'm-404',
    productId: 'p-2',
    productName: 'Souris Sans Fil Ergonomique MX 3',
    type: 'OUT',
    quantity: 10,
    date: '2026-06-10',
    reason: 'Ajustement pour perte inventaire d\'entrepôt',
    author: 'Inventaire',
    previousQty: 18,
    newQty: 8
  },
  {
    id: 'm-405',
    productId: 'p-4',
    productName: 'Câble HDMI 2.1 Ultra High Speed 2m',
    type: 'ADJUST',
    quantity: 0,
    date: '2026-06-15',
    reason: 'Ajustement d\'inventaire physique - stock épuisé d\'origine',
    author: 'Admin',
    previousQty: 5,
    newQty: 0
  }
];

export const INITIAL_SETTINGS: SystemSettings = {
  companyName: 'StockManager Pro S.A.R.L',
  currency: 'MAD',
  lowStockAlert: true,
  taxRate: 20,
  language: 'fr',
};
