import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Element {
  id: string;
  type: string;
  [key: string]: any; // Extendable properties for different element types
}

interface ContentManagementContextProps {
  elements: Element[];
  selectedElement: Element | null;
  addElement: (elementData: Omit<Element, 'id'>) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string) => void;
  clearSelection: () => void;
  undo: () => void;
  redo: () => void;
}

const ContentManagementContext = createContext<ContentManagementContextProps | undefined>(undefined);

const PERSISTENCE_KEY = 'contentManagementState';

export const ContentManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<Element[]>(() => {
    const persistedState = localStorage.getItem(PERSISTENCE_KEY);
    return persistedState ? JSON.parse(persistedState) : [];
  });
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [history, setHistory] = useState<Element[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(PERSISTENCE_KEY, JSON.stringify(elements));
  }, [elements]);

  // Undo functionality
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  // Redo functionality
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Add element
  const addElement = useCallback((elementData: Omit<Element, 'id'>) => {
    const newElement: Element = { id: uuidv4(), ...elementData };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newElements]);
    setHistoryIndex((prev) => prev + 1);
  }, [elements, history, historyIndex]);

  // Update element
  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    const newElements = elements.map((element) =>
      element.id === id ? { ...element, ...updates } : element
    );
    setElements(newElements);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newElements]);
    setHistoryIndex((prev) => prev + 1);
  }, [elements, history, historyIndex]);

  // Delete element
  const deleteElement = useCallback((id: string) => {
    const newElements = elements.filter((element) => element.id !== id);
    setElements(newElements);
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newElements]);
    setHistoryIndex((prev) => prev + 1);
  }, [elements, history, historyIndex]);

  // Select an element
  const selectElement = useCallback((id: string) => {
    setSelectedElementId(id);
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedElementId(null);
  }, []);

  const value = useMemo(
    () => ({
      elements,
      selectedElement: elements.find((element) => element.id === selectedElementId) || null,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      clearSelection,
      undo,
      redo
    }),
    [elements, selectedElementId, addElement, updateElement, deleteElement, selectElement, clearSelection, undo, redo]
  );

  return <ContentManagementContext.Provider value={value}>{children}</ContentManagementContext.Provider>;
};

export const useContentManagement = (): ContentManagementContextProps => {
  const context = useContext(ContentManagementContext);
  if (!context) {
    throw new Error('useContentManagement must be used within a ContentManagementProvider');
  }
  return context;
};
