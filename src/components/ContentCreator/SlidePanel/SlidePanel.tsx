
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, LayoutGrid, Grid2X2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SlideThumb } from './SlideThumb';
import { useContent } from '@/context/ContentContext';
import { Slide } from '@/types/slides';

export const SlidePanel: React.FC = () => {
  const { 
    slides, 
    currentSlideIndex, 
    setCurrentSlideIndex, 
    addSlide, 
    reorderSlide
  } = useContent();

  const handleAddSlide = () => {
    addSlide({
      id: `slide-${Date.now()}`,
      title: `Slide ${slides.length + 1}`,
      type: 'blank',
      elements: []
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('text/plain'));
    reorderSlide(sourceIndex, targetIndex);
  };

  return (
    <div className="flex flex-col h-full bg-sidebar p-3 text-sidebar-foreground">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-sm">Slides</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <Grid2X2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search slides"
          className="pl-8 h-9 bg-sidebar-accent text-sidebar-accent-foreground"
        />
      </div>
      
      <Button 
        className="mb-4 justify-start" 
        variant="default" 
        onClick={handleAddSlide}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Slide
      </Button>
      
      <div className="flex-1 overflow-auto space-y-2">
        {slides.map((slide: Slide, index: number) => (
          <div
            key={slide.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <SlideThumb
              slide={slide}
              index={index}
              isActive={index === currentSlideIndex}
              onClick={() => setCurrentSlideIndex(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
