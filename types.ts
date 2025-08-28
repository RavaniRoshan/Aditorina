export interface ImageFile {
  file: File;
  base64: string;
}

export interface AiEditResult {
  editedImage: string | null;
  textResponse: string | null;
}

export type Tool = 'ai-edit' | 'crop' | 'text' | 'brush' | 'select' | 'adjustments';

export interface BrushOptions {
  size: number;
  color: string;
}

export interface TextOptions {
  content: string;
  fontSize: number;
  color: string;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  type: 'image' | 'text' | 'drawing';
  content: string; // Data URL for images/drawings
  options?: {
    // Text Layer Options
    text?: string;
    fontSize?: number;
    color?: string;
    x?: number;
    y?: number;
    // Drawing Layer Options
    points?: {x: number, y: number}[];
    brushColor?: string;
    brushSize?: number;
    // Common options
    width?: number;
    height?: number;
  };
}