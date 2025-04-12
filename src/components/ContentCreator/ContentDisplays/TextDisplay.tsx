
import React from 'react';
import { TextContent } from '@/types/content';

interface TextDisplayProps {
  content: TextContent;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ content }) => {
  return (
    <div className="prose prose-invert max-w-none">
      <p className="whitespace-pre-wrap">{content.content}</p>
    </div>
  );
};
