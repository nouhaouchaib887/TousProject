import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from './clientForm';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (client: any) => void;
  client?: any;
}

export default function AddClientModal({ isOpen, onClose, onSuccess,client }: AddClientModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white dark:bg-white text-slate-900 dark:text-slate-900">
        <DialogHeader className="p-8 pb-4 shrink-0 bg-slate-50/80 dark:bg-slate-50/80 border-b border-slate-100 dark:border-slate-100">
          <DialogTitle className="text-xl font-semibold text-[#0B1739] dark:text-[#0B1739] uppercase tracking-tight">
             {client ? "Modifier Client" : "Nouveau Client"}
          </DialogTitle>

        </DialogHeader>
        <div className="p-8 pt-6 overflow-hidden flex flex-col min-h-0 bg-card">
          <ClientForm 
          client={client}
            onClientCreate={(client) => {
              onSuccess?.(client);
              onClose();
            }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
