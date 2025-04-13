
import React, { useRef } from 'react';
import { CanvasNavigation } from './Canvas/CanvasNavigation';
import { ContentList } from './Canvas/ContentList';
import { CanvasControls } from '@/components/PreziCanvas/CanvasControls';

export const ContentDisplay: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddContent = () => {
    // The drawer is triggered from the CanvasControls
  };

  return (
    <>
      <CanvasNavigation canvasRef={canvasRef}>
        <ContentList />
      </CanvasNavigation>
      <CanvasControls onAddClick={handleAddContent} />
    </>
  );
};
