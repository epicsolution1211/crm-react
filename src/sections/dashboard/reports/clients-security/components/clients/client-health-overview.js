import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import { Shield } from '@mui/icons-material';

const ClientHealthOverview = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Shield color="primary" />
            <Typography variant="h5">
              Client Health Analysis
            </Typography>
          </Box>
          
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2 }}>
                    <Skeleton variant="text" width={60} height={40} sx={{ mx: 'auto', mb: 1 }} />
                    <Skeleton variant="text" width={100} height={20} sx={{ mx: 'auto' }} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3} py={1}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.lighter', borderRadius: 2, border: '1px dashed', borderColor:"divider", boxShadow: 3 }}>
                  <Typography variant="h4" color="success.main">
                    {report?.health_analysis?.health_distribution?.excellent_health}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Excellent Health
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.lighter', borderRadius: 2, border: '1px dashed', borderColor:"divider", boxShadow: 3 }}>
                  <Typography variant="h4" color="info.main">
                    {report?.health_analysis?.health_distribution?.good_health}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Good Health
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.lighter', borderRadius: 2, border: '1px dashed', borderColor:"divider", boxShadow: 3 }}>
                  <Typography variant="h4" color="warning.main">
                    {report?.health_analysis?.health_distribution?.moderate_health}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Moderate Health
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.lighter', borderRadius: 2, border: '1px dashed', borderColor:"divider", boxShadow: 3 }}>
                  <Typography variant="h4" color="error.main">
                    {report?.health_analysis?.health_distribution?.poor_health}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Poor Health
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClientHealthOverview;
