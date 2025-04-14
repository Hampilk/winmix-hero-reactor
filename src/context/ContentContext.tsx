import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { Content, ContentType } from '@/types/content'; // Assuming paths are correct
import { Presentation, Slide } from '@/types/slides'; // Assuming paths are correct
import { ContentManagementProvider, useContentManagement, ContentManagementContextType } from './ContentManagementContext'; // Assuming export of type
import { PresentationProvider, usePresentation, PresentationContextType } from './PresentationContext'; // Assuming export of type

// Combined interface that includes both contexts' APIs
interface ContentContextType extends ContentManagementContextType, PresentationContextType {}

// Create the combined context
const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Combined provider that wraps both specialized providers
export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ContentManagementProvider>
      <PresentationProvider>
        <CombinedContextProvider>{children}</CombinedContextProvider>
      </PresentationProvider>
    </ContentManagementProvider>
  );
};

// Internal provider that combines both contexts
const CombinedContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contentManagement = useContentManagement();
  const presentation = usePresentation();

  // Validate that both contexts are properly initialized
  if (!contentManagement || !presentation) {
    throw new Error(
      'CombinedContextProvider must be used within both ContentManagementProvider and PresentationProvider'
    );
  }

  // Combine both contexts into a single value
  const combinedValue = useMemo(() => {
    // Check for naming conflicts between contexts
    const overlap = Object.keys(contentManagement).filter((key) =>
      Object.keys(presentation).includes(key)
    );
    if (overlap.length > 0) {
      console.warn(
        'Naming conflicts detected between ContentManagementContext and PresentationContext:',
        overlap
      );
    }

    return { ...contentManagement, ...presentation };
  }, [contentManagement, presentation]);

  // Provide the combined value to the ContentContext
  return <ContentContext.Provider value={combinedValue}>{children}</ContentContext.Provider>;
};

// Custom hook for consuming the combined context
export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);

  // Enforce usage within the correct provider hierarchy
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }

  return context;
};

// Optional: Export base types for reuse
export type { ContentManagementContextType, PresentationContextType };
