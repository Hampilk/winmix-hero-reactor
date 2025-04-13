
import { Content, ContentType } from '@/types/content';
import { Presentation, Slide } from '@/types/slides';

// --- Context Type Definition ---
export interface ContentContextType {
  // Presentation & Slide Management
  currentPresentation: Presentation | null;
  setCurrentPresentation: (presentation: Presentation | null) => void;
  slides: Slide[];                 
  currentSlideIndex: number;
  setCurrentSlideIndex: (index: number) => void;
  currentSlide: Slide | null;      
  addSlide: (slide?: Partial<Slide>) => string; 
  updateSlide: (id: string, slideUpdate: Partial<Slide>) => void;
  deleteSlide: (id: string) => void;
  reorderSlide: (sourceIndex: number, targetIndex: number) => void;

  // Content Management (Operates on the CURRENT slide)
  currentSlideContents: Content[]; 
  addContent: (type: ContentType, partialData?: Partial<Content>) => Content | null; 
  updateContent: (id: string, contentUpdate: Partial<Content>) => void; 
  deleteContent: (id: string) => void; 
  reorderContent: (id: string, newOrder: number) => void; 
  focusedContentId: string | null;
  setFocusedContentId: (id: string | null) => void;

  // Editor State
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;

  // Presentation Mode
  enterPresentationMode: () => void;
  exitPresentationMode: () => void;
  isPresentationMode: boolean;
}
