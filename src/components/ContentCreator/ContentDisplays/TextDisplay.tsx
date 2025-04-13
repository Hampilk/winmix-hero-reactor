
import React from 'react';
import { TextContent } from '@/types/content';

interface TextDisplayProps {
  content: TextContent;
  className?: string;
  onClick?: () => void;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ content, className = '', onClick }) => {
  return (
    <div className={`prose prose-invert max-w-none ${className}`} onClick={onClick}>
      <p className="whitespace-pre-wrap">{content.content}</p>
    </div>
  );
};
