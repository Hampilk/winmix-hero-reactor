import React from 'react';
import { Rnd } from 'react-rnd';

export const ContentItem: React.FC = ({ item }) => {
  const { updateItem } = useLayoutStore();

  const handleResizeStop = (e, direction, ref, delta, position) => {
    updateItem(item.id, {
      width: parseInt(ref.style.width, 10),
      height: parseInt(ref.style.height, 10),
      ...position,
    });
  };

  return (
    <Rnd
      size={{ width: item.width, height: item.height }}
      position={{ x: item.x, y: item.y }}
      onResizeStop={handleResizeStop}
    >
      <div>{/* Render content here */}</div>
    </Rnd>
  );
};
