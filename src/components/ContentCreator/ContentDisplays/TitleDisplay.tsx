
import React from 'react';
import { TitleContent } from '@/types/content';

interface TitleDisplayProps {
  content: TitleContent;
  className?: string;
  onClick?: () => void;
}

export const TitleDisplay: React.FC<TitleDisplayProps> = ({ content, className = '', onClick }) => {
  const { level, content: titleText } = content;
  const baseClass = className || '';

  switch (level) {
    case 1:
      return <h1 onClick={onClick} className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300 ${baseClass}`}>{titleText}</h1>;
    case 2:
      return <h2 onClick={onClick} className={`text-3xl md:text-4xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 ${baseClass}`}>{titleText}</h2>;
    case 3:
      return <h3 onClick={onClick} className={`text-2xl md:text-3xl font-semibold text-white mb-3 ${baseClass}`}>{titleText}</h3>;
    case 4:
      return <h4 onClick={onClick} className={`text-xl md:text-2xl font-semibold text-white mb-2 ${baseClass}`}>{titleText}</h4>;
    case 5:
      return <h5 onClick={onClick} className={`text-lg md:text-xl font-medium text-white mb-2 ${baseClass}`}>{titleText}</h5>;
    case 6:
      return <h6 onClick={onClick} className={`text-md md:text-lg font-medium text-gray-200 mb-2 ${baseClass}`}>{titleText}</h6>;
    default:
      return <h2 onClick={onClick} className={`text-3xl font-bold text-white mb-3 ${baseClass}`}>{titleText}</h2>;
  }
};
