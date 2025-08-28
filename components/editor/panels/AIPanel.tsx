import React from 'react';
import { LoadingSpinner } from '../../LoadingSpinner';
import { MagicWandIcon, InfoIcon, ErrorIcon, LightbulbIcon } from '../icons';

interface AIPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    isImageLoaded: boolean;
    error: string | null;
    textResponse: string | null;
}

export const AIPanel: React.FC<AIPanelProps> = ({ prompt, setPrompt, onGenerate, isLoading, isImageLoaded, error, textResponse }) => {
    
    const promptSuggestions = [
        "Change the season to winter",
        "Add a dragon flying in the sky",
        "Make it a vintage polaroid photo",
        "Add dramatic, cinematic lighting",
        "Give it a cyberpunk neon glow",
        "Turn this into a watercolor painting",
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-4">
                <h3 className="text-sm font-semibold text-dark-text-primary">AI Magic Edit</h3>
                <div>
                    <label htmlFor="prompt" className="block text-xs font-medium text-dark-text-secondary mb-2">
                        Editing Prompt
                    </label>
                    <textarea
                        id="prompt"
                        rows={4}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={!isImageLoaded || isLoading}
                        placeholder={isImageLoaded ? "e.g., Add a friendly robot..." : "Upload an image first"}
                        className="w-full bg-dark-bg border border-dark-border rounded-md shadow-sm p-2 focus:ring-1 focus:ring-dark-accent focus:border-dark-accent transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    />
                </div>
                {isImageLoaded && (
                    <div>
                        <p className="text-xs font-medium text-dark-text-secondary mb-2 flex items-center">
                            <LightbulbIcon />
                            <span className="ml-1.5">Suggestions</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {promptSuggestions.map((s) => (
                                <button key={s} onClick={() => setPrompt(s)} disabled={isLoading} className="text-xs bg-dark-panel hover:bg-dark-border text-dark-text-secondary px-2.5 py-1.5 rounded-md transition duration-150 disabled:opacity-50">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="flex-shrink-0 space-y-3">
                 {error && (
                    <div className="text-red-400 bg-red-900/30 p-3 rounded-md text-sm flex items-start">
                        <ErrorIcon />
                        <span className="ml-2">{error}</span>
                    </div>
                 )}
                 {textResponse && (
                    <div className="text-cyan-300 bg-cyan-900/40 p-3 rounded-md text-sm flex items-start">
                        <InfoIcon />
                        <span className="ml-2">{textResponse}</span>
                    </div>
                 )}
                 <button
                    onClick={onGenerate}
                    disabled={!isImageLoaded || !prompt.trim() || isLoading}
                    className="w-full flex items-center justify-center bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-2.5 px-4 rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                 >
                    {isLoading ? <LoadingSpinner small={true} /> : <><MagicWandIcon /><span>Generate Edit</span></>}
                 </button>
            </div>
        </div>
    );
};