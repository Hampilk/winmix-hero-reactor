
import React, { useEffect } from 'react';
import { 
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { SlideNavigation } from './SlideNavigation/SlideNavigation';
import { SlideCanvas } from './SlideCanvas/SlideCanvas';
import { EditorToolbar } from './EditorToolbar/EditorToolbar';
import { SlidePanel } from './SlidePanel/SlidePanel';
import { NavigationHeader } from './NavigationHeader/NavigationHeader';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/context/ContentContext';
import { ThemeProvider } from '@/context/ThemeContext';

interface ContentDisplayProps {
  presentationId?: string;
  isNewPresentation?: boolean;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ 
  presentationId,
  isNewPresentation = false
}) => {
  const { toast } = useToast();
  const { setCurrentPresentation } = useContent();
  
  useEffect(() => {
    if (presentationId) {
      // In a real app, this would fetch the presentation data from the API
      console.log(`Loading presentation with ID: ${presentationId}`);
      // Mock loading a presentation
      setCurrentPresentation({
        id: presentationId,
        title: `Presentation ${presentationId}`,
        slides: []
      });
    } else if (isNewPresentation) {
      // Create a new presentation
      console.log('Creating new presentation');
      setCurrentPresentation({
        id: 'new',
        title: 'Untitled Presentation',
        slides: []
      });
    }
  }, [presentationId, isNewPresentation, setCurrentPresentation]);

  const handleSave = () => {
    toast({
      title: "Presentation saved",
      description: "Your changes have been saved successfully",
    });
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen">
        <NavigationHeader onSave={handleSave} />
        
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <SlidePanel />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={80}>
              <div className="flex flex-col h-full">
                <EditorToolbar />
                <SlideCanvas />
                <SlideNavigation />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ThemeProvider>
  );
};
