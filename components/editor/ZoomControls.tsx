import React from 'react';
import { ZoomInIcon, ZoomOutIcon, FitToScreenIcon } from './icons';

interface ZoomControlsProps {
    zoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoomToFit: () => void;
}

const ControlButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button 
        className="w-8 h-8 flex items-center justify-center text-dark-text-secondary hover:bg-dark-border hover:text-dark-text-primary rounded-md transition-colors"
        {...props}
    >
        {children}
    </button>
);

export const ZoomControls: React.FC<ZoomControlsProps> = ({ zoom, onZoomIn, onZoomOut, onZoomToFit }) => {
    return (
        <div className="absolute bottom-4 right-4 bg-dark-surface p-1 rounded-lg shadow-2xl border border-dark-border flex items-center space-x-1 z-10 text-xs">
            <ControlButton onClick={onZoomOut} title="Zoom Out">
                <ZoomOutIcon />
            </ControlButton>
            <span className="w-12 text-center text-dark-text-secondary font-semibold select-none">
                {Math.round(zoom * 100)}%
            </span>
            <ControlButton onClick={onZoomIn} title="Zoom In">
                <ZoomInIcon />
            </ControlButton>
            <div className="w-px h-5 bg-dark-border mx-1" />
            <ControlButton onClick={onZoomToFit} title="Fit to Screen">
                <FitToScreenIcon />
            </ControlButton>
        </div>
    );
};
