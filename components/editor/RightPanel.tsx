
import React from 'react';
import { Tool, BrushOptions, TextOptions } from '../../types';
import { AIPanel } from './panels/AIPanel';
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
}

const ToolPanel: React.FC<Omit<RightPanelProps, 'layers' | 'setLayers' | 'activeLayerId' | 'setActiveLayerId'>> = (props) => {
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
             return <div className="p-4 text-center text-sm text-dark-text-secondary h-full flex items-center justify-center">Select a tool to see its options.</div>;
    }
};

export const RightPanel: React.FC<RightPanelProps> = (props) => {
    return (
        <aside className="w-80 bg-dark-surface flex-shrink-0 border-l border-dark-border flex flex-col p-4">
            <ToolPanel {...props} />
        </aside>
    );
};
