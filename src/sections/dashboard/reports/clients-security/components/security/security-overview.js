import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import { Security } from '@mui/icons-material';
import { getHealthColor } from '../helper';

const SecurityOverview = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Security color="primary" sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {report?.system_security_overview?.title}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" mb={2} mt={1} gutterBottom>
                  {report?.system_security_overview?.description}
                </Typography>
              </Box>
            </Box>
          </Box>

          {loading ? (
            <Grid container spacing={3}>
              {[...Array(4)].map((_, index) => (
                <Grid item xs={12} md={3} key={index}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="h3" color="primary.main">
                    {report?.system_security_overview?.total_clients_analyzed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Clients
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="h3" color="info.main">
                    {report?.system_security_overview?.total_active_accounts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Accounts
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="h3" color={report?.system_security_overview?.high_risk_clients_count > 0 ? 'error.main' : 'success.main'}>
                    {report?.system_security_overview?.high_risk_clients_count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Risk Clients
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="h3" color={getHealthColor(report?.system_security_overview?.security_health_score)}>
                    {report?.system_security_overview?.security_health_score ? report?.system_security_overview?.security_health_score?.toFixed(2) : 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Security Health
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

export default SecurityOverview;