
import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext';
import { DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextForm } from './Forms/TextForm';
import { TitleForm } from './Forms/TitleForm';
import { TableForm } from './Forms/TableForm';
import { ButtonForm } from './Forms/ButtonForm';
import { CardForm } from './Forms/CardForm';
import { GridForm } from './Forms/GridForm';
import { FileText, Type, Table, Link as LinkIcon, LayoutGrid, CreditCard } from 'lucide-react';

export const ContentCreationDrawer = () => {
  const [activeTab, setActiveTab] = useState('text');
  const { addContent } = useContent();

  return (
    <DrawerContent className="bg-gray-900 border-t border-gray-800">
      <DrawerHeader>
        <DrawerTitle className="text-white">Új tartalom létrehozása</DrawerTitle>
      </DrawerHeader>
      <div className="px-4 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 bg-gray-800 mb-4">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Szöveg</span>
            </TabsTrigger>
            <TabsTrigger value="title" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              <span className="hidden sm:inline">Cím</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Táblázat</span>
            </TabsTrigger>
            <TabsTrigger value="button" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Gomb</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Kártya</span>
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Rács</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text">
            <TextForm onSubmit={(data) => addContent('text', data)} />
          </TabsContent>
          
          <TabsContent value="title">
            <TitleForm onSubmit={(data) => addContent('title', data)} />
          </TabsContent>
          
          <TabsContent value="table">
            <TableForm onSubmit={(data) => addContent('table', data)} />
          </TabsContent>
          
          <TabsContent value="button">
            <ButtonForm onSubmit={(data) => addContent('button', data)} />
          </TabsContent>
          
          <TabsContent value="card">
            <CardForm onSubmit={(data) => addContent('card', data)} />
          </TabsContent>
          
          <TabsContent value="grid">
            <GridForm onSubmit={(data) => addContent('grid', data)} />
          </TabsContent>
        </Tabs>
      </div>
    </DrawerContent>
  );
};
