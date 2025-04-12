
import React from 'react';
import { useContent } from '@/context/ContentContext';
import { Content } from '@/types/content';
import { TextDisplay } from './ContentDisplays/TextDisplay';
import { TitleDisplay } from './ContentDisplays/TitleDisplay';
import { TableDisplay } from './ContentDisplays/TableDisplay';
import { ButtonDisplay } from './ContentDisplays/ButtonDisplay';
import { CardDisplay } from './ContentDisplays/CardDisplay';
import { GridDisplay } from './ContentDisplays/GridDisplay';
import { Edit, Trash, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ContentDisplay: React.FC = () => {
  const { contents, deleteContent, reorderContent, editMode } = useContent();

  const renderContent = (content: Content) => {
    switch (content.type) {
      case 'text':
        return <TextDisplay content={content} />;
      case 'title':
        return <TitleDisplay content={content} />;
      case 'table':
        return <TableDisplay content={content} />;
      case 'button':
        return <ButtonDisplay content={content} />;
      case 'card':
        return <CardDisplay content={content} />;
      case 'grid':
        return <GridDisplay content={content} />;
      default:
        return null;
    }
  };

  const handleMoveUp = (id: string, currentOrder: number) => {
    if (currentOrder > 0) {
      reorderContent(id, currentOrder - 1);
    }
  };

  const handleMoveDown = (id: string, currentOrder: number) => {
    if (currentOrder < contents.length - 1) {
      reorderContent(id, currentOrder + 1);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {contents.map((content) => (
        <div key={content.id} className="relative group">
          {editMode && (
            <div className="absolute -right-2 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleMoveUp(content.id, content.order)}
                disabled={content.order === 0}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleMoveDown(content.id, content.order)}
                disabled={content.order === contents.length - 1}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-gray-600 hover:bg-gray-700"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full"
                onClick={() => deleteContent(content.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className={`${editMode ? 'border border-dashed border-gray-700 rounded-lg p-4 transition-all hover:border-blue-500' : ''}`}>
            {renderContent(content)}
          </div>
        </div>
      ))}
      {contents.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>Még nincs tartalom. Használja a "Új tartalom" gombot a header-ben.</p>
        </div>
      )}
    </div>
  );
};
