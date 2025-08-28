import React from 'react';
import { BrushOptions } from '../../../types';
import { ColorPicker } from './ColorPicker';

interface BrushPanelProps {
    options: BrushOptions;
    onOptionsChange: (options: Partial<BrushOptions>) => void;
}

export const BrushPanel: React.FC<BrushPanelProps> = ({ options, onOptionsChange }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-dark-text-primary">Brush Options</h3>
            <div>
                <label htmlFor="brush-size" className="block text-xs font-medium text-dark-text-secondary mb-1">
                    Size
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        id="brush-size"
                        type="range"
                        min="1"
                        max="100"
                        value={options.size}
                        onChange={(e) => onOptionsChange({ size: parseInt(e.target.value, 10) })}
                        className="w-full h-1 bg-dark-border rounded-lg appearance-none cursor-pointer range-sm accent-dark-accent"
                    />
                    <span className="text-xs w-8 text-right text-dark-text-secondary">{options.size}px</span>
                </div>
            </div>
            
            <ColorPicker
                selectedColor={options.color}
                onColorChange={(color) => onOptionsChange({ color })}
            />
        </div>
    );
};