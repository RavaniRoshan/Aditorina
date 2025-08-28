import React from 'react';
import { Tool, Layer, BrushOptions, TextOptions } from '../../types';
import { AIPanel } from './panels/AIPanel';
import { LayersPanel } from './panels/LayersPanel';
import { BrushPanel } from './panels/BrushPanel';
import { TextPanel } from './panels/TextPanel';
import { CropPanel } from './panels/CropPanel';
import { AdjustmentsPanel } from './panels/AdjustmentsPanel';

interface RightPanelProps {
    activeTool: Tool;
    onToolOptionsChange: (tool: Tool, options: any) => void;
    
    // AI Panel Props
    prompt: string;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    isImageLoaded: boolean;
    error: string | null;
    textResponse: string | null;

    // Brush Panel Props
    brushOptions: BrushOptions;

    // Text Panel Props
    textOptions: TextOptions;
    onAddText: () => void;
    
    // Crop Panel Props
    onApplyCrop: () => void;
    
    // Layers Panel Props
    layers: Layer[];
    setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
    activeLayerId: string | null;
    setActiveLayerId: (id: string | null) => void;
}

const ToolPanel: React.FC<RightPanelProps> = (props) => {
    switch(props.activeTool) {
        case 'ai-edit':
            return <AIPanel {...props} />;
        case 'brush':
            return <BrushPanel 
                        options={props.brushOptions} 
                        onOptionsChange={(options) => props.onToolOptionsChange('brush', options)} 
                    />;
        case 'text':
            return <TextPanel
                        options={props.textOptions}
                        onOptionsChange={(options) => props.onToolOptionsChange('text', options)}
                        onAddText={props.onAddText}
                    />;
        case 'crop':
            return <CropPanel onApplyCrop={props.onApplyCrop} />;
        case 'adjustments':
            return <AdjustmentsPanel />;
        case 'select':
        default:
            return <div className="p-4 text-center text-sm text-dark-text-secondary">Select a tool to see its options.</div>;
    }
};

export const RightPanel: React.FC<RightPanelProps> = (props) => {
    return (
        <aside className="w-80 bg-dark-surface flex-shrink-0 border-l border-dark-border flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
                <ToolPanel {...props} />
            </div>
            
            <div className="flex-shrink-0 border-t border-dark-border">
                <LayersPanel 
                    layers={props.layers} 
                    setLayers={props.setLayers} 
                    activeLayerId={props.activeLayerId}
                    setActiveLayerId={props.setActiveLayerId}
                />
            </div>
        </aside>
    );
};