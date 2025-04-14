
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Menu, X, PlusCircle, Save, Edit, Trash, MoveVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-5 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg py-3 shadow-lg border-b border-white/5' : ''
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-3 group" aria-label="WinMix Tipster">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600/90 to-blue-700/90 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_20px_rgba(59,130,246,0.3)] backdrop-blur-sm border border-blue-400/20 group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_8px_30px_rgba(59,130,246,0.5)] transition-all duration-300">
            <Trophy className="text-white h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">WINMIX</span>
            <span className="text-[10px] -mt-1 text-blue-400/80 tracking-widest">TIPSTER</span>
          </div>
          <div className="absolute -inset-1 rounded-lg bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg -z-10"></div>
        </Link>

        {/* Content Creation Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 bg-black/70 text-gray-300 hover:text-white hover:bg-black/80 border border-white/10">
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Új tartalom</span>
            </Button>
          </DrawerTrigger>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 bg-black/70 text-gray-300 hover:text-white hover:bg-black/80 border border-white/10">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">Szerkesztés</span>
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 bg-black/70 text-gray-300 hover:text-white hover:bg-black/80 border border-white/10">
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Mentés</span>
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 bg-black/70 text-gray-300 hover:text-white hover:bg-black/80 border border-white/10">
            <Trash className="w-4 h-4" />
            <span className="text-sm font-medium">Törlés</span>
          </Button>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 bg-black/70 text-gray-300 hover:text-white hover:bg-black/80 border border-white/10">
            <MoveVertical className="w-4 h-4" />
            <span className="text-sm font-medium">Rendezés</span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 text-gray-200 bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.15)]"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <div className={`md:hidden absolute top-full left-0 right-0 shadow-lg bg-gray-900/95 backdrop-blur-xl border-b border-white/10 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
          <DrawerTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Új tartalom</span>
            </Button>
          </DrawerTrigger>
          
          <Button variant="ghost" className="flex items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium">Szerkesztés</span>
          </Button>
          
          <Button variant="ghost" className="flex items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Mentés</span>
          </Button>
          
          <Button variant="ghost" className="flex items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
            <Trash className="w-4 h-4" />
            <span className="text-sm font-medium">Törlés</span>
          </Button>
          
          <Button variant="ghost" className="flex items-center gap-2 rounded-md px-4 py-2 transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
            <MoveVertical className="w-4 h-4" />
            <span className="text-sm font-medium">Rendezés</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
