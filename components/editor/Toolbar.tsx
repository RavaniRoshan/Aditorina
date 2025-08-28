import React from 'react';
import { Tool } from '../../types';
import { AIEnhanceIcon, CropIcon, TextIcon, BrushIcon, SelectIcon } from './icons';

interface ToolbarProps {
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
            className={`w-12 h-12 flex items-center justify-center rounded-md transition duration-150 ${
                isActive ? 'bg-brand-primary text-white' : 'text-gray-400 hover:bg-dark-border hover:text-white'
            }`}
        >
            {children}
        </button>
    );
};

export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onToolSelect }) => {
    return (
        <aside className="w-16 bg-dark-surface flex-shrink-0 p-2 border-r border-dark-border">
            <div className="flex flex-col items-center space-y-2">
                <ToolButton label="Select" tool="select" activeTool={activeTool} onToolSelect={onToolSelect}><SelectIcon /></ToolButton>
                <ToolButton label="Crop" tool="crop" activeTool={activeTool} onToolSelect={onToolSelect}><CropIcon /></ToolButton>
                <ToolButton label="Brush" tool="brush" activeTool={activeTool} onToolSelect={onToolSelect}><BrushIcon /></ToolButton>
                <ToolButton label="Text" tool="text" activeTool={activeTool} onToolSelect={onToolSelect}><TextIcon /></ToolButton>
                <ToolButton label="AI Magic Edit" tool="ai-edit" activeTool={activeTool} onToolSelect={onToolSelect}><AIEnhanceIcon /></ToolButton>
            </div>
        </aside>
    );
};
