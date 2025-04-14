import React from 'react';
import { Card, CardHeader, CardTitle, CardContent as CardContentUI, CardMedia, CardActions } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CardDisplayProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  buttonText?: string;
  buttonUrl?: string;
  className?: string;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  title,
  description,
  image,
  imageAlt = title,
  buttonText,
  buttonUrl,
  className = '',
}) => {
  return (
    <Card className={`bg-gradient-to-br from-gray-900/60 to-gray-900/40 backdrop-blur-md border border-white/5 rounded-xl hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg ${className}`}>
      {image && (
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={imageAlt}
          loading="lazy"
          className="rounded-t-xl"
        />
      )}
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContentUI>
        <p className="text-gray-300 whitespace-pre-wrap">{description}</p>
      </CardContentUI>
      {buttonText && buttonUrl && (
        <CardActions>
          <Button href={buttonUrl} component="a" target="_blank" rel="noopener noreferrer" variant="contained">
            {buttonText}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
