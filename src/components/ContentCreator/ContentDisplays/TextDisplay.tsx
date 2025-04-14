import React from 'react';
import { Typography } from '@mui/material';

interface TextDisplayProps {
  text: string;
  variant?: 'body1' | 'body2' | 'subtitle1' | 'caption';
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  className?: string;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ text, variant = 'body1', align = 'inherit', className = '' }) => (
  <Typography variant={variant} align={align} paragraph={true} className={className}>
    {text}
  </Typography>
);
