
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, LayoutGrid, Grid2X2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { SlideThumb } from './SlideThumb';

export const SlidePanel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([
    { id: 1, title: 'Title Slide', type: 'title' },
    { id: 2, title: 'Content Slide', type: 'content' },
    { id: 3, title: 'Image Gallery', type: 'gallery' },
  ]);

  const addNewSlide = () => {
    const newSlide = {
      id: slides.length + 1,
      title: `Slide ${slides.length + 1}`,
      type: 'blank'
    };
    setSlides([...slides, newSlide]);
    setCurrentSlide(slides.length);
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
        onClick={addNewSlide}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Slide
      </Button>
      
      <div className="flex-1 overflow-auto space-y-2">
        {slides.map((slide, index) => (
          <SlideThumb
            key={slide.id}
            slide={slide}
            index={index}
            isActive={index === currentSlide}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};
