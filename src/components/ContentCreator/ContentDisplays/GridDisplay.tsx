
import React from 'react';
import { GridContent } from '@/types/content';

interface GridDisplayProps {
  content: GridContent;
}

export const GridDisplay: React.FC<GridDisplayProps> = ({ content }) => {
  const { columns, rows, items } = content;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    gap: '1rem',
  };

  return (
    <div style={gridStyle} className="border border-gray-800 p-4 rounded-lg bg-gray-900/30">
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            gridColumnStart: item.colStart,
            gridRowStart: item.rowStart,
          }}
          className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-4 flex items-center justify-center text-white hover:bg-blue-500/20 transition-colors duration-300"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};
