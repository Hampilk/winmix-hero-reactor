
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Content, ContentType, TextContent, TitleContent, TableContent, ButtonContent, CardContent, GridContent } from '@/types/content';
import { v4 as uuidv4 } from 'uuid';
import { Presentation, Slide } from '@/types/slides';

interface ContentContextType {
  contents: Content[];
  addContent: (content: Partial<Content> & { type: ContentType }) => void;
  updateContent: (id: string, content: Partial<Content>) => void;
  deleteContent: (id: string) => void;
  reorderContent: (id: string, newOrder: number) => void;
  focusedContentId: string | null;
  setFocusedContentId: (id: string | null) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  
  // Slide editor specific
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

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [focusedContentId, setFocusedContentId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // New state for slides
  const [currentPresentation, setCurrentPresentation] = useState<Presentation | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  const addContent = useCallback((contentData: Partial<Content> & { type: ContentType }) => {
    setContents(prevContents => {
      // Create a properly typed new content based on the type
      let newContent: Content;
      
      switch (contentData.type) {
        case 'text':
          newContent = {
            id: uuidv4(),
            order: prevContents.length,
            type: 'text',
            content: contentData.content || '',
          } as TextContent;
          break;
        case 'title':
          newContent = {
            id: uuidv4(),
            order: prevContents.length,
            type: 'title',
            content: contentData.content || '',
            level: (contentData as Partial<TitleContent>).level || 2,
          } as TitleContent;
          break;
        case 'table':
          newContent = {
            id: uuidv4(),
            order: prevContents.length,
            type: 'table',
            headers: (contentData as Partial<TableContent>).headers || [],
            rows: (contentData as Partial<TableContent>).rows || [],
          } as TableContent;
          break;
        case 'button':
          newContent = {
            id: uuidv4(),
            order: prevContents.length,
            type: 'button',
            text: (contentData as Partial<ButtonContent>).text || '',
            url: (contentData as Partial<ButtonContent>).url || '',
            variant: (contentData as Partial<ButtonContent>).variant,
          } as ButtonContent;
          break;
        case 'card':
          newContent = {
            id: uuidv4(),
            order: prevContents.length,
            type: 'card',
            title: (contentData as Partial<CardContent>).title || '',
            content: (contentData as Partial<CardContent>).content || '',
            imageUrl: (contentData as Partial<CardContent>).imageUrl,
          } as CardContent;
          break;
        case 'grid':
          newContent = {
            id: uuidv4(),
            order: prevContents.length,
            type: 'grid',
            columns: (contentData as Partial<GridContent>).columns || 3,
            rows: (contentData as Partial<GridContent>).rows || 3,
            items: (contentData as Partial<GridContent>).items || [],
          } as GridContent;
          break;
        default:
          // This ensures TypeScript exhaustiveness checking
          const _exhaustiveCheck: never = contentData.type;
          throw new Error(`Unhandled content type: ${contentData.type}`);
      }
      
      return [...prevContents, newContent];
    });
  }, []);

  const updateContent = useCallback((id: string, contentUpdate: Partial<Content>) => {
    setContents(prevContents =>
      prevContents.map(content =>
        content.id === id ? { ...content, ...contentUpdate } : content
      )
    );
  }, []);

  const deleteContent = useCallback((id: string) => {
    setContents(prevContents => {
      const filteredContents = prevContents.filter(content => content.id !== id);
      // Reorder remaining contents
      return filteredContents.map((content, index) => ({
        ...content,
        order: index,
      }));
    });
  }, []);

  const reorderContent = useCallback((id: string, newOrder: number) => {
    setContents(prevContents => {
      const contentToMove = prevContents.find(content => content.id === id);
      if (!contentToMove) return prevContents;

      const oldOrder = contentToMove.order;
      if (oldOrder === newOrder) return prevContents;

      return prevContents.map(content => {
        if (content.id === id) {
          return { ...content, order: newOrder };
        } else if (
          (oldOrder < newOrder && content.order > oldOrder && content.order <= newOrder) ||
          (oldOrder > newOrder && content.order < oldOrder && content.order >= newOrder)
        ) {
          return {
            ...content,
            order: oldOrder < newOrder ? content.order - 1 : content.order + 1,
          };
        } else {
          return content;
        }
      });
    });
  }, []);

  // Slide management functions
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
    // In a real app, you might want to trigger fullscreen mode here
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen: ${err.message}`);
    });
  }, []);

  const exitPresentationMode = useCallback(() => {
    setIsPresentationMode(false);
    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  }, []);

  const value = {
    contents,
    addContent,
    updateContent,
    deleteContent,
    reorderContent,
    focusedContentId,
    setFocusedContentId,
    editMode,
    setEditMode,
    zoomLevel,
    setZoomLevel,
    
    // Slide editor specific
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

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
