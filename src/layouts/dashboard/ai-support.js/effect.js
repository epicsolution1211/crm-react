import { Suspense } from 'react';
import Box from '@mui/material/Box';
import WaveCanvas from './wave-animation';

// Lazy load the SVG animation component with a smaller chunk name

export const AnimationEffect = () => {
  return (
    <Box 
      sx={{
        position: 'absolute',
        top: 22,
        left: 42,
        width: 460,
        height: 32, // Add fixed height to prevent layout shifts
      }}
    >
      <Suspense fallback={null}>
        <WaveCanvas width={460} height={32} />
      </Suspense>
    </Box>
  );
};
