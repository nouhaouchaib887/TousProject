import React, {  useEffect, useState, useMemo } from 'react';
import { useDataContext } from '../../../services/DataContext';
import { Facture } from '../../../types';
import{InvoiceTableRead} from '../types'
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Modal } from '../../../components/ui/modal';
import  AddInvoiceForm  from './AddInvoiceForm';
import {InvoiceTable} from './InvoiceTable'
import {getInvoices} from '../api/invoiceService'
import { Plus, MapPin,  X, Calendar as CalendarIcon,Filter, RotateCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

export  function InvoiceView() {
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState<any>(null);
   const [clientToEdit, setClientToEdit] = useState<any>(null);
  
 const [invoices, setInvoices] = useState<InvoiceTableRead[]>([])
const [filteredInvoices, setFilteredInvoices] = useState<InvoiceTableRead[]>([])
useEffect(() => {
  async function fetchInvoices() {
    const data = await getInvoices()
    setInvoices(data)
    setFilteredInvoices(data)
  }

  fetchInvoices()
}, [])

  const handleEditInvoice = (invoice: any) => {
    setInvoiceToEdit(invoice);
    setIsAddModalOpen(true);
  };

  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [invoiceDate, setInvoiceDate] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    let result = [...invoices];
    console.log("Filtered Projects:", result);

    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter(p => p.invoice_type === typeFilter);
    }

    if (invoiceDate) {
      result = result.filter(p => p.invoice_date >= invoiceDate);
    }

    if (dueDate) {
      result = result.filter(p => p.due_date <= dueDate);
    }

    setFilteredInvoices(result);
  }, [statusFilter, typeFilter, invoiceDate, dueDate]);

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setInvoiceDate('');
    setDueDate('');
  };

  const statuses = Array.from(new Set(invoices.map(p => p.status)));
  const types = Array.from(new Set(invoices.map(p => p.invoice_type)));
const handleDuplicateProject = (invoice: any) => {
    const newInvoice = {
      ...invoice,
      id: `${invoice.id}-COPY`,
      created_at: new Date().toISOString().split('T')[0]
    };
    setFilteredInvoices([newInvoice, ...filteredInvoices]);
  };

  const handleDeleteProject = (invoice: any) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le projet ${invoice.id} ?`)) {
      setFilteredInvoices(filteredInvoices.filter(p => p.id !== invoice.id));
    }
  };
  const handleEditClient = (client: any) => {
    setClientToEdit({
      ...client,
      first_name: client.firstName,
      last_name: client.lastName,
      client_type: client.client_type || 'Physique'
    });
    setIsClientModalOpen(true);
  };
   return (
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">Factures</h1>
            <p className="text-muted-foreground text-slate-500 font-medium">
              Gestion de vos factures
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => {
                setInvoiceToEdit(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-200"
            >
              <Plus size={18} />
              Nouvelle Facture
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-black uppercase text-xs tracking-widest">
              <Filter size={14} className="text-brand-600" />
              <span>Filtres</span>
            </div>
            {(statusFilter !== 'all' || typeFilter !== 'all' || invoiceDate || dueDate) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="h-7 px-2 text-[10px] uppercase font-black tracking-tighter text-slate-400 hover:text-brand-600 hover:bg-brand-50"
              >
                Réinitialiser
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Statut</label>
              <Select value={statusFilter} onValueChange={(value) => value !== null && setStatusFilter(value)}>
                <SelectTrigger className="w-full bg-slate-50/50 border-slate-100 rounded-xl focus:ring-brand-500/20">
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de mission</label>
              <Select value={typeFilter} onValueChange={(value) => value !== null && setTypeFilter(value)}>
                <SelectTrigger className="w-full bg-slate-50/50 border-slate-100 rounded-xl focus:ring-brand-500/20">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Du</label>
              <Input 
                type="date" 
                value={invoiceDate} 
                onChange={(e) => setInvoiceDate(e.target.value)} 
                className="bg-slate-50/50 border-slate-100 rounded-xl focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Au </label>
              <Input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="bg-slate-50/50 border-slate-100 rounded-xl focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <InvoiceTable invoices={filteredInvoices as unknown as InvoiceTableRead[]} 
         onEdit={handleEditInvoice} onDelete={handleDeleteProject}
          onDuplicate={handleDuplicateProject}
          onEditClient={handleEditClient}/>

        {/* Add Invoice Modal */}
        <AddInvoiceForm
          isOpen={isAddModalOpen} 
          onClose={() => {
            setIsAddModalOpen(false);
            setInvoiceToEdit(null);
          }} 
          invoice={invoiceToEdit}
        />
      </div>
  );
}

