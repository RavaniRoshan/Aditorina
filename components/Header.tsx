import React, { useRef, useLayoutEffect } from 'react';
import { Button } from './ui/button';
import { Page } from '../App';

declare const gsap: any;

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5l-2-2m-3.5 0l-2 2m11-5l-2-2m-3.5 0l-2 2" />
    </svg>
);

interface NavLinkProps {
    page: Page;
    currentPage: Page;
    navigate: (page: Page) => void;
    children: React.ReactNode;
    setRef: (el: HTMLButtonElement | null) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ page, currentPage, navigate, children, setRef }) => (
    <button
        ref={setRef}
        onClick={() => navigate(page)}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 relative ${
            currentPage === page ? 'text-dark-text-primary' : 'text-dark-text-secondary hover:text-dark-text-primary'
        }`}
    >
        {children}
    </button>
);

interface HeaderProps {
    currentPage: Page;
    navigate: (page: Page) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, navigate }) => {
    const navRef = useRef<HTMLDivElement>(null);
    const morphRef = useRef<HTMLDivElement>(null);
    const linkRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const navItems: { page: Page, label: string }[] = [
        { page: 'landing', label: 'Home' },
        { page: 'pricing', label: 'Pricing' },
        { page: 'contact', label: 'Contact' },
    ];
    
    const activeIndex = navItems.findIndex(item => item.page === currentPage);

    useLayoutEffect(() => {
        if (activeIndex !== -1 && linkRefs.current[activeIndex] && navRef.current) {
            const activeLinkEl = linkRefs.current[activeIndex];
            if (!activeLinkEl) return;

            const navRect = navRef.current.getBoundingClientRect();
            const linkRect = activeLinkEl.getBoundingClientRect();
            
            gsap.to(morphRef.current, {
                width: linkRect.width,
                height: linkRect.height,
                left: linkRect.left - navRect.left,
                duration: 0.4,
                ease: 'power3.inOut'
            });
        } else {
             gsap.to(morphRef.current, {
                width: 0,
                height: 0,
                duration: 0.4,
                ease: 'power3.inOut'
            });
        }
    }, [currentPage, activeIndex]);
    
    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full px-4">
            <div className="container mx-auto max-w-4xl">
                 <div className="bg-dark-surface/60 backdrop-blur-lg border border-dark-border rounded-full p-2 flex items-center justify-between shadow-2xl shadow-black/20">
                    <button onClick={() => navigate('landing')} className="flex items-center space-x-2 pl-4">
                         <WandIcon />
                         <span className="text-md font-bold tracking-wider text-dark-text-primary hidden sm:inline">
                           PhotoCursor AI
                         </span>
                    </button>
                    
                    <div ref={navRef} className="bg-dark-bg/50 rounded-full p-1 flex items-center relative">
                        <div ref={morphRef} className="absolute bg-dark-panel rounded-full -z-10" />
                        {navItems.map((item, index) => (
                           <NavLink
                                key={item.page}
                                page={item.page}
                                currentPage={currentPage}
                                navigate={navigate}
                                setRef={el => linkRefs.current[index] = el}
                           >
                               {item.label}
                           </NavLink>
                        ))}
                    </div>

                    <Button
                        onClick={() => navigate('editor')}
                        size="sm"
                        className="font-bold py-2 px-4 mr-2"
                    >
                        Launch Editor
                    </Button>
                </div>
            </div>
        </header>
    );
};