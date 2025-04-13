
import { useCallback } from 'react';
import { Content, ContentType, createDefaultContent } from '@/types/content';
import { Slide } from '@/types/slides';

export const useContentManagement = (
  currentSlide: Slide | null,
  currentSlideIndex: number,
  updatePresentationSlides: (updateFn: (slides: Slide[]) => Slide[]) => void,
  focusedContentId: string | null,
  setFocusedContentId: (id: string | null) => void
) => {
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
  }, [currentSlide, currentSlideIndex, updatePresentationSlides, setFocusedContentId]);


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
  }, [currentSlide, currentSlideIndex, updatePresentationSlides, focusedContentId, setFocusedContentId]);


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

  return {
    addContent,
    updateContent,
    deleteContent,
    reorderContent
  };
};
