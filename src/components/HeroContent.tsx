
import React, { ReactNode } from 'react';
import { ChevronRight, ExternalLink, Users, Award, TrendingUp } from 'lucide-react';
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
  badge = 'Tippelj mérkőzésekre és nyerj jutalmakat',
  primaryButton,
  secondaryButton,
  stats = true,
  children
}) => {
  return (
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-full backdrop-blur-sm animate-fade-in">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <p className="text-xs font-medium text-blue-300">{badge}</p>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
            <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-300">{title}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">{subtitle}</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-xl animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
            Csatlakozz ezrekhez, akik tippelési tudásukat tesztelik és versenyeznek, hogy a ranglista élére kerüljenek.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 animate-slide-in-bottom" style={{ animationDelay: '0.5s' }}>
            {primaryButton && (
              <Link 
                to={primaryButton.link} 
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-7 py-3.5 rounded-xl shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.5)] transition-all duration-300"
              >
                <span className="relative z-10">{primaryButton.text}</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
              </Link>
            )}
            {secondaryButton && (
              <Link 
                to={secondaryButton.link} 
                className="group inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-medium px-7 py-3.5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <span>{secondaryButton.text}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform duration-300" />
              </Link>
            )}
          </div>
          {stats && (
            <div className="grid grid-cols-3 gap-4 pt-8 animate-slide-in-bottom" style={{ animationDelay: '0.7s' }}>
              <div className="flex flex-col bg-gradient-to-br from-gray-900/60 to-gray-900/40 backdrop-blur-md border border-white/5 rounded-xl p-4 hover:border-blue-500/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-blue-400">Felhasználók</span>
                </div>
                <span className="text-2xl font-bold">10K+</span>
                <span className="text-xs text-gray-400">Aktív tippelő</span>
              </div>
              <div className="flex flex-col bg-gradient-to-br from-gray-900/60 to-gray-900/40 backdrop-blur-md border border-white/5 rounded-xl p-4 hover:border-blue-500/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                    <Award className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-blue-400">Pontosság</span>
                </div>
                <span className="text-2xl font-bold">87%</span>
                <span className="text-xs text-gray-400">Legjobb tippelő</span>
              </div>
              <div className="flex flex-col bg-gradient-to-br from-gray-900/60 to-gray-900/40 backdrop-blur-md border border-white/5 rounded-xl p-4 hover:border-blue-500/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] group">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors duration-300">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-blue-400">Mérkőzések</span>
                </div>
                <span className="text-2xl font-bold">5K+</span>
                <span className="text-xs text-gray-400">Tipp naponta</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Custom Content */}
        <div className="relative mx-auto lg:mx-0 animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
