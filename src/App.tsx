import React, { useState, useEffect } from 'react';
import HeroReactor from './components/HeroReactor';
import WinMixMouse from './components/WinMixMouse';
import { INITIAL_LOADING_DELAY_MS } from './constants';

function App() {
  const [isHeroReady, setIsHeroReady] = useState(false);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setIsHeroReady(true);
    }, INITIAL_LOADING_DELAY_MS);

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const handleComplete = () => {
    console.log('HeroReactor completed');
    // Add additional logic here (e.g., navigation, state updates)
  };

  const isDebugMode = import.meta.env.DEV; // Adjust based on your build tool

  if (!isHeroReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
      <HeroReactor onComplete={handleComplete} isDebug={isDebugMode} />
      <WinMixMouse />
    </div>
  );
}

export default App;
