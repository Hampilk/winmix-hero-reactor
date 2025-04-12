import React, { createContext, useContext, useState, useEffect, SetStateAction } from 'react'; // SetStateAction importálása
import { Content, TextContent, TitleContent, TableContent, ButtonContent, CardContent, GridContent } from '@/types/content';
import { v4 as uuidv4 } from 'uuid';

interface ContentContextType {
  contents: Content[];
  addContent: (content: Omit<Content, 'id' | 'order'>) => void;
  updateContent: (id: string, content: Partial<Omit<Content, 'id' | 'type' | 'order'>>) => void; // 'type' és 'order' eltávolítása a Partial-ból
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
  // Az állapot típusa explicit megadva a useState-nek
  const [contents, setContents] = useState<Content[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [focusedContentId, setFocusedContentId] = useState<string | null>(null);

  // Load contents from localStorage on component mount
  useEffect(() => {
    const savedContents = localStorage.getItem('winmix-contents');
    if (savedContents) {
      try {
        // Itt érdemes lehet validálni a betöltött adatokat a Content[] típussal szemben
        const parsedContents = JSON.parse(savedContents);
        if (Array.isArray(parsedContents)) { // Alapvető ellenőrzés
           // TODO: Mélyebb validáció szükséges lehet a típusokhoz (pl. Zod használatával)
          setContents(parsedContents as Content[]);
        } else {
           console.error('Saved contents are not an array');
           setContents([]); // Visszaállítás üres tömbre hiba esetén
        }
      } catch (e) {
        console.error('Failed to parse saved contents', e);
        setContents([]); // Visszaállítás üres tömbre hiba esetén
      }
    }
  }, []);

  // Save contents to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('winmix-contents', JSON.stringify(contents));
  }, [contents]);

  // *** JAVÍTÁS KEZDETE (addContent típusbiztonság) ***
  const addContent = (contentData: Omit<Content, 'id' | 'order'>) => {
    let newContent: Content; // Típus továbbra is Content
    const baseProps = {
        id: uuidv4(),
        order: contents.length, // Kezdeti sorrend a végén
    };

    // Explicit objektum létrehozás minden típushoz
    switch(contentData.type) {
      case 'text':
        const textInput = contentData as Partial<TextContent>;
        newContent = {
          ...baseProps,
          type: 'text',
          content: textInput.content || '',
        };
        break;

      case 'title':
        const titleInput = contentData as Partial<TitleContent>;
        newContent = {
          ...baseProps,
          type: 'title',
          content: titleInput.content || '',
          level: titleInput.level || 2, // Alapértelmezett szint
        };
        break;

      case 'table':
         const tableInput = contentData as Partial<TableContent>;
        newContent = {
          ...baseProps,
          type: 'table',
          headers: tableInput.headers || [],
          rows: tableInput.rows || [],
        };
        break;

      case 'button':
        const buttonInput = contentData as Partial<ButtonContent>;
        newContent = {
          ...baseProps,
          type: 'button',
          text: buttonInput.text || 'Gomb', // Alapértelmezett szöveg
          url: buttonInput.url || '#', // Alapértelmezett URL
          variant: buttonInput.variant || 'default', // Alapértelmezett variant
        };
        break;

      case 'card':
        const cardInput = contentData as Partial<CardContent>;
        newContent = {
          ...baseProps,
          type: 'card',
          // A 'title' kötelező a CardContent-ben, biztosítjuk, hogy létezzen
          title: cardInput.title || 'Cím nélkül', // Alapértelmezett cím
          content: cardInput.content || '', // Alapértelmezett tartalom
          imageUrl: cardInput.imageUrl, // Lehet undefined, ha nem kötelező
        };
        break;

      case 'grid':
        const gridInput = contentData as Partial<GridContent>;
        newContent = {
          ...baseProps,
          type: 'grid',
          columns: gridInput.columns || 3, // Alapértelmezett oszlopszám
          rows: gridInput.rows || 1, // Alapértelmezett sorszám (vagy lehet dinamikus?)
          items: gridInput.items || [], // Alapértelmezett elemek
        };
        break;

      default:
        // Kezeljük az ismeretlen típust (bár a Content unió ezt elvileg megakadályozza)
        console.error(`Unknown content type: ${(contentData as any).type}`);
        // Dobjunk hibát, vagy térjünk vissza anélkül, hogy módosítanánk az állapotot
        return;
        // Vagy: throw new Error(`Unknown content type: ${(contentData as any).type}`);
    }

    // A setContents hívás argumentuma most már biztosan Content[] típusú lesz
    setContents(prev => [...prev, newContent]); // Nincs szükség típuskonverzióra itt
  };
  // *** JAVÍTÁS VÉGE (addContent típusbiztonság) ***

  // *** JAVÍTÁS KEZDETE (updateContent típusbiztonság) ***
  // Módosítjuk a content paraméter típusát, hogy ne engedje a 'type' és 'order' módosítását itt.
  // Az 'order'-t a reorderContent kezeli. A 'type'-ot általában nem akarjuk módosítani update-tel.
  const updateContent = (id: string, contentUpdate: Partial<Omit<Content, 'id' | 'type' | 'order'>>) => {
    setContents(prev =>
      prev.map(item => {
        if (item.id === id) {
          // Fontos: Csak azokat a mezőket frissítjük, amik az adott típushoz tartoznak.
          // A {...item, ...contentUpdate} működhet, de potenciálisan extra mezőket vihet be.
          // Egy biztonságosabb megközelítés lenne típus-specifikus frissítés, de az bonyolultabb.
          // Maradunk az egyszerűbb megoldásnál, de a contentUpdate típusa szigorúbb.
          // Biztosítjuk, hogy a végeredmény megfeleljen a Content típusnak.
          return { ...item, ...contentUpdate } as Content; // Típuskonverzió a biztonság kedvéért
        }
        return item;
      })
    );
  };
  // *** JAVÍTÁS VÉGE (updateContent típusbiztonság) ***


  const deleteContent = (id: string) => {
    setContents(prev => {
      const filtered = prev.filter(item => item.id !== id);
      // Újrarendezi a maradék elemeket a helyes 'order' értékekkel
      return filtered.map((item, index) => ({ ...item, order: index }));
    });
  };

  const reorderContent = (id: string, newOrder: number) => {
    setContents(prev => {
      const items = [...prev]; // Másolat készítése a módosításhoz
      const itemIndex = items.findIndex(item => item.id === id);
      if (itemIndex === -1) return prev; // Elem nem található

      const [movedItem] = items.splice(itemIndex, 1); // Elem eltávolítása

      // Helyezzük be az új pozícióba
      // Biztosítjuk, hogy newOrder a határokon belül maradjon
      const targetOrder = Math.max(0, Math.min(newOrder, items.length));
      items.splice(targetOrder, 0, movedItem);

      // Frissítsük az összes elem 'order' tulajdonságát a tömbben elfoglalt helyük alapján
      return items.map((item, index) => ({ ...item, order: index }));
    });
  };

  return (
    <ContentContext.Provider
      value={{
        // A rendezést itt is meghagyjuk, hogy a kontextusból mindig rendezett lista jöjjön
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
