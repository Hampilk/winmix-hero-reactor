
import React from 'react';
import { ButtonContent } from '@/types/content';
import { Button } from '@/components/ui/button';

interface ButtonDisplayProps {
  content: ButtonContent;
}

export const ButtonDisplay: React.FC<ButtonDisplayProps> = ({ content }) => {
  const { text, url, variant = 'default' } = content;

  return (
    <div className="flex justify-center my-4">
      <Button
        variant={variant}
        asChild
        className={
          variant === 'default' 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.5)]' 
            : ''
        }
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      </Button>
    </div>
  );
};
