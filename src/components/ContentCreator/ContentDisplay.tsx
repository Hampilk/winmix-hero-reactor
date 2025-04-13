
import React from 'react';
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

export const ContentDisplay: React.FC = () => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Presentation saved",
      description: "Your changes have been saved successfully",
    });
  };

  return (
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
  );
};
