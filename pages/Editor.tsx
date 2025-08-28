import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ImageFile, Tool, Layer, BrushOptions, TextOptions } from '../types';
import { editImageWithPrompt } from '../services/geminiService';
import { TopBar } from '../components/editor/TopBar';
import { LeftPanel } from '../components/editor/LeftPanel';
import { Canvas } from '../components/editor/Canvas';
import { RightPanel } from '../components/editor/RightPanel';
import { FloatingToolbar } from '../components/editor/FloatingToolbar';
import { LayerContextMenu } from '../components/editor/LayerContextMenu';
import { ZoomControls } from '../components/editor/ZoomControls';
import { ViewportContextMenu } from '../components/editor/ViewportContextMenu';
import { v4 as uuidv4 } from 'uuid';

const PROJECT_STATE_KEY = 'photoCursorProjectState';
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 16;

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
    const [viewportContextMenu, setViewportContextMenu] = useState<{ x: number; y: number; } | null>(null);
    
    const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, zoom: 1 });
    const [isSpacePressed, setIsSpacePressed] = useState(false);
    const [showUi, setShowUi] = useState(true);
    const isPanning = useRef(false);
    const panStart = useRef({ x: 0, y: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const base64StringToFile = (base64String: string, filename: string, mimeType: string): File => {
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new File([byteArray], filename, { type: mimeType });
    };

    const zoomToFit = useCallback(() => {
        const baseLayer = layers.find(l => l.type === 'image');
        if (!viewportRef.current || !baseLayer || !baseLayer.options?.width || !baseLayer.options?.height) {
            return;
        };

        const container = viewportRef.current;
        const padding = 80;
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        const { width: imageWidth, height: imageHeight } = baseLayer.options;

        const scaleX = (containerWidth - padding) / imageWidth;
        const scaleY = (containerHeight - padding) / imageHeight;
        const newZoom = Math.min(scaleX, scaleY, 1);

        const newX = (containerWidth - imageWidth * newZoom) / 2;
        const newY = (containerHeight - imageHeight * newZoom) / 2;

        setViewTransform({ x: newX, y: newY, zoom: newZoom });
    }, [layers]);

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
                
                if (savedState.layers) {
                    setLayers(savedState.layers);
                }
                if (savedState.activeLayerId) setActiveLayerId(savedState.activeLayerId);
                if (savedState.activeTool) setActiveTool(savedState.activeTool);
                if (savedState.prompt) setPrompt(savedState.prompt);
                if (savedState.brushOptions) setBrushOptions(savedState.brushOptions);
                if (savedState.textOptions) setTextOptions(savedState.textOptions);
                
                setTimeout(zoomToFit, 100);
                
            } catch (e) {
                console.error("Failed to load project state:", e);
                localStorage.removeItem(PROJECT_STATE_KEY);
            }
        }
    }, [zoomToFit]);

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

    // Spacebar listener for panning
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
            if (e.code === 'Space' && !isSpacePressed) {
                e.preventDefault();
                setIsSpacePressed(true);
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsSpacePressed(false);
                isPanning.current = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isSpacePressed]);

    // Window resize listener
    useEffect(() => {
        window.addEventListener('resize', zoomToFit);
        return () => window.removeEventListener('resize', zoomToFit);
    }, [zoomToFit]);


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
            setViewportContextMenu(null);
            setViewTransform({ x: 0, y: 0, zoom: 1 });
        }
    };

    const handleImageUpload = (image: ImageFile) => {
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
            setImageFile(image);
            setLayers([newLayer]);
            setActiveLayerId(newLayer.id);
            
            setTimeout(() => {
                 if (!viewportRef.current) return;
                const container = viewportRef.current;
                const padding = 80;
                const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
                const { width: imageWidth, height: imageHeight } = newLayer.options;
        
                const scaleX = (containerWidth - padding) / (imageWidth || 1);
                const scaleY = (containerHeight - padding) / (imageHeight || 1);
                const newZoom = Math.min(scaleX, scaleY, 1);
        
                const newX = (containerWidth - (imageWidth || 0) * newZoom) / 2;
                const newY = (containerHeight - (imageHeight || 0) * newZoom) / 2;
        
                setViewTransform({ x: newX, y: newY, zoom: newZoom });
            }, 0);
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

    const closeAllContextMenus = () => {
        setContextMenu(null);
        setViewportContextMenu(null);
    };

    const handleLayerContextMenu = (e: React.MouseEvent, layerId: string) => {
        e.preventDefault();
        setViewportContextMenu(null);
        setContextMenu({ x: e.clientX, y: e.clientY, layerId });
    };

    const handleViewportContextMenu = (e: React.MouseEvent) => {
        if (e.target !== viewportRef.current) return;
        e.preventDefault();
        setContextMenu(null);
        setViewportContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleDeleteLayer = useCallback((layerId: string, closeMenu = true) => {
        setLayers(currentLayers => {
            const newLayers = currentLayers.filter(l => l.id !== layerId);
            if (activeLayerId === layerId) {
                const originalIndex = currentLayers.findIndex(l => l.id === layerId);
                const newActiveLayer = newLayers[originalIndex] || newLayers[newLayers.length - 1];
                setActiveLayerId(newActiveLayer ? newActiveLayer.id : null);
            }
            return newLayers;
        });
        if (closeMenu) closeAllContextMenus();
    }, [activeLayerId]);

    const handleDuplicateLayer = useCallback((layerId: string, closeMenu = true) => {
        setLayers(currentLayers => {
            const layerToDuplicate = currentLayers.find(l => l.id === layerId);
            if (layerToDuplicate) {
                const newLayer = { ...layerToDuplicate, id: uuidv4(), name: `${layerToDuplicate.name} Copy` };
                const index = currentLayers.findIndex(l => l.id === layerId);
                const newLayers = [...currentLayers];
                newLayers.splice(index + 1, 0, newLayer);
                setActiveLayerId(newLayer.id);
                return newLayers;
            }
            return currentLayers;
        });
        if (closeMenu) closeAllContextMenus();
    }, []);

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
        closeAllContextMenus();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isSpacePressed || e.button === 1) {
            e.preventDefault();
            isPanning.current = true;
            panStart.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning.current && (isSpacePressed || e.buttons === 4)) {
            const dx = e.clientX - panStart.current.x;
            const dy = e.clientY - panStart.current.y;
            panStart.current = { x: e.clientX, y: e.clientY };
            setViewTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        }
    };

    const handleMouseUp = () => {
        isPanning.current = false;
    };
    
    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const rect = viewportRef.current!.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const zoomFactor = 1.1;
            const newZoom = e.deltaY < 0 ? viewTransform.zoom * zoomFactor : viewTransform.zoom / zoomFactor;
            const clampedZoom = Math.max(MIN_ZOOM, Math.min(newZoom, MAX_ZOOM));

            const mousePoint = { x: (mouseX - viewTransform.x) / viewTransform.zoom, y: (mouseY - viewTransform.y) / viewTransform.zoom };
            
            const newX = mouseX - mousePoint.x * clampedZoom;
            const newY = mouseY - mousePoint.y * clampedZoom;
            
            setViewTransform({ x: newX, y: newY, zoom: clampedZoom });
        }
    };

    const handleZoomTo100 = useCallback(() => {
        if (!viewportRef.current) return;
        const { width, height } = viewportRef.current.getBoundingClientRect();
        
        const currentCenter = {
            x: (width / 2 - viewTransform.x) / viewTransform.zoom,
            y: (height / 2 - viewTransform.y) / viewTransform.zoom,
        };
        
        const newX = width / 2 - currentCenter.x * 1;
        const newY = height / 2 - currentCenter.y * 1;
        
        setViewTransform({ x: newX, y: newY, zoom: 1 });
    }, [viewTransform]);
    
    const handleZoomAction = useCallback((direction: 'in' | 'out') => {
        const rect = viewportRef.current!.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const zoomFactor = 1.4;
        const newZoom = direction === 'in' ? viewTransform.zoom * zoomFactor : viewTransform.zoom / zoomFactor;
        const clampedZoom = Math.max(MIN_ZOOM, Math.min(newZoom, MAX_ZOOM));
        
        const mousePoint = { x: (centerX - viewTransform.x) / viewTransform.zoom, y: (centerY - viewTransform.y) / viewTransform.zoom };
            
        const newX = centerX - mousePoint.x * clampedZoom;
        const newY = centerY - mousePoint.y * clampedZoom;
        
        setViewTransform({ x: newX, y: newY, zoom: clampedZoom });
    }, [viewTransform]);

    // Keyboard shortcuts listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const isCtrlCmd = isMac ? e.metaKey : e.ctrlKey;

            // Tool shortcuts (no modifiers)
            if (!e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                switch (e.key.toLowerCase()) {
                    case 'v': e.preventDefault(); setActiveTool('select'); break;
                    case 'c': e.preventDefault(); setActiveTool('crop'); break;
                    case 'b': e.preventDefault(); setActiveTool('brush'); break;
                    case 't': e.preventDefault(); setActiveTool('text'); break;
                }
            }

            // Commands with Ctrl/Cmd
            if (isCtrlCmd) {
                switch (e.key.toLowerCase()) {
                    case '=': case '+': e.preventDefault(); handleZoomAction('in'); break;
                    case '-': e.preventDefault(); handleZoomAction('out'); break;
                    case '0': e.preventDefault(); handleZoomTo100(); break;
                    case '\\': e.preventDefault(); setShowUi(prev => !prev); break;
                    case 'd':
                        if (activeLayerId) {
                            e.preventDefault();
                            handleDuplicateLayer(activeLayerId, false);
                        }
                        break;
                }
            }
            
            if (e.shiftKey && !isCtrlCmd) {
                 switch (e.key) {
                    case '1': e.preventDefault(); zoomToFit(); break;
                 }
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (activeLayerId) {
                    e.preventDefault();
                    handleDeleteLayer(activeLayerId, false);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeLayerId, handleZoomAction, handleZoomTo100, zoomToFit, handleDuplicateLayer, handleDeleteLayer]);

    const getCursor = () => {
        if (isSpacePressed) {
            return isPanning.current ? 'grabbing' : 'grab';
        }
        return 'default';
    };

    return (
        <div className="h-screen w-screen bg-dark-bg flex flex-col overflow-hidden text-dark-text-primary font-sans" onClick={closeAllContextMenus}>
            <TopBar onExit={onExitEditor} fileName={imageFile?.file.name} onExport={handleExport} onNewProject={handleNewProject} />
            <div className="flex flex-1 overflow-hidden">
                {showUi && <LeftPanel 
                    layers={layers}
                    activeLayerId={activeLayerId}
                    onSelectLayer={setActiveLayerId}
                    onToggleVisibility={(id) => setLayers(layers.map(l => l.id === id ? {...l, visible: !l.visible} : l))}
                    onLayerContextMenu={handleLayerContextMenu}
                />}
                <main 
                    ref={viewportRef} 
                    className="flex-1 bg-black/50 flex items-center justify-center p-4 overflow-hidden relative"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ cursor: getCursor() }}
                    onContextMenu={handleViewportContextMenu}
                >
                   <Canvas
                        canvasRef={canvasRef}
                        layers={layers}
                        setLayers={setLayers}
                        onImageUpload={handleImageUpload}
                        activeTool={activeTool}
                        brushOptions={brushOptions}
                        cropRect={cropRect}
                        setCropRect={setCropRect}
                        viewTransform={viewTransform}
                   />
                   <FloatingToolbar activeTool={activeTool} onToolSelect={setActiveTool} />
                   <ZoomControls 
                        zoom={viewTransform.zoom}
                        onZoomIn={() => handleZoomAction('in')}
                        onZoomOut={() => handleZoomAction('out')}
                        onZoomToFit={zoomToFit}
                   />
                </main>
                {showUi && <RightPanel 
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
                />}
                {contextMenu && (
                    <LayerContextMenu 
                        menuPosition={{x: contextMenu.x, y: contextMenu.y}}
                        layerId={contextMenu.layerId}
                        onClose={closeAllContextMenus}
                        onDelete={handleDeleteLayer}
                        onDuplicate={handleDuplicateLayer}
                        onMoveUp={(id) => handleMoveLayer(id, 'up')}
                        onMoveDown={(id) => handleMoveLayer(id, 'down')}
                    />
                )}
                {viewportContextMenu && (
                     <ViewportContextMenu
                        menuPosition={{ x: viewportContextMenu.x, y: viewportContextMenu.y }}
                        onClose={closeAllContextMenus}
                        onZoomToFit={zoomToFit}
                        onZoomTo100={handleZoomTo100}
                        onToggleUI={() => setShowUi(prev => !prev)}
                        isUiVisible={showUi}
                    />
                )}
            </div>
        </div>
    );
};