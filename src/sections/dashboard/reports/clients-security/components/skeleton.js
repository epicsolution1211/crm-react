import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

export const ListSkeleton = ({ items = 3 }) => (
  <Box>
    {[...Array(items)].map((_, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width="80%" />
      </Box>
    ))}
  </Box>
);

export const MetricCardSkeleton = () => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Skeleton variant="text" width={120} />
          <Skeleton variant="text" width={80} height={40} />
          <Skeleton variant="text" width={140} />
        </Box>
        <Skeleton variant="circular" width={40} height={40} />
      </Box>
    </CardContent>
  </Card>
);

export const ClientCardSkeleton = () => (
  <Card variant="outlined">
    <CardContent>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={100} />
      </Box>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
        <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1 }}>
          <Skeleton variant="text" width={40} height={30} sx={{ mx: 'auto', mb: 0.5 }} />
          <Skeleton variant="text" width={60} />
        </Box>
        <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1 }}>
          <Skeleton variant="text" width={40} height={30} sx={{ mx: 'auto', mb: 0.5 }} />
          <Skeleton variant="text" width={60} />
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={1}>
        {[...Array(7)].map((_, idx) => (
          <Box key={idx} display="flex" justifyContent="space-between" alignItems="center">
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={60} />
          </Box>
        ))}
      </Box>
    </CardContent>
  </Card>
);