
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash, Undo } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { GridItem } from '@/types/content';

interface GridFormProps {
  onSubmit: (data: { columns: number; rows: number; items: GridItem[] }) => void;
  initialData?: { columns: number; rows: number; items: GridItem[] };
}

export const GridForm: React.FC<GridFormProps> = ({ onSubmit, initialData }) => {
  const [columns, setColumns] = useState<number>(initialData?.columns || 5);
  const [rows, setRows] = useState<number>(initialData?.rows || 5);
  const [items, setItems] = useState<GridItem[]>(
    initialData?.items || Array.from({ length: 25 }, (_, i) => ({
      id: uuidv4(),
      content: `${i + 1}`,
      colStart: (i % 5) + 1,
      rowStart: Math.floor(i / 5) + 1
    }))
  );

  const updateItemContent = (id: string, content: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, content } : item
    ));
  };

  const updateItemPosition = (id: string, colStart?: number, rowStart?: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, colStart, rowStart } : item
    ));
  };

  const addItem = () => {
    setItems([...items, {
      id: uuidv4(),
      content: `${items.length + 1}`
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const resetPositions = () => {
    setItems(items.map((item, i) => ({
      ...item,
      colStart: (i % columns) + 1,
      rowStart: Math.floor(i / columns) + 1
    })));
  };

  const handleSubmit = () => {
    onSubmit({ columns, rows, items });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-white text-sm">Oszlopok száma</label>
          <Input
            type="number"
            min={1}
            max={12}
            value={columns}
            onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <div>
          <label className="text-white text-sm">Sorok száma</label>
          <Input
            type="number"
            min={1}
            max={12}
            value={rows}
            onChange={(e) => setRows(parseInt(e.target.value) || 1)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-white font-medium">Rács elemek</h3>
        <div className="flex gap-2">
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={resetPositions}
            className="bg-gray-800 text-white border-gray-700"
          >
            <Undo className="w-4 h-4 mr-1" /> Újrarendezés
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={addItem}
            className="bg-gray-800 text-white border-gray-700"
          >
            <Plus className="w-4 h-4 mr-1" /> Új elem
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-7 gap-2 items-center bg-gray-800 p-2 rounded-md">
            <div className="col-span-3">
              <label className="text-white text-xs mb-1 block">Tartalom</label>
              <Input
                value={item.content}
                onChange={(e) => updateItemContent(item.id, e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-white text-xs mb-1 block">Oszlop</label>
              <Input
                type="number"
                min={1}
                max={columns}
                value={item.colStart || ''}
                onChange={(e) => updateItemPosition(item.id, parseInt(e.target.value) || undefined, item.rowStart)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-white text-xs mb-1 block">Sor</label>
              <Input
                type="number"
                min={1}
                max={rows}
                value={item.rowStart || ''}
                onChange={(e) => updateItemPosition(item.id, item.colStart, parseInt(e.target.value) || undefined)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-end justify-end col-span-2">
              <Button 
                type="button" 
                size="icon" 
                variant="destructive" 
                onClick={() => removeItem(item.id)}
                className="h-8 w-8"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <Button onClick={handleSubmit} className="w-full">Rács hozzáadása</Button>
    </div>
  );
};
