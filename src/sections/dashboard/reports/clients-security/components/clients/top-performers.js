import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import { Stars } from '@mui/icons-material';
import ClientCard from '../client-card';
import { ClientCardSkeleton } from '../skeleton';

const TopPerformers = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Stars color="primary" />
            <Typography variant="h5">
              {report?.top_performers_analysis?.title || "Top Performing Clients"}
            </Typography>
          </Box>

          {loading ? (
            <>
              <Box mb={4}>
                <Grid container spacing={3}>
                  {[...Array(2)].map((_, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2 }}>
                        <Skeleton variant="text" width={60} height={40} sx={{ mx: 'auto', mb: 1 }} />
                        <Skeleton variant="text" width={160} height={20} sx={{ mx: 'auto' }} />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Grid container spacing={2}>
                {[...Array(8)].map((_, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <ClientCardSkeleton />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <>
              <Box mb={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} sx={{ position: 'relative' }}>
                    <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                      <Typography variant="h4" color="primary.main">
                        {report?.top_performers_analysis?.performance_insights?.highest_single_client_accesses}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Highest Single Client Accesses
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                      <Typography variant="h4" color="secondary.main">
                        {report?.top_performers_analysis?.performance_insights?.top_10_represent_percentage ? report?.top_performers_analysis?.performance_insights?.top_10_represent_percentage?.toFixed(2) : 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Top 10 Clients Access Share
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" mb={2} gutterBottom>
                  {report?.top_performers_analysis?.top_clients_by_access?.title || "Top 10 Most Active Clients"}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {report?.top_performers_analysis?.top_clients_by_access?.clients?.map((client) => (
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

export default TopPerformers;
