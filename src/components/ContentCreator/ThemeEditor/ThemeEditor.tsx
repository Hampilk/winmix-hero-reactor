
import React, { useState } from 'react';
import { useTheme, Theme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Save, Copy, Trash, Plus } from 'lucide-react';

export const ThemeEditor: React.FC = () => {
  const { themes, currentTheme, setCurrentTheme, addCustomTheme, updateTheme, deleteTheme } = useTheme();
  const [customThemeName, setCustomThemeName] = useState('Custom Theme');
  
  const handleColorChange = (colorKey: keyof Theme['colors'], value: string) => {
    if (!currentTheme.isCustom) {
      // If the current theme is not custom, create a new one based on it
      const newTheme: Omit<Theme, 'id' | 'isCustom'> = {
        ...currentTheme,
        name: customThemeName,
        colors: {
          ...currentTheme.colors,
          [colorKey]: {
            ...currentTheme.colors[colorKey],
            value
          }
        }
      };
      addCustomTheme(newTheme);
    } else {
      // Update the existing custom theme
      updateTheme(currentTheme.id, {
        colors: {
          ...currentTheme.colors,
          [colorKey]: {
            ...currentTheme.colors[colorKey],
            value
          }
        }
      });
    }
  };
  
  const handleFontFamilyChange = (value: string) => {
    if (!currentTheme.isCustom) {
      const newTheme: Omit<Theme, 'id' | 'isCustom'> = {
        ...currentTheme,
        name: customThemeName,
        typography: {
          ...currentTheme.typography,
          fontFamily: value
        }
      };
      addCustomTheme(newTheme);
    } else {
      updateTheme(currentTheme.id, {
        typography: {
          ...currentTheme.typography,
          fontFamily: value
        }
      });
    }
  };
  
  const handleBaseFontSizeChange = (value: string) => {
    if (!currentTheme.isCustom) {
      const newTheme: Omit<Theme, 'id' | 'isCustom'> = {
        ...currentTheme,
        name: customThemeName,
        typography: {
          ...currentTheme.typography,
          baseFontSize: value
        }
      };
      addCustomTheme(newTheme);
    } else {
      updateTheme(currentTheme.id, {
        typography: {
          ...currentTheme.typography,
          baseFontSize: value
        }
      });
    }
  };
  
  const handleHeadingScaleChange = (value: number[]) => {
    if (!currentTheme.isCustom) {
      const newTheme: Omit<Theme, 'id' | 'isCustom'> = {
        ...currentTheme,
        name: customThemeName,
        typography: {
          ...currentTheme.typography,
          headingScale: value[0]
        }
      };
      addCustomTheme(newTheme);
    } else {
      updateTheme(currentTheme.id, {
        typography: {
          ...currentTheme.typography,
          headingScale: value[0]
        }
      });
    }
  };
  
  const handleSpacingBaseChange = (value: number[]) => {
    if (!currentTheme.isCustom) {
      const newTheme: Omit<Theme, 'id' | 'isCustom'> = {
        ...currentTheme,
        name: customThemeName,
        spacing: {
          ...currentTheme.spacing,
          base: value[0]
        }
      };
      addCustomTheme(newTheme);
    } else {
      updateTheme(currentTheme.id, {
        spacing: {
          ...currentTheme.spacing,
          base: value[0]
        }
      });
    }
  };
  
  const handleDuplicateTheme = () => {
    const newTheme: Omit<Theme, 'id' | 'isCustom'> = {
      ...currentTheme,
      name: `${currentTheme.name} Copy`
    };
    addCustomTheme(newTheme);
  };
  
  const handleCreateNew = () => {
    const newTheme: Omit<Theme, 'id' | 'isCustom'> = {
      ...themes[0], // Start with the default theme
      name: customThemeName
    };
    addCustomTheme(newTheme);
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Theme Editor</h2>
        
        <div className="flex items-center gap-2">
          <select
            className="bg-background border rounded px-3 py-1 text-sm"
            value={currentTheme.id}
            onChange={(e) => setCurrentTheme(e.target.value)}
          >
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name} {theme.isCustom ? '(Custom)' : ''}
              </option>
            ))}
          </select>
          
          <Button variant="ghost" size="icon" onClick={handleDuplicateTheme}>
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={handleCreateNew}>
            <Plus className="h-4 w-4" />
          </Button>
          
          {currentTheme.isCustom && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteTheme(currentTheme.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {currentTheme.isCustom && (
        <div className="mb-4">
          <Label htmlFor="theme-name">Theme Name</Label>
          <div className="flex gap-2">
            <Input
              id="theme-name"
              value={currentTheme.name}
              onChange={(e) => updateTheme(currentTheme.id, { name: e.target.value })}
            />
            <Button variant="secondary" size="icon">
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="colors">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
          <TabsTrigger value="typography" className="flex-1">Typography</TabsTrigger>
          <TabsTrigger value="spacing" className="flex-1">Spacing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="space-y-4">
          {Object.entries(currentTheme.colors).map(([key, color]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`color-${key}`}>{color.name}</Label>
              <div className="flex gap-2">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: color.value }}
                />
                <Input
                  id={`color-${key}`}
                  type="text"
                  value={color.value}
                  onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                />
                <Input
                  type="color"
                  value={color.value}
                  className="w-12 h-8 p-0 border-0"
                  onChange={(e) => handleColorChange(key as keyof Theme['colors'], e.target.value)}
                />
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="font-family">Font Family</Label>
            <Input
              id="font-family"
              value={currentTheme.typography.fontFamily}
              onChange={(e) => handleFontFamilyChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="base-font-size">Base Font Size</Label>
            <Input
              id="base-font-size"
              value={currentTheme.typography.baseFontSize}
              onChange={(e) => handleBaseFontSizeChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="heading-scale">Heading Scale</Label>
            <Slider
              id="heading-scale"
              defaultValue={[currentTheme.typography.headingScale]}
              min={1}
              max={2}
              step={0.05}
              onValueChange={handleHeadingScaleChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current: {currentTheme.typography.headingScale.toFixed(2)}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="spacing" className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="spacing-base">Base Spacing (px)</Label>
            <Slider
              id="spacing-base"
              defaultValue={[currentTheme.spacing.base]}
              min={4}
              max={16}
              step={1}
              onValueChange={handleSpacingBaseChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current: {currentTheme.spacing.base}px
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 p-4 border rounded-md bg-muted/50">
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <div 
          className="p-4 rounded-md"
          style={{ 
            backgroundColor: currentTheme.colors.background.value,
            color: currentTheme.colors.text.value,
            fontFamily: currentTheme.typography.fontFamily
          }}
        >
          <h1 
            style={{ fontSize: `calc(${currentTheme.typography.baseFontSize} * ${currentTheme.typography.headingScale} * ${currentTheme.typography.headingScale})` }}
            className="font-bold mb-2"
          >
            Heading 1
          </h1>
          <h2 
            style={{ fontSize: `calc(${currentTheme.typography.baseFontSize} * ${currentTheme.typography.headingScale})` }}
            className="font-bold mb-2"
          >
            Heading 2
          </h2>
          <p style={{ fontSize: currentTheme.typography.baseFontSize }}>
            This is a paragraph with the current theme settings applied.
          </p>
          <div className="flex gap-2 mt-4">
            <button
              style={{ 
                backgroundColor: currentTheme.colors.primary.value,
                color: '#ffffff',
                padding: `${currentTheme.spacing.base / 2}px ${currentTheme.spacing.base}px`,
                borderRadius: currentTheme.borderRadius
              }}
            >
              Primary
            </button>
            <button
              style={{ 
                backgroundColor: currentTheme.colors.secondary.value,
                color: '#ffffff',
                padding: `${currentTheme.spacing.base / 2}px ${currentTheme.spacing.base}px`,
                borderRadius: currentTheme.borderRadius
              }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
