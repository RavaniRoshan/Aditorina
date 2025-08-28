import React from 'react';
import { ExportIcon, HomeIcon } from './icons';

interface TopBarProps {
    onExit: () => void;
    fileName?: string;
}

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5l-2-2m-3.5 0l-2 2m11-5l-2-2m-3.5 0l-2 2" />
    </svg>
);


export const TopBar: React.FC<TopBarProps> = ({ onExit, fileName }) => {
    return (
        <header className="bg-dark-surface h-12 flex-shrink-0 flex items-center justify-between px-4 border-b border-dark-border z-20">
            <div className="flex items-center space-x-2">
                <WandIcon />
                <span className="font-semibold text-sm text-dark-text-primary">PhotoCursor AI</span>
            </div>
            <div className="text-sm text-dark-text-secondary">
                {fileName || 'Untitled'}
            </div>
            <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 bg-dark-accent hover:bg-blue-600 text-white text-sm font-semibold py-1.5 px-3 rounded-md transition duration-200">
                    <ExportIcon />
                    <span>Export</span>
                </button>
                 <button onClick={onExit} title="Back to Home" className="p-1.5 text-dark-text-secondary hover:text-dark-text-primary hover:bg-dark-border rounded-md transition">
                    <HomeIcon />
                </button>
            </div>
        </header>
    );
};