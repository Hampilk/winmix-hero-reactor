
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
    // Create a new content object with id and order properties
    const newItem = {
      ...content,
      id: uuidv4(),
      order: contents.length,
    };
    
    // Type assertion to ensure TypeScript recognizes it as Content
    const newContent = newItem as Content;
    
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
