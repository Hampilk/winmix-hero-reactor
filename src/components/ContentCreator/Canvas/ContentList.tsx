import React from 'react';
import { useDrop } from 'react-dnd';
import { useLayoutStore } from '@/store/layout';
import { ContentItem } from './ContentItem';

interface DroppedAsset {
  id: string;
  type: string;
  [key: string]: unknown;
}

export const ContentList: React.FC = () => {
  const { layout, addItem } = useLayoutStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'ASSET',
    drop: (item: DroppedAsset) => {
      try {
        addItem(item);
      } catch (error) {
        console.error('Failed to add item:', error);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className={`relative ${isOver ? 'bg-blue-100' : ''}`}>
      {layout.items.map((item) => (
        <ContentItem key={item.id} item={item} />
      ))}
    </div>
  );
};
