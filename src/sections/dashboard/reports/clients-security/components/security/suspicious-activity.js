import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Stack, Skeleton, Paper, Alert, Chip, alpha } from '@mui/material';
import { WarningAmber } from '@mui/icons-material';

const SuspiciousActivity = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <WarningAmber color="warning" />
            <Box>
              <Typography variant="h5">
                {report?.suspicious_activity_patterns?.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" mb={2} mt={1} gutterBottom>
                {report?.suspicious_activity_patterns?.description}
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Stack spacing={3}>
              <Skeleton variant="rectangular" height={100} />
              <Skeleton variant="rectangular" height={200} />
            </Stack>
          ) : (
            <>
              {/* Key Metrics */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: 'background.neutral', height: '100%', borderRadius: 2, textAlign: 'center', border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                    <Typography variant="h4" color="primary.main">
                      {report?.suspicious_activity_patterns?.data?.total_system_recent_accesses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recent System Accesses
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: 'background.neutral', height: '100%', borderRadius: 2, textAlign: 'center', border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                    <Typography variant="h4" color={report?.suspicious_activity_patterns?.data?.high_volume_accounts > 0 ? 'warning.main' : 'success.main'}>
                      {report?.suspicious_activity_patterns?.data?.high_volume_accounts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High Volume Accounts
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: 'background.neutral', height: '100%', borderRadius: 2, textAlign: 'center', border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                    <Typography variant="h4" color="info.main">
                      {report?.suspicious_activity_patterns?.data?.average_recent_accesses_per_account?.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg. Accesses per Account
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: 'background.neutral', height: '100%', borderRadius: 2, textAlign: 'center', border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                    {report?.suspicious_activity_patterns?.data?.pattern_classification ?
                      <Chip
                      label={report?.suspicious_activity_patterns?.data?.pattern_classification}
                      color={report?.suspicious_activity_patterns?.data?.pattern_classification.includes('Low') ? 'success' : 'warning'}
                      sx={{ px: 2, py: 3 }}
                    /> : null}
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      System Classification
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Coordinated Access & Anomalies */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, bgcolor: 'background.neutral', height: '100%' }}>
                    <Typography variant="h6" mb={2}>
                      Coordinated Access Patterns
                    </Typography>
                    {report?.suspicious_activity_patterns?.coordinated_access_detection?.map((item, index) => (
                      <Alert 
                        key={index}
                        severity={item.pattern.includes('No') ? 'success' : 'warning'}
                        sx={{ 
                          mb: 1,
                          bgcolor: item.pattern.includes('No') ? 'success.main' : 'warning.main',
                          color: 'white',
                          '& .MuiAlert-icon': {
                            color: 'white'
                          }
                        }}
                      >
                        {item.pattern}
                      </Alert>
                    ))}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'background.neutral', 
                    height: '100%',
                    borderRadius: 2,
                    boxShadow: 3
                  }}>
                    <Typography variant="h6" mb={3} fontWeight="bold">
                      Anomaly Detection
                    </Typography>
                    {report?.suspicious_activity_patterns?.anomaly_detection?.map((anomaly, index) => (
                      <Box 
                        key={index} 
                        mb={3}
                        sx={{
                          p: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography 
                          variant="subtitle1" 
                          color="text.primary" 
                          fontWeight="medium"
                          mb={2}
                        >
                          {anomaly.anomaly_type}
                        </Typography>
                        <Box 
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary" mr={1}>
                              Outliers Found:
                            </Typography>
                            <Chip 
                              label={anomaly.outlier_count}
                              color={anomaly.outlier_count > 0 ? 'warning' : 'success'}
                              size="small"
                              sx={{ 
                                fontWeight: 'bold',
                                bgcolor: anomaly.outlier_count > 0 ? 'warning.main' : 'success.main', 
                                color: 'white' 
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary" mr={1}>
                              Threshold:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {anomaly?.threshold?.toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                        {anomaly.outlier_values?.length > 0 && (
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1, 
                            flexWrap: 'wrap',
                            p: 1,
                            bgcolor: alpha('#f44336', 0.1),
                            borderRadius: 1
                          }}>
                            {anomaly.outlier_values.map((value, i) => (
                              <Chip
                                key={i}
                                label={value}
                                size="small"
                                sx={{
                                  bgcolor: 'error.main',
                                  color: 'white',
                                  fontWeight: 'medium'
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SuspiciousActivity;