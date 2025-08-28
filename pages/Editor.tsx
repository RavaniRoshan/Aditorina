

import React, { useState, useCallback, useRef } from 'react';
import { ImageFile, AiEditResult, Tool, Layer, BrushOptions, TextOptions } from '../types';
import { editImageWithPrompt } from '../services/geminiService';
import { TopBar } from '../components/editor/TopBar';
import { Toolbar } from '../components/editor/Toolbar';
import { Canvas } from '../components/editor/Canvas';
import { RightPanel } from '../components/editor/RightPanel';

interface EditorProps {
    onExitEditor: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onExitEditor }) => {
    const [imageFile, setImageFile] = useState<ImageFile | null>(null);
    const [layers, setLayers] = useState<Layer[]>([]);
    const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [aiTextResponse, setAiTextResponse] = useState<string | null>(null);
    
    const [activeTool, setActiveTool] = useState<Tool>('select');
    
    const [prompt, setPrompt] = useState<string>('');
    const [brushOptions, setBrushOptions] = useState<BrushOptions>({ size: 10, color: '#FFFFFF' });
    const [textOptions, setTextOptions] = useState<TextOptions>({ content: 'Hello World', fontSize: 48, color: '#FFFFFF' });
    const [cropRect, setCropRect] = useState<{x:number, y:number, width:number, height:number} | null>(null);

    const canvasContainerRef = useRef<HTMLDivElement>(null);


    const handleImageUpload = (image: ImageFile) => {
        setImageFile(image);
        setError(null);
        setPrompt('');

        const img = new Image();
        img.onload = () => {
            const newLayer: Layer = {
                id: `layer-${Date.now()}`,
                name: 'Background',
                visible: true,
                type: 'image',
                content: img.src,
                options: { width: img.width, height: img.height }
            };
            setLayers([newLayer]);
            setActiveLayerId(newLayer.id);
        }
        img.src = `data:${image.file.type};base64,${image.base64}`;
    };

    const handleGenerateAIEdit = useCallback(async () => {
        if (!imageFile || !prompt.trim()) {
            setError('Please upload an image and enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAiTextResponse(null);

        try {
            const result = await editImageWithPrompt(
                imageFile.base64,
                imageFile.file.type,
                prompt
            );
            
            setAiTextResponse(result.textResponse);

            if (result.editedImage) {
                 const newLayer: Layer = {
                    id: `layer-${Date.now()}`,
                    name: prompt.substring(0, 20) || 'AI Edit',
                    visible: true,
                    type: 'image',
                    content: result.editedImage,
                };
                setLayers(prev => [...prev, newLayer]);
                setActiveLayerId(newLayer.id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile, prompt]);

    const handleAddText = () => {
        const newLayer: Layer = {
            id: `layer-${Date.now()}`,
            name: textOptions.content.substring(0, 20) || 'Text Layer',
            visible: true,
            type: 'text',
            content: textOptions.content,
            options: {
                ...textOptions,
                x: 50, // Default position
                y: 100
            }
        };
        setLayers(prev => [...prev, newLayer]);
    };
    
    const handleToolOptionsChange = useCallback((tool: Tool, options: any) => {
        if (tool === 'brush') {
            setBrushOptions(prev => ({ ...prev, ...options }));
        } else if (tool === 'text') {
            setTextOptions(prev => ({ ...prev, ...options }));
        }
    }, []);
    
    const handleApplyCrop = () => {
        // This is a placeholder for a more complex crop implementation
        // which would involve rendering the cropped image to a new canvas.
        if(cropRect) {
             alert(`Cropping to: \nX: ${cropRect.x.toFixed(0)}\nY: ${cropRect.y.toFixed(0)}\nWidth: ${cropRect.width.toFixed(0)}\nHeight: ${cropRect.height.toFixed(0)}`);
        }
        setActiveTool('select');
    };


    const handleReset = () => {
        setImageFile(null);
        setLayers([]);
        setActiveLayerId(null);
        setPrompt('');
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="h-screen w-screen bg-dark-bg flex flex-col overflow-hidden text-dark-text-primary font-sans">
            <TopBar onExit={onExitEditor} fileName={imageFile?.file.name} />
            <div className="flex flex-1 overflow-hidden">
                <Toolbar activeTool={activeTool} onToolSelect={setActiveTool} />
                <main ref={canvasContainerRef} className="flex-1 bg-black/50 flex items-center justify-center p-4 overflow-auto">
                   <Canvas
                        layers={layers}
                        setLayers={setLayers}
                        onImageUpload={handleImageUpload}
                        activeTool={activeTool}
                        brushOptions={brushOptions}
                        cropRect={cropRect}
                        setCropRect={setCropRect}
                        canvasContainerRef={canvasContainerRef}
                   />
                </main>
                <RightPanel 
                    activeTool={activeTool}
                    onToolOptionsChange={handleToolOptionsChange}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onGenerate={handleGenerateAIEdit}
                    isLoading={isLoading}
                    isImageLoaded={!!imageFile}
                    error={error}
                    textResponse={aiTextResponse}
                    brushOptions={brushOptions}
                    textOptions={textOptions}
                    onAddText={handleAddText}
                    onApplyCrop={handleApplyCrop}
                    layers={layers}
                    setLayers={setLayers}
                    activeLayerId={activeLayerId}
                    setActiveLayerId={setActiveLayerId}
                />
            </div>
        </div>
    );
};