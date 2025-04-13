
import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { Content } from '@/types/content';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SlideContent: React.FC = () => {
  const { currentSlide } = useContent();
  const [activeElement, setActiveElement] = useState<string | null>(null);
  
  const handleElementClick = (id: string) => {
    setActiveElement(id);
  };
  
  const handleBlur = () => {
    setActiveElement(null);
  };
  
  if (!currentSlide) {
    return (
      <div className="w-[960px] h-[540px] bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden relative flex items-center justify-center">
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
  
  return (
    <div className="w-[960px] h-[540px] bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden relative">
      <div className="absolute inset-0 p-8 flex flex-col">
        <h1 
          contentEditable 
          suppressContentEditableWarning
          className={`text-4xl font-bold mb-4 outline-none ${
            activeElement === 'title' 
              ? 'border-primary' 
              : 'border-transparent'
          } border-2 rounded px-1`}
          onClick={() => handleElementClick('title')}
          onBlur={handleBlur}
        >
          {currentSlide.title || 'Build Awesome Presentations'}
        </h1>
        
        <p 
          contentEditable
          suppressContentEditableWarning
          className={`text-xl mb-8 outline-none ${
            activeElement === 'subtitle' 
              ? 'border-primary' 
              : 'border-transparent'
          } border-2 rounded px-1`}
          onClick={() => handleElementClick('subtitle')}
          onBlur={handleBlur}
        >
          {currentSlide.subtitle || 'A modern alternative to PowerPoint for 2025'}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mt-auto">
          {currentSlide.elements?.map((element, index) => (
            <div 
              key={element.id}
              className={`bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3 ${
                activeElement === element.id 
                  ? 'ring-2 ring-primary' 
                  : ''
              }`}
              onClick={() => handleElementClick(element.id)}
            >
              <div 
                className={`text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold ${
                  index === 0 ? 'bg-blue-500' : 'bg-green-500'
                }`}
              >
                {index + 1}
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                className="outline-none border-transparent focus:border-primary border-2 rounded px-1 flex-1"
                onBlur={handleBlur}
              >
                {element.content || (index === 0 ? 'Drag and Drop Interface' : 'Beautiful Modern Themes')}
              </div>
            </div>
          ))}
          
          {(!currentSlide.elements || currentSlide.elements.length === 0) && (
            <>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">1</div>
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  className={`outline-none ${
                    activeElement === 'element1' 
                      ? 'border-primary' 
                      : 'border-transparent'
                  } border-2 rounded px-1`}
                  onClick={() => handleElementClick('element1')}
                  onBlur={handleBlur}
                >
                  Drag and Drop Interface
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">2</div>
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  className={`outline-none ${
                    activeElement === 'element2' 
                      ? 'border-primary' 
                      : 'border-transparent'
                  } border-2 rounded px-1`}
                  onClick={() => handleElementClick('element2')}
                  onBlur={handleBlur}
                >
                  Beautiful Modern Themes
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
