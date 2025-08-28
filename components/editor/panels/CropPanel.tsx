import React from 'react';
import { CheckIcon } from '../icons';

interface CropPanelProps {
    onApplyCrop: () => void;
}

export const CropPanel: React.FC<CropPanelProps> = ({ onApplyCrop }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-dark-text-primary">Crop Tool</h3>
            <p className="text-xs text-dark-text-secondary">Click and drag on the canvas to select an area to crop.</p>
            <button
                onClick={onApplyCrop}
                className="w-full flex items-center justify-center bg-dark-accent hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
                <CheckIcon />
                <span>Apply Crop</span>
            </button>
        </div>
    );
};