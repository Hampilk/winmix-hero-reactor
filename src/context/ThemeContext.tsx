
import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface ThemeColor {
  name: string;
  value: string;
}

export interface Typography {
  fontFamily: string;
  titleFontFamily?: string;
  baseFontSize: string;
  headingScale: number;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: ThemeColor;
    secondary: ThemeColor;
    accent: ThemeColor;
    background: ThemeColor;
    text: ThemeColor;
    surface: ThemeColor;
  };
  typography: Typography;
  spacing: {
    base: number;
    scale: number;
  };
  borderRadius: string;
  isCustom: boolean;
}

// Predefined themes
export const defaultThemes: Theme[] = [
  {
    id: 'default',
    name: 'Default',
    colors: {
      primary: { name: 'Primary', value: '#3b82f6' },
      secondary: { name: 'Secondary', value: '#10b981' },
      accent: { name: 'Accent', value: '#8b5cf6' },
      background: { name: 'Background', value: '#ffffff' },
      text: { name: 'Text', value: '#1f2937' },
      surface: { name: 'Surface', value: '#f9fafb' }
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      baseFontSize: '16px',
      headingScale: 1.2
    },
    spacing: {
      base: 8,
      scale: 1.5
    },
    borderRadius: '0.5rem',
    isCustom: false
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: { name: 'Primary', value: '#60a5fa' },
      secondary: { name: 'Secondary', value: '#34d399' },
      accent: { name: 'Accent', value: '#a78bfa' },
      background: { name: 'Background', value: '#111827' },
      text: { name: 'Text', value: '#f9fafb' },
      surface: { name: 'Surface', value: '#1f2937' }
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      baseFontSize: '16px',
      headingScale: 1.2
    },
    spacing: {
      base: 8,
      scale: 1.5
    },
    borderRadius: '0.5rem',
    isCustom: false
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: {
      primary: { name: 'Primary', value: '#000000' },
      secondary: { name: 'Secondary', value: '#4b5563' },
      accent: { name: 'Accent', value: '#ef4444' },
      background: { name: 'Background', value: '#ffffff' },
      text: { name: 'Text', value: '#1f2937' },
      surface: { name: 'Surface', value: '#f9fafb' }
    },
    typography: {
      fontFamily: 'system-ui, sans-serif',
      baseFontSize: '16px',
      headingScale: 1.2
    },
    spacing: {
      base: 8,
      scale: 1.5
    },
    borderRadius: '0.25rem',
    isCustom: false
  }
];

interface ThemeContextType {
  themes: Theme[];
  currentTheme: Theme;
  setCurrentTheme: (themeId: string) => void;
  addCustomTheme: (theme: Omit<Theme, 'id' | 'isCustom'>) => void;
  updateTheme: (themeId: string, updates: Partial<Omit<Theme, 'id' | 'isCustom'>>) => void;
  deleteTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [currentThemeId, setCurrentThemeId] = useState<string>(defaultThemes[0].id);

  const setCurrentTheme = useCallback((themeId: string) => {
    // Only set if theme exists
    if (themes.some(theme => theme.id === themeId)) {
      setCurrentThemeId(themeId);
    }
  }, [themes]);

  const addCustomTheme = useCallback((theme: Omit<Theme, 'id' | 'isCustom'>) => {
    const newTheme: Theme = {
      ...theme,
      id: uuidv4(),
      isCustom: true
    };
    
    setThemes(prev => [...prev, newTheme]);
    // Set it as the current theme
    setCurrentThemeId(newTheme.id);
  }, []);

  const updateTheme = useCallback((themeId: string, updates: Partial<Omit<Theme, 'id' | 'isCustom'>>) => {
    setThemes(prev => {
      // Only allow updates for custom themes
      return prev.map(theme => 
        theme.id === themeId && theme.isCustom 
          ? { ...theme, ...updates } 
          : theme
      );
    });
  }, []);

  const deleteTheme = useCallback((themeId: string) => {
    setThemes(prev => {
      // Only allow deletion of custom themes
      const updatedThemes = prev.filter(theme => !(theme.id === themeId && theme.isCustom));
      
      // If the current theme is deleted, switch to the default theme
      if (currentThemeId === themeId) {
        setCurrentThemeId(defaultThemes[0].id);
      }
      
      return updatedThemes;
    });
  }, [currentThemeId]);

  // Get the current theme object
  const currentTheme = themes.find(theme => theme.id === currentThemeId) || themes[0];

  const value = {
    themes,
    currentTheme,
    setCurrentTheme,
    addCustomTheme,
    updateTheme,
    deleteTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
