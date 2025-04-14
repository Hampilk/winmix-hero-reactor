
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Upload, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export interface Asset {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'icon';
  thumbnail?: string;
  uploadedAt: Date;
}

interface AssetManagerProps {
  onSelect: (asset: Asset) => void;
  onClose?: () => void;
}

export const AssetManager: React.FC<AssetManagerProps> = ({ onSelect, onClose }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    onDrop: async (acceptedFiles) => {
      setIsUploading(true);
      
      // Process files and create new assets
      const newAssets = await Promise.all(
        acceptedFiles.map(async (file) => {
          // Create object URL for display
          const objectUrl = URL.createObjectURL(file);
          
          // In a real app, you'd upload to a server or storage service
          // and get back a permanent URL
          
          return {
            id: uuidv4(),
            name: file.name,
            url: objectUrl,
            type: 'image' as const,
            thumbnail: objectUrl,
            uploadedAt: new Date()
          };
        })
      );
      
      setAssets((prev) => [...prev, ...newAssets]);
      setIsUploading(false);
    }
  });
  
  const filteredAssets = assets.filter(
    (asset) => asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAssetClick = (asset: Asset) => {
    onSelect(asset);
  };
  
  const handleDeleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };
  
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Asset Manager</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center mb-4 cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-center text-muted-foreground">
          {isDragActive ? "Drop files here" : "Drag & drop files, or click to select"}
        </p>
        <p className="text-xs text-center text-muted-foreground mt-1">
          Supported formats: PNG, JPG, GIF, SVG
        </p>
      </div>
      
      {isUploading && <p className="text-center text-muted-foreground my-2">Uploading...</p>}
      
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group relative aspect-square rounded-md border overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:border-primary"
              onClick={() => handleAssetClick(asset)}
            >
              {asset.type === 'image' && (
                <img
                  src={asset.thumbnail || asset.url}
                  alt={asset.name}
                  className="object-cover w-full h-full"
                />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" size="sm" className="mr-2">
                  <Image className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => handleDeleteAsset(asset.id, e)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAssets.length === 0 && !isUploading && (
          <p className="text-center text-muted-foreground my-8">
            {assets.length === 0
              ? "No assets yet. Upload some images to get started."
              : "No assets match your search."}
          </p>
        )}
      </div>
    </div>
  );
};
