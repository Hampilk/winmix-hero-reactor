
export type ContentType = 'text' | 'title' | 'table' | 'button' | 'card' | 'grid';

export interface BaseContent {
  id: string;
  type: ContentType;
  order: number;
}

export interface TextContent extends BaseContent {
  type: 'text';
  content: string;
}

export interface TitleContent extends BaseContent {
  type: 'title';
  content: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface TableCell {
  id: string;
  content: string;
}

export interface TableRow {
  id: string;
  cells: TableCell[];
}

export interface TableContent extends BaseContent {
  type: 'table';
  headers: TableCell[];
  rows: TableRow[];
}

export interface ButtonContent extends BaseContent {
  type: 'button';
  text: string;
  url: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export interface CardContent extends BaseContent {
  type: 'card';
  title: string;
  content: string;
  imageUrl?: string;
}

export interface GridItem {
  id: string;
  content: string;
  colStart?: number;
  rowStart?: number;
}

export interface GridContent extends BaseContent {
  type: 'grid';
  columns: number;
  rows: number;
  items: GridItem[];
}

export type Content = TextContent | TitleContent | TableContent | ButtonContent | CardContent | GridContent;
