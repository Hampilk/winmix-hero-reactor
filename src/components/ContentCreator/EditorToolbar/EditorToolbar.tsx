
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
  Layout
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export const EditorToolbar: React.FC = () => {
  return (
    <div className="border-b bg-background/95 backdrop-blur flex items-center p-1 overflow-x-auto">
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center">
          <ToolbarButton icon={<Layout className="h-4 w-4" />} tooltip="Layout" />
          <ToolbarButton icon={<Palette className="h-4 w-4" />} tooltip="Theme" />
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <ToolbarButton icon={<TextSelect className="h-4 w-4" />} tooltip="Text" />
          <ToolbarButton icon={<Image className="h-4 w-4" />} tooltip="Image" />
          <ToolbarButton icon={<Shapes className="h-4 w-4" />} tooltip="Shape" />
          <ToolbarButton icon={<Table className="h-4 w-4" />} tooltip="Table" />
          <ToolbarButton icon={<LineChart className="h-4 w-4" />} tooltip="Chart" />
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <ToolbarButton icon={<Bold className="h-4 w-4" />} tooltip="Bold" />
          <ToolbarButton icon={<Italic className="h-4 w-4" />} tooltip="Italic" />
          <ToolbarButton icon={<Underline className="h-4 w-4" />} tooltip="Underline" />
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <ToolbarButton icon={<AlignLeft className="h-4 w-4" />} tooltip="Align Left" />
          <ToolbarButton icon={<AlignCenter className="h-4 w-4" />} tooltip="Align Center" />
          <ToolbarButton icon={<AlignRight className="h-4 w-4" />} tooltip="Align Right" />
          <Separator orientation="vertical" className="mx-1 h-6" />
          
          <ToolbarButton icon={<List className="h-4 w-4" />} tooltip="Bullet List" />
          <ToolbarButton icon={<ListOrdered className="h-4 w-4" />} tooltip="Numbered List" />
        </div>
      </TooltipProvider>
    </div>
  );
};

interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, tooltip, onClick }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClick}>
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
