
// @/components/providers/ContentContext.tsx

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
    Content, ContentType, createDefaultContent,
} from '@/types/content'; 
import { v4 as uuidv4 } from 'uuid';
import { Presentation, Slide } from '@/types/slides'; 

// --- Context Type Definition ---
interface ContentContextType {
  // Presentation & Slide Management
  currentPresentation: Presentation | null;
  setCurrentPresentation: (presentation: Presentation | null) => void;
  slides: Slide[];                 
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
  currentSlide: Slide | null;      
  addSlide: (slide?: Partial<Slide>) => string; 
  updateSlide: (id: string, slideUpdate: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlide: (sourceIndex: number, targetIndex: number) => void;

  // Content Management (Operates on the CURRENT slide)
  currentSlideContents: Content[]; 
  addContent: (type: ContentType, partialData?: Partial<Content>) => Content | null; 
  updateContent: (id: string, contentUpdate: Partial<Content>) => void; 
  deleteContent: (id: string) => void; 
  reorderContent: (id: string, newOrder: number) => void; 
  focusedContentId: string | null;
  setFocusedContentId: (id: string | null) => void;

  // Editor State
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;

  // Presentation Mode
  enterPresentationMode: () => void;
  exitPresentationMode: () => void;
  isPresentationMode: boolean;
}

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


  // --- Slide Actions ---
  const addSlide = useCallback((slideData?: Partial<Slide>): string => {
      const newSlideId = uuidv4();
      const newSlide: Slide = {
          id: newSlideId,
          title: slideData?.title || "New Slide",
          type: slideData?.type || "content",
          content: [], // Start with empty content array
          elements: [], // Start with empty elements array
          // Add other default slide properties if needed (e.g., background)
          ...(slideData || {}), // Merge partial data
      };

      updatePresentationSlides(currentSlides => {
          const newSlides = [...currentSlides, newSlide];
          // Set the newly added slide as current immediately
          setCurrentSlideIndex(newSlides.length - 1);
          return newSlides;
      });

      return newSlideId; // Return the ID of the newly created slide
  }, [updatePresentationSlides]);

  const updateSlide = useCallback((id: string, slideUpdate: Partial<Slide>) => {
      updatePresentationSlides(currentSlides =>
          currentSlides.map(slide =>
              slide.id === id
                  ? { ...slide, ...slideUpdate, id } // Ensure ID isn't accidentally changed
                  : slide
          )
      );
  }, [updatePresentationSlides]);

  const deleteSlide = useCallback((id: string) => {
      let deletedSlideIndex = -1;
      let slidesAfterDelete: Slide[] = [];

      updatePresentationSlides(currentSlides => {
          deletedSlideIndex = currentSlides.findIndex(s => s.id === id);
          if (deletedSlideIndex === -1) return currentSlides; // Not found, no change

          slidesAfterDelete = currentSlides.filter(slide => slide.id !== id);
          return slidesAfterDelete;
      });

      // Adjust currentSlideIndex *after* state update is requested
      if (deletedSlideIndex !== -1) {
          if (slidesAfterDelete.length === 0) {
              setCurrentSlideIndex(0); // Or -1 if you want to signify no slide selected
          } else if (currentSlideIndex === deletedSlideIndex) {
              // If deleting the current slide, select the previous one (or first)
              setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
          } else if (currentSlideIndex > deletedSlideIndex) {
              // If deleting a slide *before* the current one, decrement index
              setCurrentSlideIndex(currentSlideIndex - 1);
          }
          // If deleting *after* current slide, index remains valid
      }
  }, [currentSlideIndex, updatePresentationSlides]);

  const reorderSlide = useCallback((sourceIndex: number, targetIndex: number) => {
      if (sourceIndex === targetIndex) return;

      let newCurrentIndex = currentSlideIndex; // Calculate new index before state update

      updatePresentationSlides(currentSlides => {
          if (sourceIndex < 0 || sourceIndex >= currentSlides.length || targetIndex < 0 || targetIndex > currentSlides.length) {
              console.error("Invalid source or target index for slide reorder");
              return currentSlides; // Invalid indices
          }

          const workingSlides = [...currentSlides];
          const [movedSlide] = workingSlides.splice(sourceIndex, 1);
          workingSlides.splice(targetIndex, 0, movedSlide);

          // Calculate how the current index should change based on the move
          if (currentSlideIndex === sourceIndex) {
              newCurrentIndex = targetIndex > sourceIndex ? targetIndex -1 : targetIndex; // Adjust if inserted before original spot
          } else if (sourceIndex < currentSlideIndex && targetIndex >= currentSlideIndex) {
              newCurrentIndex = currentSlideIndex - 1;
          } else if (sourceIndex > currentSlideIndex && targetIndex <= currentSlideIndex) {
              newCurrentIndex = currentSlideIndex + 1;
          }
          // Ensure new index is within bounds of the *final* array length
          newCurrentIndex = Math.max(0, Math.min(newCurrentIndex, workingSlides.length - 1));

          return workingSlides;
      });

      // Set the potentially adjusted index *after* requesting the state update
       setCurrentSlideIndex(newCurrentIndex);

  }, [currentSlideIndex, updatePresentationSlides]);


