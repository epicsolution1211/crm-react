import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Skeleton } from '@mui/material';
import { Groups } from '@mui/icons-material';
import ClientCard from '../client-card';
import { ClientCardSkeleton } from '../skeleton';

const CollaborationAnalysis = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Groups color="primary" />
            <Typography variant="h5">
              {report?.collaboration_analysis?.title || "Multi-Agent Client Relationships"}
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
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                      <Typography variant="h4" color="primary.main">
                        {report?.collaboration_analysis?.collaboration_metrics?.clients_with_multiple_agents}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Clients with Multiple Agents
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.neutral', borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                      <Typography variant="h4" color="secondary.main">
                        {report?.collaboration_analysis?.collaboration_metrics?.average_collaboration_level?.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Average Collaboration Level
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" mb={2} gutterBottom>
                  {report?.collaboration_analysis?.most_collaborative_clients?.title || "Top 10 Most Collaborative Clients"}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {report?.collaboration_analysis?.most_collaborative_clients?.clients?.map((client) => (
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

export default CollaborationAnalysis;