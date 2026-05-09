import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sub?: string; // optional subtitle / description
}

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyLabel?: string; // shown when no options match query
}

const SearchableSelect: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  emptyLabel = 'No results',
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find(o => o.value === value)?.label ?? '';

  // Filtered list
  const filtered = query.trim()
    ? options.filter(
        o =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          (o.sub ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const openDropdown = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [disabled]);

  const handleSelect = useCallback((opt: SelectOption) => {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  }, [onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
  }, [onChange]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <div
        role="combobox"
        aria-expanded={open}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDropdown(); } }}
        onClick={openDropdown}
        className={[
          'flex items-center gap-1 w-full text-xs border rounded-lg px-2 py-1.5 cursor-pointer select-none transition-all',
          disabled
            ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200'
            : open
              ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white'
              : 'border-slate-200 bg-white hover:border-slate-300',
        ].join(' ')}
      >
        {open ? (
          /* Search input inside trigger */
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Search className="h-3 w-3 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onClick={e => e.stopPropagation()}
              placeholder={selectedLabel || placeholder}
              className="flex-1 min-w-0 outline-none bg-transparent text-slate-700 placeholder-slate-400 text-xs"
            />
          </div>
        ) : (
          <span className={`flex-1 truncate ${value ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
            {selectedLabel || placeholder}
          </span>
        )}

        <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
          {value && !disabled && !open && (
            <button
              onClick={handleClear}
              className="p-0.5 rounded text-slate-300 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          )}
          <ChevronDown
            className={`h-3 w-3 text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[200] overflow-hidden">
          <div className="overflow-y-auto max-h-52">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-xs text-slate-400 italic text-center">{emptyLabel}{query ? ` for "${query}"` : ''}</div>
            ) : (
              filtered.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={[
                    'flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors',
                    opt.value === value
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.sub && (
                    <span className="ml-2 text-[10px] text-slate-400 flex-shrink-0">{opt.sub}</span>
                  )}
                  {opt.value === value && (
                    <span className="ml-2 text-indigo-400 flex-shrink-0">✓</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
