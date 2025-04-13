
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Save, 
  Share2, 
  Play, 
  Download, 
  MoreVertical,
  ChevronLeft
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationHeaderProps {
  onSave: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ onSave }) => {
  return (
    <header className="bg-background border-b flex items-center justify-between p-2 h-14">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <h1 className="text-sm font-medium">Untitled Presentation</h1>
          <span className="text-xs text-muted-foreground">Last edited just now</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        
        <Button variant="default" size="sm">
          <Play className="h-4 w-4 mr-1" />
          Present
        </Button>
        
        <Button variant="ghost" size="icon">
          <Download className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Export to PPTX</DropdownMenuItem>
            <DropdownMenuItem>Export to PDF</DropdownMenuItem>
            <DropdownMenuItem>Print</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
