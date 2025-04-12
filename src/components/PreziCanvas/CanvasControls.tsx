
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  Home, 
  Hand, 
  MousePointer, 
  Plus, 
  Edit, 
  Save, 
  Trash, 
  MoveVertical 
} from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { DrawerTrigger } from '@/components/ui/drawer';

interface CanvasControlsProps {
  onAddClick: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({ onAddClick }) => {
  const { 
    zoomLevel, 
    setZoomLevel, 
    editMode, 
    setEditMode, 
    setFocusedContentId 
  } = useContent();

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setFocusedContentId(null);
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-gray-800/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
      <div className="flex items-center space-x-1">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
          onClick={() => setEditMode(!editMode)}
          title={editMode ? "Előnézet mód" : "Szerkesztés mód"}
        >
          {editMode ? <MousePointer size={16} /> : <Edit size={16} />}
        </Button>

        <span className="h-6 w-px bg-gray-600" />

        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
          onClick={handleZoomOut}
          title="Kicsinyítés"
        >
          <ZoomOut size={16} />
        </Button>
        
        <div className="bg-gray-700 rounded-full px-2 py-0.5 text-xs text-white font-mono">
          {Math.round(zoomLevel * 100)}%
        </div>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
          onClick={handleZoomIn}
          title="Nagyítás"
        >
          <ZoomIn size={16} />
        </Button>

        <span className="h-6 w-px bg-gray-600" />

        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
          onClick={handleResetZoom}
          title="Vissza az áttekintéshez"
        >
          <Home size={16} />
        </Button>
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
          title="Mozgatás"
        >
          <Hand size={16} />
        </Button>

        {editMode && (
          <>
            <span className="h-6 w-px bg-gray-600" />
            
            <DrawerTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
                onClick={onAddClick}
                title="Új tartalom"
              >
                <Plus size={16} />
              </Button>
            </DrawerTrigger>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
              title="Mentés"
            >
              <Save size={16} />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
              title="Törlés"
            >
              <Trash size={16} />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-white hover:bg-gray-700 rounded-full"
              title="Rendezés"
            >
              <MoveVertical size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
