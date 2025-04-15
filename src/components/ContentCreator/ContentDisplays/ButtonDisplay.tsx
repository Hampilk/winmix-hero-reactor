import React from 'react';
import { Button } from '@/components/ui/button';

interface ButtonDisplayProps {
  text: string;
  url?: string;
  variant?: 'default' | 'contained' | 'outlined'; // Example variants
  className?: string;
  onClick?: () => void;
}

export const ButtonDisplay: React.FC<ButtonDisplayProps> = ({
  text,
  url,
  variant = 'default',
  className = '',
  onClick,
}) => {
  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <Button
        variant={variant}
        href={url}
        component="a"
        target={url ? '_blank' : undefined}
        rel={url ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        aria-label={text}
        className={
          variant === 'default'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.5)]'
            : ''
        }
      >
        {text}
      </Button>
    </div>
  );
};
