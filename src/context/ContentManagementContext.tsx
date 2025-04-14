import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Content, ContentType, TextContent, TitleContent, TableContent, ButtonContent, CardContent, GridContent } from '@/types/content';

// Define the context type
interface ContentManagementContextType {
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
}

// Create the context
const ContentManagementContext = createContext<ContentManagementContextType | undefined>(undefined);

// Provider Component
export const ContentManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [focusedContentId, setFocusedContentId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Add content
  const addContent = useCallback((contentData: Partial<Content> & { type: ContentType }) => {
    const newId = uuidv4();
    const newOrder = contents.length;

    // Dynamically create content based on its type
    const newContent: Content = (() => {
      switch (contentData.type) {
        case 'text':
          return { id: newId, order: newOrder, type: 'text', content: contentData.content || '' } as TextContent;
        case 'title':
          return {
            id: newId,
            order: newOrder,
            type: 'title',
            content: contentData.content || '',
            level: (contentData as Partial<TitleContent>).level || 2,
          } as TitleContent;
        case 'table':
          return {
            id: newId,
            order: newOrder,
            type: 'table',
            headers: (contentData as Partial<TableContent>).headers || [],
            rows: (contentData as Partial<TableContent>).rows || [],
          } as TableContent;
        case 'button':
          return {
            id: newId,
            order: newOrder,
            type: 'button',
            text: (contentData as Partial<ButtonContent>).text || '',
            url: (contentData as Partial<ButtonContent>).url || '',
            variant: (contentData as Partial<ButtonContent>).variant || 'default',
          } as ButtonContent;
        case 'card':
          return {
            id: newId,
            order: newOrder,
            type: 'card',
            title: (contentData as Partial<CardContent>).title || '',
            content: (contentData as Partial<CardContent>).content || '',
            imageUrl: (contentData as Partial<CardContent>).imageUrl || '',
          } as CardContent;
        case 'grid':
          return {
            id: newId,
            order: newOrder,
            type: 'grid',
            columns: (contentData as Partial<GridContent>).columns || 3,
            rows: (contentData as Partial<GridContent>).rows || 3,
            items: (contentData as Partial<GridContent>).items || [],
          } as GridContent;
        default:
          throw new Error(`Unhandled content type: ${contentData.type}`);
      }
    })();

    // Update state
    setContents((prevContents) => [...prevContents, newContent]);
  }, [contents]);

  // Update content
  const updateContent = useCallback((id: string, contentUpdate: Partial<Content>) => {
    setContents((prevContents) =>
      prevContents.map((content) =>
        content.id === id ? { ...content, ...contentUpdate } : content
      )
    );
  }, []);

  // Delete content
  const deleteContent = useCallback((id: string) => {
    setContents((prevContents) =>
      prevContents
        .filter((content) => content.id !== id) // Remove the content
        .map((content, index) => ({ ...content, order: index })) // Reorder remaining contents
    );
  }, []);

  // Reorder content
  const reorderContent = useCallback((id: string, newOrder: number) => {
    setContents((prevContents) => {
      const contentToMove = prevContents.find((content) => content.id === id);
      if (!contentToMove) {
        console.error(`Content with id ${id} not found.`);
        return prevContents;
      }

      // Remove the item and reinsert it at the new position
      const reorderedContents = prevContents
        .filter((content) => content.id !== id)
        .sort((a, b) => a.order - b.order);

      reorderedContents.splice(newOrder, 0, { ...contentToMove, order: newOrder });

      // Reorder all items sequentially
      return reorderedContents.map((content, index) => ({ ...content, order: index }));
    });
  }, []);

  // Memoized context value
  const value = useMemo(
    () => ({
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
    }),
    [contents, addContent, updateContent, deleteContent, reorderContent, focusedContentId, editMode, zoomLevel]
  );

  return <ContentManagementContext.Provider value={value}>{children}</ContentManagementContext.Provider>;
};

// Hook for consuming the context
export const useContentManagement = () => {
  const context = useContext(ContentManagementContext);
  if (!context) {
    throw new Error('useContentManagement must be used within a ContentManagementProvider');
  }
  return context;
};
