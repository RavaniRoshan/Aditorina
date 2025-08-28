import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const variantClasses = {
  default: 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-dark-border bg-transparent hover:bg-dark-surface',
  ghost: 'hover:bg-dark-surface',
};

const sizeClasses = {
  default: 'h-10 py-2 px-8',
  sm: 'h-9 px-3',
  lg: 'h-11 px-8',
  icon: 'h-10 w-10',
};

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className,
  variant = 'default',
  size = 'default',
  ...props 
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
