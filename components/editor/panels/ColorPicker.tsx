import React from 'react';

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

const colors = [
  '#FFFFFF', // White
  '#EF4444', // Red-500
  '#F97316', // Orange-500
  '#EAB308', // Yellow-500
  '#84CC16', // Lime-500
  '#22C55E', // Green-500
  '#14B8A6', // Teal-500
  '#06B6D4', // Cyan-500
  '#3B82F6', // Blue-500
  '#8B5CF6', // Violet-500
  '#EC4899', // Pink-500
  '#374151', // Gray-700
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ selectedColor, onColorChange }) => {
  return (
    <div>
      <label className="block text-xs font-medium text-dark-text-secondary mb-2">Color</label>
      <div className="grid grid-cols-6 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Select color ${color}`}
            onClick={() => onColorChange(color)}
            className={`w-full pt-[100%] relative rounded-full border-2 transition-transform transform hover:scale-110 focus:outline-none ${
              selectedColor.toLowerCase() === color.toLowerCase()
                ? 'border-dark-accent ring-1 ring-dark-accent'
                : 'border-dark-border/50'
            }`}
          >
            <span className="absolute inset-0 rounded-full" style={{ backgroundColor: color }} />
          </button>
        ))}
      </div>
    </div>
  );
};