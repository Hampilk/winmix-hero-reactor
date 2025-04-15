import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentDisplay } from '@/components/ContentCreator/ContentDisplay';
import { ContentProvider } from '@/context/ContentContext';
import { getAllPresentations, savePresentation } from '@/utils/storage'; // Assuming these exist
import { debounce } from 'lodash';

const Index: React.FC = () => {
  const [presentationList, setPresentationList] = useState<any[] | null>(null);
  const [filter, setFilter] = useState<string>('');
  const navigate = useNavigate();

  // Fetch presentations on mount
  useEffect(() => {
    try {
      const presentations = getAllPresentations();
      setPresentationList(presentations);
    } catch (error) {
      console.error('Error loading presentations:', error);
      setPresentationList([]);
    }
  }, []);

  // Create new presentation
  const createNewPresentation = useCallback(() => {
    const newPresentation = {
      id: `${Date.now()}`,
      name: 'Untitled Presentation',
      slides: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      savePresentation(newPresentation);
      setPresentationList((prev) => (prev ? [...prev, newPresentation] : [newPresentation]));
      navigate(`/presentation/${newPresentation.id}`);
    } catch (error) {
      console.error('Error creating a new presentation:', error);
    }
  }, [navigate]);

  // Filter presentations
  const handleFilterChange = useCallback(
    debounce((value: string) => setFilter(value), 300),
    []
  );

  const filteredPresentations = presentationList
    ? presentationList.filter((presentation) =>
        presentation.name.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  // Dynamic page title
  useEffect(() => {
    document.title = 'Presentations Dashboard';
  }, []);

  // UI
  if (presentationList === null) {
    return <div>Loading presentations...</div>;
  }

  return (
    <ContentProvider>
      <div className="h-screen flex flex-col bg-background">
        <div className="flex justify-between p-4">
          <input
            type="text"
            placeholder="Search presentations..."
            className="border p-2 rounded w-1/3"
            onChange={(e) => handleFilterChange(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={createNewPresentation}
          >
            New Presentation
          </button>
        </div>
        {filteredPresentations.length === 0 ? (
          <div className="text-center mt-4">No presentations found. Create a new one!</div>
        ) : (
          <ul className="p-4">
            {filteredPresentations.map((presentation) => (
              <li
                key={presentation.id}
                className="p-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/presentation/${presentation.id}`)}
              >
                <div className="text-lg font-semibold">{presentation.name}</div>
                <div className="text-sm text-gray-600">
                  Last updated: {new Date(presentation.updatedAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ContentProvider>
  );
};

export default Index;
