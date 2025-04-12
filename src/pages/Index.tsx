
import React from 'react';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import { ContentProvider } from '@/context/ContentContext';
import { ContentDisplay } from '@/components/ContentCreator/ContentDisplay';
import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import { ContentCreationDrawer } from '@/components/ContentCreator/ContentCreationDrawer';

const Index = () => {
  return (
    <ContentProvider>
      <div className="min-h-screen bg-black text-gray-300">
        <Drawer>
          <Header />
          <HeroCarousel />
          <ContentDisplay />
          <ContentCreationDrawer />
        </Drawer>
      </div>
    </ContentProvider>
  );
};

export default Index;
