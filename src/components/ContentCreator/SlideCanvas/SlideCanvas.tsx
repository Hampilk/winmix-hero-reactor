
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SlideContent } from './SlideContent';
import { useContent } from '@/context/ContentContext';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SlideElement } from '@/types/slides';

// Grid snap size in pixels
const GRID_SIZE = 8;

// Snap point to grid
const snapToGrid = (point: { x: number, y: number }): { x: number, y: number } => {
  return {
    x: Math.round(point.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(point.y / GRID_SIZE) * GRID_SIZE
  };
};

export const SlideCanvas: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const { currentSlide, updateSlide, isPresentationMode } = useContent();
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  
  // Use the PointerSensor to handle drag operations
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px of movement required before activating
      },
    })
  );
  
  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 10, 200));
  };
  
  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!currentSlide || !active.data.current) return;

    const elementId = active.id as string;
    const element = currentSlide.elements?.find(el => el.id === elementId);
    
    if (!element) return;

    // Calculate new position, considering current position and delta
    const currentX = element.position?.x || 0;
    const currentY = element.position?.y || 0;
    
    const newPosition = snapToGrid({
      x: currentX + delta.x,
      y: currentY + delta.y
    });

    // Create updated element
    const updatedElement: SlideElement = {
      ...element,
      position: newPosition
    };

    // Update the slide with the new element position
    updateSlide(currentSlide.id, {
      elements: currentSlide.elements?.map(el =>
        el.id === elementId ? updatedElement : el
      )
    });
  };
  
  const handleElementSelect = (elementId: string) => {
    setSelectedElementId(elementId);
  };

  const handleElementUpdate = (elementId: string, updates: Partial<SlideElement>) => {
    if (!currentSlide) return;

    updateSlide(currentSlide.id, {
      elements: currentSlide.elements?.map(el =>
        el.id === elementId ? { ...el, ...updates } : el
      )
    });
  };

  const handleCanvasClick = () => {
    // Deselect when clicking on the canvas
    setSelectedElementId(null);
  };
  
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 relative overflow-auto">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div 
            className={`relative transition-all duration-200 ${
              isPresentationMode ? 'scale-100' : ''
            }`}
            style={{ transform: isPresentationMode ? 'none' : `scale(${zoom / 100})` }}
            onClick={handleCanvasClick}
          >
            <SlideContent
              selectedElementId={selectedElementId}
              onElementSelect={handleElementSelect}
              onElementUpdate={handleElementUpdate}
            />
          </div>
        </div>
      </DndContext>
      
      {!isPresentationMode && (
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
      )}
    </div>
  );
};
