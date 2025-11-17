import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Analytics from '@mui/icons-material/Analytics';
import Group from '@mui/icons-material/Group';
import AssessmentOutlined from '@mui/icons-material/AssessmentOutlined';
import CompareArrows from '@mui/icons-material/CompareArrows';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Warning from '@mui/icons-material/Warning';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import WarningAmber from '@mui/icons-material/WarningAmber';
import SpeedOutlined from '@mui/icons-material/SpeedOutlined';
import TimelineOutlined from '@mui/icons-material/TimelineOutlined';
import PsychologyOutlined from '@mui/icons-material/PsychologyOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import Groups2 from '@mui/icons-material/Groups2';
import Timeline from '@mui/icons-material/Timeline';
import { alpha } from '@mui/system';
import { TableSkeleton } from './loading-skeletons';
import { getSecurityColor, getActivityColor, getRiskColor } from '../constants';

const AgentsTab = ({ report, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Skeleton variant="circular" width={32} height={32} />
                <Box>
                  <Skeleton variant="text" width={250} height={32} />
                  <Skeleton variant="text" width={350} height={24} />
                </Box>
              </Box>

              <Grid container spacing={2}>
                {[...Array(4)].map((_, index) => (
                  <Grid sx={{ position: 'relative' }} item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2, bgcolor: 'background.neutral', borderRadius: 2, height: '100%' }}>
                      <Skeleton variant="text" width={120} height={24} />
                      <Skeleton variant="text" width={80} height={40} />
                      <Skeleton variant="text" width={100} height={20} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableSkeleton />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Analytics color="primary" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {report?.agent_security_overview?.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" mt={1}>
                    {report?.agent_security_overview?.description}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Metrics Overview */}
            <Grid container spacing={2} mt={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle2" color="text.primary" gutterBottom>
                    Total Agents
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {report?.agent_security_overview?.total_agents_analyzed}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Analyzed in system
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle2" color="text.primary" gutterBottom>
                    High Risk Agents
                  </Typography>
                  <Typography variant="h4" color={report?.agent_security_overview?.high_risk_agents_count > 0 ? 'error.main' : 'success.main'}>
                    {report?.agent_security_overview?.high_risk_agents_count}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requiring attention
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle2" color="text.primary" gutterBottom>
                    Security Alerts
                  </Typography>
                  <Typography variant="h4" color={report?.agent_security_overview?.agents_with_security_alerts > 0 ? 'warning.main' : 'success.main'}>
                    {report?.agent_security_overview?.agents_with_security_alerts}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Active alerts
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 2, height: '100%' }}>
                  <Typography variant="subtitle2" color="text.primary" gutterBottom>
                    System Health
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Typography variant="h4" color={report?.agent_security_overview?.system_security_health >= 90 ? 'success.main' : 'warning.main'}>
                      {report?.agent_security_overview?.system_security_health}%
                    </Typography>
                    {report?.agent_security_overview?.system_security_health >= 90 ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Warning color="warning" />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Overall security score
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Agent Directory */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            {/* Header Section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Group color="primary" sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {report?.complete_agent_directory?.title || "All Active Agents"} ({report?.complete_agent_directory?.total_agents})
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Agent Directory Table */}
            <TableContainer sx={{ maxHeight: 500, mt: 1 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Agent</TableCell>
                    <TableCell align="center">Clients Accessed</TableCell>
                    <TableCell align="center">Total Accesses</TableCell>
                    <TableCell align="center">Activity Level</TableCell>
                    <TableCell align="center">Security Status</TableCell>
                    <TableCell align="center">Performance</TableCell>
                    <TableCell align="center">Workload</TableCell>
                    <TableCell>Last Access</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report?.complete_agent_directory?.agents?.map((agent) => (
                    <TableRow 
                      key={agent.agent_id}
                      hover
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar 
                            sx={{ 
                              width: 40, 
                              height: 40,
                              bgcolor: `${['primary', 'secondary', 'error', 'warning', 'info', 'success'][Math.floor(Math.random() * 6)]}.light`
                            }}
                          >
                            {agent.agent_name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">
                              {agent.agent_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {agent.agent_id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="medium">
                          {agent.total_clients_accessed}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight="medium">
                          {agent.total_accesses}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={agent.activity_level}
                          color={getActivityColor(agent.activity_level)}
                          size="small"
                          sx={{ minWidth: 85 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={agent.security_status}
                          color={getSecurityColor(agent.security_status)}
                          size="small"
                          sx={{ minWidth: 85 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: 'background.neutral',
                              fontWeight: 'medium'
                            }}
                          >
                            {agent.performance_rating}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: 'background.neutral',
                              fontWeight: 'medium'
                            }}
                          >
                            {agent.workload_analysis}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(agent.last_access).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Risk Rankings */}
      <Grid item xs={12} md={12}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <AssessmentOutlined color="primary" />
              <Typography variant="h5">Agent Risk Rankings</Typography>
            </Box>

            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
              {report?.agent_risk_rankings?.description}
            </Typography>

            <Stack spacing={2}>
              {report?.agent_risk_rankings?.data?.map((agent) => (
                <Paper 
                  key={agent.agent_id}
                  elevation={0}
                  sx={{ 
                    p: 2.5,
                    bgcolor: 'background.neutral',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    boxShadow: 2,
                    border: '1px dashed #e0e0e015',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    }
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar 
                        sx={{ 
                          color: 'primary.main',
                          width: 48,
                          height: 48
                        }}
                      >
                        {agent.agent_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {agent.agent_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {agent.agent_id}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={agent.risk_level}
                      color={getRiskColor(agent.risk_level)}
                      size="small"
                      sx={{ 
                        borderRadius: 1,
                        px: 1,
                        '& .MuiChip-label': {
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1, border: '1px dashed', borderColor: 'primary.dark', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
                        <Typography variant="h6" color="primary.main">
                          {agent.risk_score}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Risk Score
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1, border: '1px dashed', borderColor: 'warning.dark', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
                        <Typography variant="h6" color="warning.main">
                          {agent.recent_activity_level}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Activity Level
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1, border: '1px dashed', borderColor: 'info.dark', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
                        <Typography variant="h6" color="info.main">
                          {agent.total_clients_accessed}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Clients
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 1, border: '1px dashed', borderColor: 'error.dark', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
                        <Typography variant="h6" color="error.main">
                          {agent.security_alerts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Security Alerts
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {agent.behavioral_flags.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        Behavioral Flags:
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {agent?.behavioral_flags?.map((flag, index) => (
                          <Chip
                            key={index}
                            label={flag}
                            size="small"
                            color="default"
                            sx={{ 
                              bgcolor: "info.dark",
                              color: 'white',
                              borderRadius: 1
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Accordion sx={{ mt: 3, bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                    <AccordionSummary 
                      expandIcon={<ExpandMore sx={{ color: 'primary.main' }}/>}
                      sx={{ 
                        px: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="subtitle2" color="text.primary">
                        Detailed Analysis
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                      <Grid container >
                        {/* Basic Data */}
                        <Grid item xs={12}>
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: 'background.neutral',
                            borderRadius: 1,
                            mb: 2 
                          }}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Basic Information
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={6} sm={4} md={3}>
                                <Box sx={{ 
                                  textAlign: 'center', 
                                  p: 2,
                                  border: '1px dashed',
                                  borderColor: 'divider',
                                  boxShadow: 3,
                                  bgcolor: 'background.neutral',
                                  borderRadius: 1,
                                  transition: 'transform 0.2s, box-shadow 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                  }
                                }}>
                                  <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                                    {agent.detailed_analysis.basic_data.clients_accessed}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Clients Accessed
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6} sm={4} md={3}>
                                <Box sx={{ 
                                  textAlign: 'center',
                                  p: 2,
                                  border: '1px dashed',
                                  borderColor: 'divider',
                                  boxShadow: 3,
                                  bgcolor: 'background.neutral',
                                  borderRadius: 1,
                                  transition: 'transform 0.2s, box-shadow 0.2s',
                                  '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 3
                                  }
                                }}>
                                  <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                                    {agent.detailed_analysis.basic_data.total_accesses}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Total Accesses
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={4} md={6}>
                                <Box sx={{ 
                                  p: 2,
                                  border: '1px dashed',
                                  borderColor: 'divider',
                                  boxShadow: 3,
                                  bgcolor: 'background.neutral',
                                  borderRadius: 1,
                                  height: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center'
                                }}>
                                  <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Last Access
                                  </Typography>
                                  <Typography variant="subtitle1" color="text.primary" sx={{ fontWeight: 500 }}>
                                    {agent.detailed_analysis.basic_data.last_access_readable}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>

                        {/* Account Summary */}
                        <Grid item xs={12}>
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: 'background.neutral',
                            borderRadius: 1,
                            mb: 2
                          }}>
                            <Accordion sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), }}>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle2" color="text.primary">
                                  Account Summary
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={2}>
                                  {Object.entries(agent.detailed_analysis.account_summary).map(([accountId, summary]) => (
                                    <Grid item xs={12} md={6} lg={4} key={accountId}>
                                      <Box
                                        sx={{
                                          p: 2,
                                          bgcolor: 'background.paper',
                                          borderRadius: 1,
                                          boxShadow: 1,
                                          border: '1px dashed',
                                          borderColor: 'divider',
                                          transition: 'transform 0.2s, box-shadow 0.2s',
                                          '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 3
                                          }
                                        }}
                                      >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                          <Typography variant="subtitle2">
                                            Account {accountId}
                                          </Typography>
                                          <Typography 
                                            variant="body2" 
                                            sx={{ 
                                              px: 1, 
                                              py: 0.5, 
                                              bgcolor: 'primary.lighter',
                                              color: 'primary.main',
                                              borderRadius: 1,
                                              border: '1px dashed',
                                              borderColor: 'primary.main'
                                            }}
                                          >
                                            {summary.access_count} accesses
                                          </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                          <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                              First Access
                                            </Typography>
                                            <Typography variant="body2">
                                              {summary.first_access_readable}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary" display="block">
                                              Last Access
                                            </Typography>
                                            <Typography variant="body2">
                                              {summary.last_access_readable}
                                            </Typography>
                                          </Grid>
                                          <Grid item xs={12}>
                                            <Box sx={{ 
                                              display: 'flex', 
                                              alignItems: 'center',
                                              mt: 1,
                                              p: 1,
                                              bgcolor: 'background.neutral',
                                              borderRadius: 1
                                            }}>
                                              <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                  Last IP
                                                </Typography>
                                                <Typography variant="body2">
                                                  {summary.last_ip}
                                                </Typography>
                                              </Box>
                                            </Box>
                                          </Grid>
                                        </Grid>
                                      </Box>
                                    </Grid>
                                  ))}
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          </Box>
                        </Grid>

                        {/* Suspicious Activity */}
                        <Grid item xs={12}>
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: 'background.neutral',
                            borderRadius: 1,
                            mb: 2
                          }}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Suspicious Activity
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Hourly Activity
                                  </Typography>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Clients Accessed
                                      </Typography>
                                      <Typography variant="body2">
                                        {agent.detailed_analysis.suspicious_activity.hourly.total_clients_accessed}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Recent Accesses
                                      </Typography>
                                      <Typography variant="body2">
                                        {agent.detailed_analysis.suspicious_activity.hourly.recent_accesses}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Total Access Count
                                      </Typography>
                                      <Typography variant="body2">
                                        {agent.detailed_analysis.suspicious_activity.hourly.total_access_count}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider', boxShadow: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Daily Activity
                                  </Typography>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Clients Accessed
                                      </Typography>
                                      <Typography variant="body2">
                                        {agent.detailed_analysis.suspicious_activity.daily.total_clients_accessed}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Recent Accesses
                                      </Typography>
                                      <Typography variant="body2">
                                        {agent.detailed_analysis.suspicious_activity.daily.recent_accesses}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Total Access Count
                                      </Typography>
                                      <Typography variant="body2">
                                        {agent.detailed_analysis.suspicious_activity.daily.total_access_count}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                        
                        {/* Risk Profile */}
                        <Grid item xs={12}>
                          <Box sx={{ 
                            p: 3,
                            bgcolor: 'background.neutral',
                            borderRadius: 2,
                            mb: 2,
                            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                          }}>
                            <Box display="flex" alignItems="center" gap={1} mb={2.5}>
                              <Typography variant="subtitle2" color="primary">
                                Risk Profile
                              </Typography>
                            </Box>
                            <Grid container spacing={2.5}>
                              {[
                                {
                                  label: 'Access Volume',
                                  value: agent.detailed_analysis.risk_profile.access_volume_risk,
                                  icon: <SpeedOutlined fontSize="medium" />
                                },
                                {
                                  label: 'Recent Activity',
                                  value: agent.detailed_analysis.risk_profile.recent_activity_risk,
                                  icon: <TimelineOutlined fontSize="medium" />
                                },
                                {
                                  label: 'Behavioral Risk',
                                  value: agent.detailed_analysis.risk_profile.behavioral_risk,
                                  icon: <PsychologyOutlined fontSize="small" />
                                },
                                {
                                  label: 'Alert Risk',
                                  value: agent.detailed_analysis.risk_profile.alert_risk,
                                  icon: <NotificationsOutlined fontSize="small" />
                                }
                              ].map((item) => (
                                <Grid item xs={6} sm={3} key={item.label}>
                                  <Box sx={(theme) => ({ 
                                    p: 2,
                                    height: '100%',
                                    bgcolor: item.value === 'Low' || item.value === 'None' ? alpha(theme.palette.success.main, 0.05) :
                                            item.value === 'Medium' ? alpha(theme.palette.warning.main, 0.05) : alpha(theme.palette.error.main, 0.05),
                                    borderRadius: 2,
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                      transform: 'scale(1.02)'
                                    }
                                  })}>
                                    {item.icon}
                                    <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ fontWeight: 500 }}>
                                      {item.label}
                                    </Typography>
                                    <Typography 
                                      variant="subtitle2" 
                                      sx={{
                                        color: item.value === 'Low' || item.value === 'None' ? 'success.main' :
                                              item.value === 'Medium' ? 'warning.main' : 'error.main',
                                        fontWeight: 600
                                      }}
                                    >
                                      {item.value}
                                    </Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      {/* Cross-Agent Analysis */}
      <Grid item xs={12}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CompareArrows color="primary" />
              <Typography variant="h5">Cross-Agent Pattern Analysis</Typography>
            </Box>

            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              {report?.cross_agent_analysis?.description}
            </Typography>

            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                {
                  label: 'Total Agents Analyzed',
                  value: report?.cross_agent_analysis?.data?.total_agents_analyzed,
                  icon: <Groups2 sx={{ color: 'primary.main' }} />
                },
                {
                  label: 'Client Access Overlap',
                  value: `${report?.cross_agent_analysis?.data?.client_access_overlap}%`,
                  icon: <CompareArrows sx={{ color: 'info.main' }} />
                },
                {
                  label: 'Access Pattern Similarity',
                  value: `${report?.cross_agent_analysis?.data?.access_pattern_similarity}%`,
                  icon: <Timeline sx={{ color: 'success.main' }} />
                }
              ].map((metric) => (
                <Grid item xs={12} md={4} key={metric.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      bgcolor: 'background.neutral',
                      borderRadius: 2,
                      border: '1px dashed #e0e0e015',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      {metric.icon}
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {metric.label}
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1 }}>
                          {metric.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Collaboration Patterns */}
            <Typography variant="h6" mb={2}>
              Cross-Agent Pattern Analysis
            </Typography>
            <Grid container spacing={2}>
              {!report?.cross_agent_analysis?.collaboration_patterns ? (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.warning.main, 0.03),
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'warning.light'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <WarningAmber sx={{ color: 'warning.main', fontSize: 24 }} />
                      <Typography variant="body1" color="warning.main">
                        Insufficient data for pattern analysis
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ) : report?.cross_agent_analysis?.collaboration_patterns?.length === 0 || 
                  report?.cross_agent_analysis?.collaboration_patterns[0]?.pattern === "No significant collaboration patterns detected" ? (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.03),
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'success.light'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <CheckCircleOutline sx={{ color: 'success.main', fontSize: 24 }} />
                      <Typography variant="body1" color="success.main">
                        No significant patterns detected across agents
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ) : (
                report?.cross_agent_analysis?.collaboration_patterns?.map((pattern, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: 'background.neutral', 
                        border: '1px dashed #e0e0e015',
                        borderRadius: 2,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle2" color="primary">
                            Client ID: {pattern.client_id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {pattern.collaboration_type}
                          </Typography>
                        </Box>
                        <Chip
                          label={pattern.pattern_strength}
                          color={pattern.pattern_strength === 'High' ? 'error' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Collaborating Agents:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                          {pattern?.collaborating_agents?.map((agent) => (
                            <Chip
                              key={agent}
                              label={`Agent ${agent}`}
                              size="small"
                              sx={{
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))
              )}
            </Grid>

            {/* Anomalous Behaviors */}
            <Box sx={{ mt: 4, mb: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <ErrorOutline sx={{ color: 'error.main', fontSize: 28 }} />
                <Typography variant="h6">Anomalous Behaviors Detected</Typography>
              </Box>

              {report?.cross_agent_analysis?.anomalous_behaviors?.[0]?.anomaly? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.03),
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'success.light'
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircleOutline sx={{ color: 'success.main', fontSize: 24 }} />
                    <Typography variant="body1" color="success.main">
                      No anomalous behaviors detected across agents
                    </Typography>
                  </Box>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {report?.cross_agent_analysis?.anomalous_behaviors?.map((anomaly, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          height: '100%',
                          bgcolor: (theme) => alpha(theme.palette.error.main, 0.03),
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'error.light',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.error.main, 0.08)}`
                          }
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                          <Box display="flex" gap={2}>
                            <Avatar
                              sx={{
                                bgcolor: (theme) => alpha(theme.palette.error.main, 0.12),
                                color: 'error.main'
                              }}
                            >
                              <WarningAmber />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold" color="error.main">
                                Agent {anomaly.agent_id}
                              </Typography>
                              <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                                {anomaly.anomaly_type}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label="High Risk"
                            color="error"
                            size="small"
                            sx={{ fontWeight: 'medium' }}
                          />
                        </Box>

                        <Box sx={{ mt: 3 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Client Access Count
                              </Typography>
                              <Typography variant="h6" color="text.primary">
                                {anomaly.client_count}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">
                                Deviation 
                              </Typography>
                              <Typography variant="h6" color="text.primary">
                                {anomaly.deviation_from_mean}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
    </Grid>
  );
};

export default AgentsTab; 