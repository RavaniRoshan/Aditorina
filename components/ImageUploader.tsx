
import React, { useCallback, useRef } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
    onImageUpload: (image: ImageFile) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                if(base64){
                     onImageUpload({ file, base64: base64 });
                }
            };
            reader.readAsDataURL(file);
        }
    }, [onImageUpload]);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target?.result as string;
                if(base64){
                    onImageUpload({ file, base64: base64 });
                }
            };
            reader.readAsDataURL(file);
        }
    }, [onImageUpload]);
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div 
            className="w-full h-full p-4 flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
            />
            <UploadIcon />
            <p className="mt-2 text-dark-text-primary font-semibold">
                Click to upload or drag & drop
            </p>
            <p className="text-xs text-dark-text-secondary">
                PNG, JPG, or WEBP
            </p>
        </div>
    );
};