
import React from 'react';
import { Trophy, Award } from 'lucide-react';

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-blue-950/20 to-black/95"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.15),transparent_45%)]"></div>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px)', backgroundSize: '30px 30px', backgroundPosition: '0px 0px' }}></div>
      
      {/* Particle Container */}
      <div className="hero-background-particles">
        <div className="hero-particle animate-float" style={{ animationDuration: '8s', top: '88%', left: '50%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '12s', top: '10%', left: '15%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '10s', top: '40%', left: '90%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '9s', top: '20%', left: '33%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '11s', top: '85%', left: '65%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '7s', top: '70%', left: '45%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '13s', top: '55%', left: '75%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '9s', top: '30%', left: '40%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '14s', top: '50%', left: '80%' }}></div>
        <div className="hero-particle animate-float" style={{ animationDuration: '10s', top: '80%', left: '25%' }}></div>
      </div>
      
      {/* Orbs */}
      <div className="hero-orbs"></div>
      <div className="hero-orbs-secondary"></div>
      
      {/* Floating Icons */}
      <div className="absolute top-[20%] right-[5%] w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-blue-600/30 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-[0_4px_20px_rgba(59,130,246,0.3)] animate-float" style={{ animationDuration: '4s' }}>
        <Trophy className="text-white h-5 w-5" />
      </div>
      <div className="absolute bottom-[15%] left-[10%] w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-[0_4px_20px_rgba(139,92,246,0.3)] animate-float" style={{ animationDuration: '5s', animationDelay: '1s' }}>
        <Award className="text-white h-4 w-4" />
      </div>
    </div>
  );
};

export default HeroBackground;
