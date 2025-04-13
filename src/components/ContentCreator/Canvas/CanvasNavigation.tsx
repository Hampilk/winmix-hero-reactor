
import React, { useState, useRef, useEffect } from 'react';
import { useContent } from '@/context/ContentContext';

interface CanvasNavigationProps {
  children: React.ReactNode;
  canvasRef: React.RefObject<HTMLDivElement>;
}

export const CanvasNavigation: React.FC<CanvasNavigationProps> = ({ children, canvasRef }) => {
  const { zoomLevel, focusedContentId } = useContent();
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
  }, [isDragging, dragStart, canvasRef]);

  useEffect(() => {
    if (focusedContentId && canvasRef.current) {
      setCanvasOffset({ x: 0, y: 0 });
    }
  }, [focusedContentId, canvasRef]);

  const canvasStyle: React.CSSProperties = {
    transform: `scale(${zoomLevel}) translate(${canvasOffset.x / zoomLevel}px, ${canvasOffset.y / zoomLevel}px)`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
  };

  return (
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
          {children}
        </div>
      </div>
    </div>
  );
};
