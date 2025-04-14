
import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Presentation, Slide } from '@/types/slides';
import { useToast } from '@/hooks/use-toast';

interface PresentationContextType {
  currentPresentation: Presentation | null;
  setCurrentPresentation: (presentation: Presentation | null) => void;
  slides: Slide[];
  currentSlideIndex: number;
  currentSlide: Slide | null;
  setCurrentSlideIndex: (index: number) => void;
  addSlide: (slide: Slide) => void;
  updateSlide: (id: string, slide: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlide: (sourceIndex: number, targetIndex: number) => void;
  enterPresentationMode: () => void;
  exitPresentationMode: () => void;
  isPresentationMode: boolean;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export const PresentationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const slides = currentPresentation?.slides || [];
  const currentSlide = slides[currentSlideIndex] || null;

  const addSlide = useCallback((slide: Slide) => {
    setCurrentPresentation(prev => {
      if (!prev) return null;
      
      const updatedSlides = [...prev.slides, slide];
      return {
        ...prev,
        slides: updatedSlides
      };
    });
    // Set the newly added slide as current
    setCurrentSlideIndex(slides.length);
  }, [slides.length]);

  const updateSlide = useCallback((id: string, slideUpdate: Partial<Slide>) => {
    setCurrentPresentation(prev => {
      if (!prev) return null;
      
      const updatedSlides = prev.slides.map(slide =>
        slide.id === id ? { ...slide, ...slideUpdate } : slide
      );
      
      return {
        ...prev,
        slides: updatedSlides
      };
    });
  }, []);

  const deleteSlide = useCallback((id: string) => {
    setCurrentPresentation(prev => {
      if (!prev) return null;
      
      const updatedSlides = prev.slides.filter(slide => slide.id !== id);
      
      // If we deleted the current slide, adjust the current index
      if (currentSlideIndex >= updatedSlides.length) {
        setCurrentSlideIndex(Math.max(0, updatedSlides.length - 1));
      }
      
      return {
        ...prev,
        slides: updatedSlides
      };
    });
  }, [currentSlideIndex]);

  const reorderSlide = useCallback((sourceIndex: number, targetIndex: number) => {
    if (sourceIndex === targetIndex) return;
    
    setCurrentPresentation(prev => {
      if (!prev) return null;
      
      const updatedSlides = [...prev.slides];
      const [movedSlide] = updatedSlides.splice(sourceIndex, 1);
      updatedSlides.splice(targetIndex, 0, movedSlide);
      
      // If we're moving the current slide, update the current index
      if (currentSlideIndex === sourceIndex) {
        setCurrentSlideIndex(targetIndex);
      }
      
      return {
        ...prev,
        slides: updatedSlides
      };
    });
  }, [currentSlideIndex]);

  const enterPresentationMode = useCallback(() => {
    setIsPresentationMode(true);
    // Enhanced error handling for fullscreen API
    if (!document.fullscreenEnabled) {
      toast({
        title: "Fullscreen not supported",
        description: "Your browser does not support fullscreen mode",
        variant: "destructive"
      });
      return;
    }
    
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
      toast({
        title: "Fullscreen error",
        description: `Could not enter fullscreen mode: ${err.message}`,
        variant: "destructive"
      });
      // Reset presentation mode if fullscreen fails
      setIsPresentationMode(false);
    });
  }, [toast]);

  const exitPresentationMode = useCallback(() => {
    setIsPresentationMode(false);
    // Exit fullscreen with error handling
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
        toast({
          title: "Exit fullscreen error",
          description: `Could not exit fullscreen mode: ${err.message}`,
          variant: "destructive"
        });
      });
    }
  }, [toast]);

  const value = {
    currentPresentation,
    setCurrentPresentation,
    slides,
    currentSlideIndex,
    currentSlide,
    setCurrentSlideIndex,
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlide,
    enterPresentationMode,
    exitPresentationMode,
    isPresentationMode
  };

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};
