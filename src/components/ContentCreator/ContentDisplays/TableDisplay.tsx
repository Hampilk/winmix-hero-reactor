import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface TableDisplayProps {
  headers: string[];
  rows: Array<{ id: string; cells: React.ReactNode[] }>;
  className?: string;
}

export const TableDisplay: React.FC<TableDisplayProps> = ({ headers, rows, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table className="border border-gray-800 rounded-lg">
        <TableHeader className="bg-gray-900">
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} scope="col" className="text-white font-medium">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-b border-gray-800 hover:bg-gray-800/50">
              {row.cells.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="text-gray-300">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
