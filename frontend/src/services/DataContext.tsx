import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Client,
  Fournisseur,
  Produit,
  Commande,
  Facture,
  Paiement,
  StockMovement,
  SystemSettings,
  ActiveModule,
} from '../types';
import {
  INITIAL_CLIENTS,
  INITIAL_SUPPLIERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_MOVEMENTS,
  INITIAL_SETTINGS,
} from './mockData';

interface DataContextType {
  clients: Client[];
  suppliers: Fournisseur[];
  products: Produit[];
  orders: Commande[];
  invoices: Facture[];
  payments: Paiement[];
  movements: StockMovement[];
  settings: SystemSettings;
  sidebarOpen: boolean;
  activeModule: ActiveModule;
  searchQuery: string;

  // Actions
  setSidebarOpen: (open: boolean) => void;
  setActiveModule: (module: ActiveModule) => void;
  setSearchQuery: (query: string) => void;

  // Clients
  addClient: (client: Omit<Client, 'id' | 'totalOrders' | 'totalSpent'>) => void;
  editClient: (client: Client) => void;
  deleteClient: (id: string) => void;

  // Suppliers
  addSupplier: (supplier: Omit<Fournisseur, 'id' | 'productsSuppliedCount'>) => void;
  editSupplier: (supplier: Fournisseur) => void;
  deleteSupplier: (id: string) => void;

  // Products
  addProduct: (product: Omit<Produit, 'id' | 'status'>) => void;
  editProduct: (product: Produit) => void;
  deleteProduct: (id: string) => void;

  // Orders
  addOrder: (order: Omit<Commande, 'id' | 'orderNumber' | 'date'>) => void;
  updateOrderStatus: (id: string, status: Commande['status']) => void;
  deleteOrder: (id: string) => void;

