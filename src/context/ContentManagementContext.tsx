
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
      const { type } = contentData;
      
      if (type === 'text') {
        const newContent: TextContent = {
          id: uuidv4(),
          order: prevContents.length,
          type: 'text',
          content: contentData.content || '',
        };
        return [...prevContents, newContent];
      } 
      else if (type === 'title') {
        const newContent: TitleContent = {
          id: uuidv4(),
          order: prevContents.length,
          type: 'title',
          content: contentData.content || '',
          level: (contentData as Partial<TitleContent>).level || 2,
        };
        return [...prevContents, newContent];
      } 
      else if (type === 'table') {
        const newContent: TableContent = {
          id: uuidv4(),
          order: prevContents.length,
          type: 'table',
          headers: (contentData as Partial<TableContent>).headers || [],
          rows: (contentData as Partial<TableContent>).rows || [],
        };
        return [...prevContents, newContent];
      } 
      else if (type === 'button') {
        const newContent: ButtonContent = {
          id: uuidv4(),
          order: prevContents.length,
          type: 'button',
          text: (contentData as Partial<ButtonContent>).text || '',
          url: (contentData as Partial<ButtonContent>).url || '',
          variant: (contentData as Partial<ButtonContent>).variant || 'default',
        };
        return [...prevContents, newContent];
      } 
      else if (type === 'card') {
        const newContent: CardContent = {
          id: uuidv4(),
          order: prevContents.length,
          type: 'card',
          title: (contentData as Partial<CardContent>).title || '',
          content: (contentData as Partial<CardContent>).content || '',
          imageUrl: (contentData as Partial<CardContent>).imageUrl,
        };
        return [...prevContents, newContent];
      } 
      else if (type === 'grid') {
        const newContent: GridContent = {
          id: uuidv4(),
          order: prevContents.length,
          type: 'grid',
          columns: (contentData as Partial<GridContent>).columns || 3,
          rows: (contentData as Partial<GridContent>).rows || 3,
          items: (contentData as Partial<GridContent>).items || [],
        };
        return [...prevContents, newContent];
      } 
      else {
        // This should never happen with proper ContentType definition
        console.error(`Unhandled content type: ${type}`);
        return prevContents;
      }
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
