import { lazy } from 'react';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import LazyComponentWrapper from './lazy-component-wrapper';

const LazyApexChart = lazy(() => import('react-apexcharts'));

const LoadingFallback = ({ height = 300 }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: height,
      width: '100%'
    }}
  >
    <CircularProgress />
  </Box>
);

export const LazyChart = (props) => {
  return (
    <LazyComponentWrapper 
      fallback={() => <LoadingFallback height={props.height} />} 
      height={props.height || 300}
    >
      <LazyApexChart {...props} />
    </LazyComponentWrapper>
  );
};
