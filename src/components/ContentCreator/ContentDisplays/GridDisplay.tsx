import React from 'react';
import { Grid } from '@mui/material';
import { TextDisplay, TitleDisplay, CardDisplay } from './ContentDisplays';

const componentMap: { [key: string]: React.ComponentType<any> } = {
  text: TextDisplay,
  title: TitleDisplay,
  card: CardDisplay,
};

interface GridItem {
  id: string;
  contentType: string;
  gridSpan?: number;
  [key: string]: any; // Additional props for specific components
}

interface GridDisplayProps {
  content: GridItem[];
  className?: string;
}

export const GridDisplay: React.FC<GridDisplayProps> = ({ content, className = '' }) => {
  return (
    <Grid container spacing={2} className={className}>
      {content.map((item) => {
        const Component = componentMap[item.contentType];
        if (!Component) {
          console.warn(`Unknown content type: ${item.contentType}`);
          return (
            <Grid item xs={item.gridSpan || 12} key={item.id}>
              <div style={{ border: '1px dashed red', padding: '10px' }}>
                Unknown content type: {item.contentType}
              </div>
            </Grid>
          );
        }
        return (
          <Grid item xs={item.gridSpan || 12} key={item.id}>
            <Component {...item} />
          </Grid>
        );
      })}
    </Grid>
  );
};
