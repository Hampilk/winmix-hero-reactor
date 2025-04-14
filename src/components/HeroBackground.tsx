import React from 'react';

interface HeroBackgroundProps {
  backgroundImage: string;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ backgroundImage }) => {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#cccccc', // Fallback color
      }}
      aria-hidden="true"
    />
  );
};

export default HeroBackground;
