import React from 'react';
import { Grid, Card, CardContent, Box, Typography, LinearProgress, Skeleton } from '@mui/material';
import { HealthAndSafety } from '@mui/icons-material';
import ClientCard from '../client-card';
import { ClientCardSkeleton } from '../skeleton';

const HealthAnalysis = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={5}>
            <HealthAndSafety color="primary" />
            <Typography variant="h5">
              {report?.health_analysis?.title}
            </Typography>
          </Box>

          {loading ? (
            <>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} sx={{ mb: 3 }} px={3}>
                  <Skeleton variant="text" width={150} sx={{ mb: 2 }} />
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={60} />
                      </Box>
                      <Skeleton variant="rectangular" height={6} width="100%" sx={{ borderRadius: 1 }} />
                    </Box>
                  ))}
                </Grid>
                <Grid xs={12} md={6} sx={{ mb: 3 }} px={3}>
                  <Skeleton variant="text" width={150} sx={{ mb: 2 }} />
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={60} />
                      </Box>
                      <Skeleton variant="rectangular" height={6} width="100%" sx={{ borderRadius: 1 }} />
                    </Box>
                  ))}
                </Grid>
              </Grid>

              <Box mb={2}>
                <Skeleton variant="text" width={200} />
              </Box>
              <Grid container spacing={2}>
                {[...Array(4)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <ClientCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid xs={12} md={6} sx={{ mb: 3 }} px={3}>
                  <Typography variant="h6" gutterBottom>
                    Health Distribution
                  </Typography>
                  {Object.entries(report?.health_analysis?.health_distribution || {}).map(([key, value]) => {
                    const total = Object.values(report?.health_analysis?.health_distribution || {}).reduce((a, b) => a + b, 0);
                    const percentage = total ? (value / total) * 100 : 0;
                    return (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                            {key.replace(/_/g, ' ')}
                          </Typography>
                          <Typography variant="body2" color="inherit">
                            {value} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage}
                          color={key === 'excellent_health' ? 'success' : key === 'good_health' ? 'info' : key === 'moderate_health' ? 'warning' : 'secondary'}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    );
                  })}
                </Grid>

                <Grid xs={12} md={6} sx={{ mb: 3 }} px={3}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity Analysis
                  </Typography>
                  {Object.entries(report?.health_analysis?.recent_activity_analysis || {}).map(([key, value]) => {
                    const total = Object.values(report?.health_analysis?.recent_activity_analysis || {}).reduce((a, b) => a + b, 0);
                    const percentage = total ? (value / total) * 100 : 0;
                    return (
                      <Box key={key} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                            {key.replace(/_/g, ' ')}
                          </Typography>
                          <Typography variant="body2" color="inherit">
                            {value} ({percentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={percentage}
                          color={key === 'very_recent' ? 'success' : key === 'recent' ? 'info' : 'warning'}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    );
                  })}
                </Grid>
              </Grid>
                
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" mb={2} gutterBottom>
                  {report?.health_analysis?.healthiest_clients?.title || "Top 10 Most Collaborative Clients"}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {report?.health_analysis?.healthiest_clients?.clients?.map((client) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={client.client_id}>
                    <ClientCard client={client} />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default HealthAnalysis;