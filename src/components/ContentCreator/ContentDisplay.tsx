import React, { useRef, useState, useEffect } from 'react';
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
import { CanvasControls } from '@/components/PreziCanvas/CanvasControls';

export const ContentDisplay: React.FC = () => {
  const {
    contents,
    deleteContent,
    reorderContent,
    editMode,
    zoomLevel,
    focusedContentId,
    setFocusedContentId,
  } = useContent();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 1) {
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;
        setCanvasOffset(prev => ({
          x: prev.x + dx,
          y: prev.y + dy
        }));
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (focusedContentId && canvasRef.current) {
      setCanvasOffset({ x: 0, y: 0 });
    }
  }, [focusedContentId]);

  const renderContent = (content: Content) => {
    const isFocused = focusedContentId === content.id;

    const commonProps = {
      onClick: () => {
        if (!editMode) {
          setFocusedContentId(content.id);
        }
      },
      className: `transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500 rounded-lg' : ''} ${editMode ? 'cursor-default' : 'cursor-pointer'}`
    };

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
        const exhaustiveCheck: never = content;
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

  const handleEdit = (contentId: string) => {
    console.log("Edit button clicked for content ID:", contentId);
  };

  let canvasStyle: React.CSSProperties = {
    transform: `scale(${zoomLevel}) translate(${canvasOffset.x / zoomLevel}px, ${canvasOffset.y / zoomLevel}px)`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };

  if (focusedContentId) {
    const focusedContent = contents.find(c => c.id === focusedContentId);
    if (focusedContent) {
      canvasStyle = {
        transform: `scale(${zoomLevel}) translate(${canvasOffset.x / zoomLevel}px, ${canvasOffset.y / zoomLevel}px)`,
        transformOrigin: 'center center',
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      };
    }
  }

  const handleAddContent = () => {
    // The drawer is triggered from the CanvasControls
  };

  return (
    <>
      <div
        className="relative w-full h-[calc(100vh-200px)] overflow-hidden bg-gray-100 dark:bg-gray-900"
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        <div
          ref={canvasRef}
          className="absolute w-full h-full"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform"
            style={canvasStyle}
          >
            <div className="p-4 space-y-6 max-w-4xl mx-auto">
              {contents.map((content) => (
                <div key={content.id} className="relative group">
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
                        disabled={content.order === contents.length - 1}
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
                    {renderContent(content)}
                  </div>
                </div>
              ))}
              {contents.length === 0 && !editMode && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>Még nincs tartalom.</p>
                </div>
              )}
              {contents.length === 0 && editMode && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>Adj hozzá új tartalmat a vászonvezérlőkkel.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CanvasControls onAddClick={handleAddContent} />
    </>
  );
};
