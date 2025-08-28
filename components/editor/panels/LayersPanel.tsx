import React from 'react';
import { Layer } from '../../../types';
import { LayersIcon, EyeOpenIcon, EyeClosedIcon } from '../icons';

interface LayersPanelProps {
    layers: Layer[];
    setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
    activeLayerId: string | null;
    setActiveLayerId: (id: string | null) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ layers, setLayers, activeLayerId, setActiveLayerId }) => {

    const toggleLayerVisibility = (id: string) => {
        setLayers(layers.map(layer => layer.id === id ? { ...layer, visible: !layer.visible } : layer));
    };

    return (
        <div className="p-4 space-y-2">
            <h3 className="text-sm font-semibold flex items-center text-dark-text-primary">
                <LayersIcon />
                <span className="ml-2">Layers</span>
            </h3>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {layers.length > 0 ? [...layers].reverse().map((layer) => (
                    <div 
                        key={layer.id} 
                        onClick={() => setActiveLayerId(layer.id)}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                            activeLayerId === layer.id ? 'bg-dark-accent/30' : 'bg-dark-panel hover:bg-dark-border'
                        }`}
                    >
                        <span className="text-sm text-dark-text-secondary truncate">{layer.name}</span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleLayerVisibility(layer.id);
                            }} 
                            title="Toggle visibility"
                            className="text-dark-text-secondary hover:text-dark-text-primary"
                        >
                            {layer.visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                        </button>
                    </div>
                )) : <p className="text-xs text-dark-text-tertiary text-center py-4">No layers yet.</p>}
            </div>
        </div>
    );
};