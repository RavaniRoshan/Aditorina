import React, { useState, useCallback } from 'react';
import { ImageFile, AiEditResult, Tool, Layer } from '../types';
import { editImageWithPrompt } from '../services/geminiService';
import { TopBar } from '../components/editor/TopBar';
import { Toolbar } from '../components/editor/Toolbar';
import { Canvas } from '../components/editor/Canvas';
import { RightPanel } from '../components/editor/RightPanel';

interface EditorProps {
    onExitEditor: () => void;
}

export const Editor: React.FC<EditorProps> = ({ onExitEditor }) => {
    const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
    const [editResult, setEditResult] = useState<AiEditResult | null>(null);
    const [layers, setLayers] = useState<Layer[]>([]);
    
    const [prompt, setPrompt] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [activeTool, setActiveTool] = useState<Tool>('ai-edit');
    const [rightPanelTab, setRightPanelTab] = useState<'ai-edit' | 'layers' | 'adjustments'>('ai-edit');

    const handleImageUpload = (image: ImageFile) => {
        setOriginalImage(image);
        setEditResult(null);
        setError(null);
        setPrompt('');
        const newLayer: Layer = {
            id: `layer-${Date.now()}`,
            name: 'Background',
            visible: true,
            type: 'image',
            content: `data:${image.file.type};base64,${image.base64}`
        };
        setLayers([newLayer]);
    };

    const handleGenerate = useCallback(async () => {
        if (!originalImage || !prompt.trim()) {
            setError('Please upload an image and enter a prompt.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setEditResult(null);

        try {
            const result = await editImageWithPrompt(
                originalImage.base64,
                originalImage.file.type,
                prompt
            );
            setEditResult(result);
            if (result.editedImage) {
                 const newLayer: Layer = {
                    id: `layer-${Date.now()}`,
                    name: prompt.substring(0, 20) || 'AI Edit',
                    visible: true,
                    type: 'image',
                    content: result.editedImage,
                };
                // Replace previous AI edits for simplicity, or push to add more layers
                setLayers(prev => [prev[0], newLayer]); 
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [originalImage, prompt]);

    const handleReset = () => {
        setOriginalImage(null);
        setEditResult(null);
        setPrompt('');
        setError(null);
        setIsLoading(false);
        setLayers([]);
    };

    return (
        <div className="h-screen w-screen bg-[#222] flex flex-col overflow-hidden text-dark-text-primary font-sans">
            <TopBar onExit={onExitEditor} fileName={originalImage?.file.name} />
            <div className="flex flex-1 overflow-hidden">
                <Toolbar activeTool={activeTool} onToolSelect={setActiveTool} />
                <main className="flex-1 bg-black/50 flex items-center justify-center p-4">
                   <Canvas
                        originalImage={originalImage}
                        editResult={editResult}
                        onImageUpload={handleImageUpload}
                        onReset={handleReset}
                        isLoading={isLoading}
                   />
                </main>
                <RightPanel 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                    isImageLoaded={!!originalImage}
                    error={error}
                    textResponse={editResult?.textResponse}
                    layers={layers}
                    setLayers={setLayers}
                    activeTab={rightPanelTab}
                    setActiveTab={setRightPanelTab}
                />
            </div>
        </div>
    );
};
