import React from 'react';

const AdjustmentSlider: React.FC<{label: string}> = ({label}) => (
    <div>
        <label className="block text-xs font-medium text-dark-text-secondary">{label}</label>
        <div className="flex items-center space-x-2">
            <input type="range" min="-100" max="100" defaultValue="0" className="w-full h-1 bg-dark-border rounded-lg appearance-none cursor-pointer range-sm accent-dark-accent" />
            <span className="text-xs w-8 text-right text-dark-text-secondary">0</span>
        </div>
    </div>
);

export const AdjustmentsPanel: React.FC = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-dark-text-primary">Adjustments</h3>
            <AdjustmentSlider label="Brightness" />
            <AdjustmentSlider label="Contrast" />
            <AdjustmentSlider label="Saturation" />
            <AdjustmentSlider label="Vibrance" />
            <p className="text-xs text-center text-dark-text-tertiary pt-4">More adjustments coming soon!</p>
        </div>
    );
};