import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Assignment from '@mui/icons-material/Assignment';
import Visibility from '@mui/icons-material/Visibility';
import Warning from '@mui/icons-material/Warning';
import CheckCircle from '@mui/icons-material/CheckCircle';
import School from '@mui/icons-material/School';
import Policy from '@mui/icons-material/Policy';
import ArrowRight from '@mui/icons-material/ArrowRight';
import Event from '@mui/icons-material/Event';
import { ListSkeleton } from './loading-skeletons';

const RecommendationsTab = ({ report, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="text" width="60%" height={32} />
              <Skeleton variant="text" width="80%" height={24} />
            </Box>
          </Box>
        </Grid>

        {/* Priority Actions Card */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ bgcolor: 'background.neutral', mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={200} />
              </Box>
              
              <Grid container spacing={2}>
                {[...Array(3)].map((_, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Monitoring Strategy */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={200} />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2, 
                    mb: 3,
                    flexWrap: 'wrap'
                  }}>
                    {[...Array(3)].map((_, index) => (
                      <Card key={index} sx={{ p: 2, minWidth: 200 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Skeleton variant="circular" width={40} height={40} />
                          <Box>
                            <Skeleton variant="text" width={60} height={40} />
                            <Skeleton variant="text" width={100} height={20} />
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} sx={{ p: 2, mb: 2 }}>
                      <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {[...Array(5)].map((_, chipIndex) => (
                          <Skeleton 
                            key={chipIndex}
                            variant="rectangular"
                            width={80}
                            height={24}
                            sx={{ borderRadius: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Card>
                  ))}

                  <Card sx={{ p: 2 }}>
                    <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
                    <List dense>
                      {[...Array(4)].map((_, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Skeleton variant="circular" width={20} height={20} />
                          </ListItemIcon>
                          <ListItemText>
                            <Skeleton variant="text" width="90%" />
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Training & Policy Column */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={100} />
                </Box>
                
                <ListSkeleton items={3} />
              </CardContent>
            </Card>

            <Card elevation={2}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={120} />
                </Box>

                <ListSkeleton items={3} />
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Assignment color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h5" gutterBottom>
              Operational Security Recommendations
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Strategic recommendations and actions for improving system security
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Priority Actions Card */}
      <Grid item xs={12}>
        <Card elevation={0} sx={{ bgcolor: 'background.neutral', mb: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Event color="primary" />
              <Typography variant="h6">Priority Actions</Typography>
            </Box>
            
            <Grid container spacing={2}>
              {report?.operational_security_recommendations?.immediate_actions?.map((action, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{
                      height: '100%',
                      border: '2px dotted',
                      borderColor: action.priority === 'High' ? 'error.main' : 
                                  action.priority === 'Medium' ? 'warning.main' : 'success.main',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Chip 
                          label={action.priority}
                          color={action.priority === 'High' ? 'error' : 
                                action.priority === 'Medium' ? 'warning' : 'success'}
                          size="small"
                          sx={{ borderRadius: 0.5 }}
                        />
                      </Box>
                      <Typography variant="body1">{action.action}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Monitoring Strategy */}
      <Grid item xs={12} md={8}>
        <Card elevation={2}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Visibility color="primary" />
              <Typography variant="h5">Monitoring Strategy</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  mb: 3,
                  flexWrap: 'wrap'
                }}>
                  <Card 
                    sx={{ 
                      p: 2, 
                      minWidth: 200,
                      border: '1px dashed',
                      borderColor: 'divider',
                      boxShadow: 3,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Warning sx={{ fontSize: 40 }} color="error" />
                      <Box>
                        <Typography variant="h4">
                          {report?.operational_security_recommendations?.monitoring_strategy?.high_priority_agents?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          High Priority
                        </Typography>
                      </Box>
                    </Box>
                  </Card>

                  <Card 
                    sx={{ 
                      p: 2, 
                      minWidth: 200,
                      border: '1px dashed',
                      borderColor: 'divider',
                      boxShadow: 3,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Visibility sx={{ fontSize: 40 }} color="warning" />
                      <Box>
                        <Typography variant="h4">
                          {report?.operational_security_recommendations?.monitoring_strategy?.enhanced_monitoring_agents?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Enhanced Monitoring
                        </Typography>
                      </Box>
                    </Box>
                  </Card>

                  <Card 
                    sx={{ 
                      p: 2, 
                      minWidth: 200,
                      border: '1px dashed',
                      borderColor: 'divider',
                      boxShadow: 3,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <CheckCircle sx={{ fontSize: 40 }} color="success" />
                      <Box>
                        <Typography variant="h4">
                          {report?.operational_security_recommendations?.monitoring_strategy?.routine_monitoring_agents?.length || 0}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Routine Monitoring
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={12} spacing={3}>
                <Card sx={{ p: 2, marginBottom: 3, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="subtitle1" color="error.main" fontWeight="bold" gutterBottom>
                    High Priority Agents
                  </Typography>
                  {report?.operational_security_recommendations?.monitoring_strategy?.high_priority_agents?.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {report?.operational_security_recommendations?.monitoring_strategy?.high_priority_agents?.map((agentId) => (
                        <Chip
                          key={agentId}
                          label={`Agent ${agentId}`}
                          variant="filled"
                          color="error"
                          size="small"
                          onClick={() => {}}
                          sx={{ 
                            borderRadius: 0.5,
                            '&:hover': { 
                              bgcolor: 'error.main',
                              color: 'white'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Card>

                <Card sx={{ p: 2, marginBottom: 3, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="subtitle1" color="warning.main" fontWeight="bold" gutterBottom>
                    Enhanced Monitoring Agents
                  </Typography>
                  {report?.operational_security_recommendations?.monitoring_strategy?.enhanced_monitoring_agents?.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {report?.operational_security_recommendations?.monitoring_strategy?.enhanced_monitoring_agents?.map((agentId) => (
                        <Chip
                          key={agentId}
                          label={`Agent ${agentId}`}
                          variant="filled"
                          color="warning"
                          size="small"
                          onClick={() => {}}
                          sx={{ 
                            borderRadius: 0.5,
                            '&:hover': { 
                              bgcolor: 'warning.main',
                              color: 'white'
                            }
                          }}
                        />
                        ))}
                      </Box>
                    )}
                </Card>

                <Card sx={{ p: 2, marginBottom: 3, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="subtitle1" color="success.main" fontWeight="bold" gutterBottom>
                    Routine Monitoring Agents
                  </Typography>
                  {report?.operational_security_recommendations?.monitoring_strategy?.routine_monitoring_agents?.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {report?.operational_security_recommendations?.monitoring_strategy?.routine_monitoring_agents?.map((agentId) => (
                      <Chip
                        key={agentId}
                        label={`Agent ${agentId}`}
                        variant="filled"
                        color="success"
                        size="small"
                        onClick={() => {}}
                        sx={{ 
                          borderRadius: 0.5,
                          '&:hover': { 
                            bgcolor: 'success.main',
                            color: 'white'
                          }
                        }}
                      />
                    ))}
                  </Box>
                  )}
                </Card>
                  
                <Card sx={{ p: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="subtitle1" color="info.main" fontWeight="bold" gutterBottom>
                    Monitoring Recommendations
                  </Typography>
                  <List dense>
                    {report?.operational_security_recommendations?.monitoring_strategy?.recommendations?.map((rec, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ArrowRight color="info" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={rec}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Training & Policy Column */}
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <School color="primary" />
                <Typography variant="h6">Training</Typography>
              </Box>
              
              <List dense>
                {report?.operational_security_recommendations?.training_recommendations?.map((training, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      borderRadius: 0.5,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <ListItemIcon>
                      <CheckCircle color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={training}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Policy color="primary" />
                <Typography variant="h6">Policy Updates</Typography>
              </Box>

              <List dense>
                {report?.operational_security_recommendations?.policy_updates?.map((policy, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      borderRadius: 0.5,
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
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default RecommendationsTab; 