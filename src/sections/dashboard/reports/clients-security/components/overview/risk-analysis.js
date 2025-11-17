import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import { Stars } from '@mui/icons-material';
import ClientCard from '../client-card';
import { ClientCardSkeleton } from '../skeleton';

const RiskAnalysis = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Stars color="primary" />
            <Typography variant="h5">
              {report?.risk_analysis?.title || "Risk Analysis"}
            </Typography>
          </Box>

          {loading ? (
            <>
              <Box mb={4}>
                <Grid container spacing={3}>
                  {[...Array(3)].map((_, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                    </Grid>
                  ))}
                </Grid>
              </Box>

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
              <Box mb={1}>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3}}>
                      <Typography variant="h4" color="primary.main">
                        {report?.risk_analysis?.risk_factors?.inactive_clients}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Inactive Clients
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} pl={3}>
                    <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3}}>
                      <Typography variant="h4" color="primary.main">
                        {report?.risk_analysis?.risk_factors?.single_agent_dependencies}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Single Agent Dependencies
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4} pl={3}>
                    <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3}}>
                      <Typography variant="h4" color="primary.main">
                        {report?.risk_analysis?.risk_factors?.low_engagement_clients}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Low Engagement Clients
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" mb={2} gutterBottom>
                  {report?.risk_analysis?.at_risk_clients?.title || "At Risk Clients"}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {report?.risk_analysis?.at_risk_clients?.clients?.map((client) => (
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

export default RiskAnalysis;