
import React from 'react';
import { Layer } from '../../types';
import { LayersIcon, EyeOpenIcon, EyeClosedIcon, ImageIcon, TextLayerIcon, DrawingLayerIcon } from './icons';

interface LeftPanelProps {
    layers: Layer[];
    activeLayerId: string | null;
    onSelectLayer: (id: string) => void;
    onToggleVisibility: (id: string) => void;
    onLayerContextMenu: (e: React.MouseEvent, layerId: string) => void;
}

const LayerTypeIcon: React.FC<{type: Layer['type']}> = ({ type }) => {
    switch(type) {
        case 'image': return <ImageIcon />;
        case 'text': return <TextLayerIcon />;
        case 'drawing': return <DrawingLayerIcon />;
        default: return null;
    }
};

export const LeftPanel: React.FC<LeftPanelProps> = ({ layers, activeLayerId, onSelectLayer, onToggleVisibility, onLayerContextMenu }) => {
    return (
        <aside className="w-64 bg-dark-surface flex-shrink-0 border-r border-dark-border flex flex-col p-2">
            <h3 className="text-sm font-semibold flex items-center text-dark-text-primary px-2 py-1 mb-1">
                <LayersIcon />
                <span className="ml-2">Layers</span>
            </h3>
            <div className="flex-1 space-y-1 overflow-y-auto">
                {layers.length > 0 ? [...layers].reverse().map((layer) => (
                    <div 
                        key={layer.id} 
                        onClick={() => onSelectLayer(layer.id)}
                        onContextMenu={(e) => onLayerContextMenu(e, layer.id)}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-sm ${
                            activeLayerId === layer.id ? 'bg-dark-accent/80 text-white' : 'hover:bg-dark-border text-dark-text-secondary'
                        }`}
                    >
                        <div className="flex items-center space-x-2 truncate">
                           <LayerTypeIcon type={layer.type} />
                           <span className="truncate">{layer.name}</span>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleVisibility(layer.id);
                            }} 
                            title="Toggle visibility"
                            className="flex-shrink-0 text-dark-text-secondary hover:text-dark-text-primary"
                        >
                            {layer.visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                        </button>
                    </div>
                )) : <p className="text-xs text-dark-text-tertiary text-center py-4">No layers yet.</p>}
            </div>
        </aside>
    );
};
