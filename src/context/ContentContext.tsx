import React, { createContext, useContext, useState, useEffect, SetStateAction } from 'react';
import { Content, TextContent, TitleContent, TableContent, ButtonContent, CardContent, GridContent } from '@/types/content';
import { v4 as uuidv4 } from 'uuid';

interface ContentContextType {
  contents: Content[];
  addContent: (content: Omit<Content, 'id' | 'order'>) => void;
  updateContent: (id: string, content: Partial<Omit<Content, 'id' | 'type' | 'order'>>) => void;
  deleteContent: (id: string) => void;
  reorderContent: (id: string, newOrder: number) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  focusedContentId: string | null;
  setFocusedContentId: (id: string | null) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [focusedContentId, setFocusedContentId] = useState<string | null>(null);

  useEffect(() => {
    const savedContents = localStorage.getItem('winmix-contents');
    if (savedContents) {
      try {
        const parsedContents = JSON.parse(savedContents);
        if (Array.isArray(parsedContents)) {
          setContents(parsedContents as Content[]);
        } else {
          console.error('Saved contents are not an array');
          setContents([]);
        }
      } catch (e) {
        console.error('Failed to parse saved contents', e);
        setContents([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('winmix-contents', JSON.stringify(contents));
  }, [contents]);

  const addContent = (contentData: Omit<Content, 'id' | 'order'>) => {
    const baseProps = {
      id: uuidv4(),
      order: contents.length,
    };

    let newContent: Content;

    switch(contentData.type) {
      case 'text':
        newContent = {
          ...baseProps,
          type: 'text',
          content: (contentData as Partial<TextContent>).content || '',
        } as TextContent;
        break;

      case 'title':
        newContent = {
          ...baseProps,
          type: 'title',
          content: (contentData as Partial<TitleContent>).content || '',
          level: (contentData as Partial<TitleContent>).level || 2,
        } as TitleContent;
        break;

      case 'table':
        newContent = {
          ...baseProps,
          type: 'table',
          headers: (contentData as Partial<TableContent>).headers || [],
          rows: (contentData as Partial<TableContent>).rows || [],
        } as TableContent;
        break;

      case 'button':
        newContent = {
          ...baseProps,
          type: 'button',
          text: (contentData as Partial<ButtonContent>).text || 'Gomb',
          url: (contentData as Partial<ButtonContent>).url || '#',
          variant: (contentData as Partial<ButtonContent>).variant || 'default',
        } as ButtonContent;
        break;

      case 'card':
        newContent = {
          ...baseProps,
          type: 'card',
          title: (contentData as Partial<CardContent>).title || 'Cím nélkül',
          content: (contentData as Partial<CardContent>).content || '',
          imageUrl: (contentData as Partial<CardContent>).imageUrl,
        } as CardContent;
        break;

      case 'grid':
        newContent = {
          ...baseProps,
          type: 'grid',
          columns: (contentData as Partial<GridContent>).columns || 3,
          rows: (contentData as Partial<GridContent>).rows || 1,
          items: (contentData as Partial<GridContent>).items || [],
        } as GridContent;
        break;

      default:
        console.error(`Unknown content type: ${(contentData as any).type}`);
        return;
    }

    setContents(prev => [...prev, newContent]);
  };

  const updateContent = (id: string, contentUpdate: Partial<Omit<Content, 'id' | 'type' | 'order'>>) => {
    setContents(prev =>
      prev.map(item => {
        if (item.id === id) {
          return { ...item, ...contentUpdate } as Content;
        }
        return item;
      })
    );
  };

  const deleteContent = (id: string) => {
    setContents(prev => {
      const filtered = prev.filter(item => item.id !== id);
      return filtered.map((item, index) => ({ ...item, order: index }));
    });
  };

  const reorderContent = (id: string, newOrder: number) => {
    setContents(prev => {
      const items = [...prev];
      const itemIndex = items.findIndex(item => item.id === id);
      if (itemIndex === -1) return prev;

      const [movedItem] = items.splice(itemIndex, 1);
      const targetOrder = Math.max(0, Math.min(newOrder, items.length));
      items.splice(targetOrder, 0, movedItem);

      return items.map((item, index) => ({ ...item, order: index }));
    });
  };

  return (
    <ContentContext.Provider
      value={{
        contents: [...contents].sort((a, b) => a.order - b.order),
        addContent,
        updateContent,
        deleteContent,
        reorderContent,
        editMode,
        setEditMode,
        zoomLevel,
        setZoomLevel,
        focusedContentId,
        setFocusedContentId,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
