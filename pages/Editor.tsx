import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageFile, Tool, Layer, BrushOptions, TextOptions } from '../types';
import { editImageWithPrompt } from '../services/geminiService';
import { TopBar } from '../components/editor/TopBar';
import { LeftPanel } from '../components/editor/LeftPanel';
import { Canvas } from '../components/editor/Canvas';
import { RightPanel } from '../components/editor/RightPanel';
import { FloatingToolbar } from '../components/editor/FloatingToolbar';
import { LayerContextMenu } from '../components/editor/LayerContextMenu';
import { v4 as uuidv4 } from 'uuid';

const PROJECT_STATE_KEY = 'photoCursorProjectState';

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

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; layerId: string; } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    const base64StringToFile = (base64String: string, filename: string, mimeType: string): File => {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], filename, { type: mimeType });
    };

    // Load state on mount
    useEffect(() => {
        const savedStateJSON = localStorage.getItem(PROJECT_STATE_KEY);
        if (savedStateJSON) {
            try {
                const savedState = JSON.parse(savedStateJSON);
                
                if (savedState.imageFile) {
                    const { fileName, fileType, base64 } = savedState.imageFile;
                    const file = base64StringToFile(base64, fileName, fileType);
                    setImageFile({ file, base64 });
                }
                
                if (savedState.layers) setLayers(savedState.layers);
                if (savedState.activeLayerId) setActiveLayerId(savedState.activeLayerId);
                if (savedState.activeTool) setActiveTool(savedState.activeTool);
                if (savedState.prompt) setPrompt(savedState.prompt);
                if (savedState.brushOptions) setBrushOptions(savedState.brushOptions);
                if (savedState.textOptions) setTextOptions(savedState.textOptions);
                
            } catch (e) {
                console.error("Failed to load project state:", e);
                localStorage.removeItem(PROJECT_STATE_KEY);
            }
        }
    }, []);

    // Save state on change
    useEffect(() => {
        if (!imageFile) {
            return;
        }
        const stateToSave = {
            imageFile: imageFile ? {
                fileName: imageFile.file.name,
                fileType: imageFile.file.type,
                base64: imageFile.base64,
            } : null,
            layers,
            activeLayerId,
            activeTool,
            prompt,
            brushOptions,
            textOptions,
        };
        
        try {
            localStorage.setItem(PROJECT_STATE_KEY, JSON.stringify(stateToSave));
        } catch (e) {
            console.error("Failed to save project state:", e);
        }
    }, [imageFile, layers, activeLayerId, activeTool, prompt, brushOptions, textOptions]);

    const handleNewProject = () => {
        if (window.confirm("Are you sure you want to start a new project? Your current work will be cleared.")) {
            localStorage.removeItem(PROJECT_STATE_KEY);
            // Reset all states to initial values
            setImageFile(null);
            setLayers([]);
            setActiveLayerId(null);
            setIsLoading(false);
            setError(null);
            setAiTextResponse(null);
            setActiveTool('select');
            setPrompt('');
            setBrushOptions({ size: 10, color: '#FFFFFF' });
            setTextOptions({ content: 'Hello World', fontSize: 48, color: '#FFFFFF' });
            setCropRect(null);
            setContextMenu(null);
        }
    };

    const handleImageUpload = (image: ImageFile) => {
        setImageFile(image);
        setError(null);
        setPrompt('');

        const img = new Image();
        img.onload = () => {
            const newLayer: Layer = {
                id: uuidv4(),
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
                    id: uuidv4(),
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
            id: uuidv4(),
            name: textOptions.content.substring(0, 20) || 'Text Layer',
            visible: true,
            type: 'text',
            content: textOptions.content,
            options: {
                ...textOptions,
                x: 50,
                y: 100
            }
        };
        setLayers(prev => [...prev, newLayer]);
        setActiveLayerId(newLayer.id);
    };
    
    const handleToolOptionsChange = useCallback((tool: Tool, options: any) => {
        if (tool === 'brush') {
            setBrushOptions(prev => ({ ...prev, ...options }));
        } else if (tool === 'text') {
            setTextOptions(prev => ({ ...prev, ...options }));
        }
    }, []);
    
    const handleApplyCrop = () => {
        if (!cropRect || !canvasRef.current || cropRect.width === 0 || cropRect.height === 0) {
            setActiveTool('select');
            return;
        }
    
        const sourceCanvas = canvasRef.current;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.abs(cropRect.width);
        tempCanvas.height = Math.abs(cropRect.height);
        const tempCtx = tempCanvas.getContext('2d');
    
        if (tempCtx) {
            const sx = cropRect.width > 0 ? cropRect.x : cropRect.x + cropRect.width;
            const sy = cropRect.height > 0 ? cropRect.y : cropRect.y + cropRect.height;
            const sWidth = Math.abs(cropRect.width);
            const sHeight = Math.abs(cropRect.height);

            tempCtx.drawImage(sourceCanvas, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);
            
            const newDataUrl = tempCanvas.toDataURL('image/png');
            const newLayer: Layer = {
                id: uuidv4(),
                name: 'Cropped Background',
                visible: true,
                type: 'image',
                content: newDataUrl,
                options: {
                    width: sWidth,
                    height: sHeight,
                }
            };
            setLayers([newLayer]);
            setActiveLayerId(newLayer.id);
        }
    
        setCropRect(null);
        setActiveTool('select');
    };

    const handleExport = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = `${imageFile?.file.name.split('.')[0] || 'canvas'}-export.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleLayerContextMenu = (e: React.MouseEvent, layerId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, layerId });
    };

    const closeContextMenu = () => setContextMenu(null);

    const handleDeleteLayer = (layerId: string) => {
        setLayers(layers.filter(l => l.id !== layerId));
        if (activeLayerId === layerId) {
            setActiveLayerId(null);
        }
        closeContextMenu();
    };

    const handleDuplicateLayer = (layerId: string) => {
        const layerToDuplicate = layers.find(l => l.id === layerId);
        if (layerToDuplicate) {
            const newLayer = { ...layerToDuplicate, id: uuidv4(), name: `${layerToDuplicate.name} Copy` };
            const index = layers.findIndex(l => l.id === layerId);
            const newLayers = [...layers];
            newLayers.splice(index + 1, 0, newLayer);
            setLayers(newLayers);
            setActiveLayerId(newLayer.id);
        }
        closeContextMenu();
    };

    const handleMoveLayer = (layerId: string, direction: 'up' | 'down') => {
        const index = layers.findIndex(l => l.id === layerId);
        if (index === -1) return;
    
        const newIndex = direction === 'up' ? index + 1 : index - 1;
    
        if (newIndex >= 0 && newIndex < layers.length) {
            const newLayers = [...layers];
            const [movedLayer] = newLayers.splice(index, 1);
            newLayers.splice(newIndex, 0, movedLayer);
            setLayers(newLayers);
        }
        closeContextMenu();
    };

    return (
        <div className="h-screen w-screen bg-dark-bg flex flex-col overflow-hidden text-dark-text-primary font-sans" onClick={closeContextMenu}>
            <TopBar onExit={onExitEditor} fileName={imageFile?.file.name} onExport={handleExport} onNewProject={handleNewProject} />
            <div className="flex flex-1 overflow-hidden">
                <LeftPanel 
                    layers={layers}
                    activeLayerId={activeLayerId}
                    onSelectLayer={setActiveLayerId}
                    onToggleVisibility={(id) => setLayers(layers.map(l => l.id === id ? {...l, visible: !l.visible} : l))}
                    onLayerContextMenu={handleLayerContextMenu}
                />
                <main ref={canvasContainerRef} className="flex-1 bg-black/50 flex items-center justify-center p-4 overflow-auto relative">
                   <Canvas
                        canvasRef={canvasRef}
                        layers={layers}
                        setLayers={setLayers}
                        onImageUpload={handleImageUpload}
                        activeTool={activeTool}
                        brushOptions={brushOptions}
                        cropRect={cropRect}
                        setCropRect={setCropRect}
                        canvasContainerRef={canvasContainerRef}
                   />
                   <FloatingToolbar activeTool={activeTool} onToolSelect={setActiveTool} />
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
                />
                {contextMenu && (
                    <LayerContextMenu 
                        menuPosition={{x: contextMenu.x, y: contextMenu.y}}
                        layerId={contextMenu.layerId}
                        onClose={closeContextMenu}
                        onDelete={handleDeleteLayer}
                        onDuplicate={handleDuplicateLayer}
                        onMoveUp={(id) => handleMoveLayer(id, 'up')}
                        onMoveDown={(id) => handleMoveLayer(id, 'down')}
                    />
                )}
            </div>
        </div>
    );
};
