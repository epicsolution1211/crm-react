import React from 'react';
import { Box, Typography, Grid, Skeleton } from '@mui/material';

const ReportMetadata = ({ report, loading }) => {
  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      {loading ? (
        <Box>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="70%" height={24} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="60%" height={24} sx={{ mt: 1 }} />
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle2" color="textPrimary" gutterBottom>
            Report Details
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>Period:</span> {report?.report_period}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>Next Review:</span> {report?.report_metadata?.next_recommended_review}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>Data Sources:</span> {report?.report_metadata?.data_sources?.join(', ')}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>Analysis Depth:</span> {report?.report_metadata?.analysis_depth}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="textSecondary">
                <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>Security Context:</span> {report?.security_context}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>Account Context:</span> {report?.account_context}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                <span style={{ fontStyle: 'italic', textDecoration: 'underline' }}>Recommendations:</span> {report?.recommendations?.title}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ReportMetadata;