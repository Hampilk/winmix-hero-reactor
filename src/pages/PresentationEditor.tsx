
import React, { useState } from 'react';
import { ContentProvider } from '@/context/ContentContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Save, Share, PlayCircle, Download, Search,
  Plus, Grid, Layout, Image, ChevronLeft, ChevronRight, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, 
  AlignRight, List, ListOrdered, Maximize2 
} from 'lucide-react';

const PresentationEditor = () => {
  const { id } = useParams();
  const isNewPresentation = !id;
  const [presentationTitle, setPresentationTitle] = useState("Untitled Presentation");
  const [zoom, setZoom] = useState(90);

  return (
    <ContentProvider>
      <ThemeProvider>
        <div className="h-screen flex flex-col bg-background overflow-hidden">
          {/* Header */}
          <header className="h-12 bg-black flex items-center justify-between px-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium text-white">{presentationTitle}</h1>
              <span className="text-xs text-gray-400">Last edited just now</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
                <Save className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
                <Share className="h-5 w-5" />
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlayCircle className="mr-2 h-4 w-4" />
                Present
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400">
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* Slide Panel */}
            <div className="w-[300px] bg-[#0f0f0f] border-r border-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-white mb-2">Slides</h2>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search slides" 
                    className="pl-8 bg-gray-900 border-gray-700 text-gray-300"
                  />
                </div>
              </div>
              
              <div className="p-2 flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {/* Slides will be listed here */}
                  <div className="flex justify-center items-center p-12 text-gray-500">
                    No slides yet
                  </div>
                </div>
              </div>
              
              <div className="p-2 border-t border-gray-800">
                <Button className="w-full justify-center bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slide
                </Button>
              </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
              {/* Toolbar */}
              <div className="h-10 bg-[#0f0f0f] border-b border-gray-800 flex items-center px-2 gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Layout className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Image className="h-4 w-4" />
                </Button>
                <div className="h-5 border-r border-gray-700 mx-1"></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="h-5 border-r border-gray-700 mx-1"></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <AlignRight className="h-4 w-4" />
                </Button>
                <div className="h-5 border-r border-gray-700 mx-1"></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </div>

              {/* Canvas */}
              <div className="flex-1 bg-[#0a0a16] flex items-center justify-center">
                <div className="w-[960px] h-[540px] bg-white rounded-sm shadow-xl flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <p>No slide selected</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Add Content
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="h-10 bg-[#0f0f0f] border-t border-gray-800 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-gray-400">No slides</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{zoom}%</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </ContentProvider>
  );
};

export default PresentationEditor;
