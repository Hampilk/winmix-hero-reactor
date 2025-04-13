
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SlideContent } from './SlideContent';

export const SlideCanvas: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
  };
  
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 relative overflow-auto">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div 
          className="relative transition-all duration-200"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <SlideContent />
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-background border rounded-lg shadow-sm flex items-center">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-9 w-9">
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-5" />
        
        <span className="px-2 text-xs font-medium">{zoom}%</span>
        
        <Separator orientation="vertical" className="h-5" />
        
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-9 w-9">
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
