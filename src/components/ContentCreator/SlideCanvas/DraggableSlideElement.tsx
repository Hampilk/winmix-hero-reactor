
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { SlideElement } from '@/types/slides';

interface DraggableSlideElementProps {
  element: SlideElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SlideElement>) => void;
}

export const DraggableSlideElement: React.FC<DraggableSlideElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
    data: {
      element
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    position: 'absolute',
    left: `${element.position?.x || 0}px`,
    top: `${element.position?.y || 0}px`,
    width: element.size?.width ? `${element.size.width}px` : 'auto',
    height: element.size?.height ? `${element.size.height}px` : 'auto',
    ...element.style
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setIsEditing(false);
    onUpdate(element.id, { content: e.target.textContent || '' });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-md shadow-sm p-4 cursor-move',
        isSelected && 'ring-2 ring-primary'
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      {...attributes}
      {...listeners}
    >
      <div
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        className="outline-none focus:outline-none"
      >
        {element.content}
      </div>
    </div>
  );
};
