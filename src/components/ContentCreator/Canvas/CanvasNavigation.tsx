import React, { useState } from 'react';
import { useLayoutStore } from '@/store/layout';
import { Slider, IconButton, Tooltip } from '@mui/material';
import { ZoomIn, ZoomOut, Undo, Redo } from 'lucide-react';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 2.0;
const ZOOM_STEP = 0.1;

export const CanvasNavigation: React.FC = () => {
  const { zoomLevel, setZoom, undo, redo } = useLayoutStore();
  const [sliderValue, setSliderValue] = useState(zoomLevel);

  const handleZoomChange = (event: Event, value: number | number[]) => {
    const zoom = Array.isArray(value) ? value[0] : value;
    setSliderValue(zoom);
    setZoom(zoom);
  };

  return (
    <div className="flex space-x-4">
      <Tooltip title="Undo">
        <IconButton onClick={undo} aria-label="Undo">
          <Undo />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton onClick={redo} aria-label="Redo">
          <Redo />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton onClick={() => setZoom(Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM))} aria-label="Zoom Out">
          <ZoomOut />
        </IconButton>
      </Tooltip>
      <Slider
        value={sliderValue}
        onChange={handleZoomChange}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={ZOOM_STEP}
        aria-label="Zoom Level"
      />
      <Tooltip title="Zoom In">
        <IconButton onClick={() => setZoom(Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM))} aria-label="Zoom In">
          <ZoomIn />
        </IconButton>
      </Tooltip>
    </div>
  );
};
