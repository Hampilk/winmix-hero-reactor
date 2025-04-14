import React, { useState, useEffect } from 'react';
import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  badge?: string;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
  showStats?: boolean;
  content: React.ReactNode;
}

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      title: 'Emeld új szintre',
      subtitle: 'mérkőzés tippjeidet',
      badge: 'Tippelj mérkőzésekre és nyerj jutalmakat',
      primaryButton: {
        text: 'Kezdj el tippelni most',
        link: '/signup',
      },
      secondaryButton: {
        text: 'Hogyan működik',
        link: '/how-it-works',
      },
      showStats: true,
      content: (
        <div className="relative h-[500px] w-[500px] max-w-full">
          <HeroBackground backgroundImage="path/to/image.jpg" />
        </div>
      ),
    },
    // Add more slides as needed
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAnimating) goToNextSlide();
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentSlide, isAnimating]);

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const goToSlide = (index: number) => {
    if (isAnimating || currentSlide === index) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <section id="hero" className="relative" aria-label="Hero Carousel">
      <div className="relative min-h-[80vh] flex items-center pt-28 pb-16 overflow-hidden">
        {/* Carousel Controls */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/30"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/30"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Current Slide */}
        <div className="w-full" key={currentSlide}>
          <HeroContent
            title={slides[currentSlide].title}
            subtitle={slides[currentSlide].subtitle}
            badge={slides[currentSlide].badge}
            primaryButton={slides[currentSlide].primaryButton}
            secondaryButton={slides[currentSlide].secondaryButton}
            stats={slides[currentSlide].showStats}
          >
            {slides[currentSlide].content}
          </HeroContent>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
