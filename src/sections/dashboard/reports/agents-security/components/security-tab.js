import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import SecurityOutlined from '@mui/icons-material/SecurityOutlined';
import Security from '@mui/icons-material/Security';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Shield from '@mui/icons-material/Shield';
import Verified from '@mui/icons-material/Verified';

const SecurityTab = ({ report, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box>
                  <Skeleton variant="text" width={200} height={32} />
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" gap={2}>
                    <Skeleton variant="rectangular" height={100} sx={{ flex: 1, borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={100} sx={{ flex: 1, borderRadius: 2 }} />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Security Overview */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <SecurityOutlined sx={{ fontSize: 32, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {report?.security_analysis?.title}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={3}>
              {/* Risk Level Card */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    bgcolor: 'background.neutral',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      border: '8px solid',
                      borderColor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {report?.security_analysis?.security_overview?.system_risk_level}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    System Risk Level
                  </Typography>
                </Paper>
              </Grid>

              {/* Alert Statistics */}
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    bgcolor: 'background.neutral',
                    borderRadius: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    boxShadow: 3,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                    Security Alert Breakdown
                  </Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" color="text.secondary">High Priority</Typography>
                        <Typography variant="body2" fontWeight="medium">{report?.security_analysis?.security_overview?.alert_breakdown?.high}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={report?.security_analysis?.security_overview?.alert_breakdown?.high} 
                        color="error"
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>

                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" color="text.secondary">Medium Priority</Typography>
                        <Typography variant="body2" fontWeight="medium">{report?.security_analysis?.security_overview?.alert_breakdown?.medium}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={report?.security_analysis?.security_overview?.alert_breakdown?.medium}
                        color="warning"
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>

                    <Box>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" color="text.secondary">Low Priority</Typography>
                        <Typography variant="body2" fontWeight="medium">{report?.security_analysis?.security_overview?.alert_breakdown?.low}</Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={report?.security_analysis?.security_overview?.alert_breakdown?.low}
                        color="info"
                        sx={{ height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              {/* Summary Stats */}
              <Grid item xs={12} md={12}>
                <Box display="flex" gap={2}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px dashed',
                      borderColor: 'divider',
                      boxShadow: 3,
                      flex: 1,
                      bgcolor: 'background.neutral',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h4" color="error.main" fontWeight="bold">
                      {report?.security_analysis?.security_overview?.total_security_alerts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Security Alerts
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px dashed',
                      borderColor: 'divider',
                      boxShadow: 3,
                      flex: 1,
                      bgcolor: 'background.neutral',
                      borderRadius: 2,
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {report?.security_analysis?.security_overview?.high_risk_agents}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High Risk Agents
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Security Intelligence */}
      <Grid item xs={12} md={12}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Stack spacing={3}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Security color="primary" sx={{ fontSize: 32 }} />
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {report?.security_intelligence?.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" mt={1} gutterBottom>
                      {report?.security_intelligence?.description}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                <Typography variant="h6">
                  Threat Indicators
                </Typography>
                {report?.security_intelligence?.threat_indicators?.map((indicator, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
                    <CheckCircle color="success" fontSize="small" />
                    <Typography variant="body2">
                      {indicator.threat}
                    </Typography>
                  </Box>
                ))}
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Insider Threat Assessment
                </Typography>
                {report?.security_intelligence?.insider_threat_assessment?.map((assessment, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
                    <Shield color="info" fontSize="small" />
                    <Typography variant="body2">
                      {assessment.assessment}
                    </Typography>
                  </Box>
                ))}
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                <Typography variant="h6">
                  Compliance Status
                </Typography>
                {report?.security_intelligence?.compliance_violations?.map((violation, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
                    <Verified color="success" fontSize="small" />
                    <Typography variant="body2">
                      {violation.compliance}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SecurityTab; 