import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Upload, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { debounce } from 'lodash';

export const AssetManager: React.FC = ({ onSelect, onClose }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg'] },
    onDrop: async (acceptedFiles) => {
      setIsUploading(true);
      try {
        const newAssets = await Promise.all(
          acceptedFiles.map(async (file) => {
            const objectUrl = URL.createObjectURL(file);
            return {
              id: uuidv4(),
              name: file.name,
              url: objectUrl,
              type: 'image' as const,
              thumbnail: objectUrl,
              uploadedAt: new Date(),
            };
          })
        );
        setAssets((prev) => [...prev, ...newAssets]);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload files. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
  });

  const debouncedSearch = debounce((query) => setSearchQuery(query), 300);

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Asset Manager</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close Asset Manager">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets..."
          className="pl-9"
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>

      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center mb-4 cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'
        )}
        aria-label="Drag and drop files here or click to upload"
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-center text-muted-foreground">
          {isDragActive ? 'Drop files here' : 'Drag & drop files, or click to select'}
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
              onClick={() => onSelect(asset)}
            >
              {asset.type === 'image' && (
                <img
                  src={asset.thumbnail || asset.url}
                  alt={asset.name}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          ))}
        </div>

        {filteredAssets.length === 0 && !isUploading && (
          <p className="text-center text-muted-foreground my-8">
            {assets.length === 0
              ? 'No assets yet. Upload some images to get started.'
              : 'No assets match your search.'}
          </p>
        )}
      </div>
    </div>
  );
};
