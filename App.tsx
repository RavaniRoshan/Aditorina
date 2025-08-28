import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Editor } from './pages/Editor';

const App: React.FC = () => {
  const [isEditorLaunched, setIsEditorLaunched] = useState(false);

  const handleLaunchEditor = () => {
    setIsEditorLaunched(true);
  };

  const handleExitEditor = () => {
    setIsEditorLaunched(false);
  };

  if (!isEditorLaunched) {
    return <LandingPage onLaunchEditor={handleLaunchEditor} />;
  }

  return <Editor onExitEditor={handleExitEditor} />;
};

export default App;