  // Invoices
  addInvoice: (invoice: Omit<Facture, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (id: string, status: Facture['status'], paidAmount: number) => void;
  deleteInvoice: (id: string) => void;

  // Payments
  addPayment: (payment: Omit<Paiement, 'id' | 'paymentNumber' | 'date'>) => void;
  deletePayment: (id: string) => void;

  // Stock
  adjustStockQuantity: (productId: string, qtyChange: number, type: 'IN' | 'OUT' | 'ADJUST', reason: string, author: string) => void;

  // Settings
  updateSettings: (settings: SystemSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Try loading from localStorage, otherwise use initial mock data
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('sm_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [suppliers, setSuppliers] = useState<Fournisseur[]>(() => {
    const saved = localStorage.getItem('sm_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [products, setProducts] = useState<Produit[]>(() => {
    const saved = localStorage.getItem('sm_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Commande[]>(() => {
    const saved = localStorage.getItem('sm_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [invoices, setInvoices] = useState<Facture[]>(() => {
    const saved = localStorage.getItem('sm_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [payments, setPayments] = useState<Paiement[]>(() => {
    const saved = localStorage.getItem('sm_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem('sm_movements');
    return saved ? JSON.parse(saved) : INITIAL_MOVEMENTS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('sm_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState<ActiveModule>('factures'); // default module first on the user sidebar "Factures"
  const [searchQuery, setSearchQuery] = useState('');

  // Persist back to localStorage
  useEffect(() => {
    localStorage.setItem('sm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('sm_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  // Recalculate status of products whenever list changes
  const updateProductStatuses = (list: Produit[]) => {
    return list.map(p => {
      let status: Produit['status'] = 'in_stock';
      if (p.stockQuantity <= 0) {
        status = 'out_of_stock';
      } else if (p.stockQuantity <= p.minStockThreshold) {
        status = 'low_stock';
      }
      return { ...p, status };
    });
  };

  useEffect(() => {
    localStorage.setItem('sm_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sm_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sm_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('sm_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('sm_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('sm_settings', JSON.stringify(settings));
  }, [settings]);

  // CLIENTS ACTIONS
  const addClient = (newClient: Omit<Client, 'id' | 'totalOrders' | 'totalSpent'>) => {
    const client: Client = {
      ...newClient,
      id: `c-${Date.now()}`,
      totalOrders: 0,
      totalSpent: 0,
    };
    setClients(prev => [client, ...prev]);
  };

  const editClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  // SUPPLIERS ACTIONS
  const addSupplier = (newSupplier: Omit<Fournisseur, 'id' | 'productsSuppliedCount'>) => {
    const sup: Fournisseur = {
      ...newSupplier,
      id: `f-${Date.now()}`,
      productsSuppliedCount: 0,
    };
    setSuppliers(prev => [sup, ...prev]);
  };

  const editSupplier = (updatedSupplier: Fournisseur) => {
    setSuppliers(prev => prev.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // PRODUCTS ACTIONS
  const addProduct = (newProduct: Omit<Produit, 'id' | 'status'>) => {
    const id = `p-${Date.now()}`;
    // calculate status
    let status: Produit['status'] = 'in_stock';
    if (newProduct.stockQuantity <= 0) {
      status = 'out_of_stock';
    } else if (newProduct.stockQuantity <= newProduct.minStockThreshold) {
      status = 'low_stock';
    }

    const prod: Produit = {
      ...newProduct,
      id,
      status,
    };

    setProducts(prev => [prod, ...prev]);

    // Keep supplier counts in sync
    if (newProduct.supplierId) {
      setSuppliers(sups =>
        sups.map(s => s.id === newProduct.supplierId ? { ...s, productsSuppliedCount: s.productsSuppliedCount + 1 } : s)
      );
    }

    // Add physical stock movement
    const movement: StockMovement = {
      id: `m-${Date.now()}`,
      productId: id,
      productName: prod.name,
      type: 'IN',
      quantity: prod.stockQuantity,
      date: new Date().toISOString().split('T')[0],
      reason: 'Création initiale du produit',
      author: 'Système',
      previousQty: 0,
      newQty: prod.stockQuantity
    };
    setMovements(prev => [movement, ...prev]);
  };

  const editProduct = (updatedProduct: Produit) => {
    // track previous values before update so we can log movement if inventory changes
    setProducts(prev => {
      const match = prev.find(p => p.id === updatedProduct.id);
      if (match && match.stockQuantity !== updatedProduct.stockQuantity) {
        const type = updatedProduct.stockQuantity > match.stockQuantity ? 'IN' : 'OUT';
        const difference = Math.abs(updatedProduct.stockQuantity - match.stockQuantity);
        
        const movement: StockMovement = {
          id: `m-${Date.now()}`,
          productId: updatedProduct.id,
          productName: updatedProduct.name,
          type,
          quantity: difference,
          date: new Date().toISOString().split('T')[0],
          reason: 'Modification manuelle depuis la fiche produit',
          author: 'Admin',
          previousQty: match.stockQuantity,
          newQty: updatedProduct.stockQuantity
        };
        setTimeout(() => setMovements(m => [movement, ...m]), 0);
      }
      
      let status: Produit['status'] = 'in_stock';
      if (updatedProduct.stockQuantity <= 0) {
        status = 'out_of_stock';
      } else if (updatedProduct.stockQuantity <= updatedProduct.minStockThreshold) {
        status = 'low_stock';
      }

      return prev.map(p => p.id === updatedProduct.id ? { ...updatedProduct, status } : p);
    });
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const target = prev.find(p => p.id === id);
      if (target && target.supplierId) {
        setSuppliers(sups =>
          sups.map(s => s.id === target.supplierId ? { ...s, productsSuppliedCount: Math.max(0, s.productsSuppliedCount - 1) } : s)
        );
      }
      return prev.filter(p => p.id !== id);
    });
  };

  // ORDERS ACTIONS
  const addOrder = (newOrder: Omit<Commande, 'id' | 'orderNumber' | 'date'>) => {
    const orderNumber = `CMD-2026-${String(orders.length + 1).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    const order: Commande = {
      ...newOrder,
      id: `o-${Date.now()}`,
      orderNumber,
      date,
    };

    setOrders(prev => [order, ...prev]);

    // Update Client metrics
    setClients(prev => prev.map(c => c.id === order.clientId ? {
      ...c,
      totalOrders: c.totalOrders + 1,
      totalSpent: c.totalSpent + order.totalAmount
    } : c));

    // Dedicate stock movements if completed / shipping
    if (order.status === 'completed' || order.status === 'shipping') {
      order.products.forEach(p => {
        adjustStockQuantity(p.productId, p.quantity, 'OUT', `Commande ${orderNumber}`, 'Vente Client');
      });
    }

    // Auto-create associated Invoice (Facture) in SOLID pipeline
    const invoiceDueDate = new Date();
    invoiceDueDate.setDate(invoiceDueDate.getDate() + 30); // Net 30

    const invoice: Facture = {
      id: `i-${Date.now()}`,
      invoiceNumber: `FAC-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      clientId: order.clientId,
      clientName: order.clientName,
      date: date,
      dueDate: invoiceDueDate.toISOString().split('T')[0],
      totalAmount: order.totalAmount,
      paidAmount: 0,
      status: 'unpaid'
    };
    setInvoices(prev => [invoice, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Commande['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      
      // If going from cancelled/pending to completed/shipping for first time, deduct stock
      const previousStatus = o.status;
      if (
        (previousStatus === 'pending' || previousStatus === 'cancelled') &&
        (status === 'completed' || status === 'shipping')
      ) {
        o.products.forEach(p => {
          adjustStockQuantity(p.productId, p.quantity, 'OUT', `Statut Commande ${o.orderNumber}: ${status}`, 'Vente Client');
        });
      }
      // If going from active to cancelled, return stock
      if (
        (previousStatus === 'completed' || previousStatus === 'shipping') &&
        (status === 'cancelled')
      ) {
        o.products.forEach(p => {
          adjustStockQuantity(p.productId, p.quantity, 'IN', `Annulation Commande ${o.orderNumber}`, 'Retour Stock');
        });
      }

      return { ...o, status };
    }));
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // INVOICES ACTIONS
  const addInvoice = (newInvoice: Omit<Facture, 'id' | 'invoiceNumber'>) => {
    const invoiceNumber = `FAC-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    const invoice: Facture = {
      ...newInvoice,
      id: `i-${Date.now()}`,
      invoiceNumber
    };
    setInvoices(prev => [invoice, ...prev]);
  };

  const updateInvoiceStatus = (id: string, status: Facture['status'], paidAmount: number) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status, paidAmount } : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  // PAYMENTS ACTIONS
  const addPayment = (newPayment: Omit<Paiement, 'id' | 'paymentNumber' | 'date'>) => {
    const paymentNumber = `PAI-2026-${String(payments.length + 1).padStart(3, '0')}`;
    const date = new Date().toISOString().split('T')[0];
    const payment: Paiement = {
      ...newPayment,
      id: `pay-${Date.now()}`,
      paymentNumber,
      date
    };

    setPayments(prev => [payment, ...prev]);

    // Update associated invoice billing states
    setInvoices(prevInvs => prevInvs.map(inv => {
      if (inv.id === payment.invoiceId) {
        const newPaidAmount = inv.paidAmount + payment.amount;
        let finalStatus: Facture['status'] = 'partial';
        if (newPaidAmount >= inv.totalAmount) {
          finalStatus = 'paid';
        } else if (newPaidAmount === 0) {
          finalStatus = 'unpaid';
        }
        return {
          ...inv,
          paidAmount: newPaidAmount,
          status: finalStatus
        };
      }
      return inv;
    }));
  };

  const deletePayment = (id: string) => {
    const target = payments.find(p => p.id === id);
    if (target) {
      // Revert paid amount on invoice
      setInvoices(prevInvs => prevInvs.map(inv => {
        if (inv.id === target.invoiceId) {
          const newPaidAmount = Math.max(0, inv.paidAmount - target.amount);
          let finalStatus: Facture['status'] = 'unpaid';
          if (newPaidAmount > 0 && newPaidAmount < inv.totalAmount) {
            finalStatus = 'partial';
          } else if (newPaidAmount >= inv.totalAmount) {
            finalStatus = 'paid';
          }
          return {
            ...inv,
            paidAmount: newPaidAmount,
            status: finalStatus
          };
        }
        return inv;
      }));
    }
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  // STOCK QUANTITY MANIPULATION
  const adjustStockQuantity = (
    productId: string,
    qtyChange: number,
    type: 'IN' | 'OUT' | 'ADJUST',
    reason: string,
    author: string
  ) => {
    setProducts(currentProds => {
      const match = currentProds.find(p => p.id === productId);
      if (!match) return currentProds;

      const previousQty = match.stockQuantity;
      let newQty = previousQty;

      if (type === 'IN') {
        newQty += qtyChange;
      } else if (type === 'OUT') {
        newQty = Math.max(0, previousQty - qtyChange);
      } else if (type === 'ADJUST') {
        newQty = qtyChange; // Direct target value
      }

      const diff = Math.abs(newQty - previousQty);

      // Create physical movement
      const movement: StockMovement = {
        id: `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        productId,
        productName: match.name,
        type,
        quantity: diff,
        date: new Date().toISOString().split('T')[0],
        reason,
        author,
        previousQty,
        newQty
      };

      // Push movement in macro queue
      setTimeout(() => setMovements(m => [movement, ...m]), 0);

      let revisedStatus: Produit['status'] = 'in_stock';
      if (newQty <= 0) {
        revisedStatus = 'out_of_stock';
      } else if (newQty <= match.minStockThreshold) {
        revisedStatus = 'low_stock';
      }

      return currentProds.map(p => p.id === productId ? {
        ...p,
        stockQuantity: newQty,
        status: revisedStatus
      } : p);
    });
  };

  // SETTINGS
  const updateSettings = (updatedSettings: SystemSettings) => {
    setSettings(updatedSettings);
  };

  const value = useMemo(() => ({
    clients,
    suppliers,
    products,
    orders,
    invoices,
    payments,
    movements,
    settings,
    sidebarOpen,
    activeModule,
    searchQuery,
    setSidebarOpen,
    setActiveModule,
    setSearchQuery,
    addClient,
    editClient,
    deleteClient,
    addSupplier,
    editSupplier,
    deleteSupplier,
    addProduct,
    editProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    addInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    addPayment,
    deletePayment,
    adjustStockQuantity,
    updateSettings,
  }), [clients, suppliers, products, orders, invoices, payments, movements, settings, sidebarOpen, activeModule, searchQuery]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
