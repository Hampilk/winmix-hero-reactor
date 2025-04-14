import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ContentProvider } from '@/context/ContentContext';
import { getPresentationById, updatePresentation } from '@/utils/storage'; // Assuming these exist
import Header from '@/components/Header';
import { Drawer } from '@/components/ui/drawer';
import { ContentDisplay } from '@/components/ContentCreator/ContentDisplay';
import { ContentCreationDrawer } from '@/components/ContentCreator/ContentCreationDrawer';

const PresentationEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [presentation, setPresentation] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch presentation on mount
  useEffect(() => {
    if (!id) return;

    try {
      const fetchedPresentation = getPresentationById(id);
      if (!fetchedPresentation) {
        console.error('Presentation not found');
        return navigate('/');
      }
      setPresentation(fetchedPresentation);
    } catch (error) {
      console.error('Error loading presentation:', error);
      navigate('/');
    }
  }, [id, navigate]);

  // Save presentation with debounce
  const savePresentation = useCallback(
    (updatedPresentation: any) => {
      setIsSaving(true);
      try {
        updatePresentation(updatedPresentation);
        setPresentation(updatedPresentation);
      } catch (error) {
        console.error('Error saving presentation:', error);
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // Handle slide addition
  const addSlide = useCallback(() => {
    const newSlide = { id: `${Date.now()}`, content: 'New Slide' };
    const updatedPresentation = {
      ...presentation,
      slides: [...presentation.slides, newSlide],
    };
    savePresentation(updatedPresentation);
  }, [presentation, savePresentation]);

  // Handle slide deletion
  const deleteSlide = useCallback(
    (slideId: string) => {
      if (window.confirm('Are you sure you want to delete this slide?')) {
        const updatedSlides = presentation.slides.filter((slide: any) => slide.id !== slideId);
        const updatedPresentation = { ...presentation, slides: updatedSlides };
        savePresentation(updatedPresentation);
      }
    },
    [presentation, savePresentation]
  );

  if (!presentation) {
    return <div>Loading presentation...</div>;
  }

  return (
    <ContentProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300">
        <Drawer>
          <Header />
          <div className="container mx-auto px-4">
            <div className="py-4">
              <h1 className="text-3xl font-bold text-center text-white mb-2">
                {presentation.name}
              </h1>
              <p className="text-center text-gray-400 mb-6">Edit your presentation below</p>
            </div>
            <ContentDisplay slides={presentation.slides} />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={addSlide}
            >
              Add Slide
            </button>
            {isSaving && <div className="text-center mt-2 text-green-400">Saving...</div>}
          </div>
          <ContentCreationDrawer />
        </Drawer>
      </div>
    </ContentProvider>
  );
};

export default PresentationEditor;
