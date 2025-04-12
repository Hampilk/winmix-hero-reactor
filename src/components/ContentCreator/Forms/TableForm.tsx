
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { TableRow, TableCell } from '@/types/content';

interface TableFormProps {
  onSubmit: (data: { headers: TableCell[]; rows: TableRow[] }) => void;
  initialData?: { headers: TableCell[]; rows: TableRow[] };
}

export const TableForm: React.FC<TableFormProps> = ({ onSubmit, initialData }) => {
  const [headers, setHeaders] = useState<TableCell[]>(
    initialData?.headers || [{ id: uuidv4(), content: '' }]
  );
  
  const [rows, setRows] = useState<TableRow[]>(
    initialData?.rows || [{ id: uuidv4(), cells: [{ id: uuidv4(), content: '' }] }]
  );

  const addHeader = () => {
    setHeaders([...headers, { id: uuidv4(), content: '' }]);
    
    // Add a cell to each row for the new column
    setRows(rows.map(row => ({
      ...row,
      cells: [...row.cells, { id: uuidv4(), content: '' }]
    })));
  };

  const removeHeader = (index: number) => {
    if (headers.length <= 1) return;
    
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
    
    // Remove the corresponding cell from each row
    setRows(rows.map(row => {
      const newCells = [...row.cells];
      newCells.splice(index, 1);
      return {
        ...row,
        cells: newCells
      };
    }));
  };

  const updateHeader = (index: number, content: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], content };
    setHeaders(newHeaders);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: uuidv4(),
        cells: headers.map(() => ({ id: uuidv4(), content: '' }))
      }
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const updateCell = (rowIndex: number, cellIndex: number, content: string) => {
    const newRows = [...rows];
    newRows[rowIndex].cells[cellIndex] = { 
      ...newRows[rowIndex].cells[cellIndex], 
      content 
    };
    setRows(newRows);
  };

  const handleSubmit = () => {
    onSubmit({ headers, rows });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Oszlopok</h3>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={addHeader}
            className="bg-gray-800 text-white border-gray-700"
          >
            <Plus className="w-4 h-4 mr-1" /> Oszlop
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {headers.map((header, index) => (
            <div key={header.id} className="flex items-center gap-2">
              <Input
                value={header.content}
                onChange={(e) => updateHeader(index, e.target.value)}
                placeholder={`Oszlop ${index + 1}`}
                className="w-32 bg-gray-800 border-gray-700 text-white"
              />
              <Button 
                type="button" 
                size="icon" 
                variant="destructive" 
                onClick={() => removeHeader(index)}
                disabled={headers.length <= 1}
                className="h-8 w-8"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-medium">Sorok</h3>
          <Button 
            type="button" 
            size="sm" 
            variant="outline" 
            onClick={addRow}
            className="bg-gray-800 text-white border-gray-700"
          >
            <Plus className="w-4 h-4 mr-1" /> Sor
          </Button>
        </div>
        
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
          {rows.map((row, rowIndex) => (
            <div key={row.id} className="flex items-start gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 flex-1">
                {row.cells.map((cell, cellIndex) => (
                  <div key={cell.id} className="flex items-center">
                    <div className="text-gray-400 text-xs w-16 truncate">
                      {headers[cellIndex]?.content || `Oszlop ${cellIndex + 1}`}:
                    </div>
                    <Input
                      value={cell.content}
                      onChange={(e) => updateCell(rowIndex, cellIndex, e.target.value)}
                      placeholder={`Cella ${cellIndex + 1}`}
                      className="flex-1 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                ))}
              </div>
              <Button 
                type="button" 
                size="icon" 
                variant="destructive" 
                onClick={() => removeRow(rowIndex)}
                disabled={rows.length <= 1}
                className="h-8 w-8 mt-1"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <Button onClick={handleSubmit} className="w-full">Táblázat hozzáadása</Button>
    </div>
  );
};
