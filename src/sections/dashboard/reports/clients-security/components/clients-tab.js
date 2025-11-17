import React from 'react';
import { Grid } from '@mui/material';
import ClientHealthOverview from './clients/client-health-overview';
import TopPerformers from './clients/top-performers';
import CollaborationAnalysis from './clients/collaboration-analysis';
import ClientRiskRankings from './clients/client-risk-rankings';

const ClientsTab = ({ report, loading }) => {
  return (
    <Grid container spacing={3}>
      <ClientHealthOverview report={report} loading={loading} />
      <TopPerformers report={report} loading={loading} />
      <CollaborationAnalysis report={report} loading={loading} />
      <ClientRiskRankings report={report} loading={loading} />
    </Grid>
  );
};

export default ClientsTab;