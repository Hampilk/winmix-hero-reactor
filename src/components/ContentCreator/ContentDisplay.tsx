
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
    setFocusedContentId 
  } = useContent();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });

  // Handle canvas interaction
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Using wheel for zooming is handled through the zoomLevel state
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2 || e.button === 1) { // Right click or middle click
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
      // Prevent context menu when right-clicking for panning
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

  // Handle focused content
  useEffect(() => {
    if (focusedContentId && canvasRef.current) {
      // When focusing on a specific content, reset canvas offset
      setCanvasOffset({ x: 0, y: 0 });
    }
  }, [focusedContentId]);

  const renderContent = (content: Content) => {
    const isFocused = focusedContentId === content.id;
    
    // Wrap content in a clickable container
    const handleContentClick = () => {
      if (!editMode) {
        setFocusedContentId(content.id);
      }
    };
    
    const contentProps = {
      onClick: handleContentClick,
      className: `transition-all duration-300 ${isFocused ? 'ring-2 ring-blue-500' : ''}`
    };
    
    switch (content.type) {
      case 'text':
        return <TextDisplay content={content} additionalProps={contentProps} />;
      case 'title':
        return <TitleDisplay content={content} additionalProps={contentProps} />;
      case 'table':
        return <TableDisplay content={content} additionalProps={contentProps} />;
      case 'button':
        return <ButtonDisplay content={content} additionalProps={contentProps} />;
      case 'card':
        return <CardDisplay content={content} additionalProps={contentProps} />;
      case 'grid':
        return <GridDisplay content={content} additionalProps={contentProps} />;
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

  // Calculate the scale and transform styles based on zoom level and focused content
  let canvasStyle: React.CSSProperties = {
    transform: `scale(${zoomLevel}) translate(${canvasOffset.x / zoomLevel}px, ${canvasOffset.y / zoomLevel}px)`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };

  // If focusing on a specific content
  if (focusedContentId) {
    const focusedContent = contents.find(c => c.id === focusedContentId);
    if (focusedContent) {
      // Center the focused content
      canvasStyle = {
        ...canvasStyle,
        transformOrigin: 'center center',
      };
    }
  }

  // Handle opening the drawer for adding new content
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
                    <div className="absolute -right-2 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
                  <p>Még nincs tartalom. Használja a "Új tartalom" gombot.</p>
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
