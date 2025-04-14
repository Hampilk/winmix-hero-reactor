
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Content, ContentType, TextContent, TitleContent, TableContent, ButtonContent, CardContent, GridContent } from '@/types/content';
import { v4 as uuidv4 } from 'uuid';

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

const ContentManagementContext = createContext<ContentManagementContextType | undefined>(undefined);

export const ContentManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [focusedContentId, setFocusedContentId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const addContent = useCallback((contentData: Partial<Content> & { type: ContentType }) => {
    setContents(prevContents => {
      const newOrder = prevContents.length;
      const newId = uuidv4();
      let newContent: Content;
      
      switch (contentData.type) {
        case 'text':
          newContent = {
            id: newId,
            order: newOrder,
            type: 'text',
            content: (contentData as Partial<TextContent>).content || ''
          } as TextContent;
          break;
        case 'title':
          newContent = {
            id: newId,
            order: newOrder,
            type: 'title',
            content: (contentData as Partial<TitleContent>).content || '',
            level: (contentData as Partial<TitleContent>).level || 2
          } as TitleContent;
          break;
        case 'table':
          newContent = {
            id: newId,
            order: newOrder,
            type: 'table',
            headers: (contentData as Partial<TableContent>).headers || [],
            rows: (contentData as Partial<TableContent>).rows || []
          } as TableContent;
          break;
        case 'button':
          newContent = {
            id: newId,
            order: newOrder,
            type: 'button',
            text: (contentData as Partial<ButtonContent>).text || '',
            url: (contentData as Partial<ButtonContent>).url || '',
            variant: (contentData as Partial<ButtonContent>).variant || 'default'
          } as ButtonContent;
          break;
        case 'card':
          newContent = {
            id: newId,
            order: newOrder,
            type: 'card',
            title: (contentData as Partial<CardContent>).title || '',
            content: (contentData as Partial<CardContent>).content || '',
            imageUrl: (contentData as Partial<CardContent>).imageUrl
          } as CardContent;
          break;
        case 'grid':
          newContent = {
            id: newId,
            order: newOrder,
            type: 'grid',
            columns: (contentData as Partial<GridContent>).columns || 3,
            rows: (contentData as Partial<GridContent>).rows || 3,
            items: (contentData as Partial<GridContent>).items || []
          } as GridContent;
          break;
        default: {
          // Properly handle exhaustive type checking
          const exhaustiveCheck: never = contentData.type;
          console.error(`Unhandled content type: ${String(exhaustiveCheck)}`);
          // Fallback for runtime safety - create a default text content
          newContent = {
            id: newId,
            order: newOrder,
            type: 'text',
            content: ''
          } as TextContent;
        }
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
  };

  return <ContentManagementContext.Provider value={value}>{children}</ContentManagementContext.Provider>;
};

export const useContentManagement = () => {
  const context = useContext(ContentManagementContext);
  if (context === undefined) {
    throw new Error('useContentManagement must be used within a ContentManagementProvider');
  }
  return context;
};
