import React from 'react';
import { TrashIcon, DuplicateIcon, ChevronUpIcon, ChevronDownIcon, ZoomToSelectionIcon } from './icons';

interface LayerContextMenuProps {
    menuPosition: { x: number; y: number; };
    layerId: string;
    onClose: () => void;
    onDelete: (layerId: string) => void;
    onDuplicate: (layerId: string) => void;
    onMoveUp: (layerId: string) => void;
    onMoveDown: (layerId: string) => void;
    onZoomToLayer: (layerId: string) => void;
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


export const LayerContextMenu: React.FC<LayerContextMenuProps> = (props) => {
    const { menuPosition, layerId, onClose, onDelete, onDuplicate, onMoveUp, onMoveDown, onZoomToLayer } = props;

    return (
        <div
            style={{ top: menuPosition.y, left: menuPosition.x }}
            className="fixed w-48 bg-dark-panel p-2 rounded-lg shadow-2xl border border-dark-border z-50"
            onClick={(e) => e.stopPropagation()}
        >
            <ContextMenuItem onClick={() => onDuplicate(layerId)}>
                <DuplicateIcon />
                <span>Duplicate</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onZoomToLayer(layerId)}>
                <ZoomToSelectionIcon />
                <span>Zoom to Layer</span>
            </ContextMenuItem>
            <div className="h-px bg-dark-border my-1" />
            <ContextMenuItem onClick={() => onMoveUp(layerId)}>
                <ChevronUpIcon />
                <span>Move Up</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onMoveDown(layerId)}>
                <ChevronDownIcon />
                <span>Move Down</span>
            </ContextMenuItem>
            <div className="h-px bg-dark-border my-1" />
            <ContextMenuItem onClick={() => onDelete(layerId)}>
                <TrashIcon />
                <span className="text-red-400">Delete</span>
            </ContextMenuItem>
        </div>
    );
};