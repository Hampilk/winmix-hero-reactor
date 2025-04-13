
import React from 'react';
import { ContentDisplay } from '@/components/ContentCreator/ContentDisplay';
import { ContentProvider } from '@/context/ContentContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useParams } from 'react-router-dom';

const PresentationEditor = () => {
  const { id } = useParams();
  const isNewPresentation = !id;

  return (
    <ThemeProvider>
      <ContentProvider>
        <div className="h-screen flex flex-col bg-background">
          <ContentDisplay 
            presentationId={id} 
            isNewPresentation={isNewPresentation}
          />
        </div>
      </ContentProvider>
    </ThemeProvider>
  );
};

export default PresentationEditor;
