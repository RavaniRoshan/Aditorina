import React from 'react';
import { FitToScreenIcon, HideUiIcon } from './icons';

// A placeholder icon component until a real one is available
const ZoomTo100Icon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10.5 8.5v4l-2-2" />
    </svg>
);


interface ViewportContextMenuProps {
    menuPosition: { x: number; y: number; };
    onClose: () => void;
    onZoomToFit: () => void;
    onZoomTo100: () => void;
    onToggleUI: () => void;
    isUiVisible: boolean;
}

const ContextMenuItem: React.FC<{ onClick: () => void; children: React.ReactNode; }> = ({ onClick, children }) => (
    <button
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
        className="w-full flex items-center space-x-3 text-left px-3 py-2 text-sm text-dark-text-primary hover:bg-dark-accent rounded-md transition-colors"
    >
        {children}
    </button>
);

export const ViewportContextMenu: React.FC<ViewportContextMenuProps> = (props) => {
    const { menuPosition, onClose, onZoomToFit, onZoomTo100, onToggleUI, isUiVisible } = props;

    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <div
            style={{ top: menuPosition.y, left: menuPosition.x }}
            className="fixed w-48 bg-dark-panel p-2 rounded-lg shadow-2xl border border-dark-border z-50"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
        >
            <ContextMenuItem onClick={() => handleAction(onZoomToFit)}>
                <FitToScreenIcon />
                <span>Zoom to fit</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleAction(onZoomTo100)}>
                <ZoomTo100Icon /> 
                <span>Zoom to 100%</span>
            </ContextMenuItem>
            <div className="h-px bg-dark-border my-1" />
            <ContextMenuItem onClick={() => handleAction(onToggleUI)}>
                <HideUiIcon />
                <span>{isUiVisible ? 'Hide' : 'Show'} UI</span>
            </ContextMenuItem>
        </div>
    );
};