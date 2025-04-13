
import React from 'react';
import { ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useContent } from '@/context/ContentContext';

export const SlideNavigation: React.FC = () => {
  const { 
    slides, 
    currentSlideIndex, 
    setCurrentSlideIndex,
    enterPresentationMode
  } = useContent();

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleFullscreen = () => {
    if (enterPresentationMode) {
      enterPresentationMode();
    }
  };

  return (
    <div className="border-t h-12 bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handlePrevSlide}
          disabled={currentSlideIndex <= 0 || slides.length === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          {slides.length > 0 
            ? `Slide ${currentSlideIndex + 1} of ${slides.length}` 
            : "No slides"
          }
        </span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={handleNextSlide}
          disabled={currentSlideIndex >= slides.length - 1 || slides.length === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={handleFullscreen}
        disabled={slides.length === 0}
      >
        <Maximize className="h-4 w-4" />
      </Button>
    </div>
  );
};
