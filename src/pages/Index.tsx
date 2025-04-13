import React from 'react';
import { ContentDisplay } from '@/components/ContentCreator/ContentDisplay';
import { ContentProvider } from '@/context/ContentContext';
import { useParams } from 'react-router-dom';

const Index = () => {
  const { id } = useParams();
  const isNewPresentation = !id;

  return (
    <ContentProvider>
      <div className="h-screen flex flex-col bg-background">
        <ContentDisplay 
          presentationId={id} 
          isNewPresentation={isNewPresentation}
        />
      </div>
    </ContentProvider>
  );
};

export default Index;
