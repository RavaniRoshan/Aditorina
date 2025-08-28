
import React from 'react';

interface LoadingSpinnerProps {
    small?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ small = false }) => {
    const sizeClasses = small ? 'h-5 w-5' : 'h-12 w-12';
    const borderClasses = small ? 'border-2' : 'border-4';

    return (
        <div className="flex flex-col items-center justify-center space-y-3">
             <div 
                className={`${sizeClasses} ${borderClasses} border-t-transparent border-brand-secondary rounded-full animate-spin`}
                role="status"
            >
             <span className="sr-only">Loading...</span>
            </div>
            {!small && (
                 <p className="text-dark-text-secondary animate-pulse-slow">AI is thinking...</p>
            )}
        </div>
    );
};
