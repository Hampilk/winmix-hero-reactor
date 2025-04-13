
import React from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SlideNavigation: React.FC = () => {
  return (
    <div className="border-t h-12 bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">Slide 1 of 3</span>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
};
