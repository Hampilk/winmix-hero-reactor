
import React, { createContext, useContext } from 'react';
import { Content, ContentType } from '@/types/content';
import { Presentation, Slide } from '@/types/slides';
import { ContentManagementProvider, useContentManagement } from './ContentManagementContext';
import { PresentationProvider, usePresentation } from './PresentationContext';

// Combined interface that includes both contexts
interface ContentContextType {
  // Content management
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
  
  // Presentation
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

// Create the combined context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Combined provider that wraps both specialized providers
export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ContentManagementProvider>
      <PresentationProvider>
        <CombinedContextProvider>
          {children}
        </CombinedContextProvider>
      </PresentationProvider>
    </ContentManagementProvider>
  );
};

// Internal provider that combines both contexts
const CombinedContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contentManagement = useContentManagement();
  const presentation = usePresentation();

  // Combine both contexts
  const combinedValue: ContentContextType = {
    ...contentManagement,
    ...presentation
  };

  return <ContentContext.Provider value={combinedValue}>{children}</ContentContext.Provider>;
};

// The hook to use the combined context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
