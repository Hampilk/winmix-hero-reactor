
import React from 'react';
import { CardContent as CardContentType } from '@/types/content';
import { Card, CardHeader, CardTitle, CardContent as CardContentUI } from '@/components/ui/card';

interface CardDisplayProps {
  content: CardContentType;
  className?: string;
  onClick?: () => void;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ content, className = '', onClick }) => {
  const { title, content: cardContent, imageUrl } = content;

  return (
    <Card className={`bg-gradient-to-br from-gray-900/60 to-gray-900/40 backdrop-blur-md border border-white/5 rounded-xl hover:border-blue-500/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${className}`} onClick={onClick}>
      {imageUrl && (
        <div className="w-full h-40 overflow-hidden rounded-t-xl">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContentUI>
        <p className="text-gray-300 whitespace-pre-wrap">{cardContent}</p>
      </CardContentUI>
    </Card>
  );
};
