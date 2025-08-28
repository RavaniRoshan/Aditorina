import React from 'react';
import { TextOptions } from '../../../types';
import { ColorPicker } from './ColorPicker';
import { TextIcon } from '../icons';

interface TextPanelProps {
    options: TextOptions;
    onOptionsChange: (options: Partial<TextOptions>) => void;
    onAddText: () => void;
}

export const TextPanel: React.FC<TextPanelProps> = ({ options, onOptionsChange, onAddText }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-dark-text-primary">Text Options</h3>
            <div>
                <label htmlFor="text-content" className="block text-xs font-medium text-dark-text-secondary mb-1">
                    Text Content
                </label>
                <textarea
                    id="text-content"
                    rows={3}
                    value={options.content}
                    onChange={(e) => onOptionsChange({ content: e.target.value })}
                    placeholder="Enter text here..."
                    className="w-full bg-dark-bg border border-dark-border rounded-md shadow-sm p-2 focus:ring-1 focus:ring-dark-accent focus:border-dark-accent transition duration-150 text-sm"
                />
            </div>

            <div>
                <label htmlFor="font-size" className="block text-xs font-medium text-dark-text-secondary mb-1">
                    Font Size
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        id="font-size"
                        type="range"
                        min="12"
                        max="256"
                        value={options.fontSize}
                        onChange={(e) => onOptionsChange({ fontSize: parseInt(e.target.value, 10) })}
                        className="w-full h-1 bg-dark-border rounded-lg appearance-none cursor-pointer range-sm accent-dark-accent"
                    />
                    <span className="text-xs w-8 text-right text-dark-text-secondary">{options.fontSize}px</span>
                </div>
            </div>
            
            <ColorPicker
                selectedColor={options.color}
                onColorChange={(color) => onOptionsChange({ color })}
            />

            <button
                onClick={onAddText}
                disabled={!options.content.trim()}
                className="w-full flex items-center justify-center bg-dark-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 ease-in-out disabled:opacity-50"
            >
                <TextIcon />
                <span className="ml-1.5">Add Text Layer</span>
            </button>
        </div>
    );
};