import React from 'react';
import { ChevronDown } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  action?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ icon, label, error, action, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
          {icon}
        </div>
      )}
      <input
        className={`block w-full rounded-xl border border-slate-200 bg-white shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none sm:text-sm py-2.5 transition-all ${icon ? 'pl-10' : 'pl-3.5'} ${action ? 'pr-24' : 'pr-3.5'} ${error ? 'border-rose-500 ring-rose-500/10' : ''} ${className}`}
        {...props}
      />
      {action && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
          {action}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-rose-500 mt-1 ml-1">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  action?: React.ReactNode;
  options?: (string | { label: string; value: string })[];
}

export const Select: React.FC<SelectProps> = ({ label, error, action, className = '', children, options, ...props }) => (
  <div className="w-full">
     {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
     <div className="relative group">
       <select
        className={`block w-full rounded-xl border border-slate-200 bg-white shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none sm:text-sm py-2.5 pl-3.5 pr-10 appearance-none transition-all cursor-pointer hover:border-slate-300 ${error ? 'border-rose-500 ring-rose-500/10' : ''} ${className}`}
        {...props}
       >
         {options ? options.map(opt => {
           const oLabel = typeof opt === 'string' ? opt : opt.label;
           const oValue = typeof opt === 'string' ? opt : opt.value;
           return <option key={oValue} value={oValue}>{oLabel}</option>;
         }) : children}
       </select>
       {!props.multiple && (
         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 pl-2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
           <ChevronDown className="h-4 w-4" />
         </div>
       )}
       {action && (
         <div className="absolute inset-y-0 right-10 flex items-center">
           {action}
         </div>
       )}
     </div>
     {error && <p className="text-xs text-rose-500 mt-1 ml-1">{error}</p>}
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  action?: React.ReactNode;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, action, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>}
    <div className="relative">
      <textarea
        className={`block w-full rounded-xl border border-slate-200 bg-white shadow-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 focus:outline-none sm:text-sm py-2.5 px-3.5 transition-all min-h-[100px] ${error ? 'border-rose-500 ring-rose-500/10' : ''} ${className}`}
        {...props}
      />
      {action && (
        <div className="absolute top-2 right-2">
          {action}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-rose-500 mt-1 ml-1">{error}</p>}
  </div>
);

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, description, className = '' }) => (
  <div className={`flex items-center justify-between group cursor-pointer ${className}`} onClick={() => onChange(!checked)}>
    {(label || description) && (
      <div className="flex flex-col pr-4">
        {label && <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{label}</span>}
        {description && <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</span>}
      </div>
    )}
    <div
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);
