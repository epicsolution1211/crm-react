import React from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { Dashboard, Business, Speed, TrendingUp, Group, Warning, Shield } from '@mui/icons-material';
import MetricCard from '../metric-card';
import { MetricCardSkeleton } from '../skeleton';
import { getHealthColor } from '../helper';

const ExecutiveSummary = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <Dashboard color="primary" />
            <Typography variant="h5">
              {report?.executive_summary?.title || "Client Portfolio Overview"}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <Grid item xs={12} md={6} lg={3} key={index}>
                  <MetricCardSkeleton />
                </Grid>
              ))
            ) : (
              <>
                <Grid item xs={12} md={6} lg={3}>
                  <MetricCard
                    title="Total Clients"
                    value={report?.executive_summary?.key_metrics?.total_clients_analyzed}
                    icon={<Business sx={{ fontSize: 40 }} />}
                    subtitle="Clients analyzed"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MetricCard
                    title="System Accesses"
                    value={report?.executive_summary?.key_metrics?.total_system_accesses}
                    icon={<Speed sx={{ fontSize: 40 }} />}
                    color="info"
                    subtitle="Total accesses"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MetricCard
                    title="Avg Accesses/Client"
                    value={report?.executive_summary?.key_metrics?.average_accesses_per_client?.toFixed(1)}
                    icon={<TrendingUp sx={{ fontSize: 40 }} />}
                    color="success"
                    subtitle="Average engagement"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MetricCard
                    title="Avg Agents/Client"
                    value={report?.executive_summary?.key_metrics?.average_agents_per_client?.toFixed(1)}
                    icon={<Group sx={{ fontSize: 40 }} />}
                    color="warning"
                    subtitle="Collaboration level"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MetricCard
                    title="At Risk Clients"
                    value={report?.executive_summary?.key_metrics?.at_risk_clients}
                    icon={<Warning sx={{ fontSize: 40 }} />}
                    color="error"
                    subtitle="Need attention"
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={3}>
                  <MetricCard
                    title="Health Score"
                    value={`${report?.executive_summary?.key_metrics?.system_health_score ? report?.executive_summary?.key_metrics?.system_health_score?.toFixed(1) : 0}%`}
                    icon={<Shield sx={{ fontSize: 40 }} />}
                    color={getHealthColor(report?.executive_summary?.key_metrics?.system_health_score)}
                    subtitle="System health"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ExecutiveSummary;