import React from 'react';

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5l-2-2m-3.5 0l-2 2m11-5l-2-2m-3.5 0l-2 2" />
    </svg>
);

interface HeaderProps {
    onLaunchEditor: () => void;
}


export const Header: React.FC<HeaderProps> = ({ onLaunchEditor }) => {
  return (
    <header className="bg-dark-surface/50 backdrop-blur-sm sticky top-0 z-10 border-b border-dark-border">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <WandIcon />
            <span className="text-xl font-bold tracking-wider text-dark-text-primary">
              PhotoCursor AI
            </span>
          </div>
           <button
            onClick={onLaunchEditor}
            className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out"
          >
            Launch Editor
          </button>
        </div>
      </nav>
    </header>
  );
};
