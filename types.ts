export interface ImageFile {
  file: File;
  base64: string;
}

export interface AiEditResult {
  editedImage: string | null;
  textResponse: string | null;
}

export type Tool = 'ai-edit' | 'crop' | 'text' | 'brush' | 'select';

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  type: 'image' | 'text';
  // For image layers, content is a data URL.
  content: string;
}
