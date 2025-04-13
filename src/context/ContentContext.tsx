
// @/context/ContentContext.tsx
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Content, ContentType } from '@/types/content'; 
import { Presentation, Slide } from '@/types/slides'; 
import { ContentContextType } from './content/types';
import { useSlideManagement } from './content/slideManagement';
import { useContentManagement } from './content/contentManagement';
import { usePresentationMode } from './content/presentationMode';

// --- Context Creation ---
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// --- Provider Component ---
export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- State ---
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [focusedContentId, setFocusedContentId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(true); // Often start in edit mode
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // --- Derived State (Memoized for performance) ---
  const slides = useMemo(() => currentPresentation?.slides || [], [currentPresentation]);

  const currentSlide = useMemo(() => {
    if (currentSlideIndex >= 0 && currentSlideIndex < slides.length) {
      return slides[currentSlideIndex];
    }
    return null;
  }, [slides, currentSlideIndex]);

  // Content for the *currently selected* slide
  const currentSlideContents = useMemo(() => currentSlide?.content || [], [currentSlide]);

  // --- Internal Helper: Update Presentation State Immutably ---
  // Centralizes the logic for updating the presentation object
  const updatePresentationSlides = useCallback((updateFn: (slides: Slide[]) => Slide[]) => {
    setCurrentPresentation(prev => {
      if (!prev) return null;
      const updatedSlides = updateFn([...prev.slides]); // Operate on a copy
      return { ...prev, slides: updatedSlides };
    });
  }, []);

  // Hook composition for different functionalities
  const { addSlide, updateSlide, deleteSlide, reorderSlide } = useSlideManagement(
    slides,
    currentSlideIndex,
    setCurrentSlideIndex,
    updatePresentationSlides
  );

  const { addContent, updateContent, deleteContent, reorderContent } = useContentManagement(
    currentSlide,
    currentSlideIndex,
    updatePresentationSlides,
    focusedContentId,
    setFocusedContentId
  );

  const { enterPresentationMode, exitPresentationMode } = usePresentationMode(
    setIsPresentationMode,
    setEditMode,
    setFocusedContentId
  );

  // --- Context Value ---
  // Assemble the value provided to consumers
  const value: ContentContextType = useMemo(() => ({
    // Presentation & Slide State
    currentPresentation,
    setCurrentPresentation,
    slides,
    currentSlideIndex,
    setCurrentSlideIndex,
    currentSlide,
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlide,

    // Current Slide Content & Actions
    currentSlideContents,
    addContent,
    updateContent,
    deleteContent,
    reorderContent,
    focusedContentId,
    setFocusedContentId,

    // Editor State
    editMode,
    setEditMode,
    zoomLevel,
    setZoomLevel,

    // Presentation Mode
    enterPresentationMode,
    exitPresentationMode,
    isPresentationMode,
  }), [
    currentPresentation, setCurrentPresentation, slides, currentSlideIndex, setCurrentSlideIndex, currentSlide,
    addSlide, updateSlide, deleteSlide, reorderSlide,
    currentSlideContents, addContent, updateContent, deleteContent, reorderContent,
    focusedContentId, setFocusedContentId,
    editMode, setEditMode, zoomLevel, setZoomLevel,
    enterPresentationMode, exitPresentationMode, isPresentationMode
  ]);

  // --- Render Provider ---
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

// --- Hook for Consuming Context ---
export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider. Make sure the component is wrapped.');
  }
  return context;
};
