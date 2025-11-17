import React from 'react';
import { Grid, Card, CardContent, Box, Typography, LinearProgress, Skeleton } from '@mui/material';
import { Analytics } from '@mui/icons-material';

const SystemAnalytics = ({ report, loading }) => {
  return (
    <Grid item xs={12} lg={12}>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={5}>
            <Analytics color="primary" />
            <Typography variant="h5">
              System Analytics {report?.system_analytics?.title ? `- ${report?.system_analytics?.title}` : ""}
            </Typography>
          </Box>
          
          {loading ? (
            <Grid container spacing={2}>
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
          ) : (
            <Grid container spacing={2}>
              <Grid xs={12} md={6} sx={{ mb: 3 }} px={3}>
                <Typography variant="h6" mb={2} gutterBottom>
                  Activity Distribution
                </Typography>
                {Object.entries(report?.system_analytics?.activity_distribution || {})?.map(([key, value]) => {
                  const total = report?.executive_summary?.key_metrics?.total_clients_analyzed;
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
                        color={key === 'high_activity' ? 'success' : key === 'moderate_activity' ? 'info' : key === 'low_activity' ? 'warning' : 'secondary'}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  );
                })}
              </Grid>

              <Grid xs={12} md={6} sx={{ mb: 3 }} px={3}>
                <Typography variant="h6" mb={2} gutterBottom>
                  Engagement Patterns
                </Typography>
                {Object.entries(report?.system_analytics?.engagement_patterns || {})?.map(([key, value]) => {
                  const total = report?.executive_summary?.key_metrics?.total_clients_analyzed;
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
                        color={key === 'power_clients' ? 'success' : key === 'regular_clients' ? 'info' : 'warning'}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  );
                })}
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SystemAnalytics;