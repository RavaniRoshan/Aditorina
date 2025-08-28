import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Editor } from './pages/Editor';
import { PricingPage } from './pages/PricingPage';
import { ContactPage } from './pages/ContactPage';

export type Page = 'landing' | 'pricing' | 'contact' | 'editor';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const navigate = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  switch (currentPage) {
    case 'pricing':
      return <PricingPage navigate={navigate} currentPage={currentPage} />;
    case 'contact':
      return <ContactPage navigate={navigate} currentPage={currentPage} />;
    case 'editor':
      return <Editor onExitEditor={() => navigate('landing')} />;
    case 'landing':
    default:
      return <LandingPage navigate={navigate} currentPage={currentPage} />;
  }
};

export default App;