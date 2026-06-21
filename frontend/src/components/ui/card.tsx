import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  className?: string;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerActions,
  className = '',
  id,
}) => {
  return (
    <div
      id={id}
      className={`bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden ${className}`}
    >
      {(title || subtitle || headerActions) && (
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/50">
          <div>
            {title && <h3 className="font-semibold text-slate-800 tracking-tight text-base">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};
