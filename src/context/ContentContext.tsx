
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Content } from '@/types/content';
import { v4 as uuidv4 } from 'uuid';

interface ContentContextType {
  contents: Content[];
  addContent: (content: Omit<Content, 'id' | 'order'>) => void;
  updateContent: (id: string, content: Partial<Omit<Content, 'id'>>) => void;
  deleteContent: (id: string) => void;
  reorderContent: (id: string, newOrder: number) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
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

  // Load contents from localStorage on component mount
  useEffect(() => {
    const savedContents = localStorage.getItem('winmix-contents');
    if (savedContents) {
      try {
        setContents(JSON.parse(savedContents));
      } catch (e) {
        console.error('Failed to parse saved contents', e);
      }
    }
  }, []);

  // Save contents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('winmix-contents', JSON.stringify(contents));
  }, [contents]);

  const addContent = (content: Omit<Content, 'id' | 'order'>) => {
    // The issue is here - we need to make sure each content type has all required properties
    // Create a properly typed content object based on the content's type
    let newContent: Content;
    
    // Properly create each content type with its required properties
    if (content.type === 'card') {
      newContent = {
        ...content,
        id: uuidv4(),
        order: contents.length,
        // Make sure these properties exist for CardContent
        title: (content as any).title || '',
        content: (content as any).content || '',
        imageUrl: (content as any).imageUrl
      } as Content;
    } else if (content.type === 'button') {
      newContent = {
        ...content,
        id: uuidv4(),
        order: contents.length,
        // Make sure these properties exist for ButtonContent
        text: (content as any).text || '',
        url: (content as any).url || '',
        variant: (content as any).variant
      } as Content;
    } else if (content.type === 'table') {
      newContent = {
        ...content,
        id: uuidv4(),
        order: contents.length,
        // Make sure these properties exist for TableContent
        headers: (content as any).headers || [],
        rows: (content as any).rows || []
      } as Content;
    } else if (content.type === 'grid') {
      newContent = {
        ...content,
        id: uuidv4(),
        order: contents.length,
        // Make sure these properties exist for GridContent
        columns: (content as any).columns || 3,
        rows: (content as any).rows || 3,
        items: (content as any).items || []
      } as Content;
    } else if (content.type === 'title') {
      newContent = {
        ...content,
        id: uuidv4(),
        order: contents.length,
        // Make sure these properties exist for TitleContent
        content: (content as any).content || '',
        level: (content as any).level || 2
      } as Content;
    } else {
      // Text content or any other type
      newContent = {
        ...content,
        id: uuidv4(),
        order: contents.length
      } as Content;
    }
    
    setContents((prev) => [...prev, newContent]);
  };

  const updateContent = (id: string, content: Partial<Omit<Content, 'id'>>) => {
    setContents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...content } : item))
    );
  };

  const deleteContent = (id: string) => {
    setContents((prev) => {
      const filtered = prev.filter((item) => item.id !== id);
      // Re-order the remaining contents
      return filtered.map((item, index) => ({ ...item, order: index }));
    });
  };

  const reorderContent = (id: string, newOrder: number) => {
    setContents((prev) => {
      const content = prev.find((item) => item.id === id);
      if (!content) return prev;

      const oldOrder = content.order;
      if (oldOrder === newOrder) return prev;

      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, order: newOrder };
        }
        if (oldOrder < newOrder && item.order > oldOrder && item.order <= newOrder) {
          return { ...item, order: item.order - 1 };
        }
        if (oldOrder > newOrder && item.order >= newOrder && item.order < oldOrder) {
          return { ...item, order: item.order + 1 };
        }
        return item;
      });
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
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};
