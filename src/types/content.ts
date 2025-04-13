
// @/types/content.ts

import { v4 as uuidv4 } from 'uuid';

// The union of all possible content types
export type ContentType = 'text' | 'title' | 'table' | 'button' | 'card' | 'grid' | 'image' | 'spacer';

// Base interface common to all content types
export interface BaseContent {
  id: string;            // Unique identifier for the content element
  type: ContentType;     // The specific type of content
  order: number;         // Position within the slide's content list (0-based index)

  // --- Optional Common Layout/Style Properties ---
  // These could be added for more granular control directly on the content item
  // width?: string;      // e.g., '100%', '300px'
  // height?: string;     // e.g., 'auto', '200px'
  // x?: number;          // Position (if using absolute positioning)
  // y?: number;          // Position (if using absolute positioning)
  // rotation?: number;   // Degrees
  // Custom CSS classes or styles could also go here
}

// --- Specific Content Type Interfaces ---

export interface TextContent extends BaseContent {
  type: 'text';
  content: string; // HTML or plain text content
}

export interface TitleContent extends BaseContent {
  type: 'title';
  content: string; // The text of the title
  level: 1 | 2 | 3 | 4 | 5 | 6; // Corresponds to h1-h6 heading levels
}

// --- Table Structures ---
export interface TableCell {
  id: string;      // Unique ID for the cell (e.g., for targeting specific cells later)
  content: string; // Content of the cell (can be simple text or potentially richer)
}

export interface TableRow {
  id: string;      // Unique ID for the row
  cells: TableCell[]; // Array of cells in this row
}

export interface TableContent extends BaseContent {
  type: 'table';
  headers: TableCell[]; // Defines the header row cells
  rows: TableRow[];     // Array of data rows
  caption?: string;     // Optional table caption
  hasHeader?: boolean;  // Explicitly state if headers should be visually distinct
}

// --- Button ---
export interface ButtonContent extends BaseContent {
  type: 'button';
  text: string;    // Text displayed on the button
  url: string;     // URL the button links to
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link'; // Styling variant
  target?: '_blank' | '_self'; // Link target attribute (default is usually _self)
}

// --- Card ---
export interface CardContent extends BaseContent {
  type: 'card';
  title?: string;       // Optional card title
  content: string;      // Main text content of the card
  imageUrl?: string;    // Optional image URL for the card header/media section
  footer?: string;      // Optional footer text
  linkUrl?: string;     // Optional URL the entire card links to
}

// --- Grid Structures ---
export interface GridItem {
  id: string;         // Unique ID for the grid item
  contentId?: string; // ID linking to a separate Content object (more flexible)
  content?: string;   // Simple text/HTML content for direct display
  
  // Grid positioning properties
  colStart?: number;   // Grid column start line (1-based)
  rowStart?: number;   // Grid row start line (1-based)
  colSpan?: number;    // How many columns the item spans (default: 1)
  rowSpan?: number;    // How many rows the item spans (default: 1)
}

export interface GridContent extends BaseContent {
  type: 'grid';
  columns: number;      // Number of columns in the grid template
  rows?: number;        // Optional: Define number of explicit rows (often inferred)
  gap?: number;         // Gap between grid items (in pixels or other CSS units)
  items: GridItem[];    // The items placed within the grid
}

// --- Image ---
export interface ImageContent extends BaseContent {
  type: 'image';
  src: string;          // Image source URL
  alt: string;          // Alt text for accessibility (required)
  caption?: string;     // Optional caption displayed below the image
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none'; // CSS object-fit property
}

// --- Spacer ---
export interface SpacerContent extends BaseContent {
  type: 'spacer';
  height: number; // Height of the spacer in pixels (could be string for other units e.g., '2rem')
}

// --- Discriminated Union ---
// This `Content` type represents any *one* of the specific content interfaces.
export type Content =
  | TextContent
  | TitleContent
  | TableContent
  | ButtonContent
  | CardContent
  | GridContent
  | ImageContent
  | SpacerContent;


// --- Helper Functions for Creating Default Content Structures ---
// Useful for initializing complex content like tables or grids when added.

/** Creates a default TableCell */
export const createDefaultTableCell = (content: string = ''): TableCell => ({
    id: uuidv4(),
    content,
});

/** Creates a default TableRow with a specified number of cells */
export const createDefaultTableRow = (cellCount: number = 3): TableRow => ({
    id: uuidv4(),
    cells: Array.from({ length: cellCount }, () => createDefaultTableCell()),
});

/** Creates a default GridItem */
export const createDefaultGridItem = (content: string = '', contentId?: string): GridItem => ({
    id: uuidv4(),
    content,
    contentId, // Link to actual content if needed
    colSpan: 1,
    rowSpan: 1,
});

/** Creates a default instance of a specific Content type */
export const createDefaultContent = (type: ContentType, order: number): Content => {
    const base: Omit<BaseContent, 'type' | 'order'> = { id: uuidv4() }; // Omit type/order as they are passed

    switch (type) {
        case 'text':
            return { ...base, type, order, content: 'New text block...' } as TextContent;
        case 'title':
            return { ...base, type, order, content: 'New Title', level: 2 } as TitleContent;
        case 'table':
            return {
                ...base, type, order, hasHeader: true,
                headers: [createDefaultTableCell('Header 1'), createDefaultTableCell('Header 2')],
                rows: [createDefaultTableRow(2)],
            } as TableContent;
        case 'button':
            return { ...base, type, order, text: 'Click Me', url: '#', variant: 'default' } as ButtonContent;
        case 'card':
            return { ...base, type, order, title: 'Card Title', content: 'Card content...' } as CardContent;
        case 'grid':
             // Example: Default 2x2 grid. Items would typically be added separately.
            return { ...base, type, order, columns: 2, rows: 2, gap: 8, items: [] } as GridContent;
        case 'image':
            return { ...base, type, order, src: '', alt: 'Placeholder image' } as ImageContent; // Requires user to set src
        case 'spacer':
            return { ...base, type, order, height: 20 } as SpacerContent;
        default:
             // Ensures any new ContentType added will cause a compile error here if not handled
            const exhaustiveCheck: never = type;
            throw new Error(`Unhandled default content type: ${exhaustiveCheck}`);
    }
};
