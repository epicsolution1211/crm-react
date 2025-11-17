import React from 'react';
import { Grid } from '@mui/material';
import ExecutiveSummary from './overview/executive-summary';
import SystemAnalytics from './overview/system-analytics';
import HealthAnalysis from './overview/health-analysis';
import RiskAnalysis from './overview/risk-analysis';

const OverviewTab = ({ report, loading }) => {
  return (
    <Grid container spacing={3}>
      <ExecutiveSummary report={report} loading={loading} />
      <SystemAnalytics report={report} loading={loading} />
      <HealthAnalysis report={report} loading={loading} />
      <RiskAnalysis report={report} loading={loading} />
    </Grid>
  );
};

export default OverviewTab;