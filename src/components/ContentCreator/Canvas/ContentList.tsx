
import React from 'react';
import { useContent } from '@/context/ContentContext';
import { ContentItem } from './ContentItem';

export const ContentList: React.FC = () => {
  const { currentSlideContents, editMode } = useContent();

  if (currentSlideContents.length === 0 && !editMode) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Még nincs tartalom.</p>
      </div>
    );
  }

  if (currentSlideContents.length === 0 && editMode) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Adj hozzá új tartalmat a vászonvezérlőkkel.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      {currentSlideContents.map((content) => (
        <ContentItem key={content.id} content={content} />
      ))}
    </div>
  );
};
