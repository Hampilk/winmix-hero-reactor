import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Presentation, Slide } from '@/types/slides';
import { useToast } from '@/hooks/use-toast';

interface PresentationContextType {
  currentPresentation: Presentation | null;
  setCurrentPresentation: (presentation: Presentation | null) => void;
  slides: Slide[];
  currentSlideIndex: number;
  currentSlide: Slide | null;
  setCurrentSlideIndex: (index: number | ((prevIndex: number) => number)) => void; // Allow functional updates
  addSlide: (slide: Slide) => void;
  updateSlide: (id: string, slideUpdate: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlide: (sourceIndex: number, targetIndex: number) => void;
  enterPresentationMode: () => void;
  exitPresentationMode: () => void;
  isPresentationMode: boolean;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

export const PresentationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();

  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(() => null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(() => 0);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(() => false);

  // Suggestion 1 (Error Handling): Log compatibility warning once
  useEffect(() => {
    if (!document.fullscreenEnabled) {
      console.warn("Fullscreen API is not supported or enabled in this browser.");
    }
  }, []);

  const slides = useMemo(() => currentPresentation?.slides || [], [currentPresentation]);
  const currentSlide = useMemo(() => slides[currentSlideIndex] || null, [slides, currentSlideIndex]);

  // Suggestion 5 (Error Handling): Use toast on failure
  const addSlide = useCallback((slide: Slide) => {
    const slideWithId = { ...slide, id: slide.id || uuidv4() };

    setCurrentPresentation(prev => {
      if (!prev) {
        // Use toast for user feedback if trying to add to non-existent presentation
        toast({
          title: "Cannot Add Slide",
          description: "No presentation is currently loaded.",
          variant: "warning", // Or "destructive" depending on severity
        });
        return null;
      }
      const updatedSlides = [...prev.slides, slideWithId];
      // Update index inside setter to point to the new slide
      setCurrentSlideIndex(updatedSlides.length - 1);
      return {
        ...prev,
        slides: updatedSlides
      };
    });
  }, [toast]); // Added toast dependency

  // Suggestion 1 (updateSlide Optimization): Check if ID exists before mapping
  const updateSlide = useCallback((id: string, slideUpdate: Partial<Slide>) => {
    setCurrentPresentation(prev => {
      if (!prev) return null;

      // Optimization: Check if the slide exists before creating a new array
      const slideExists = prev.slides.some(slide => slide.id === id);
      if (!slideExists) {
         console.warn(`updateSlide: Slide with id ${id} not found.`);
         return prev; // Return previous state if slide doesn't exist
      }

      const updatedSlides = prev.slides.map(slide =>
        slide.id === id ? { ...slide, ...slideUpdate } : slide
      );

      // Note: Deep equality check could be added here for further optimization
      // if performance profiling indicates it's needed.
      // e.g., if (isEqual(prev.slides, updatedSlides)) return prev;

      return {
        ...prev,
        slides: updatedSlides
      };
    });
  }, []);

  // Suggestion 2 (deleteSlide Simplification): Use simplified clamping logic
  const deleteSlide = useCallback((id: string) => {
    setCurrentPresentation(prev => {
      if (!prev) return null;

      let deletedSlideWasCurrent = false;
      const originalIndex = prev.slides.findIndex(slide => slide.id === id);

      if (originalIndex === -1) return prev; // Slide not found

      const updatedSlides = prev.slides.filter(slide => slide.id !== id);

      // Use functional update for setCurrentSlideIndex for safety with async state
      setCurrentSlideIndex(prevIndex => {
        // Clamp the index to the new valid range.
        // Handles deleting the last slide or the currently selected slide correctly
        // by ensuring the index doesn't exceed the new bounds.
        // It doesn't adjust if a slide *before* the current one is deleted.
        return Math.max(0, Math.min(prevIndex, updatedSlides.length - 1));
      });

      return {
        ...prev,
        slides: updatedSlides
      };
    });
  }, []); // No dependency on currentSlideIndex needed when using functional update

  // Reorder logic remains complex but handles index updates correctly
  const reorderSlide = useCallback((sourceIndex: number, targetIndex: number) => {
    if (!currentPresentation || sourceIndex === targetIndex || sourceIndex < 0 || sourceIndex >= slides.length || targetIndex < 0 || targetIndex > slides.length) {
       console.warn("Invalid reorder parameters", { sourceIndex, targetIndex, slideCount: slides.length });
       return;
    }

    setCurrentPresentation(prev => {
      if (!prev) return null; // Should be covered by check above, but safe

      const updatedSlides = [...prev.slides];
      const [movedSlide] = updatedSlides.splice(sourceIndex, 1);
      updatedSlides.splice(targetIndex, 0, movedSlide);

      // Use functional update for index adjustment
      setCurrentSlideIndex(prevIndex => {
          if (prevIndex === sourceIndex) {
              return targetIndex; // Moved the current slide
          } else if (sourceIndex < prevIndex && targetIndex >= prevIndex) {
              return prevIndex - 1; // Moved from before to after/at current
          } else if (sourceIndex > prevIndex && targetIndex <= prevIndex) {
              return prevIndex + 1; // Moved from after to before/at current
          }
          return prevIndex; // No index change needed relative to current
      });


      return {
        ...prev,
        slides: updatedSlides
      };
    });
  }, [currentPresentation, slides.length]); // slides.length dependency is okay here


  const enterPresentationMode = useCallback(() => {
    // Suggestion 3 (Polyfills): Not implemented, but noted as good practice.
    if (!document.fullscreenEnabled) {
      toast({ /* ... */ }); return;
    }
    document.documentElement.requestFullscreen()
      .then(() => { setIsPresentationMode(true); })
      .catch(err => { /* ... */ setIsPresentationMode(false); });
  }, [toast]);

  const exitPresentationMode = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => { /* ... */ });
    }
    setIsPresentationMode(false); // Always reset internal state
  }, [toast]);

  // Suggestion 4 (Fullscreen Listener Cleanup): Removed outdated prefixes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPresentationMode(!!document.fullscreenElement); // Sync state directly
    };
    // Keep webkit prefix for Safari compatibility
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);


  // Memoized context value
  const value = useMemo(() => ({
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
    isPresentationMode,
  }), [
    currentPresentation, slides, currentSlideIndex, currentSlide, // State + Derived State
    addSlide, updateSlide, deleteSlide, reorderSlide, // Callbacks (memoized)
    enterPresentationMode, exitPresentationMode, isPresentationMode // Fullscreen state/callbacks
  ]);

  return <PresentationContext.Provider value={value}>{children}</PresentationContext.Provider>;
};

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (context === undefined) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};
