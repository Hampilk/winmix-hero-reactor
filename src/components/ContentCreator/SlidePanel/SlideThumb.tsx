
import React from 'react';
import { cn } from '@/lib/utils';

interface SlideThumbProps {
  slide: {
    id: number;
    title: string;
    type: string;
  };
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export const SlideThumb: React.FC<SlideThumbProps> = ({
  slide,
  index,
  isActive,
  onClick
}) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors",
        isActive && "bg-sidebar-accent"
      )}
      onClick={onClick}
    >
      <div className="w-6 text-xs font-medium text-muted-foreground">{index + 1}</div>
      <div 
        className={cn(
          "w-24 h-16 rounded border border-border bg-background flex items-center justify-center text-xs overflow-hidden",
          isActive && "ring-2 ring-primary"
        )}
      >
        {slide.type === 'title' && (
          <div className="flex flex-col items-center p-1">
            <div className="w-12 h-1.5 bg-foreground/30 rounded mb-1"></div>
            <div className="w-16 h-0.5 bg-foreground/20 rounded mb-1"></div>
            <div className="w-14 h-0.5 bg-foreground/20 rounded"></div>
          </div>
        )}
        
        {slide.type === 'content' && (
          <div className="flex flex-col items-center p-1">
            <div className="w-16 h-1 bg-foreground/30 rounded mb-1"></div>
            <div className="w-12 h-0.5 bg-foreground/20 rounded mb-1"></div>
            <div className="w-14 h-3 bg-foreground/10 rounded"></div>
          </div>
        )}
        
        {slide.type === 'gallery' && (
          <div className="grid grid-cols-2 gap-0.5 p-1">
            <div className="w-7 h-5 bg-foreground/10 rounded"></div>
            <div className="w-7 h-5 bg-foreground/10 rounded"></div>
            <div className="w-7 h-5 bg-foreground/10 rounded"></div>
            <div className="w-7 h-5 bg-foreground/10 rounded"></div>
          </div>
        )}
        
        {slide.type === 'blank' && (
          <div className="text-foreground/30">Blank</div>
        )}
      </div>
      <div className="flex-1 truncate text-xs">{slide.title}</div>
    </div>
  );
};
