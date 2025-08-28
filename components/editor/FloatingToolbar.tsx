
import React from 'react';
import { Tool } from '../../types';
import { AIEnhanceIcon, CropIcon, TextIcon, BrushIcon, SelectIcon, AdjustmentsIcon } from './icons';

interface FloatingToolbarProps {
    activeTool: Tool;
    onToolSelect: (tool: Tool) => void;
}

const ToolButton: React.FC<{
    label: string;
    tool: Tool;
    activeTool: Tool;
    onToolSelect: (tool: Tool) => void;
    children: React.ReactNode;
}> = ({ label, tool, activeTool, onToolSelect, children }) => {
    const isActive = activeTool === tool;
    return (
        <button
            title={label}
            onClick={() => onToolSelect(tool)}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition duration-150 ${
                isActive ? 'bg-dark-accent text-white' : 'text-dark-text-secondary hover:bg-dark-border hover:text-dark-text-primary'
            }`}
        >
            {children}
        </button>
    );
};

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ activeTool, onToolSelect }) => {
    return (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-dark-surface p-2 rounded-lg shadow-2xl border border-dark-border flex items-center space-x-1 z-10">
            <ToolButton label="Select" tool="select" activeTool={activeTool} onToolSelect={onToolSelect}><SelectIcon /></ToolButton>
            <ToolButton label="Crop" tool="crop" activeTool={activeTool} onToolSelect={onToolSelect}><CropIcon /></ToolButton>
            <ToolButton label="Adjustments" tool="adjustments" activeTool={activeTool} onToolSelect={onToolSelect}><AdjustmentsIcon /></ToolButton>
            <div className="w-px h-8 bg-dark-border mx-1"></div>
            <ToolButton label="Brush" tool="brush" activeTool={activeTool} onToolSelect={onToolSelect}><BrushIcon /></ToolButton>
            <ToolButton label="Text" tool="text" activeTool={activeTool} onToolSelect={onToolSelect}><TextIcon /></ToolButton>
            <div className="w-px h-8 bg-dark-border mx-1"></div>
            <ToolButton label="AI Magic Edit" tool="ai-edit" activeTool={activeTool} onToolSelect={onToolSelect}><AIEnhanceIcon /></ToolButton>
        </div>
    );
};