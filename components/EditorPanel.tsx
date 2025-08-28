
import React, { useState, useCallback, useRef } from 'react';
import { ImageFile, AiEditResult } from '../types';
import { editImageWithPrompt } from '../services/geminiService';
import { ImageUploader } from './ImageUploader';
import { LoadingSpinner } from './LoadingSpinner';
import { IconButton } from './IconButton';

interface EditorPanelProps {
    originalImage: ImageFile | null;
    setOriginalImage: (image: ImageFile | null) => void;
}

const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const ClearIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const MagicWandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 2.293a1 1 0 011.414 0l.001.001a1 1 0 010 1.414l-11 11a1 1 0 01-1.414-1.414l11-11zM11 7a1 1 0 100-2 1 1 0 000 2zM5.414 11.586a1 1 0 10-1.414 1.414 1 1 0 001.414-1.414zM11 15a1 1 0 100-2 1 1 0 000 2z"/><path fillRule="evenodd" d="M9 2a1 1 0 011 1v1.586l2.293-2.293a1 1 0 111.414 1.414L11.414 6H13a1 1 0 110 2h-1.586l2.293 2.293a1 1 0 11-1.414 1.414L10 9.414V11a1 1 0 11-2 0V9.414l-2.293 2.293a1 1 0 11-1.414-1.414L6.586 8H5a1 1 0 110-2h1.586L4.293 3.707a1 1 0 011.414-1.414L8 4.586V3a1 1 0 011-1z" clipRule="evenodd" /></svg>;

export const EditorPanel: React.FC<EditorPanelProps> = ({ originalImage, setOriginalImage }) => {
    const [prompt, setPrompt] = useState<string>('');
    const [editResult, setEditResult] = useState<AiEditResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const promptTextareaRef = useRef<HTMLTextAreaElement>(null);

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
    }

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
    }

    const handlePromptSuggestion = (suggestion: string) => {
        setPrompt(suggestion);
        if(promptTextareaRef.current) {
            promptTextareaRef.current.focus();
        }
    }

    const promptSuggestions = [
        "Add a pirate hat to the person",
        "Change the background to a futuristic city",
        "Make the sky look like a vibrant sunset",
        "Turn the photo into a watercolor painting",
    ];

    return (
        <div className="bg-dark-surface rounded-lg shadow-2xl p-4 sm:p-6 lg:p-8 border border-dark-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Uploader and Image Display */}
                <div className="flex flex-col space-y-4">
                    <div className="aspect-square bg-dark-bg rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-dark-border relative">
                        {!originalImage && <ImageUploader onImageUpload={setOriginalImage} />}
                        {originalImage && (
                            <img src={originalImage.base64} alt="Original upload" className="object-contain h-full w-full" />
                        )}
                        {originalImage && !isLoading && (
                            <div className="absolute top-2 right-2">
                                <IconButton onClick={handleReset} aria-label="Clear image" className="bg-black/50 hover:bg-red-600/80">
                                    <ClearIcon />
                                </IconButton>
                            </div>
                        )}
                    </div>
                     <div className="aspect-square bg-dark-bg rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-dark-border relative">
                        {isLoading && <LoadingSpinner />}
                        {!isLoading && editResult?.editedImage && (
                            <>
                                <img src={editResult.editedImage} alt="AI Edited Result" className="object-contain h-full w-full" />
                                <div className="absolute top-2 right-2">
                                     <IconButton onClick={handleDownload} aria-label="Download image" className="bg-black/50 hover:bg-brand-primary/80">
                                        <DownloadIcon />
                                    </IconButton>
                                </div>
                            </>
                        )}
                        {!isLoading && !editResult?.editedImage && (
                           <div className="text-center text-dark-text-secondary p-4">
                               <p className="font-semibold">Your edited image will appear here.</p>
                               <p className="text-sm">Describe your edit and click "Generate".</p>
                           </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Prompt and Controls */}
                <div className="flex flex-col space-y-4">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-dark-text-secondary mb-2">
                            Editing Prompt
                        </label>
                        <textarea
                            ref={promptTextareaRef}
                            id="prompt"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={!originalImage || isLoading}
                            placeholder={originalImage ? "e.g., Add a friendly robot waving in the background" : "Upload an image first"}
                            className="w-full bg-dark-bg border border-dark-border rounded-md shadow-sm p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>
                    
                    {originalImage && (
                        <div>
                            <p className="text-sm font-medium text-dark-text-secondary mb-2">Suggestions</p>
                            <div className="flex flex-wrap gap-2">
                                {promptSuggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePromptSuggestion(s)}
                                        disabled={isLoading}
                                        className="text-xs bg-dark-border hover:bg-brand-primary/50 text-dark-text-secondary px-3 py-1.5 rounded-full transition duration-150 disabled:opacity-50"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex-grow"></div>
                    
                    {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm">{error}</div>}
                    {editResult?.textResponse && <div className="text-cyan-300 bg-cyan-900/50 p-3 rounded-md text-sm">{editResult.textResponse}</div>}
                    
                    <button
                        onClick={handleGenerate}
                        disabled={!originalImage || !prompt.trim() || isLoading}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-4 rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                    >
                        {isLoading ? (
                            <LoadingSpinner small={true} />
                        ) : (
                            <>
                                <MagicWandIcon />
                                Generate Edit
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
