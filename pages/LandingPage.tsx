import React from 'react';
import { Header } from '../components/Header';
import { AIEnhanceIcon, CreativeToolsIcon, IntuitiveInterfaceIcon } from '../components/editor/icons';

interface LandingPageProps {
    onLaunchEditor: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-dark-surface p-6 rounded-lg border border-dark-border transform hover:scale-105 transition-transform duration-300">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary text-white mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-dark-text-primary mb-2">{title}</h3>
        <p className="text-dark-text-secondary">{children}</p>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchEditor }) => {
    return (
        <div className="min-h-screen bg-dark-bg text-dark-text-primary font-sans">
            <Header onLaunchEditor={onLaunchEditor} />

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-16 sm:py-24 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                    The Future of Photo Editing is Here.
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-dark-text-secondary">
                    Unleash your creativity with PhotoCursor AI. Describe your edits in plain English and watch our powerful AI bring your vision to life instantly.
                </p>
                <div className="mt-8">
                    <button
                        onClick={onLaunchEditor}
                        className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-3 px-8 rounded-md shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 ease-in-out"
                    >
                        Start Creating for Free
                    </button>
                </div>
            </main>

            {/* Features Section */}
            <section id="features" className="py-16 bg-dark-surface/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Why You'll Love PhotoCursor AI</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <FeatureCard icon={<AIEnhanceIcon />} title="AI Magic Edit">
                            Simply type what you want. "Add a pirate hat," "change the background to a beach," or "make it a watercolor painting." It's that easy.
                        </FeatureCard>
                        <FeatureCard icon={<IntuitiveInterfaceIcon />} title="Intuitive Interface">
                           A familiar, Photoshop-style layout makes powerful tools accessible to everyone, from beginners to pros. No learning curve.
                        </FeatureCard>
                         <FeatureCard icon={<CreativeToolsIcon />} title="Pro-Level Tools">
                            Go beyond AI with layers, adjustments, cropping, and more. All the essential tools you need for pixel-perfect results are at your fingertips.
                        </FeatureCard>
                    </div>
                </div>
            </section>
            
            <footer className="text-center py-6 text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} PhotoCursor AI. All Rights Reserved.</p>
            </footer>
        </div>
    );
};
