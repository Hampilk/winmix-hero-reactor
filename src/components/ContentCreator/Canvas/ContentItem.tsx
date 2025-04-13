
import React from 'react';
import { Content } from '@/types/content';
import { useContent } from '@/context/ContentContext';
import { TextDisplay } from '../ContentDisplays/TextDisplay';
import { TitleDisplay } from '../ContentDisplays/TitleDisplay';
import { TableDisplay } from '../ContentDisplays/TableDisplay';
import { ButtonDisplay } from '../ContentDisplays/ButtonDisplay';
import { CardDisplay } from '../ContentDisplays/CardDisplay';
import { GridDisplay } from '../ContentDisplays/GridDisplay';
import { Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentItemProps {
  content: Content;
}

export const ContentItem: React.FC<ContentItemProps> = ({ content }) => {
  const { deleteContent, reorderContent, editMode, setFocusedContentId, focusedContentId, currentSlideContents } = useContent();
  const isFocused = focusedContentId === content.id;

  const handleMoveUp = (id: string, currentOrder: number) => {
    if (currentOrder > 0) {
      reorderContent(id, currentOrder - 1);
    }
  };

  const handleMoveDown = (id: string, currentOrder: number) => {
    if (currentOrder < currentSlideContents.length - 1) {
      reorderContent(id, currentOrder + 1);
    }
  };

  const handleEdit = (contentId: string) => {
    console.log("Edit button clicked for content ID:", contentId);
  };

  const handleClick = () => {
    if (!editMode) {
      setFocusedContentId(content.id);
    }
  };

  const commonProps = {
    onClick: handleClick,
    className: `transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500 rounded-lg' : ''} ${editMode ? 'cursor-default' : 'cursor-pointer'}`
  };

  const renderContent = () => {
    switch (content.type) {
      case 'text':
        return <TextDisplay content={content} {...commonProps} />;
      case 'title':
        return <TitleDisplay content={content} {...commonProps} />;
      case 'table':
        return <TableDisplay content={content} {...commonProps} />;
      case 'button':
        return <ButtonDisplay content={content} {...commonProps} />;
      case 'card':
        return <CardDisplay content={content} {...commonProps} />;
      case 'grid':
        return <GridDisplay content={content} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative group">
      {editMode && (
        <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 bg-background/80 rounded-md shadow-lg border">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => handleMoveUp(content.id, content.order)}
            disabled={content.order === 0}
            title="Move Up"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => handleMoveDown(content.id, content.order)}
            disabled={content.order === currentSlideContents.length - 1}
            title="Move Down"
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-blue-500 hover:text-blue-700"
            onClick={() => handleEdit(content.id)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-red-500 hover:text-red-700"
            onClick={() => deleteContent(content.id)}
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className={`${editMode ? 'border border-dashed border-transparent rounded-lg p-1 transition-all group-hover:border-blue-500' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};
