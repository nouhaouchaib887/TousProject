'use client'
import  React,{ useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, X,Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'




// Simple Searchable Select Component
interface SearchableSelectProps {
  options: string[] | { id: string, name: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label?: string;
  disabled?: boolean;
}

export function SearchableSelect({ options, value, onChange, placeholder, label, disabled }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(opt => {
    const name = typeof opt === 'string' ? opt : opt.name;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const displayValue = typeof options[0] === 'object' 
    ? (options as any[]).find(o => o.id === value)?.name || value
    : value;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  const displayLimit = 1600
  const displayedOptions = filteredOptions.slice(0, displayLimit);
  const hiddenCount = filteredOptions.length - displayedOptions.length;

  return (
    <div ref={containerRef} className="relative space-y-1.5 w-full">
      {label && <Label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 ml-1">{label}</Label>}
      <div 
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2 text-sm transition-all focus-within:ring-2 focus-within:ring-brand-500 cursor-pointer overflow-hidden",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={cn("truncate mr-2 flex-1", !value && "text-slate-400")}>
          {displayValue || placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          <Search className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-slate-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 border-b border-slate-50">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                autoFocus
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 pl-8 text-xs border-none bg-slate-50 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="max-h-[160px] overflow-y-auto">
            <div className="p-1">
              {displayedOptions.length > 0 ? (
                displayedOptions.map((opt, idx) => {
                  const val = typeof opt === 'string' ? opt : opt.id;
                  const name = typeof opt === 'string' ? opt : opt.name;
                   return (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-xs rounded-lg cursor-pointer hover:bg-slate-50 transition-colors",
                        (typeof opt === 'string' ? opt === value : opt.id === value) && "bg-brand-50 text-brand-600"
                      )}
                      onClick={() => {
                        onChange(val);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                    >
                      <span className="font-medium text-slate-700">{name}</span>
                      { (typeof opt === 'string' ? opt === value : opt.id === value) && <Check className="h-3 w-3 text-brand-600" />}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-xs text-slate-400 italic">
                  Aucun résultat
                </div>
              )}
        
            </div>
          </div>
        </div>
      )}
    </div>
  );
}