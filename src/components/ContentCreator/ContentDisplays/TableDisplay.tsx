
import React from 'react';
import { TableContent } from '@/types/content';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

interface TableDisplayProps {
  content: TableContent;
  className?: string;
  onClick?: () => void;
}

export const TableDisplay: React.FC<TableDisplayProps> = ({ content, className = '', onClick }) => {
  const { headers, rows } = content;

  return (
    <div className={`overflow-x-auto ${className}`} onClick={onClick}>
      <Table className="border border-gray-800 rounded-lg">
        <TableHeader className="bg-gray-900">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header.id} className="text-white font-medium">
                {header.content}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} className="border-b border-gray-800 hover:bg-gray-800/50">
              {row.cells.map((cell) => (
                <TableCell key={cell.id} className="text-gray-300">
                  {cell.content}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
