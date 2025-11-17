import React from 'react';
import { Grid, Box, Typography, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Stack, Chip } from '@mui/material';
import { Assignment, Visibility, Policy, CheckCircle, Event } from '@mui/icons-material';
import { ListSkeleton } from './skeleton';

const RecommendationsTab = ({ report, loading }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Assignment color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              {report?.security_recommendations?.title}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" mb={2} mt={1} gutterBottom>
              {report?.security_recommendations?.description}
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Immediate Actions */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Event color="primary" />
              <Typography variant="h6">Immediate Actions</Typography>
            </Box>
            
            {loading ? (
              <ListSkeleton items={3} />
            ) : (
              <List>
                {report?.security_recommendations?.immediate_actions?.map((action, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      borderRadius: 1,
                      mb: 1,
                      border: '1px dashed',
                      borderColor: action.priority === 'High' ? 'error.dark' : 
                        action.priority === 'Medium' ? 'warning.dark' : 'success.dark',
                      boxShadow: 3,
                      bgcolor: 'background.neutral',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      <Chip 
                        label={action.priority}
                        color={action.priority === 'High' ? 'error' : 
                              action.priority === 'Medium' ? 'warning' : 'success'}
                        size="small"
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={action.action}
                      secondary={action.timeline}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Monitoring & Policy */}
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Visibility color="primary" />
                <Typography variant="h6">Monitoring</Typography>
              </Box>
              
              {loading ? (
                <ListSkeleton items={3} />
              ) : (
                <List dense>
                  {report?.security_recommendations?.monitoring_enhancements?.map((enhancement, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircle color="info" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={enhancement}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Policy color="primary" />
                <Typography variant="h6">Policy Updates</Typography>
              </Box>

              {loading ? (
                <ListSkeleton items={3} />
              ) : (
                <List dense>
                  {report?.security_recommendations?.policy_recommendations?.map((policy, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        borderRadius: 1,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={policy}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RecommendationsTab;