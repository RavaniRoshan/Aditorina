import React, { useLayoutEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Page } from '../App';
import { CheckIcon } from '../components/editor/icons';

declare const gsap: any;

interface PricingPageProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const AnimatedGridBackground = () => (
    <div className="absolute inset-0 h-full w-full bg-dark-bg bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] overflow-hidden -z-10">
      <div className="absolute bottom-auto left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(139,92,246,0.15),rgba(255,255,255,0))]"></div>
      <div className="absolute bottom-0 right-[-20%] top-auto h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(236,72,153,0.15),rgba(255,255,255,0))]"></div>
    </div>
);

const FeatureListItem: React.FC<{children: React.ReactNode}> = ({children}) => (
    <li className="flex items-center space-x-2">
        <CheckIcon />
        <span className="text-dark-text-secondary">{children}</span>
    </li>
);

export const PricingPage: React.FC<PricingPageProps> = ({ navigate, currentPage }) => {
    const mainRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.timeline()
                .from("#pricing-title", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
                .from("#pricing-subtitle", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.5")
                .from(".pricing-card", { opacity: 0, y: 50, duration: 0.6, stagger: 0.2, ease: "power3.out" }, "-=0.4");
        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className="min-h-screen bg-dark-bg text-dark-text-primary font-sans relative overflow-x-hidden">
            <AnimatedGridBackground />
            <Header navigate={navigate} currentPage={currentPage} />

            <main className="container mx-auto px-4 pt-32 sm:pt-40 pb-24 text-center relative z-10">
                <h1 id="pricing-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                    Choose Your Plan
                </h1>
                <p id="pricing-subtitle" className="mt-6 max-w-2xl mx-auto text-lg text-dark-text-secondary">
                    Unlock more power and creativity. Start for free and upgrade when you're ready.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16 text-left">
                    <Card className="pricing-card">
                        <CardHeader>
                            <CardTitle>Free</CardTitle>
                            <CardDescription>Perfect for getting started and casual use.</CardDescription>
                             <p className="text-4xl font-bold pt-4">$0 <span className="text-lg font-normal text-dark-text-secondary">/ month</span></p>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate('editor')} variant="outline" className="w-full">Get Started</Button>
                            <ul className="mt-6 space-y-3">
                                <FeatureListItem>Basic AI Edits</FeatureListItem>
                                <FeatureListItem>Standard Tools (Crop, Text)</FeatureListItem>
                                <FeatureListItem>3 Exports per day</FeatureListItem>
                                <FeatureListItem>Community Support</FeatureListItem>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="pricing-card border-brand-primary shadow-2xl shadow-brand-primary/20 relative">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <div className="bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
                        </div>
                        <CardHeader>
                            <CardTitle>Pro</CardTitle>
                            <CardDescription>For professionals and enthusiasts who need more.</CardDescription>
                            <p className="text-4xl font-bold pt-4">$12 <span className="text-lg font-normal text-dark-text-secondary">/ month</span></p>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate('editor')} className="w-full">Go Pro</Button>
                             <ul className="mt-6 space-y-3">
                                <FeatureListItem>Unlimited AI Edits</FeatureListItem>
                                <FeatureListItem>Full Suite of Pro Tools</FeatureListItem>
                                <FeatureListItem>High-Resolution Exports</FeatureListItem>
                                <FeatureListItem>Priority Support</FeatureListItem>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="pricing-card">
                        <CardHeader>
                            <CardTitle>Enterprise</CardTitle>
                            <CardDescription>For teams and businesses that need collaboration.</CardDescription>
                             <p className="text-4xl font-bold pt-4">Custom</p>
                        </CardHeader>
                        <CardContent>
                             <Button onClick={() => navigate('contact')} variant="outline" className="w-full">Contact Sales</Button>
                             <ul className="mt-6 space-y-3">
                                <FeatureListItem>Everything in Pro</FeatureListItem>
                                <FeatureListItem>Team Collaboration Tools</FeatureListItem>
                                <FeatureListItem>Dedicated Account Manager</FeatureListItem>
                                <FeatureListItem>Custom Integrations</FeatureListItem>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
            
            <Footer navigate={navigate} />
        </div>
    );
};