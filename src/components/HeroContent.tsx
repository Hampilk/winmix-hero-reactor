import React, { ReactNode } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroContentProps {
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
  stats?: boolean;
  children?: ReactNode;
}

const HeroContent: React.FC<HeroContentProps> = ({
  title,
  subtitle,
  badge,
  primaryButton,
  secondaryButton,
  stats,
  children,
}) => {
  return (
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <div className="space-y-8">
          {badge && (
            <div className="inline-flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-full">
              <span className="text-xs font-medium text-blue-300">{badge}</span>
            </div>
          )}
          <h1 className="text-4xl font-bold">{title}</h1>
          <h2 className="text-2xl text-gray-300">{subtitle}</h2>
          <div className="flex gap-4">
            {primaryButton && (
              <Link to={primaryButton.link} className="btn-primary">
                {primaryButton.text}
                <ChevronRight />
              </Link>
            )}
            {secondaryButton && (
              <Link to={secondaryButton.link} className="btn-secondary">
                {secondaryButton.text}
                <ExternalLink />
              </Link>
            )}
          </div>
        </div>
        {/* Right Column */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default HeroContent;
