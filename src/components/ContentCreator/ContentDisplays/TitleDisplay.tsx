
import React from 'react';
import { TitleContent } from '@/types/content';

interface TitleDisplayProps {
  content: TitleContent;
}

export const TitleDisplay: React.FC<TitleDisplayProps> = ({ content }) => {
  const { level, content: titleText } = content;

  switch (level) {
    case 1:
      return <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">{titleText}</h1>;
    case 2:
      return <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">{titleText}</h2>;
    case 3:
      return <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">{titleText}</h3>;
    case 4:
      return <h4 className="text-xl md:text-2xl font-semibold text-white mb-2">{titleText}</h4>;
    case 5:
      return <h5 className="text-lg md:text-xl font-medium text-white mb-2">{titleText}</h5>;
    case 6:
      return <h6 className="text-md md:text-lg font-medium text-gray-200 mb-2">{titleText}</h6>;
    default:
      return <h2 className="text-3xl font-bold text-white mb-3">{titleText}</h2>;
  }
};
