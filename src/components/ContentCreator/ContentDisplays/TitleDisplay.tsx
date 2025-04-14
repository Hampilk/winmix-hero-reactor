import React from 'react';
import { Typography } from '@mui/material';

interface TitleDisplayProps {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const levelToVariant: Record<number, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const TitleDisplay: React.FC<TitleDisplayProps> = ({ text, level = 2, className = '' }) => {
  const variant = levelToVariant[level] || 'h4';
  const component = `h${level}` as React.ElementType;

  return (
    <Typography variant={variant} component={component} className={className} sx={{ mb: 2 }}>
      {text}
    </Typography>
  );
};
