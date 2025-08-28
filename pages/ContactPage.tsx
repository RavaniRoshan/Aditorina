import React, { useLayoutEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { Page } from '../App';

declare const gsap: any;

interface ContactPageProps {
    navigate: (page: Page) => void;
    currentPage: Page;
}

const AnimatedGridBackground = () => (
    <div className="absolute inset-0 h-full w-full bg-dark-bg bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] overflow-hidden -z-10">
      <div className="absolute bottom-auto left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(139,92,246,0.15),rgba(255,255,255,0))]"></div>
      <div className="absolute bottom-0 right-[-20%] top-auto h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(236,72,153,0.15),rgba(255,255,255,0))]"></div>
    </div>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, ...props}) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-dark-text-secondary mb-2">{label}</label>
        <input 
            {...props}
            className="w-full bg-dark-bg border border-dark-border rounded-md shadow-sm p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150"
        />
    </div>
);

export const ContactPage: React.FC<ContactPageProps> = ({ navigate, currentPage }) => {
    const mainRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
             gsap.timeline()
                .from("#contact-title", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
                .from("#contact-subtitle", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.5")
                .from("#contact-form", { opacity: 0, y: 50, duration: 0.8, ease: "power3.out" }, "-=0.4");
        }, mainRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={mainRef} className="min-h-screen bg-dark-bg text-dark-text-primary font-sans relative overflow-x-hidden">
            <AnimatedGridBackground />
            <Header navigate={navigate} currentPage={currentPage} />

            <main className="container mx-auto px-4 pt-32 sm:pt-40 pb-24 text-center relative z-10">
                <h1 id="contact-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                    Get in Touch
                </h1>
                <p id="contact-subtitle" className="mt-6 max-w-2xl mx-auto text-lg text-dark-text-secondary">
                    Have a question, a feature request, or just want to say hello? We'd love to hear from you.
                </p>

                <div id="contact-form" className="max-w-xl mx-auto mt-12 text-left bg-dark-surface p-8 rounded-lg border border-dark-border">
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <InputField id="name" name="name" type="text" label="Full Name" placeholder="Your Name" required />
                        <InputField id="email" name="email" type="email" label="Email Address" placeholder="you@example.com" required />
                        <div>
                             <label htmlFor="message" className="block text-sm font-medium text-dark-text-secondary mb-2">Message</label>
                             <textarea
                                id="message"
                                name="message"
                                rows={5}
                                placeholder="Your message..."
                                required
                                className="w-full bg-dark-bg border border-dark-border rounded-md shadow-sm p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150"
                            />
                        </div>
                        <Button type="submit" size="lg" className="w-full">Send Message</Button>
                    </form>
                </div>
            </main>
            
            <Footer navigate={navigate} />
        </div>
    );
};