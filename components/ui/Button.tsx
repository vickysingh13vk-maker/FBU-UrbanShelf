import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  action?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  action,
  isLoading,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-[0.98]";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600/20 shadow-sm hover:shadow-md border border-transparent",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-200 shadow-sm",
    outline: "bg-transparent text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 focus:ring-indigo-600/20",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200",
    danger: "bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 hover:border-rose-300 focus:ring-rose-200 shadow-sm",
  };

  const sizes = {
    xs: "px-2 py-1 text-[10px] uppercase tracking-wider",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      ) : icon && iconPosition === 'left' ? (
        <span className={`${children ? 'mr-2' : ''} flex items-center`}>{icon}</span>
      ) : null}
      {children}
      {!isLoading && icon && iconPosition === 'right' && <span className={`${children ? 'ml-2' : ''} flex items-center`}>{icon}</span>}
    </button>
  );
};

export const IconButton: React.FC<ButtonProps> = ({ icon, className = '', ...props }) => (
  <Button 
    icon={icon} 
    className={`p-2 rounded-lg ${className}`} 
    variant="secondary" 
    size="sm"
    {...props}
  >
    {props.children}
  </Button>
);
