import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Grid from "@mui/system/Unstable_Grid/Grid";

export const DashboardSkeleton = ({ count = 8 }) => {
  return (
    <Grid container spacing={3}>
      {[...Array(count)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card
            sx={{
              height: '100%',
              border: '1px dashed',
              borderColor: 'divider',
            }}
          >
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Skeleton variant="circular" width={48} height={48} />
                
                <Box display="flex" gap={1}>
                  <Skeleton variant="circular" width={30} height={30} />
                  <Skeleton variant="circular" width={30} height={30} />
                </Box>
              </Box>

              <Skeleton variant="text" sx={{ fontSize: '1.25rem', mt: 2, width: '70%' }} />

              <Skeleton variant="text" sx={{ fontSize: '0.875rem', mt: 1, width: '90%' }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: '60%' }} />

              <Box sx={{ mt: 'auto', pt: 2 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 80 }} />
                </Box>
                <Box display="flex" alignItems="center" gap={1} mt={1}>
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" sx={{ fontSize: '0.875rem', width: 120 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}; 