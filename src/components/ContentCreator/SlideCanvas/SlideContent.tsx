
import React from 'react';
import { useContent } from '@/context/ContentContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SlideElement } from '@/types/slides';
import { DraggableSlideElement } from './DraggableSlideElement';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@/context/ThemeContext';

interface SlideContentProps {
  selectedElementId: string | null;
  onElementSelect: (id: string) => void;
  onElementUpdate: (id: string, updates: Partial<SlideElement>) => void;
}

export const SlideContent: React.FC<SlideContentProps> = ({
  selectedElementId,
  onElementSelect,
  onElementUpdate
}) => {
  const { currentSlide, updateSlide } = useContent();
  const { currentTheme } = useTheme();
  
  const handleAddElement = () => {
    if (!currentSlide) return;
    
    const newElement: SlideElement = {
      id: uuidv4(),
      type: 'text',
      content: 'Click to edit this text',
      position: { x: 200, y: 200 },
      size: { width: 300, height: 100 }
    };
    
    updateSlide(currentSlide.id, {
      elements: [...(currentSlide.elements || []), newElement]
    });
  };
  
  if (!currentSlide) {
    return (
      <div 
        className="w-[960px] h-[540px] bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden relative flex items-center justify-center"
        style={{ 
          backgroundColor: currentTheme.colors.background.value,
          color: currentTheme.colors.text.value 
        }}
      >
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No slide selected</p>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Content
          </Button>
        </div>
      </div>
    );
  }
  
  // Set background based on slide background or current theme
  const bgColor = currentSlide.background?.color || currentTheme.colors.background.value;
  const bgImage = currentSlide.background?.image || '';
  const bgGradient = currentSlide.background?.gradient || '';
  
  const slideStyle = {
    backgroundColor: bgColor,
    backgroundImage: bgImage ? `url(${bgImage})` : bgGradient,
    color: currentTheme.colors.text.value,
    fontFamily: currentTheme.typography.fontFamily
  };
  
  return (
    <div 
      className="w-[960px] h-[540px] bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden relative"
      style={slideStyle}
    >
      <div className="absolute inset-0 p-8">
        <h1 
          contentEditable 
          suppressContentEditableWarning
          className="text-4xl font-bold mb-4 outline-none border-transparent border-2 rounded px-1 focus:border-primary"
          style={{ fontFamily: currentTheme.typography.titleFontFamily || currentTheme.typography.fontFamily }}
          onBlur={(e) => updateSlide(currentSlide.id, { title: e.currentTarget.textContent || '' })}
        >
          {currentSlide.title || 'Untitled Slide'}
        </h1>
        
        <p 
          contentEditable
          suppressContentEditableWarning
          className="text-xl mb-8 outline-none border-transparent border-2 rounded px-1 focus:border-primary"
          onBlur={(e) => updateSlide(currentSlide.id, { subtitle: e.currentTarget.textContent || '' })}
        >
          {currentSlide.subtitle || 'Add a subtitle'}
        </p>
        
        {/* Render draggable elements */}
        {currentSlide.elements?.map((element) => (
          <DraggableSlideElement 
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onSelect={onElementSelect}
            onUpdate={onElementUpdate}
          />
        ))}
      </div>
      
      {/* Add element button */}
      <Button 
        className="absolute bottom-4 right-4"
        onClick={handleAddElement}
        variant="outline"
        size="sm"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Element
      </Button>
    </div>
  );
};
