import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Badge,
  Skeleton,
} from '@mui/material';
import {
  Dashboard,
  Group,
  PersonOutline,
  Business,
  Speed,
  TrendingUp,
  Warning,
  Analytics,
} from '@mui/icons-material';
import MetricCard from './metric-card';
import { getActivityColor, getSecurityColor } from '../constants';

const OverviewTab = ({ report, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {/* Executive Summary Skeleton */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={200} />
              </Box>
              <Grid container spacing={3}>
                {[...Array(6)].map((_, index) => (
                  <Grid item xs={12} md={6} lg={3} key={index}>
                    <Card>
                      <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box>
                            <Skeleton variant="text" width={120} />
                            <Skeleton variant="text" width={80} height={40} />
                            <Skeleton variant="text" width={140} />
                          </Box>
                          <Skeleton variant="circular" width={40} height={40} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Client Coverage Analysis Skeleton */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={200} />
              </Box>
              <Grid container spacing={3}>
                {[...Array(4)].map((_, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card>
                      <Box sx={{ p: 2 }}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Skeleton variant="circular" width={40} height={40} />
                          <Box flex={1}>
                            <Skeleton variant="text" width={100} />
                            <Skeleton variant="text" width={60} height={32} />
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Executive Summary */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Dashboard color="primary" />
              <Typography variant="h5">
                {report?.executive_summary?.title || "Executive Summary"}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard
                  title="Total Agents"
                  value={report?.executive_summary?.key_metrics?.total_agents_analyzed}
                  icon={<Group sx={{ fontSize: 40 }} />}
                  subtitle="Total agents in system"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard
                  title="Active Agents (24h)"
                  value={report?.executive_summary?.key_metrics?.active_agents_last_24h}
                  icon={<PersonOutline sx={{ fontSize: 40 }} />}
                  color="success"
                  subtitle="Active in last 24 hours"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard
                  title="Total Clients"
                  value={report?.executive_summary?.key_metrics?.total_unique_clients_served}
                  icon={<Business sx={{ fontSize: 40 }} />}
                  color="info"
                  subtitle="Unique clients served"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard
                  title="Total Accesses"
                  value={report?.executive_summary?.key_metrics?.total_system_accesses}
                  icon={<Speed sx={{ fontSize: 40 }} />}
                  color="warning"
                  subtitle="System accesses"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard
                  title="High Risk Agents"
                  value={report?.executive_summary?.key_metrics?.high_risk_agents}
                  icon={<Warning sx={{ fontSize: 40 }} />}
                  color="error"
                  subtitle="Agents requiring attention"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MetricCard
                  title="System Utilization"
                  value={`${report?.executive_summary?.key_metrics?.system_utilization_rate ?? 0}%`}
                  icon={<TrendingUp sx={{ fontSize: 40 }} />}
                  color="primary"
                  subtitle="Current utilization rate"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Client Coverage Analysis */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Group color="primary" />
              <Typography variant="h5">
                {report?.client_coverage_analysis?.title || "Client Coverage Analysis"}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'primary.dark', boxShadow: 3 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Business />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Total Clients
                      </Typography>
                      <Typography variant="h5" color="primary.main" fontWeight="bold">
                        {report?.client_coverage_analysis?.coverage_metrics?.total_clients_served}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'success.dark', boxShadow: 3 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <PersonOutline />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Avg Clients/Agent
                      </Typography>
                      <Typography variant="h5" color="success.main" fontWeight="bold">
                        {report?.client_coverage_analysis?.coverage_metrics?.average_clients_per_agent?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', p: 2, borderRadius: 2, height: '100%', border: '1px dashed', borderColor: 'warning.dark', boxShadow: 3 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Speed />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Avg Accesses/Client
                      </Typography>
                      <Typography variant="h5" color="warning.main" fontWeight="bold">
                        {report?.client_coverage_analysis?.coverage_metrics?.average_accesses_per_client?.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'info.dark', boxShadow: 3 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        System Utilization
                      </Typography>
                      <Typography variant="subtitle1" color="info.main">
                        {report?.client_coverage_analysis?.coverage_metrics?.system_utilization_level}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* System Analytics */}
      <Grid item xs={12} lg={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Analytics color="primary" />
              <Typography variant="h5">
                {report?.system_analytics?.title || "System Analytics"}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'success.dark', boxShadow: 3 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Peak Activity Agents
                      </Typography>
                      <Typography variant="h5" color="success.main" fontWeight="bold">
                        {report?.system_analytics?.usage_patterns?.peak_activity_agents}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'warning.dark', boxShadow: 3 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Speed />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="warning.main">
                        Consistent Performers
                      </Typography>
                      <Typography variant="h5" color="warning.main" fontWeight="bold">
                        {report?.system_analytics?.usage_patterns?.consistent_performers}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'info.dark', boxShadow: 3 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <PersonOutline />
                    </Avatar>
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Occasional Users
                      </Typography>
                      <Typography variant="h5" color="info.main" fontWeight="bold">
                        {report?.system_analytics?.usage_patterns?.occasional_users}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Performance Distribution */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
              <Analytics color="primary" />
              <Typography variant="h5">
                {report?.performance_analytics?.title || "Performance Distribution"}
              </Typography>
            </Box>
            
            {/* Top Performers */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={3}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {report?.performance_analytics?.top_performers?.title || "Top Performing Agents"}
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      {report?.performance_analytics?.top_performers?.agents?.map((agent, index) => (
                        <Grid item xs={12} md={3} key={agent.agent_id}>
                          <Card 
                            sx={{
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              border: '1px dashed',
                              borderColor: 'divider',
                              boxShadow: 3,
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4
                              }
                            }}
                          >
                            <CardContent>
                              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" mb={2}>
                                <Badge 
                                  badgeContent={index + 1} 
                                  color="primary"
                                  sx={{
                                    '& .MuiBadge-badge': {
                                      width: 26,
                                      height: 26,
                                      borderRadius: '50%'
                                    }
                                  }}
                                >
                                  <Avatar 
                                    sx={{ 
                                      width: 80, 
                                      height: 80,
                                      bgcolor: index === 0 ? 'success.main' : 'primary.dark',
                                      fontSize: '2rem'
                                    }}
                                  >
                                    {agent.agent_name.charAt(0)}
                                  </Avatar>
                                </Badge>
                                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                                  {agent.agent_name}
                                </Typography>
                              </Box>

                              <Box 
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(2, 1fr)',
                                  gap: 2,
                                  mb: 2
                                }}
                              >
                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>
                                  <Typography variant="h4" color="primary.main">
                                    {agent.total_accesses}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Accesses
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'background.neutral', borderRadius: 1 }}>
                                  <Typography variant="h4" color="success.main">
                                    {agent.total_clients_accessed}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Clients
                                  </Typography>
                                </Box>
                              </Box>

                              <Box display="flex" flexDirection="column" gap={1}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Typography variant="body2" color="text.secondary">
                                    Activity Level
                                  </Typography>
                                  <Chip 
                                    label={agent.activity_level}
                                    color={getActivityColor(agent.activity_level)}
                                    size="small"
                                    sx={{ minWidth: 90 }}
                                  />
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Typography variant="body2" color="text.secondary">
                                    Security Status
                                  </Typography>
                                  <Chip 
                                    label={agent.security_status}
                                    color={getSecurityColor(agent.security_status)}
                                    size="small"
                                    sx={{ minWidth: 90 }}
                                  />
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Typography variant="body2" color="text.secondary">
                                    Performance
                                  </Typography>
                                  <Typography variant="body2" color="text.primary" fontWeight="medium">
                                    {agent.performance_rating}
                                  </Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Typography variant="body2" color="text.secondary">
                                    Workload
                                  </Typography>
                                  <Typography variant="body2" color="text.primary" fontWeight="medium">
                                    {agent.workload_analysis}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            
              {/* Performance Distribution Charts */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)', border: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Performance Distribution
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(report?.performance_analytics?.performance_distribution?.by_performance || {}).map(([key, value]) => {
                      const percentage = (value / report?.executive_summary?.key_metrics?.total_agents_analyzed) * 100;
                      return (
                        <Box key={key} sx={{ mb: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box 
                                sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%',
                                  bgcolor: key === 'high_performers' ? 'success.dark' :
                                          key === 'standard_performers' ? 'info.dark' : 'warning.dark'
                                }} 
                              />
                              <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                                {key.replace(/_/g, ' ')}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" color="primary" fontWeight="bold">
                                {value}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ({percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage}
                            sx={{ 
                              height: 8, 
                              borderRadius: 2,
                              bgcolor: 'grey.900',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: key === 'high_performers' ? 'success.dark' :
                                        key === 'standard_performers' ? 'info.dark' : 'warning.dark'
                              }
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.2)', border: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    Workload Distribution
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {Object.entries(report?.performance_analytics?.performance_distribution?.by_workload || {}).map(([key, value]) => {
                      const percentage = (value / report?.executive_summary?.key_metrics?.total_agents_analyzed) * 100;
                      return (
                        <Box key={key} sx={{ mb: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box 
                                sx={{ 
                                  width: 8, 
                                  height: 8, 
                                  borderRadius: '50%',
                                  bgcolor: key === 'light' ? 'success.dark' :
                                          key === 'moderate' ? 'info.dark' :
                                          key === 'heavy' ? 'warning.dark' : 'error.dark'
                                }} 
                              />
                              <Typography variant="body2" sx={{ textTransform: 'capitalize', fontWeight: 500 }}>
                                {key} Workload
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" color="primary" fontWeight="bold">
                                {value}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ({percentage.toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={percentage}
                            sx={{ 
                              height: 8, 
                              borderRadius: 2,
                              bgcolor: 'grey.900',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: key === 'light' ? 'success.dark' :
                                        key === 'moderate' ? 'info.dark' :
                                        key === 'heavy' ? 'warning.dark' : 'error.dark'
                              }
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3 }}>
                  <Typography variant="h6" color="text.primary" gutterBottom>
                    System Efficiency Metrics
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Average Accesses per Agent
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          {report?.performance_analytics?.system_efficiency?.average_accesses_per_agent?.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          Average Clients per Agent
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          {report?.performance_analytics?.system_efficiency?.average_clients_per_agent?.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                          System Efficiency Ratio
                        </Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold">
                          {report?.performance_analytics?.system_efficiency?.system_efficiency_ratio?.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OverviewTab; 