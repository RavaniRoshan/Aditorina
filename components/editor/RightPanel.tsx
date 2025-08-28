import React from 'react';
import { Layer } from '../../types';
import { LoadingSpinner } from '../LoadingSpinner';
import { AIEnhanceIcon, LayersIcon, AdjustmentsIcon, EyeOpenIcon, EyeClosedIcon, MagicWandIcon, InfoIcon, ErrorIcon, LightbulbIcon } from './icons';

interface RightPanelProps {
    prompt: string;
    setPrompt: (prompt: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    isImageLoaded: boolean;
    error: string | null;
    textResponse: string | null;
    layers: Layer[];
    setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
    activeTab: 'ai-edit' | 'layers' | 'adjustments';
    setActiveTab: (tab: 'ai-edit' | 'layers' | 'adjustments') => void;
}

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ label, isActive, onClick, children }) => (
    <button
        title={label}
        onClick={onClick}
        className={`flex-1 flex justify-center items-center p-2 text-sm border-b-2 transition ${
            isActive ? 'border-brand-primary text-white' : 'border-transparent text-gray-400 hover:border-dark-border hover:text-white'
        }`}
    >
        {children}
    </button>
);

const AdjustmentSlider: React.FC<{label: string}> = ({label}) => (
    <div>
        <label className="block text-xs font-medium text-dark-text-secondary">{label}</label>
        <div className="flex items-center space-x-2">
            <input type="range" min="-100" max="100" defaultValue="0" className="w-full h-1 bg-dark-border rounded-lg appearance-none cursor-pointer range-sm accent-brand-secondary" />
            <span className="text-xs w-8 text-right">0</span>
        </div>
    </div>
);


export const RightPanel: React.FC<RightPanelProps> = (props) => {
    const {
        prompt, setPrompt, onGenerate, isLoading, isImageLoaded, error, textResponse,
        layers, setLayers, activeTab, setActiveTab
    } = props;
    
    const promptSuggestions = [
        "Change the season to winter",
        "Add a dragon flying in the sky",
        "Make it a vintage polaroid photo",
        "Add dramatic, cinematic lighting",
        "Give it a cyberpunk neon glow",
        "Turn this into a watercolor painting",
    ];
    
    const toggleLayerVisibility = (id: string) => {
        setLayers(layers.map(layer => layer.id === id ? { ...layer, visible: !layer.visible } : layer));
    };

    return (
        <aside className="w-80 bg-dark-surface flex-shrink-0 border-l border-dark-border flex flex-col">
            <div className="flex border-b border-dark-border">
                <TabButton label="AI Edit" isActive={activeTab === 'ai-edit'} onClick={() => setActiveTab('ai-edit')}><AIEnhanceIcon /></TabButton>
                <TabButton label="Layers" isActive={activeTab === 'layers'} onClick={() => setActiveTab('layers')}><LayersIcon /></TabButton>
                <TabButton label="Adjustments" isActive={activeTab === 'adjustments'} onClick={() => setActiveTab('adjustments')}><AdjustmentsIcon /></TabButton>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeTab === 'ai-edit' && (
                    <>
                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-dark-text-secondary mb-2">
                                Editing Prompt
                            </label>
                            <textarea
                                id="prompt"
                                rows={4}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                disabled={!isImageLoaded || isLoading}
                                placeholder={isImageLoaded ? "e.g., Add a friendly robot..." : "Upload an image first"}
                                className="w-full bg-dark-bg border border-dark-border rounded-md shadow-sm p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        {isImageLoaded && (
                            <div>
                                <p className="text-xs font-medium text-dark-text-secondary mb-2 flex items-center">
                                    <LightbulbIcon />
                                    <span className="ml-1">Suggestions</span>
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {promptSuggestions.map((s) => (
                                        <button key={s} onClick={() => setPrompt(s)} disabled={isLoading} className="text-xs bg-dark-border hover:bg-brand-primary/50 text-dark-text-secondary px-2.5 py-1.5 rounded-md transition duration-150 disabled:opacity-50">
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
                {activeTab === 'layers' && (
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Layers</h3>
                        <div className="space-y-1">
                            {layers.length > 0 ? layers.map((layer) => (
                                <div key={layer.id} className="flex items-center justify-between bg-dark-bg p-2 rounded-md border border-dark-border">
                                    <span className="text-sm">{layer.name}</span>
                                    <button onClick={() => toggleLayerVisibility(layer.id)} title="Toggle visibility">
                                        {layer.visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
                                    </button>
                                </div>
                            )).reverse() : <p className="text-xs text-dark-text-secondary text-center py-4">No layers yet.</p>}
                        </div>
                    </div>
                )}
                {activeTab === 'adjustments' && (
                     <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Adjustments</h3>
                        <AdjustmentSlider label="Brightness" />
                        <AdjustmentSlider label="Contrast" />
                        <AdjustmentSlider label="Saturation" />
                        <AdjustmentSlider label="Vibrance" />
                         <p className="text-xs text-center text-dark-text-secondary pt-4">More adjustments coming soon!</p>
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t border-dark-border space-y-3">
                 {error && (
                    <div className="text-red-400 bg-red-900/50 p-3 rounded-md text-sm flex items-start">
                        <ErrorIcon />
                        <span>{error}</span>
                    </div>
                 )}
                 {textResponse && (
                    <div className="text-cyan-300 bg-cyan-900/50 p-3 rounded-md text-sm flex items-start">
                        <InfoIcon />
                        <span>{textResponse}</span>
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
        </aside>
    );
};