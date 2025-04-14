import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image,
  Table,
  Shapes,
  TextSelect,
  LineChart,
  Palette,
  Layout,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ToolbarButtonConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  isActive?: boolean; // Indicates whether the button is active or not
}

interface EditorToolbarProps {
  editorState: { [key: string]: boolean }; // Example editor state to track active buttons
  onAction: (actionType: string) => void; // Generic action handler for button clicks
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editorState, onAction }) => {
  const buttons: ToolbarButtonConfig[] = [
    { id: 'layout', label: 'Layout', icon: Layout, onClick: () => onAction('layout') },
    { id: 'theme', label: 'Theme', icon: Palette, onClick: () => onAction('theme') },
    { id: 'text', label: 'Text', icon: TextSelect, onClick: () => onAction('text') },
    { id: 'image', label: 'Image', icon: Image, onClick: () => onAction('image') },
    { id: 'shape', label: 'Shape', icon: Shapes, onClick: () => onAction('shape') },
    { id: 'table', label: 'Table', icon: Table, onClick: () => onAction('table') },
    { id: 'chart', label: 'Chart', icon: LineChart, onClick: () => onAction('chart') },
    { id: 'bold', label: 'Bold', icon: Bold, onClick: () => onAction('bold'), isActive: editorState.bold },
    { id: 'italic', label: 'Italic', icon: Italic, onClick: () => onAction('italic'), isActive: editorState.italic },
    { id: 'underline', label: 'Underline', icon: Underline, onClick: () => onAction('underline'), isActive: editorState.underline },
    { id: 'alignLeft', label: 'Align Left', icon: AlignLeft, onClick: () => onAction('alignLeft') },
    { id: 'alignCenter', label: 'Align Center', icon: AlignCenter, onClick: () => onAction('alignCenter') },
    { id: 'alignRight', label: 'Align Right', icon: AlignRight, onClick: () => onAction('alignRight') },
    { id: 'bulletList', label: 'Bullet List', icon: List, onClick: () => onAction('bulletList') },
    { id: 'numberedList', label: 'Numbered List', icon: ListOrdered, onClick: () => onAction('numberedList') },
  ];

  return (
    <div className="border-b bg-background/95 backdrop-blur flex items-center p-1 overflow-x-auto">
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center">
          {buttons.map((button, index) => (
            <React.Fragment key={button.id}>
              <ToolbarButton
                icon={<button.icon className="h-4 w-4" />}
                tooltip={button.label}
                onClick={button.onClick}
                isActive={button.isActive}
              />
              {/* Add separators between specific button groups */}
              {(index === 1 || index === 6 || index === 9 || index === 12) && (
                <Separator orientation="vertical" className="mx-1 h-6" />
              )}
            </React.Fragment>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
};

interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  isActive?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, tooltip, onClick, isActive }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-8 w-8 ${isActive ? 'bg-accent text-accent-foreground' : ''}`}
          onClick={onClick}
          aria-label={tooltip}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