  // --- Content Actions (Operate on Current Slide) ---

  const addContent = useCallback((type: ContentType, partialData?: Partial<Content>): Content | null => {
      if (!currentSlide) {
          console.error("Cannot add content: No current slide selected.");
          return null;
      }

      let newContent: Content | null = null;

      updatePresentationSlides(currentSlides => {
          return currentSlides.map((slide, index) => {
              if (index === currentSlideIndex) {
                  const currentContent = slide.content || [];
                  const newOrder = currentContent.length;
                  
                  // Create default content based on type
                  const baseContent = createDefaultContent(type, newOrder);
                  
                  // Merge with partial data but preserve critical properties
                  newContent = {
                      ...baseContent,
                      ...(partialData || {}),
                      id: baseContent.id, // Ensure ID isn't changed
                      type, // Ensure type isn't changed
                      order: newOrder // Ensure order is correct
                  } as Content; // Use type assertion to avoid type issues
                  
                  return { 
                      ...slide, 
                      content: [...currentContent, newContent] 
                  };
              }
              return slide;
          });
      });

      // Focus the newly added content item immediately (optional)
      if (newContent) {
          setFocusedContentId(newContent.id);
      }

      return newContent; // Return the newly created content object
  }, [currentSlide, currentSlideIndex, updatePresentationSlides]);


  const updateContent = useCallback((id: string, contentUpdate: Partial<Content>) => {
      if (!currentSlide) return;

      updatePresentationSlides(currentSlides => {
          return currentSlides.map((slide, index) => {
              if (index === currentSlideIndex) {
                  const updatedContent = (slide.content || []).map(content =>
                      content.id === id
                          ? { 
                              ...content, 
                              ...contentUpdate, 
                              id: content.id, // Preserve ID
                              type: content.type // Preserve content type
                            } as Content
                          : content
                  );
                  return { ...slide, content: updatedContent };
              }
              return slide;
          });
      });
  }, [currentSlide, currentSlideIndex, updatePresentationSlides]);

  const deleteContent = useCallback((id: string) => {
      if (!currentSlide) return;

      updatePresentationSlides(currentSlides => {
          return currentSlides.map((slide, index) => {
              if (index === currentSlideIndex) {
                  const currentContent = slide.content || [];
                  const filteredContent = currentContent.filter(content => content.id !== id);
                  // Re-assign order based on new array index
                  const reorderedContent = filteredContent.map((content, idx) => ({
                      ...content,
                      order: idx,
                  }));
                  return { ...slide, content: reorderedContent };
              }
              return slide;
          });
      });

      // If the deleted item was focused, unfocus it
      if (focusedContentId === id) {
          setFocusedContentId(null);
      }
  }, [currentSlide, currentSlideIndex, updatePresentationSlides, focusedContentId]);


  const reorderContent = useCallback((id: string, newOrder: number) => {
       if (!currentSlide) return;

      updatePresentationSlides(currentSlides => {
          return currentSlides.map((slide, index) => {
               if (index === currentSlideIndex) {
                   const currentContent = slide.content || [];
                   const oldIndex = currentContent.findIndex(c => c.id === id);

                   if (oldIndex === -1) return slide; // Content not found on this slide

                   const targetIndex = Math.max(0, Math.min(newOrder, currentContent.length - 1));

                   if (oldIndex === targetIndex) return slide; // No change in position

                   const workingContent = [...currentContent];
                   const [movedItem] = workingContent.splice(oldIndex, 1);
                   workingContent.splice(targetIndex, 0, movedItem);

                   // Update order property for all items based on their new index
                   const reorderedContent = workingContent.map((content, idx) => ({
                       ...content,
                       order: idx,
                   }));

                   return { ...slide, content: reorderedContent };
               }
               return slide;
           });
       });
  }, [currentSlide, currentSlideIndex, updatePresentationSlides]);


  // --- Presentation Mode Actions ---
  const enterPresentationMode = useCallback(() => {
      setIsPresentationMode(true);
      setEditMode(false); // Exit edit mode
      setFocusedContentId(null); // Clear focus
      // Attempt fullscreen
      document.documentElement.requestFullscreen().catch(err => {
          console.warn(`Could not enter fullscreen: ${err.message}`);
      });
  }, []);

  const exitPresentationMode = useCallback(() => {
      setIsPresentationMode(false);
      // Optionally re-enter edit mode: setEditMode(true);
      // Exit fullscreen if active
      if (document.fullscreenElement) {
          document.exitFullscreen().catch(err => {
              console.warn(`Could not exit fullscreen: ${err.message}`);
          });
      }
  }, []);

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
