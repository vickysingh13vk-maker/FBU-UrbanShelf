import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sub?: string;
}

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyLabel?: string;
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

  const filtered = query.trim()
    ? options.filter(o =>
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

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
    };
    document.addEventListener('keydown', handler);
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
      {/*
        Trigger — FIXED height via py-1.5 + text-xs on all content.
        The input and label span are always both rendered; we toggle
        visibility so the DOM height never changes on open/close.
      */}
      <div
        role="combobox"
        aria-expanded={open}
        tabIndex={disabled ? -1 : 0}
        onClick={openDropdown}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDropdown(); }
        }}
        className={[
          'flex items-center w-full text-xs border rounded-lg px-2 py-1.5 cursor-pointer transition-all overflow-hidden',
          disabled
            ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200'
            : open
              ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white'
              : 'border-slate-200 bg-white hover:border-indigo-300',
        ].join(' ')}
      >
        {/* Label — visible when closed */}
        <span
          className={[
            'flex-1 truncate text-xs leading-none',
            open ? 'hidden' : 'block',
            value ? 'text-slate-700 font-medium' : 'text-slate-400',
          ].join(' ')}
        >
          {selectedLabel || placeholder}
        </span>

        {/* Search input — visible when open, same line-height as label */}
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onClick={e => e.stopPropagation()}
          placeholder={selectedLabel || placeholder}
          className={[
            'flex-1 min-w-0 outline-none bg-transparent text-slate-700 text-xs leading-none placeholder-slate-400',
            open ? 'block' : 'hidden',
          ].join(' ')}
        />

        {/* Right icons — fixed width so trigger width is stable */}
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
            className={`h-3 w-3 text-slate-400 transition-transform duration-150 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Dropdown — absolutely positioned, never affects layout */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[300] overflow-hidden min-w-[160px]">
          <div className="overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-xs text-slate-400 italic text-center">
                {emptyLabel}{query ? ` for "${query}"` : ''}
              </div>
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
                  <span className="truncate flex-1">{opt.label}</span>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    {opt.sub && (
                      <span className="text-[10px] text-slate-400">{opt.sub}</span>
                    )}
                    {opt.value === value && (
                      <span className="text-indigo-400 text-[10px]">✓</span>
                    )}
                  </div>
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
