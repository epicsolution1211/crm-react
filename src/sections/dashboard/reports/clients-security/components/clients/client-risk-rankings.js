import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Stack, Paper, Avatar, Chip, Skeleton } from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { alpha } from '@mui/system';
import { getRiskColor } from '../helper';

const ClientRiskRankings = ({ report, loading }) => {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Assignment color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" gutterBottom>
                {report?.client_risk_rankings?.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" mb={2} gutterBottom>
                {report?.client_risk_rankings?.description}
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Stack spacing={2}>
              {[...Array(5)].map((_, index) => (
                <Paper key={index} elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box>
                        <Skeleton variant="text" width={120} height={32} />
                        <Skeleton variant="text" width={80} height={20} />
                      </Box>
                    </Box>
                    <Skeleton variant="rectangular" width={90} height={32} sx={{ borderRadius: 1 }} />
                  </Box>

                  <Grid container spacing={2}>
                    {[...Array(4)].map((_, idx) => (
                      <Grid item xs={6} md={3} key={idx}>
                        <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1 }}>
                          <Skeleton variant="text" width={40} height={32} sx={{ mx: 'auto', mb: 0.5 }} />
                          <Skeleton variant="text" width={80} height={20} sx={{ mx: 'auto' }} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Box mt={2}>
                    <Skeleton variant="text" width={80} height={20} sx={{ mb: 1 }} />
                    <Box display="flex" gap={1}>
                      {[...Array(3)].map((_, idx) => (
                        <Skeleton key={idx} variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                      ))}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Stack spacing={2}>
              {report?.client_risk_rankings?.data?.map((client) => (
                <Paper 
                  key={client.client_id}
                  elevation={0}
                  sx={{ 
                    p: 3,
                    bgcolor: 'background.neutral',
                    borderRadius: 2,
                    boxShadow: 2,
                    border: '1px dashed',
                    borderColor: 'divider',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      bgcolor: (theme) => alpha(theme.palette.primary.light, 0.07),
                      cursor: 'pointer'
                    }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getRiskColor(client.risk_level) + '.light',
                          color: getRiskColor(client.risk_level) + '.dark',
                          width: 48,
                          height: 48
                        }}
                      >
                        {client.client_id}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          Client {client.client_id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Risk Score: {client.risk_score}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={client.risk_level}
                      color={getRiskColor(client.risk_level)}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3} sx={{ position: 'relative' }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'primary.main', boxShadow: 3 }}>
                        <Typography variant="h6" color="primary.main">
                          {client.total_accounts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Accounts
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3} sx={{ position: 'relative' }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'info.main', boxShadow: 3 }}>
                        <Typography variant="h6" color="info.main">
                          {client.total_accesses}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Accesses
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3} sx={{ position: 'relative' }}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'error.main', boxShadow: 3 }}>
                        <Typography variant="h6" color="error.main">
                          {client.high_risk_accounts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          High Risk Accounts
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px dashed', borderColor: 'warning.main', boxShadow: 3 }}>
                        <Typography variant="h6" color="warning.main">
                          {client.risk_score}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Risk Score
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {client.risk_factors && client.risk_factors.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        Risk Factors:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {client.risk_factors.map((factor, index) => (
                          <Chip
                            key={index}
                            label={factor}
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{
                              bgcolor: 'success.dark',
                              color: 'white',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClientRiskRankings;