import React from 'react';
import { ProjectStatus, PaymentStatus } from '../types';

interface StatusBadgeProps {
  status: ProjectStatus | PaymentStatus;
  type: 'project' | 'payment';
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  const getStyles = () => {
    if (type === 'project') {
      switch (status) {
        case 'Brouillon': return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'Validé': return 'bg-brand-50 text-brand-500 border-brand-100';
        case 'Phase Terrain': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Phase Bureau': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        case 'Clôturé': return 'bg-teal-50 text-teal-700 border-teal-100';
        case undefined: return 'bg-slate-100 text-slate-700 border-slate-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
    } else {
      switch (status) {
        case 'Impayé': return 'bg-rose-50 text-rose-700 border-rose-100';
        case 'Partiel': return 'bg-amber-50 text-amber-700 border-amber-100';
        case 'Payé': return 'bg-teal-50 text-teal-700 border-teal-100';
        case undefined: return 'bg-slate-100 text-slate-700 border-slate-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${getStyles()}`}>
      {status}
    </span>
  );
}
