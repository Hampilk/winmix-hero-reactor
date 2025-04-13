
import { useCallback } from 'react';
import { Slide } from '@/types/slides';
import { v4 as uuidv4 } from 'uuid';

export const useSlideManagement = (
  slides: Slide[],
  currentSlideIndex: number,
  setCurrentSlideIndex: (index: number) => void,
  updatePresentationSlides: (updateFn: (slides: Slide[]) => Slide[]) => void
) => {
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
  }, [updatePresentationSlides, setCurrentSlideIndex]);

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
  }, [currentSlideIndex, updatePresentationSlides, setCurrentSlideIndex]);

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
        newCurrentIndex = targetIndex;
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
  }, [currentSlideIndex, updatePresentationSlides, setCurrentSlideIndex]);

  return {
    addSlide,
    updateSlide,
    deleteSlide,
    reorderSlide
  };
};
