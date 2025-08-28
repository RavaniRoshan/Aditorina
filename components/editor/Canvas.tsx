import React from 'react';
import { ImageFile, AiEditResult } from '../../types';
import { ImageUploader } from '../ImageUploader';
import { LoadingSpinner } from '../LoadingSpinner';
import { IconButton } from '../IconButton';
import { ClearIcon, DownloadIcon } from './icons';

interface CanvasProps {
    originalImage: ImageFile | null;
    editResult: AiEditResult | null;
    isLoading: boolean;
    onImageUpload: (image: ImageFile) => void;
    onReset: () => void;
}

const ImagePanel: React.FC<{
    title: string;
    imageUrl: string | null;
    children?: React.ReactNode;
}> = ({ title, imageUrl, children }) => (
    <div className="flex-1 flex flex-col bg-dark-bg rounded-lg border-2 border-dashed border-dark-border overflow-hidden">
        <div className="p-2 border-b border-dark-border">
            <h3 className="text-xs text-center font-semibold text-dark-text-secondary">{title}</h3>
        </div>
        <div className="flex-1 flex items-center justify-center relative p-1">
            {imageUrl && <img src={imageUrl} alt={title} className="object-contain max-h-full max-w-full" />}
            {children}
        </div>
    </div>
);


export const Canvas: React.FC<CanvasProps> = ({
    originalImage,
    editResult,
    isLoading,
    onImageUpload,
    onReset
}) => {
    
    const handleDownload = () => {
        if (editResult?.editedImage) {
            const link = document.createElement('a');
            link.href = editResult.editedImage;
            const originalFileName = originalImage?.file.name.split('.').slice(0, -1).join('.') || 'edited-image';
            link.download = `${originalFileName}-edited.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (!originalImage) {
        return (
            <div className="w-full max-w-lg aspect-video bg-dark-surface rounded-lg border-2 border-dashed border-dark-border flex items-center justify-center">
                <ImageUploader onImageUpload={onImageUpload} />
            </div>
        );
    }
    
    const originalImageUrl = `data:${originalImage.file.type};base64,${originalImage.base64}`;

    return (
        <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-4">
            {/* Original Image Panel */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative group">
                <ImagePanel title="Original" imageUrl={originalImageUrl} />
                <div className="absolute top-10 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <IconButton onClick={onReset} aria-label="Clear image" className="bg-black/50 hover:bg-red-600/80">
                        <ClearIcon />
                    </IconButton>
                </div>
            </div>

            {/* Edited Image Panel */}
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative group">
                <ImagePanel title="AI Edited Result" imageUrl={editResult?.editedImage}>
                    {isLoading && <LoadingSpinner />}
                    {!isLoading && !editResult?.editedImage && (
                       <div className="text-center text-dark-text-secondary p-4">
                           <p className="font-semibold">Your edited image will appear here.</p>
                           <p className="text-sm">Describe your edit and click "Generate".</p>
                       </div>
                    )}
                </ImagePanel>
                 {editResult?.editedImage && !isLoading && (
                    <div className="absolute top-10 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <IconButton onClick={handleDownload} aria-label="Download image" className="bg-black/50 hover:bg-brand-primary/80">
                            <DownloadIcon />
                        </IconButton>
                    </div>
                )}
            </div>
        </div>
    );
};
