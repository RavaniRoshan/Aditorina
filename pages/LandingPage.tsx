import React, { useLayoutEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { AIEnhanceIcon, CreativeToolsIcon, IntuitiveInterfaceIcon, EyeOpenIcon, CropIcon, AdjustmentsIcon, TextIcon, BrushIcon, SelectIcon } from '../components/editor/icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { InfiniteReviews } from '../components/InfiniteReviews';
import { Footer } from '../components/Footer';
import { Page } from '../App';

declare const gsap: any;
declare const ScrollTrigger: any;

interface LandingPageProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const AnimatedGridBackground = () => {
    const glow1Ref = useRef(null);
    const glow2Ref = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline({
                repeat: -1,
                yoyo: true,
            })
            .to(glow1Ref.current, {
                x: 'random(-150, 150)',
                y: 'random(-100, 100)',
                duration: 25,
                ease: 'power1.inOut'
            })
            .to(glow2Ref.current, {
                x: 'random(-150, 150)',
                y: 'random(-100, 100)',
                duration: 25,
                ease: 'power1.inOut'
            }, '<');
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="absolute inset-0 h-full w-full bg-dark-bg bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] overflow-hidden -z-10">
          <div ref={glow1Ref} className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(139,92,246,0.15),rgba(255,255,255,0))]"></div>
          <div ref={glow2Ref} className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(236,72,153,0.15),rgba(255,255,255,0))]"></div>
        </div>
    );
};


