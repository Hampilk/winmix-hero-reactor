import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface PresentationContextProps {
  zoomLevel: number;
  canvasSize: { width: number; height: number };
  setZoomLevel: (level: number) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  resetZoom: () => void;
  resetCanvasSize: () => void;
}

const PresentationContext = createContext<PresentationContextProps | undefined>(undefined);

export const PresentationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [zoomLevel, setZoomLevelState] = useState<number>(1);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080
  });

  const setZoomLevel = useCallback((level: number) => {
    const clampedLevel = Math.max(0.1, Math.min(level, 5)); // Clamp between 0.1 and 5
    setZoomLevelState(clampedLevel);
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevelState(1);
  }, []);

  const resetCanvasSize = useCallback(() => {
    setCanvasSize({ width: 1920, height: 1080 });
  }, []);

  const value = useMemo(
    () => ({
      zoomLevel,
      canvasSize,
      setZoomLevel,
      setCanvasSize,
      resetZoom,
      resetCanvasSize
    }),
    [zoomLevel, canvasSize, setZoomLevel, resetZoom, resetCanvasSize]
  );

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
};

export const usePresentation = (): PresentationContextProps => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};
