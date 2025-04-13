
export type SlideType = 'title' | 'content' | 'gallery' | 'blank' | 'text' | 'image';

export interface SlideElement {
  id: string;
  type: string;
  content?: string;
  position?: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  style?: Record<string, string>;
}

export interface Slide {
  id: string;
  title: string;
  subtitle?: string;
  type: SlideType;
  elements?: SlideElement[];
  background?: {
    color?: string;
    image?: string;
    gradient?: string;
  };
  notes?: string;
}

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  slides: Slide[];
  createdAt?: string;
  updatedAt?: string;
  theme?: string;
  settings?: Record<string, any>;
}
