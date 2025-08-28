import React from 'react';
import { Page } from '../App';
import { TwitterIcon, GithubIcon, LinkedinIcon } from './editor/icons';

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5l-2-2m-3.5 0l-2 2m11-5l-2-2m-3.5 0l-2 2" />
    </svg>
);

interface FooterProps {
    navigate: (page: Page) => void;
}

const FooterLink: React.FC<{page: Page, children: React.ReactNode, navigate: (page: Page) => void}> = ({ page, children, navigate }) => (
    <li>
        <button onClick={() => navigate(page)} className="text-dark-text-secondary hover:text-brand-primary transition-colors duration-300">
            {children}
        </button>
    </li>
);

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
    return (
        <footer className="relative z-10 border-t border-dark-border mt-12">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <WandIcon />
                            <span className="text-xl font-bold tracking-wider text-dark-text-primary">
                              PhotoCursor AI
                            </span>
                        </div>
                        <p className="text-sm text-dark-text-secondary">The future of photo editing.</p>
                    </div>

                    {/* Links Section */}
                    <div className="md:col-span-1">
                         <h4 className="font-semibold text-dark-text-primary mb-4">Navigation</h4>
                         <ul className="space-y-2">
                             <FooterLink page="landing" navigate={navigate}>Home</FooterLink>
                             <FooterLink page="pricing" navigate={navigate}>Pricing</FooterLink>
                             <FooterLink page="contact" navigate={navigate}>Contact</FooterLink>
                             <FooterLink page="editor" navigate={navigate}>Launch Editor</FooterLink>
                         </ul>
                    </div>

                     {/* Legal Section */}
                    <div className="md:col-span-1">
                         <h4 className="font-semibold text-dark-text-primary mb-4">Legal</h4>
                         <ul className="space-y-2">
                             <li><a href="#" className="text-dark-text-secondary hover:text-brand-primary transition-colors">Privacy Policy</a></li>
                             <li><a href="#" className="text-dark-text-secondary hover:text-brand-primary transition-colors">Terms of Service</a></li>
                         </ul>
                    </div>

                    {/* Social Section */}
                    <div className="md:col-span-1">
                         <h4 className="font-semibold text-dark-text-primary mb-4">Follow Us</h4>
                         <div className="flex space-x-4">
                             <a href="#" className="text-dark-text-secondary hover:text-white transition-colors"><TwitterIcon /></a>
                             <a href="#" className="text-dark-text-secondary hover:text-white transition-colors"><GithubIcon /></a>
                             <a href="#" className="text-dark-text-secondary hover:text-white transition-colors"><LinkedinIcon /></a>
                         </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-dark-border/50 text-center text-sm text-dark-text-tertiary">
                    <p>&copy; {new Date().getFullYear()} PhotoCursor AI. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};
