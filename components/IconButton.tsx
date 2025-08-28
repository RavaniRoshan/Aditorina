
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, className, ...props }) => {
    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-surface focus:ring-brand-primary transition-colors duration-150 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