export const LandingPage: React.FC<LandingPageProps> = ({ navigate, currentPage }) => {
    const mainRef = useRef(null);
    const featuresRef = useRef(null);
    
    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            gsap.timeline()
                .from("#hero-title", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
                .from("#hero-subtitle", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.5")
                .from("#hero-cta", { opacity: 0, scale: 0.8, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");
            
            gsap.from("#features .feature-card", {
                scrollTrigger: {
                    trigger: featuresRef.current,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                opacity: 0,
                y: 50,
                duration: 0.6,
                stagger: 0.2,
                ease: "power3.out",
            });
            
            const featureRows = gsap.utils.toArray('.feature-row');
            featureRows.forEach((row: any) => {
                const visual = row.querySelector('.feature-visual');
                const text = row.querySelector('.feature-text');

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 85%',
                        toggleActions: 'play none none reset',
                    }
                });
                
                const isReversed = row.querySelector('.md\\:order-1') === visual;

                tl.from(visual, { 
                    x: isReversed ? 100 : -100,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                })
                .from(text, {
                    x: isReversed ? -100 : 100,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, "-=0.6");
            });

        }, mainRef);
        
        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className="min-h-screen bg-dark-bg text-dark-text-primary font-sans relative overflow-x-hidden">
            <AnimatedGridBackground />
            <Header navigate={navigate} currentPage={currentPage} />

            <main className="container mx-auto px-4 pt-32 sm:pt-48 text-center relative z-10">
                <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                    The Future of Photo Editing is Here.
                </h1>
                <p id="hero-subtitle" className="mt-6 max-w-2xl mx-auto text-lg text-dark-text-secondary">
                    Unleash your creativity with PhotoCursor AI. Describe your edits in plain English and watch our powerful AI bring your vision to life instantly.
                </p>
                <div id="hero-cta" className="mt-10">
                    <Button onClick={() => navigate('editor')} size="lg">
                        Start Creating for Free
                    </Button>
                </div>
            </main>

            <section id="features" ref={featuresRef} className="py-24 relative z-10">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why You'll Love PhotoCursor AI</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="feature-card">
                            <CardHeader>
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary/20 text-brand-primary mb-4">
                                    <AIEnhanceIcon />
                                </div>
                                <CardTitle>AI Magic Edit</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Simply type what you want. "Add a pirate hat," "change the background to a beach," or "make it a watercolor painting." It's that easy.
                                </CardDescription>
                            </CardContent>
                        </Card>
                         <Card className="feature-card">
                            <CardHeader>
                                 <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary/20 text-brand-primary mb-4">
                                    <IntuitiveInterfaceIcon />
                                </div>
                                <CardTitle>Intuitive Interface</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                   A familiar, Figma-style layout makes powerful tools accessible to everyone, from beginners to pros. No learning curve.
                                </CardDescription>
                            </CardContent>
                        </Card>
                         <Card className="feature-card">
                            <CardHeader>
                                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-brand-primary/20 text-brand-primary mb-4">
                                    <CreativeToolsIcon />
                                </div>
                                <CardTitle>Pro-Level Tools</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    Go beyond AI with layers, adjustments, cropping, and more. All the essential tools you need for pixel-perfect results are at your fingertips.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            
            <section id="detailed-features" className="py-12 md:py-24 relative z-10 overflow-hidden">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-16 md:mb-24">A Closer Look at the Magic</h2>
                    
                    <div className="feature-row grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 md:mb-32">
                        <div className="feature-visual">
                            <div className="relative aspect-square bg-dark-panel rounded-xl shadow-2xl shadow-black/30 border border-dark-border p-8 flex items-center justify-center">
                                <AIEnhanceIcon className="h-24 w-24 text-brand-primary opacity-20" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 via-transparent to-brand-secondary/20"></div>
                                <p className="absolute bottom-4 bg-dark-bg/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                                    "Add a friendly robot waving"
                                </p>
                            </div>
                        </div>
                        <div className="feature-text text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-4 text-dark-text-primary">Unleash AI Creativity</h3>
                            <p className="text-dark-text-secondary">
                                Go beyond filters. Describe any change in plain English—from adding fantastical elements to completely transforming the scene. Our AI understands your intent and brings your imagination to life in seconds.
                            </p>
                        </div>
                    </div>

                    <div className="feature-row grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 md:mb-32">
                        <div className="feature-text text-center md:text-left md:order-2">
                             <h3 className="text-2xl font-bold mb-4 text-dark-text-primary">Powerful Layer-Based Workflow</h3>
                            <p className="text-dark-text-secondary">
                                Work non-destructively with a professional-grade layer system. Manage, organize, and blend your edits with the same flexibility as industry-standard software. Your creativity is never locked in.
                            </p>
                        </div>
                        <div className="feature-visual md:order-1">
                             <div className="relative aspect-square bg-dark-panel rounded-xl shadow-2xl shadow-black/30 border border-dark-border p-8 flex items-center justify-center flex-col space-y-2 overflow-hidden">
                                <div className="w-4/5 p-3 bg-dark-bg/50 rounded-lg border border-dark-border text-sm flex items-center justify-between opacity-50 transform -rotate-3 scale-95"><span>Background</span> <EyeOpenIcon /></div>
                                <div className="w-4/5 p-3 bg-dark-bg/50 rounded-lg border border-dark-border text-sm flex items-center justify-between opacity-80 transform rotate-2 scale-100 z-10"><span>AI Edit</span> <EyeOpenIcon /></div>
                                <div className="w-4/5 p-3 bg-dark-accent/30 rounded-lg border border-dark-accent text-sm text-white flex items-center justify-between transform -rotate-1 scale-105 z-20"><span>Text Layer</span> <EyeOpenIcon /></div>
                            </div>
                        </div>
                    </div>

                    <div className="feature-row grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="feature-visual">
                            <div className="relative grid grid-cols-3 gap-4 aspect-square bg-dark-panel rounded-xl shadow-2xl shadow-black/30 border border-dark-border p-4 md:p-8">
                                <div className="bg-dark-bg/50 rounded-lg flex items-center justify-center text-brand-primary p-2 md:p-4"><CropIcon className="w-full h-full" /></div>
                                <div className="bg-dark-bg/50 rounded-lg flex items-center justify-center text-brand-primary p-2 md:p-4"><AdjustmentsIcon className="w-full h-full" /></div>
                                <div className="bg-dark-bg/50 rounded-lg flex items-center justify-center text-brand-primary p-2 md:p-4"><TextIcon className="w-full h-full" /></div>
                                <div className="bg-dark-bg/50 rounded-lg flex items-center justify-center text-brand-primary p-2 md:p-4 col-span-2"><BrushIcon className="w-full h-full" /></div>
                                <div className="bg-dark-bg/50 rounded-lg flex items-center justify-center text-brand-primary p-2 md:p-4"><SelectIcon className="w-full h-full" /></div>
                            </div>
                        </div>
                        <div className="feature-text text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-4 text-dark-text-primary">A Complete Creative Suite</h3>
                            <p className="text-dark-text-secondary">
                                AI is just the beginning. Fine-tune every detail with a full set of tools including brushes, text, precise cropping, and powerful color adjustments. Your vision, your control.
                            </p>
                        </div>
                    </div>

                </div>
            </section>
            
            <InfiniteReviews />
            
            <Footer navigate={navigate} />
        </div>
    );
};