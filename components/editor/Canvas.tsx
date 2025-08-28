
import React, { useEffect, useState, useCallback } from 'react';
import { ImageFile, Layer, BrushOptions, Tool } from '../../types';
import { ImageUploader } from '../ImageUploader';

interface CanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    layers: Layer[];
    setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
    onImageUpload: (image: ImageFile) => void;
    activeTool: Tool;
    brushOptions: BrushOptions;
    cropRect: {x:number, y:number, width:number, height:number} | null;
    setCropRect: (rect: {x:number, y:number, width:number, height:number} | null) => void;
    canvasContainerRef: React.RefObject<HTMLDivElement>;
}

export const Canvas: React.FC<CanvasProps> = (props) => {
    const { canvasRef, layers, setLayers, onImageUpload, activeTool, brushOptions, cropRect, setCropRect } = props;
    
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<{x: number, y: number}[]>([]);
    
    const [isCropping, setIsCropping] = useState(false);
    const [cropStart, setCropStart] = useState<{x:number, y:number} | null>(null);

    const getCanvasDimensions = () => {
        const baseLayer = layers.find(l => l.type === 'image');
        if (baseLayer && baseLayer.options?.width && baseLayer.options?.height) {
            return { width: baseLayer.options.width, height: baseLayer.options.height };
        }
        return { width: 0, height: 0 };
    };
    
    const { width, height } = getCanvasDimensions();

    const getMousePos = (e: React.MouseEvent): {x: number, y: number} => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    };

    const drawLayers = useCallback(async () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const imagePromises: Promise<HTMLImageElement>[] = [];
        const imageElements: { [key: string]: HTMLImageElement } = {};
      
        for (const layer of layers) {
            if (layer.type === 'image') {
                const promise = new Promise<HTMLImageElement>(resolve => {
                    if (imageElements[layer.content]) {
                        resolve(imageElements[layer.content]);
                    } else {
                        const img = new Image();
                        img.src = layer.content;
                        img.onload = () => {
                            imageElements[layer.content] = img;
                            resolve(img);
                        };
                    }
                });
                imagePromises.push(promise);
            }
        }
    
        await Promise.all(imagePromises);

        for (const layer of layers) {
            if (!layer.visible) continue;

            if (layer.type === 'image') {
                const img = imageElements[layer.content];
                if (img) {
                    ctx.drawImage(img, 0, 0);
                }
            } else if (layer.type === 'drawing' && layer.options?.points) {
                ctx.beginPath();
                ctx.strokeStyle = layer.options.brushColor || '#FFFFFF';
                ctx.lineWidth = layer.options.brushSize || 5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                layer.options.points.forEach((point, index) => {
                    if (index === 0) ctx.moveTo(point.x, point.y);
                    else ctx.lineTo(point.x, point.y);
                });
                ctx.stroke();
            } else if (layer.type === 'text' && layer.options) {
                 ctx.fillStyle = layer.options.color || '#FFFFFF';
                 ctx.font = `${layer.options.fontSize || 48}px Inter`;
                 ctx.fillText(layer.content, layer.options.x || 50, layer.options.y || 100);
            }
        }
    }, [layers, canvasRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
        drawLayers();
    }, [layers, width, height, drawLayers, canvasRef]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (activeTool === 'brush') {
            setIsDrawing(true);
            const pos = getMousePos(e);
            setPoints([pos]);
        } else if (activeTool === 'crop') {
            setIsCropping(true);
            const pos = getMousePos(e);
            setCropStart(pos);
            setCropRect({ x: pos.x, y: pos.y, width: 0, height: 0 });
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        const pos = getMousePos(e);

        if (isDrawing && activeTool === 'brush') {
            setPoints(prev => [...prev, pos]);
            
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (!ctx || points.length < 1) return;
            
            ctx.beginPath();
            ctx.strokeStyle = brushOptions.color;
            ctx.lineWidth = brushOptions.size;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.moveTo(points[points.length-1].x, points[points.length-1].y);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
            
        } else if (isCropping && activeTool === 'crop' && cropStart) {
            setCropRect({ 
                x: Math.min(pos.x, cropStart.x), 
                y: Math.min(pos.y, cropStart.y), 
                width: Math.abs(pos.x - cropStart.x), 
                height: Math.abs(pos.y - cropStart.y) 
            });
        }
    };
    
    const handleMouseUp = () => {
        if(isDrawing && activeTool === 'brush' && points.length > 1) {
             const newLayer: Layer = {
                id: `layer-${Date.now()}`,
                name: 'Drawing',
                visible: true,
                type: 'drawing',
                content: '',
                options: {
                    points: points,
                    brushColor: brushOptions.color,
                    brushSize: brushOptions.size,
                }
            };
            setLayers(prev => [...prev, newLayer]);
        }
        
        setIsDrawing(false);
        setPoints([]);

        setIsCropping(false);
        setCropStart(null);
    };

    if (layers.length === 0) {
        return (
            <div className="w-full max-w-lg aspect-video bg-dark-surface rounded-lg border-2 border-dashed border-dark-border flex items-center justify-center">
                <ImageUploader onImageUpload={onImageUpload} />
            </div>
        );
    }
    
    const cursorClass = () => {
        switch(activeTool) {
            case 'brush': return 'cursor-crosshair';
            case 'crop': return 'cursor-crosshair';
            default: return 'cursor-default';
        }
    };

    return (
        <div className="relative" style={{ width, height }}>
            <canvas
                ref={canvasRef}
                className={cursorClass()}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            />
            {activeTool === 'crop' && cropRect && (
                <div 
                    className="absolute border-2 border-dashed border-dark-accent bg-dark-accent/20 pointer-events-none"
                    style={{ 
                        left: cropRect.x, 
                        top: cropRect.y, 
                        width: cropRect.width, 
                        height: cropRect.height 
                    }}
                />
            )}
        </div>
    );
};
