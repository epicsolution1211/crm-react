import React from 'react';
import { Grid } from '@mui/material';
import SecurityOverview from './security/security-overview';
import SuspiciousActivity from './security/suspicious-activity';

const SecurityTab = ({ report, loading }) => {
  return (
    <Grid container spacing={3}>
      <SecurityOverview report={report} loading={loading} />
      <SuspiciousActivity report={report} loading={loading} />
    </Grid>
  );
};

export default SecurityTab;