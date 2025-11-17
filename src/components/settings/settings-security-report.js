// MUI Core imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import { useTheme } from "@mui/material/styles";
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress from '@mui/material/LinearProgress';

// MUI Icon imports
import DoneIcon from '@mui/icons-material/Done';
import HubIcon from '@mui/icons-material/Hub';
import InfoIcon from '@mui/icons-material/Info';
import BarChartIcon from '@mui/icons-material/BarChart';
import ErrorIcon from '@mui/icons-material/Error';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import RouterIcon from '@mui/icons-material/Router';
import GroupsIcon from '@mui/icons-material/Groups';
import HistoryIcon from '@mui/icons-material/History';
import ReportIcon from '@mui/icons-material/Report';
import BalanceIcon from '@mui/icons-material/Balance';
import GppGoodIcon from '@mui/icons-material/GppGood';
import InsightsIcon from '@mui/icons-material/Insights';
import LanguageIcon from '@mui/icons-material/Language';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import WarningIcon from '@mui/icons-material/Warning';
import BusinessIcon from '@mui/icons-material/Business';
import CompareIcon from '@mui/icons-material/Compare';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import BugReportIcon from '@mui/icons-material/BugReport';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SecurityIcon from '@mui/icons-material/Security';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import PsychologyIcon from '@mui/icons-material/Psychology';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import SecurityUpdateIcon from '@mui/icons-material/SecurityUpdate';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SecurityUpdateWarningIcon from '@mui/icons-material/SecurityUpdateWarning';

// React imports
import { useCallback, useEffect, useState } from 'react';

// Date handling
import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Recharts imports
import { alpha } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// API imports
import { agentsApi } from 'src/api/agents';

const useSecurityReport = (agentId) => {
  const [securityReport, setSecurityReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSecurityReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await agentsApi.getAgentSecurityReport({
        id: agentId,
        type: "agent",
        readable_dates: true,
        include_explanations: true,
      });
      setSecurityReport(response?.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    getSecurityReport();
  }, [getSecurityReport]);

  return { securityReport, loading, error, getSecurityReport };
};

const MetricCard = ({ title, value, icon: Icon, color = 'primary', tooltip, subValue, subLabel }) => {
  return (
    <Card 
      elevation={0}
      sx={(theme) => ({ 
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        border: 1,
        borderColor: theme.palette[color]?.main || theme.palette.primary.main,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: theme.palette.background.default,
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      })}
    >
      <CardContent>
        <Stack spacing={3}>
          {/* Header Section */}
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={(theme) => ({
                backgroundColor: theme.palette.background.default,
                borderRadius: 1,
                p: 1,
                display: 'flex',
                flexShrink: 0
              })}
            >
              <Icon sx={(theme) => ({ 
                color: theme.palette[color]?.main || theme.palette.primary.main,
                fontSize: 24 
              })} />
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    lineHeight: 1.5,
                    wordBreak: 'break-word'
                  }}
                >
                  {title}
                </Typography>
                {tooltip && (
                  <Tooltip title={tooltip}>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        p: 0.5, 
                        flexShrink: 0,
                        '&:hover': {
                          backgroundColor: (theme) => 
                            alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Value Section */}
          <Box>
            <Typography 
              variant="h4" 
              sx={(theme) => ({ 
                color: theme.palette[color]?.main || theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: '0.25px'
              })}
            >
              {value}
            </Typography>
            
            {subValue && (
              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1} 
                sx={{ mt: 1 }}
              >
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.75rem',
                    lineHeight: 1.5
                  }}
                >
                  {subLabel}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={(theme) => ({ 
                    fontWeight: 500,
                    color: theme.palette[color]?.main || theme.palette.primary.main,
                    lineHeight: 1.5
                  })}
                >
                  {subValue}
                </Typography>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ReportOverview = ({ data }) => {
  return (
    <Stack spacing={3}>
      <Card 
        elevation={0}
        sx={{ 
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardHeader
          avatar={<SecurityIcon color="primary" />}
          title={data.title}
          subheader={data.description}
        />
        <CardContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">Key Findings</Typography>
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              {data.key_findings.map((finding, index) => (
                <li key={index}>
                  <Typography variant="body2">{finding}</Typography>
                </li>
              ))}
            </Box>
          </Alert>

          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Report Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 2.5, 
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Report Scope
                    </Typography>
                    <Typography variant="body1">
                      {data.report_scope}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ 
                    p: 2.5, 
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      Security Status
                    </Typography>
                    <Chip
                      label={data.security_status}
                      color={data.security_status.includes('NORMAL') ? 'success' : 'warning'}
                      size="small"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="caption" color="text.secondary" align="right">
              {data.data_freshness}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

const SummaryStats = ({ data }) => {
  const theme = useTheme();

  const accessDistributionData = [
    { name: 'Unique Clients', value: data.metrics.total_unique_clients_accessed.value },
    { name: 'Average Access', value: data.metrics.average_accesses_per_client.value }
  ];

  const colors = [theme.palette.primary.main, theme.palette.success.main];

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<AssessmentIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <MetricCard
              title="Total Clients"
              value={data.metrics.total_unique_clients_accessed.value}
              icon={GroupIcon}
              tooltip={data.metrics.total_unique_clients_accessed.explanation}
              subValue={data.metrics.total_unique_clients_accessed.benchmark}
              subLabel="Benchmark"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <MetricCard
              title="Total Accesses"
              value={data.metrics.total_access_count.value}
              icon={AccessTimeIcon}
              color="success"
              tooltip={data.metrics.total_access_count.explanation}
              subValue={data.metrics.total_access_count.intensity_level}
              subLabel="Intensity"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <MetricCard
              title="Unique IPs"
              value={data.metrics.unique_ip_addresses_used.value}
              icon={LanguageIcon}
              color="info"
              tooltip={data.metrics.unique_ip_addresses_used.explanation}
              subValue={data.metrics.unique_ip_addresses_used.mobility_assessment}
              subLabel="Mobility"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <MetricCard
              title="Session Duration"
              value={`${data.metrics.session_duration_estimate.value}h`}
              icon={ScheduleIcon}
              color="warning"
              tooltip={data.metrics.session_duration_estimate.explanation}
              subValue={data.metrics.session_duration_estimate.usage_pattern}
              subLabel="Pattern"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} lg={7}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">Access Timeline</Typography>
              <Box sx={{ 
                p: 2.5, 
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Stack spacing={2}>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    spacing={2}
                  >
                    <Stack>
                      <Typography variant="body2" color="text.secondary">
                        First Access
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(data.metrics.first_recorded_access.value), 'PPpp')}
                      </Typography>
                    </Stack>
                    <Stack align={{ xs: 'left', sm: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Last Access
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(data.metrics.last_recorded_access.value), 'PPpp')}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      {data.metrics.first_recorded_access.explanation}
                    </Typography>
                  </Alert>
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">IP Addresses Used</Typography>
              <Box sx={{ 
                p: 2.5, 
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                minHeight: '100%'
              }}>
                <Stack spacing={1.5}>
                  {data.metrics.ip_addresses.value.map((ip, index) => (
                    <Chip
                      key={index}
                      label={ip}
                      variant="outlined"
                      size="small"
                      icon={<LanguageIcon />}
                    />
                  ))}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {data.metrics.ip_addresses.security_note}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, height: 300 }}>
          <Typography variant="subtitle2" gutterBottom>
            Access Distribution
          </Typography>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={accessDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {accessDistributionData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="center" 
            spacing={2} 
            sx={{ mt: 2 }}
            alignItems="center"
          >
            {accessDistributionData.map((item, index) => (
              <Stack key={item.name} direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: 0.5,
                    bgcolor: colors[index]
                  }}
                />
                <Typography variant="body2">{item.name}: {item.value}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

const ActivityBreakdown = ({ data }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<QueryStatsIcon color="primary" />}
        title={data.title}
        subheader={data.description}
        action={
          <Tooltip title={data.interpretation_guide}>
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Current Hour Activity */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <HourglassTopIcon color="primary" />
                  <Typography variant="subtitle2">
                    {data.periods.last_hour.title}
                  </Typography>
                </Stack>
                
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" color="primary">
                      {data.periods.last_hour.total_accesses}
                    </Typography>
                    <Chip 
                      label={data.periods.last_hour.activity_level}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Stack>
                  
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Clients Accessed
                      </Typography>
                      <Typography variant="body2">
                        {data.periods.last_hour.clients_accessed}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Threshold Status
                      </Typography>
                      <Typography variant="body2">
                        {data.periods.last_hour.threshold_status}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={data.periods.last_hour.percentage_of_total}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {data.periods.last_hour.percentage_of_total}% of total activity
                    </Typography>
                  </Box>
                </Stack>

                <Alert severity="info" sx={{ mt: 'auto' }}>
                  <Typography variant="caption">
                    {data.periods.last_hour.explanation}
                  </Typography>
                </Alert>
              </Stack>
            </Box>
          </Grid>

          {/* Daily Activity */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarTodayIcon color="success" />
                  <Typography variant="subtitle2">
                    {data.periods.last_24_hours.title}
                  </Typography>
                </Stack>
                
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" color="success.main">
                      {data.periods.last_24_hours.total_accesses}
                    </Typography>
                    <Chip 
                      label={data.periods.last_24_hours.activity_level}
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                  </Stack>
                  
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Clients Accessed
                      </Typography>
                      <Typography variant="body2">
                        {data.periods.last_24_hours.clients_accessed}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Threshold Status
                      </Typography>
                      <Typography variant="body2">
                        {data.periods.last_24_hours.threshold_status}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={data.periods.last_24_hours.percentage_of_total}
                      color="success"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {data.periods.last_24_hours.percentage_of_total}% of total activity
                    </Typography>
                  </Box>
                </Stack>

                <Alert severity="info" sx={{ mt: 'auto' }}>
                  <Typography variant="caption">
                    {data.periods.last_24_hours.explanation}
                  </Typography>
                </Alert>
              </Stack>
            </Box>
          </Grid>

          {/* Weekly Activity */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DateRangeIcon color="warning" />
                  <Typography variant="subtitle2">
                    {data.periods.last_7_days.title}
                  </Typography>
                </Stack>
                
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" color="warning.main">
                      {data.periods.last_7_days.total_accesses}
                    </Typography>
                    <Chip 
                      label={data.periods.last_7_days.activity_level}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Stack>
                  
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Clients Accessed
                      </Typography>
                      <Typography variant="body2">
                        {data.periods.last_7_days.clients_accessed}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Trend Analysis
                      </Typography>
                      <Typography variant="body2">
                        {data.periods.last_7_days.trend_analysis}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={data.periods.last_7_days.percentage_of_total}
                      color="warning"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                      {data.periods.last_7_days.percentage_of_total}% of total activity
                    </Typography>
                  </Box>
                </Stack>

                <Alert severity="info" sx={{ mt: 'auto' }}>
                  <Typography variant="caption">
                    {data.periods.last_7_days.explanation}
                  </Typography>
                </Alert>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ActivityBreakdown.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    interpretation_guide: PropTypes.string.isRequired,
    periods: PropTypes.object.isRequired
  }).isRequired
};

const BehavioralPatterns = ({ data }) => {
  const theme = useTheme();

  // Prepare data for the access distribution chart
  const distributionData = [
    { name: 'Minimum', value: data.insights.access_frequency_distribution.value.min },
    { name: 'Average', value: data.insights.access_frequency_distribution.value.average },
    { name: 'Maximum', value: data.insights.access_frequency_distribution.value.max }
  ];

  // Prepare data for the client usage chart
  const clientUsageData = Object.entries(data.insights.clients_by_access_range.value).map(([key, value]) => ({
    name: key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: value
  }));

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<PsychologyIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Peak Access Time */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTimeIcon color="primary" />
                  <Typography variant="subtitle2">Peak Activity Time</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h3" color="primary">
                    {data.insights.peak_access_hour.value}
                  </Typography>
                  <Chip 
                    label={data.insights.peak_access_hour.work_schedule_insight}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>

                <Alert severity="info">
                  <Typography variant="caption">
                    {data.insights.peak_access_hour.explanation}
                  </Typography>
                </Alert>
              </Stack>
            </Box>
          </Grid>

          {/* Access Distribution */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <BarChartIcon color="success" />
                  <Typography variant="subtitle2">Access Distribution</Typography>
                </Stack>

                <Box sx={{ width: '100%', height: 120 }}>
                  <ResponsiveContainer>
                    <BarChart data={distributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="value" fill={theme.palette.success.main} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Pattern Type</Typography>
                    <Typography variant="body2">{data.insights.access_frequency_distribution.pattern_type}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Variability</Typography>
                    <Typography variant="body2">{data.insights.access_frequency_distribution.variability_assessment}</Typography>
                  </Stack>
                </Stack>

                <Alert severity="info">
                  <Typography variant="caption">
                    {data.insights.access_frequency_distribution.explanation}
                  </Typography>
                </Alert>
              </Stack>
            </Box>
          </Grid>

          {/* Client Usage Patterns */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <GroupIcon color="warning" />
                  <Typography variant="subtitle2">Client Usage Patterns</Typography>
                </Stack>

                <Box sx={{ width: '100%', height: 120 }}>
                  <ResponsiveContainer>
                    <BarChart data={clientUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="value" fill={theme.palette.warning.main} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Portfolio Analysis</Typography>
                    <Typography variant="body2">{data.insights.clients_by_access_range.portfolio_analysis}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Management Style</Typography>
                    <Typography variant="body2">{data.insights.clients_by_access_range.management_style}</Typography>
                  </Stack>
                </Stack>

                <Alert severity="info">
                  <Typography variant="caption">
                    {data.insights.clients_by_access_range.explanation}
                  </Typography>
                </Alert>
              </Stack>
            </Box>
          </Grid>

          {/* Recent vs Old Clients */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CompareArrowsIcon color="info" />
                  <Typography variant="subtitle2">Client Retention Analysis</Typography>
                </Stack>

                <Stack spacing={2}>
                  <Box sx={{ position: 'relative', pt: 2 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h4" color="info.main">
                        {data.insights.recent_vs_old_clients.value.recent_percentage}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Recent Client Rate
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={data.insights.recent_vs_old_clients.value.recent_percentage}
                      color="info"
                      sx={{ height: 8, borderRadius: 1, mt: 6 }}
                    />
                  </Box>

                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Recent Clients</Typography>
                      <Typography variant="body2">{data.insights.recent_vs_old_clients.value.recent_clients}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Historical Clients</Typography>
                      <Typography variant="body2">{data.insights.recent_vs_old_clients.value.old_clients}</Typography>
                    </Stack>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Engagement Trend</Typography>
                      <Typography variant="body2">{data.insights.recent_vs_old_clients.engagement_trend}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Retention Status</Typography>
                      <Typography variant="body2">{data.insights.recent_vs_old_clients.retention_indicator}</Typography>
                    </Stack>
                  </Stack>

                  <Alert severity="info">
                    <Typography variant="caption">
                      {data.insights.recent_vs_old_clients.explanation}
                    </Typography>
                  </Alert>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

BehavioralPatterns.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    insights: PropTypes.object.isRequired
  }).isRequired
};

const ClientRelationshipAnalysis = ({ data }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<BusinessIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Key Relationships Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ px: 1 }}>
              Key Client Relationships
            </Typography>
            <Grid container spacing={3}>
              {/* Most Accessed Client */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <StarIcon color="warning" />
                        <Typography variant="subtitle2">Most Accessed Client</Typography>
                      </Stack>
                      <Chip 
                        label={`Client ${data.key_relationships.most_accessed_client.client_id}`}
                        color="primary"
                        size="small"
                      />
                    </Stack>

                    <Box sx={{ position: 'relative', pt: 1 }}>
                      <Typography variant="h3" color="warning.main" align="center">
                        {data.key_relationships.most_accessed_client.access_count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center" display="block">
                        Total Accesses
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={data.key_relationships.most_accessed_client.percentage_of_total_accesses}
                        color="warning"
                        sx={{ height: 8, borderRadius: 1, mt: 1 }}
                      />
                      <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 0.5 }}>
                        {data.key_relationships.most_accessed_client.percentage_of_total_accesses}% of total accesses
                      </Typography>
                    </Box>

                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">First Access</Typography>
                        <Typography variant="body2">
                          {format(new Date(data.key_relationships.most_accessed_client.first_access), 'PPp')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Last Access</Typography>
                        <Typography variant="body2">
                          {format(new Date(data.key_relationships.most_accessed_client.last_access), 'PPp')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Relationship</Typography>
                        <Typography variant="body2">
                          {data.key_relationships.most_accessed_client.relationship_strength}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Alert severity="info">
                      <Typography variant="caption">
                        {data.key_relationships.most_accessed_client.explanation}
                      </Typography>
                    </Alert>
                  </Stack>
                </Box>
              </Grid>

              {/* Least Accessed Client */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <StarBorderIcon color="info" />
                        <Typography variant="subtitle2">Least Accessed Client</Typography>
                      </Stack>
                      <Chip 
                        label={`Client ${data.key_relationships.least_accessed_client.client_id}`}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Box sx={{ position: 'relative', pt: 1 }}>
                      <Typography variant="h3" color="info.main" align="center">
                        {data.key_relationships.least_accessed_client.access_count}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" align="center" display="block">
                        Total Accesses
                      </Typography>
                    </Box>

                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">First Access</Typography>
                        <Typography variant="body2">
                          {format(new Date(data.key_relationships.least_accessed_client.first_access), 'PPp')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Last Access</Typography>
                        <Typography variant="body2">
                          {format(new Date(data.key_relationships.least_accessed_client.last_access), 'PPp')}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Relationship</Typography>
                        <Typography variant="body2">
                          {data.key_relationships.least_accessed_client.relationship_type}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Alert severity="info">
                      <Typography variant="caption">
                        {data.key_relationships.least_accessed_client.explanation}
                      </Typography>
                    </Alert>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Portfolio Distribution */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ px: 1, pt: 2 }}>
              Portfolio Distribution
            </Typography>
            <Grid container spacing={3}>
              {/* Recent Activity */}
              <Grid item xs={12} sm={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimelapseIcon color="primary" />
                      <Typography variant="subtitle2">Recent Activity</Typography>
                    </Stack>
                    
                    <Typography variant="h3" color="primary">
                      {data.portfolio_distribution.recent_activity_clients.value}
                    </Typography>

                    <Chip 
                      label={data.portfolio_distribution.recent_activity_clients.urgency_indicator}
                      color="primary"
                      size="small"
                    />

                    <Typography variant="caption" color="text.secondary">
                      {data.portfolio_distribution.recent_activity_clients.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Excessive Access */}
              <Grid item xs={12} sm={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TrendingUpIcon color="warning" />
                      <Typography variant="subtitle2">Access Thresholds</Typography>
                    </Stack>
                    
                    <Typography variant="h3" color="warning.main">
                      {data.portfolio_distribution.clients_with_excessive_access.value.length}
                    </Typography>

                    <Chip 
                      label={data.portfolio_distribution.clients_with_excessive_access.review_recommendation}
                      color="success"
                      size="small"
                    />

                    <Typography variant="caption" color="text.secondary">
                      {data.portfolio_distribution.clients_with_excessive_access.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Single Access */}
              <Grid item xs={12} sm={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PeopleAltIcon color="info" />
                      <Typography variant="subtitle2">Single Access</Typography>
                    </Stack>
                    
                    <Typography variant="h3" color="info.main">
                      {data.portfolio_distribution.clients_accessed_once.value}
                    </Typography>

                    <Chip 
                      label={data.portfolio_distribution.clients_accessed_once.follow_up_potential}
                      color="info"
                      size="small"
                    />

                    <Typography variant="caption" color="text.secondary">
                      {data.portfolio_distribution.clients_accessed_once.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Frequent Access */}
              <Grid item xs={12} sm={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <StarIcon color="success" />
                      <Typography variant="subtitle2">Frequent Access</Typography>
                    </Stack>
                    
                    <Typography variant="h3" color="success.main">
                      {data.portfolio_distribution.clients_accessed_frequently.value}
                    </Typography>

                    <Chip 
                      label={data.portfolio_distribution.clients_accessed_frequently.relationship_value}
                      color="success"
                      size="small"
                    />

                    <Typography variant="caption" color="text.secondary">
                      {data.portfolio_distribution.clients_accessed_frequently.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ClientRelationshipAnalysis.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    key_relationships: PropTypes.object.isRequired,
    portfolio_distribution: PropTypes.object.isRequired
  }).isRequired
};

const BehavioralInsights = ({ data }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<PsychologyAltIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Work Style Analysis */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ px: 1 }}>
              Work Style Analysis
            </Typography>
            <Grid container spacing={3}>
              {/* Access Consistency */}
              <Grid item xs={12} md={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BalanceIcon color="primary" />
                      <Typography variant="subtitle2">Access Consistency</Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="h4" color="primary">
                        {data.work_style_analysis.access_consistency.value}
                      </Typography>
                      <Chip 
                        label={data.work_style_analysis.access_consistency.work_style_indicator}
                        color="primary"
                        size="small"
                      />
                      <Typography variant="body2" color="success.main">
                        {data.work_style_analysis.access_consistency.efficiency_implication}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.work_style_analysis.access_consistency.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Client Diversity */}
              <Grid item xs={12} md={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <NetworkCheckIcon color="success" />
                      <Typography variant="subtitle2">Portfolio Balance</Typography>
                    </Stack>

                    <Box sx={{ position: 'relative', pt: 1 }}>
                      <Typography variant="h4" color="success.main">
                        {data.work_style_analysis.client_diversity_score.value}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={data.work_style_analysis.client_diversity_score.value}
                        color="success"
                        sx={{ height: 8, borderRadius: 1, mt: 1 }}
                      />
                    </Box>

                    <Stack spacing={1}>
                      <Chip 
                        label={data.work_style_analysis.client_diversity_score.portfolio_balance}
                        color="success"
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {data.work_style_analysis.client_diversity_score.specialization_indicator}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.work_style_analysis.client_diversity_score.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Session Patterns */}
              <Grid item xs={12} md={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SpeedIcon color="warning" />
                      <Typography variant="subtitle2">Session Analytics</Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="h4" color="warning.main">
                        {Math.round(data.work_style_analysis.session_patterns.value.average_session_length_minutes)}m
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Average Session Length
                      </Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Shortest</Typography>
                        <Typography variant="body2">
                          {Math.round(data.work_style_analysis.session_patterns.value.shortest_session_minutes)}m
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Longest</Typography>
                        <Typography variant="body2">
                          {Math.round(data.work_style_analysis.session_patterns.value.longest_session_minutes)}m
                        </Typography>
                      </Stack>
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Efficiency</Typography>
                        <Typography variant="body2" color="warning.main">
                          {data.work_style_analysis.session_patterns.efficiency_assessment}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.work_style_analysis.session_patterns.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Work Pattern */}
              <Grid item xs={12} md={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <WorkIcon color="info" />
                      <Typography variant="subtitle2">Work Schedule</Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="h4" color="info.main">
                        {data.work_style_analysis.work_pattern.value}
                      </Typography>
                      <Chip 
                        label={data.work_style_analysis.work_pattern.work_life_balance}
                        color="info"
                        size="small"
                      />
                      <Typography variant="body2" color="success.main">
                        {data.work_style_analysis.work_pattern.schedule_optimization}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.work_style_analysis.work_pattern.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Productivity Metrics */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ px: 1, pt: 2 }}>
              Productivity Metrics
            </Typography>
            <Grid container spacing={3}>
              {/* IP Stability */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <RouterIcon color="primary" />
                      <Typography variant="subtitle2">Location Stability</Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="h4" color="primary">
                        {data.productivity_metrics.ip_stability.value}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          label={data.productivity_metrics.ip_stability.mobility_assessment}
                          color="primary"
                          size="small"
                        />
                        <Chip 
                          label={data.productivity_metrics.ip_stability.security_consideration}
                          color="success"
                          size="small"
                        />
                      </Stack>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.productivity_metrics.ip_stability.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Client Coverage */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BalanceIcon color="warning" />
                      <Typography variant="subtitle2">Coverage Efficiency</Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="h4" color="warning.main">
                        {data.productivity_metrics.client_coverage_efficiency.value.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="warning.main">
                        {data.productivity_metrics.client_coverage_efficiency.strategy_indicator}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.productivity_metrics.client_coverage_efficiency.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Access Velocity */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TrendingUpIcon color="success" />
                      <Typography variant="subtitle2">Access Velocity</Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="h4" color="success.main">
                        {data.productivity_metrics.access_velocity.value.toFixed(1)}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        {data.productivity_metrics.access_velocity.growth_pattern}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.productivity_metrics.access_velocity.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

BehavioralInsights.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    work_style_analysis: PropTypes.object.isRequired,
    productivity_metrics: PropTypes.object.isRequired
  }).isRequired
};

const SecurityAnalysis = ({ data }) => {
  const getThresholdColor = (percentage) => {
    if (percentage <= 25) return 'success';
    if (percentage <= 75) return 'warning';
    return 'error';
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<SecurityUpdateIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Overall Risk Assessment */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SecurityIcon color="primary" />
                  <Typography variant="subtitle2">Overall Risk Assessment</Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={2} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Typography 
                    variant="h3" 
                    color={data.risk_assessment.overall_risk_level.value === 'NORMAL' ? 'success.main' : 'error.main'}
                  >
                    {data.risk_assessment.overall_risk_level.value}
                  </Typography>
                  <Chip 
                    icon={data.risk_assessment.overall_risk_level.value === 'NORMAL' ? <CheckCircleIcon /> : <WarningIcon />}
                    label={data.risk_assessment.overall_risk_level.value === 'NORMAL' ? 'No Significant Concerns' : 'Attention Required'}
                    color={data.risk_assessment.overall_risk_level.value === 'NORMAL' ? 'success' : 'warning'}
                    sx={{
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        '-webkit-line-clamp': '2',
                        '-webkit-box-orient': 'vertical',
                      }
                    }}
                  />
                </Stack>

                <Divider />

                <Stack spacing={1}>
                  <Typography variant="subtitle2">Risk Factors:</Typography>
                  {data.risk_assessment.overall_risk_level.risk_factors.map((factor, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      • {factor}
                    </Typography>
                  ))}
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2">Recommendations:</Typography>
                  {data.risk_assessment.overall_risk_level.mitigation_recommendations.map((rec, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      • {rec}
                    </Typography>
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Grid>

          {/* Alerts Analysis */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <NotificationsActiveIcon color="warning" />
                  <Typography variant="subtitle2">Security Alerts</Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: 'error.lighter',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h4" color="error.main">
                        {data.risk_assessment.alerts_analysis.alert_breakdown.high}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        High Priority
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: 'warning.lighter',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h4" color="warning.main">
                        {data.risk_assessment.alerts_analysis.alert_breakdown.medium}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Medium Priority
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: 'success.lighter',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h4" color="success.main">
                        {data.risk_assessment.alerts_analysis.alert_breakdown.low}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Low Priority
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Alert severity="info">
                  <Typography variant="caption">
                    {data.risk_assessment.alerts_analysis.explanation}
                  </Typography>
                </Alert>
              </Stack>
            </Box>
          </Grid>

          {/* Threshold Analysis */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <SpeedIcon color="primary" />
                  <Typography variant="subtitle2">Threshold Analysis</Typography>
                </Stack>

                <Grid container spacing={3}>
                  {/* Hourly Threshold */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Hourly Usage
                      </Typography>
                      <Box sx={{ position: 'relative', pt: 1 }}>
                        <Typography variant="h5" color="primary">
                          {data.risk_assessment.threshold_analysis.hourly_threshold_usage.value}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={data.risk_assessment.threshold_analysis.hourly_threshold_usage.percentage}
                          color={getThresholdColor(data.risk_assessment.threshold_analysis.hourly_threshold_usage.percentage)}
                          sx={{ height: 8, borderRadius: 1, mt: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {data.risk_assessment.threshold_analysis.hourly_threshold_usage.status}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Daily Threshold */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Daily Usage
                      </Typography>
                      <Box sx={{ position: 'relative', pt: 1 }}>
                        <Typography variant="h5" color="primary">
                          {data.risk_assessment.threshold_analysis.daily_threshold_usage.value}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={data.risk_assessment.threshold_analysis.daily_threshold_usage.percentage}
                          color={getThresholdColor(data.risk_assessment.threshold_analysis.daily_threshold_usage.percentage)}
                          sx={{ height: 8, borderRadius: 1, mt: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {data.risk_assessment.threshold_analysis.daily_threshold_usage.status}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Client Access Threshold */}
                  <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Client Access
                      </Typography>
                      <Box sx={{ position: 'relative', pt: 1 }}>
                        <Typography variant="h5" color="primary">
                          {data.risk_assessment.threshold_analysis.client_access_threshold.value}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={data.risk_assessment.threshold_analysis.client_access_threshold.max_client_percentage}
                          color={getThresholdColor(data.risk_assessment.threshold_analysis.client_access_threshold.max_client_percentage)}
                          sx={{ height: 8, borderRadius: 1, mt: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {data.risk_assessment.threshold_analysis.client_access_threshold.status}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Grid>

          {/* Anomaly Detection */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <BugReportIcon color="error" />
                  <Typography variant="subtitle2">Anomaly Detection</Typography>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <Chip 
                    icon={<ReportIcon />}
                    label={data.risk_assessment.anomaly_detection.anomaly_severity}
                    color="warning"
                  />
                  <Chip 
                    icon={<ErrorIcon />}
                    label={data.risk_assessment.anomaly_detection.investigation_priority}
                    color="error"
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography variant="subtitle2">Detected Anomalies:</Typography>
                  {data.risk_assessment.anomaly_detection.value.map((anomaly, index) => (
                    <Alert key={index} severity="warning" icon={<WarningIcon />}>
                      {anomaly}
                    </Alert>
                  ))}
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {data.risk_assessment.anomaly_detection.explanation}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

SecurityAnalysis.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    risk_assessment: PropTypes.object.isRequired
  }).isRequired
};

const TopClientRelationships = ({ data }) => {
  const getStatusColor = (status) => {
    if (status.toLowerCase().includes('high') || status.toLowerCase().includes('very')) return 'success';
    if (status.toLowerCase().includes('moderate')) return 'warning';
    return 'error';
  };

  const getBusinessValueColor = (value) => {
    if (value.toLowerCase().includes('high')) return 'success';
    if (value.toLowerCase().includes('moderate')) return 'warning';
    return 'error';
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<SupervisedUserCircleIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            {data.explanation}
          </Typography>
        </Alert>

        <Grid container spacing={3}>
          {data.clients.map((client, index) => (
            <Grid item xs={12} md={6} key={client.client_id}>
              <Box
                sx={{
                  p: 2.5,
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative'
                }}
              >
                {/* Rank Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {index + 1}
                </Box>

                <Stack spacing={2}>
                  {/* Client Header */}
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40
                      }}
                    >
                      C{client.client_id}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        Client {client.client_id}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          icon={<SignalCellularAltIcon />}
                          label={client.relationship_strength}
                          color={getStatusColor(client.relationship_strength)}
                        />
                      </Stack>
                    </Box>
                  </Stack>

                  <Divider />

                  {/* Access Metrics */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          Access Count
                        </Typography>
                        <Typography variant="h6">
                          {client.access_count}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={client.percentage_of_total}
                          sx={{ height: 6, borderRadius: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {client.percentage_of_total}% of total access
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={6}>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          Access Span
                        </Typography>
                        <Typography variant="h6">
                          {Math.round(client.access_span_hours)}h
                        </Typography>
                        <Chip
                          size="small"
                          label={client.last_activity_status}
                          color={getStatusColor(client.last_activity_status)}
                          sx={{ mt: 0.5 }}
                        />
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Engagement Details */}
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccessTimeFilledIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        Last Access:
                      </Typography>
                      <Typography variant="body2">
                        {formatDistanceToNow(new Date(client.last_access))} ago
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <MonetizationOnIcon 
                        color={getBusinessValueColor(client.business_value)} 
                        fontSize="small" 
                      />
                      <Typography variant="body2" color="text.secondary">
                        Business Value:
                      </Typography>
                      <Typography 
                        variant="body2"
                        color={`${getBusinessValueColor(client.business_value)}.main`}
                      >
                        {client.business_value}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Pattern Indicator */}
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: 'background.neutral',
                      borderRadius: 1,
                      mt: 1
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        Engagement Pattern
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color={getStatusColor(client.engagement_pattern)}
                        fontWeight="medium"
                      >
                        {client.engagement_pattern}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

TopClientRelationships.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    clients: PropTypes.arrayOf(PropTypes.shape({
      client_id: PropTypes.string.isRequired,
      access_count: PropTypes.number.isRequired,
      first_access: PropTypes.string.isRequired,
      last_access: PropTypes.string.isRequired,
      last_ip: PropTypes.string.isRequired,
      access_span_hours: PropTypes.number.isRequired,
      percentage_of_total: PropTypes.number.isRequired,
      relationship_strength: PropTypes.string.isRequired,
      engagement_pattern: PropTypes.string.isRequired,
      business_value: PropTypes.string.isRequired,
      last_activity_status: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
};

const AgentContext = ({ agentId, agentName }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1
      }}
    >
      <Stack direction="row" spacing={1}>
        <Chip
          icon={<PersonIcon />}
          label={`Agent: ${agentName}`}
          color="primary"
        />
        <Chip
          label={`ID: ${agentId}`}
          variant="outlined"
        />
      </Stack>
    </Box>
  );
};

const PerformanceAnalysis = ({ data }) => {
  const getEfficiencyColor = (value) => {
    if (value > 90) return 'success';
    if (value > 70) return 'warning';
    return 'error';
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<AssessmentIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Productivity Indicators */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ px: 1 }}>
              Productivity Indicators
            </Typography>
            <Grid container spacing={3}>
              {/* Clients per Hour */}
              <Grid item xs={12} sm={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <PeopleOutlineIcon color="primary" />
                      <Typography variant="subtitle2">Client Acquisition Rate</Typography>
                    </Stack>
                    
                    <Typography variant="h3" color="primary">
                      {data.productivity_indicators.clients_per_hour_average.value.toFixed(2)}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary">
                      clients/hour
                    </Typography>

                    <Chip 
                      label={data.productivity_indicators.clients_per_hour_average.benchmark}
                      color="primary"
                      size="small"
                    />

                    <Typography variant="caption" color="text.secondary">
                      {data.productivity_indicators.clients_per_hour_average.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Accesses per Hour */}
              <Grid item xs={12} sm={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <SpeedIcon color="success" />
                      <Typography variant="subtitle2">Activity Rate</Typography>
                    </Stack>
                    
                    <Typography variant="h3" color="success.main">
                      {data.productivity_indicators.accesses_per_hour_average.value.toFixed(1)}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary">
                      accesses/hour
                    </Typography>

                    <Chip 
                      label={data.productivity_indicators.accesses_per_hour_average.efficiency_rating}
                      color="success"
                      size="small"
                    />

                    <Typography variant="caption" color="text.secondary">
                      {data.productivity_indicators.accesses_per_hour_average.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Efficiency Score */}
              <Grid item xs={12} sm={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AutoGraphIcon color="warning" />
                      <Typography variant="subtitle2">Efficiency Score</Typography>
                    </Stack>
                    
                    <Box sx={{ position: 'relative', pt: 1 }}>
                      <Typography variant="h3" color="warning.main">
                        {data.productivity_indicators.efficiency_score.value.toFixed(1)}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(data.productivity_indicators.efficiency_score.value, 100)}
                        color={getEfficiencyColor(data.productivity_indicators.efficiency_score.value)}
                        sx={{ height: 8, borderRadius: 1, mt: 1 }}
                      />
                    </Box>

                    <Chip 
                      label={data.productivity_indicators.efficiency_score.optimization_potential}
                      color={getEfficiencyColor(data.productivity_indicators.efficiency_score.value)}
                      size="small"
                    />

                    <Typography variant="caption" color="text.secondary">
                      {data.productivity_indicators.efficiency_score.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Activity Intensity */}
              <Grid item xs={12} sm={6} lg={6}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <InsightsIcon color="info" />
                      <Typography variant="subtitle2">Activity Intensity</Typography>
                    </Stack>
                    
                    <Typography variant="h3" color="info.main">
                      {data.productivity_indicators.activity_intensity.value}
                    </Typography>

                    <Stack spacing={1}>
                      <Chip 
                        label={data.productivity_indicators.activity_intensity.sustainability_assessment}
                        color="info"
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {data.productivity_indicators.activity_intensity.workload_recommendation}
                      </Typography>
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.productivity_indicators.activity_intensity.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Advanced Analytics */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ px: 1, pt: 2 }}>
              Advanced Analytics
            </Typography>
            <Grid container spacing={3}>
              {/* Portfolio Health */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <HealthAndSafetyIcon color="success" />
                      <Typography variant="subtitle2">Portfolio Health</Typography>
                    </Stack>

                    <Box sx={{ position: 'relative', pt: 1 }}>
                      <Typography variant="h3" color="success.main">
                        {data.advanced_analytics.client_portfolio_health.value}%
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={data.advanced_analytics.client_portfolio_health.value}
                        color="success"
                        sx={{ height: 8, borderRadius: 1, mt: 1 }}
                      />
                    </Box>

                    <Stack spacing={1}>
                      {data.advanced_analytics.client_portfolio_health.health_factors.map((factor, index) => (
                        <Typography key={index} variant="body2" color="text.secondary">
                          • {factor}
                        </Typography>
                      ))}
                    </Stack>

                    <Typography variant="caption" color="text.secondary">
                      {data.advanced_analytics.client_portfolio_health.explanation}
                    </Typography>
                  </Stack>
                </Box>
              </Grid>

              {/* Predictive Insights */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TrendingUpIcon color="primary" />
                      <Typography variant="subtitle2">Growth Opportunities</Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Potential Growth Clients:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {data.advanced_analytics.predictive_insights.growth_opportunity_clients.map((clientId) => (
                          <Chip
                            key={clientId}
                            label={`Client ${clientId}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Stack>

                    <Alert severity="info">
                      <Typography variant="caption">
                        {data.advanced_analytics.predictive_insights.optimization_recommendations[0]}
                      </Typography>
                    </Alert>
                  </Stack>
                </Box>
              </Grid>

              {/* Comparative Analysis */}
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CompareIcon color="info" />
                      <Typography variant="subtitle2">Peer Comparison</Typography>
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        {data.advanced_analytics.comparative_analysis.peer_benchmark}
                      </Typography>
                      <Chip 
                        label={data.advanced_analytics.comparative_analysis.performance_percentile}
                        color="info"
                        size="small"
                      />
                    </Stack>

                    <Stack spacing={1}>
                      <Typography variant="subtitle2">Improvement Areas:</Typography>
                      {data.advanced_analytics.comparative_analysis.improvement_areas.map((area, index) => (
                        <Typography key={index} variant="body2" color="text.secondary">
                          • {area}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

PerformanceAnalysis.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    productivity_indicators: PropTypes.object.isRequired,
    advanced_analytics: PropTypes.object.isRequired
  }).isRequired
};

const ReportMetadata = ({ data }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<DescriptionIcon color="primary" />}
        title="Report Information"
        subheader={`Version ${data?.report_version}`}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Report Overview */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DataUsageIcon color="primary" />
                  <Typography variant="subtitle2">Analysis Overview</Typography>
                </Stack>

                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Generation Time
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(data.generation_time_ms), 'PPpp')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Data Points Analyzed
                    </Typography>
                    <Typography variant="body2">
                      {data.data_points_analyzed}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Next Review Due
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {format(parseISO(data.next_recommended_review), 'PP')}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Grid>

          {/* Security Checks & Analytics */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2.5,
                height: '100%',
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ModelTrainingIcon color="success" />
                  <Typography variant="subtitle2">Analysis Components</Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Security Checks:
                    </Typography>
                    <Stack spacing={0.5}>
                      {data.security_checks_performed.map((check, index) => (
                        <Chip
                          key={index}
                          label={check}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ justifyContent: 'flex-start', width: '100%' }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Analytics Models:
                    </Typography>
                    <Stack spacing={0.5}>
                      {data.analytics_models_used.map((model, index) => (
                        <Chip
                          key={index}
                          label={model}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ justifyContent: 'flex-start', width: '100%' }}
                        />
                      ))}
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Grid>

          {/* Usage Recommendations */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EventNoteIcon color="info" />
                  <Typography variant="subtitle2">Recommended Review Schedule</Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Daily Monitoring
                      </Typography>
                      <Typography variant="body2">
                        {data.usage_recommendations.daily_monitoring}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Weekly Analysis
                      </Typography>
                      <Typography variant="body2">
                        {data.usage_recommendations.weekly_analysis}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Monthly Planning
                      </Typography>
                      <Typography variant="body2">
                        {data.usage_recommendations.monthly_planning}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Quarterly Review
                      </Typography>
                      <Typography variant="body2">
                        {data.usage_recommendations.quarterly_review}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ReportMetadata.propTypes = {
  data: PropTypes.shape({
    report_version: PropTypes.string.isRequired,
    generation_time_ms: PropTypes.number.isRequired,
    data_points_analyzed: PropTypes.number.isRequired,
    security_checks_performed: PropTypes.arrayOf(PropTypes.string).isRequired,
    analytics_models_used: PropTypes.arrayOf(PropTypes.string).isRequired,
    usage_recommendations: PropTypes.object.isRequired,
    next_recommended_review: PropTypes.string.isRequired
  }).isRequired
};

const ReportContext = ({ type, context, generatedBy, accountContext }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader 
        avatar={<DescriptionIcon color="primary" />}
        title="Report Context"
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Report Type
              </Typography>
              <Typography variant="body1">
                {type}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Security Context
              </Typography>
              <Typography variant="body1">
                {context}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Account Context
              </Typography>
              <Typography variant="body1">
                {accountContext}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Generated By
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                  {generatedBy.charAt(0)}
                </Avatar>
                <Typography variant="body1">
                  {generatedBy}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ReportContext.propTypes = {
  type: PropTypes.string.isRequired,
  context: PropTypes.string.isRequired,
  generatedBy: PropTypes.string.isRequired,
  accountContext: PropTypes.number.isRequired
};

const DetailedAccessSummary = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const rows = Object.entries(data.data).map(([clientId, details]) => ({
    id: clientId,
    client_id: clientId,
    ...details
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<HistoryIcon color="primary" />}
        title={data.title}
        subheader={data.description}
        action={
          <Chip
            label={`${data.total_clients_accessed} Clients`}
            color="primary"
            size="small"
          />
        }
      />
      <CardContent>
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper'
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client ID</TableCell>
                <TableCell>Access Count</TableCell>
                <TableCell>First Access</TableCell>
                <TableCell>Last Access</TableCell>
                <TableCell>Last IP</TableCell>
                <TableCell>Access Duration</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const firstAccess = new Date(row.first_access_readable);
                  const lastAccess = new Date(row.last_access_readable);
                  const diffHours = Math.round((lastAccess - firstAccess) / (1000 * 60 * 60));

                  return (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Chip
                          label={`Client ${row.client_id}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="primary.main" fontWeight="medium">
                          {row.access_count}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {format(new Date(row.first_access_readable), 'PPpp')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(row.last_access_readable), 'PPpp')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.last_ip}
                          size="small"
                          variant="outlined"
                          icon={<LanguageIcon fontSize="small" />}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {diffHours}h
                          </Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </CardContent>
    </Card>
  );
};

DetailedAccessSummary.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    total_clients_accessed: PropTypes.number.isRequired,
    data: PropTypes.object.isRequired
  }).isRequired
};

const SuspiciousActivityTimeline = ({ data }) => {
  const getRiskLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  const getTrendIcon = () => {
    switch (data.trend_analysis.trend_direction.toLowerCase()) {
      case 'accelerating':
        return <TrendingUpIcon color="error" />;
      case 'decelerating':
        return <TrendingDownIcon color="success" />;
      default:
        return <ShowChartIcon color="info" />;
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<TimelineIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Timeframe Analysis Cards */}
          {Object.entries(data.data).map(([timeframe, metrics]) => (
            <Grid item xs={12} md={4} key={timeframe}>
              <Box
                sx={{
                  p: 2.5,
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">
                      {metrics.timeframe}
                    </Typography>
                    <Chip
                      icon={<SecurityUpdateWarningIcon />}
                      label={metrics.risk_level}
                      size="small"
                      color={getRiskLevelColor(metrics.risk_level)}
                    />
                  </Stack>

                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h3" color="primary">
                        {metrics.total_access_count}
                      </Typography>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Total Accesses
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Clients Accessed
                        </Typography>
                        <Typography variant="body2">
                          {metrics.total_clients_accessed}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Recent Accesses
                        </Typography>
                        <Typography variant="body2">
                          {metrics.recent_accesses}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Most Accessed
                        </Typography>
                        <Chip
                          label={`Client ${metrics.most_accessed_client}`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          ))}

          {/* Trend Analysis */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <SpeedIcon color="primary" />
                  <Typography variant="subtitle2">Trend Analysis</Typography>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {getTrendIcon()}
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Trend Direction
                        </Typography>
                        <Typography variant="subtitle1">
                          {data.trend_analysis.trend_direction}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ShowChartIcon color="warning" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Acceleration
                        </Typography>
                        <Typography variant="subtitle1">
                          {data.trend_analysis.acceleration}%
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TimelineIcon color="info" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Volatility
                        </Typography>
                        <Typography variant="subtitle1">
                          {data.trend_analysis.volatility}%
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <ShowChartIcon color="success" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Pattern Type
                        </Typography>
                        <Typography variant="subtitle1">
                          {data.trend_analysis.pattern_type}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Alert 
                  severity={data.trend_analysis.trend_direction.toLowerCase() === 'accelerating' ? 'warning' : 'info'}
                  icon={getTrendIcon()}
                >
                  <Typography variant="body2">
                    Activity is {data.trend_analysis.trend_direction.toLowerCase()} with {data.trend_analysis.acceleration}% acceleration, 
                    showing a {data.trend_analysis.pattern_type.toLowerCase()} with {data.trend_analysis.volatility}% volatility.
                  </Typography>
                </Alert>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

SuspiciousActivityTimeline.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    trend_analysis: PropTypes.shape({
      trend_direction: PropTypes.string.isRequired,
      acceleration: PropTypes.number.isRequired,
      volatility: PropTypes.number.isRequired,
      pattern_type: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const SecurityAlertsDetailed = ({ data }) => {
  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <ErrorIcon fontSize="small" />;
      case 'high':
        return <WarningIcon fontSize="small" />;
      case 'medium':
        return <NotificationsActiveIcon fontSize="small" />;
      case 'low':
        return <InfoIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<GppGoodIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Alert Summary */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2">Alert Summary</Typography>
                  <Chip
                    icon={<TaskAltIcon />}
                    label={`${data.total_alerts} Total Alerts`}
                    color={data.total_alerts === 0 ? 'success' : 'warning'}
                    size="small"
                  />
                </Stack>

                <Grid container spacing={2}>
                  {Object.entries(data.alert_severity_breakdown).map(([severity, count]) => (
                    <Grid item xs={6} sm={3} key={severity}>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: `${getSeverityColor(severity)}.lighter`,
                          borderRadius: 1,
                          textAlign: 'center'
                        }}
                      >
                        <Stack spacing={1} alignItems="center">
                          {getSeverityIcon(severity)}
                          <Typography 
                            variant="h4" 
                            color={`${getSeverityColor(severity)}.main`}
                          >
                            {count}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            color={`${getSeverityColor(severity)}.main`}
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {severity}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Box>
          </Grid>

          {/* Alert Details or Empty State */}
          <Grid item xs={12}>
            {data.data.length > 0 ? (
              <Stack spacing={2}>
                {data.data.map((alert, index) => (
                  <Alert
                    key={index}
                    severity={getSeverityColor(alert.severity)}
                    icon={getSeverityIcon(alert.severity)}
                    sx={{
                      '& .MuiAlert-message': {
                        width: '100%'
                      }
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center"
                      >
                        <Typography variant="subtitle2">
                          {alert.title}
                        </Typography>
                        <Chip
                          label={alert.severity}
                          size="small"
                          color={getSeverityColor(alert.severity)}
                        />
                      </Stack>
                      <Typography variant="body2">
                        {alert.description}
                      </Typography>
                      {alert.recommendation && (
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          Recommendation: {alert.recommendation}
                        </Typography>
                      )}
                    </Stack>
                  </Alert>
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <TaskAltIcon 
                    color="success" 
                    sx={{ fontSize: 48 }}
                  />
                  <Typography variant="h6" color="success.main">
                    No Security Alerts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All security checks have passed. No suspicious activity or security risks detected.
                  </Typography>
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

SecurityAlertsDetailed.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    total_alerts: PropTypes.number.isRequired,
    alert_severity_breakdown: PropTypes.shape({
      critical: PropTypes.number.isRequired,
      high: PropTypes.number.isRequired,
      medium: PropTypes.number.isRequired,
      low: PropTypes.number.isRequired
    }).isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      severity: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      recommendation: PropTypes.string
    }))
  }).isRequired
};

const ClientInteractionAnalysis = ({ data }) => {
  const getRelationshipColor = (relationship) => {
    switch (relationship.toLowerCase()) {
      case 'high involvement':
        return 'success';
      case 'moderate involvement':
        return 'primary';
      case 'low involvement':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getPopularityColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'warning';
    return 'error';
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<HubIcon color="primary" />}
        title={data.title}
        subheader={data.description}
        action={
          <Chip
            icon={<GroupsIcon />}
            label={`${data.clients_analyzed} Clients Analyzed`}
            color="primary"
            size="small"
          />
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          {data.data.map((client) => (
            <Grid item xs={12} md={6} key={client.client_id}>
              <Box
                sx={{
                  p: 2.5,
                  height: '100%',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Stack spacing={2}>
                  {/* Client Header */}
                  <Stack 
                    direction="row" 
                    alignItems="center" 
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: 'primary.main',
                          width: 40,
                          height: 40
                        }}
                      >
                        C{client.client_id}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">
                          Client {client.client_id}
                        </Typography>
                        <Chip
                          size="small"
                          label={client.agent_client_relationship}
                          color={getRelationshipColor(client.agent_client_relationship)}
                        />
                      </Box>
                    </Stack>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography 
                        variant="h6" 
                        color={`${getPopularityColor(client.client_popularity_score)}.main`}
                      >
                        {client.client_popularity_score.toFixed(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Popularity Score
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  {/* Access Details */}
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Access Timeline
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTimeIcon color="action" fontSize="small" />
                          <Typography variant="body2">
                            {format(new Date(client.agent_access_to_client.first_access_readable), 'PPp')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            to
                          </Typography>
                          <Typography variant="body2">
                            {format(new Date(client.agent_access_to_client.last_access_readable), 'PPp')}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" color="primary">
                          {client.agent_access_to_client.access_count}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Accesses
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Agent Collaboration */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Team Collaboration
                        </Typography>
                        <Typography variant="body2">
                          {client.other_agents_accessing_client} other agents
                        </Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={(client.other_agents_accessing_client / 10) * 100}
                        color="primary"
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>

                    {/* Last Access Info */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LanguageIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          Last Access IP:
                        </Typography>
                        <Typography variant="body2">
                          {client.agent_access_to_client.last_ip}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(client.agent_access_to_client.last_access_readable))} ago
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

ClientInteractionAnalysis.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    clients_analyzed: PropTypes.number.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape({
      client_id: PropTypes.string.isRequired,
      agent_access_to_client: PropTypes.shape({
        first_access: PropTypes.number.isRequired,
        last_access: PropTypes.number.isRequired,
        access_count: PropTypes.number.isRequired,
        last_ip: PropTypes.string.isRequired,
        agent_id: PropTypes.string.isRequired,
        agent_name: PropTypes.string.isRequired,
        first_access_readable: PropTypes.string.isRequired,
        last_access_readable: PropTypes.string.isRequired
      }).isRequired,
      other_agents_accessing_client: PropTypes.number.isRequired,
      client_popularity_score: PropTypes.number.isRequired,
      agent_client_relationship: PropTypes.string.isRequired
    })).isRequired
  }).isRequired
};

const RealTimeSecurityAssessment = ({ data }) => {
  const getStatusColor = (status) => {
    if (status.toLowerCase().includes('critical')) return 'error';
    if (status.toLowerCase().includes('elevated')) return 'warning';
    if (status.toLowerCase().includes('normal')) return 'success';
    return 'info';
  };

  const getActivityLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'error';
      case 'moderate':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'info';
    }
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardHeader
        avatar={<MonitorHeartIcon color="primary" />}
        title={data.title}
        subheader={data.description}
      />
      <CardContent>
        <Grid container spacing={3}>
          {/* Current Status */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2.5,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Stack spacing={2}>
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ShieldIcon 
                      color={getStatusColor(data.data.overall_status)} 
                      sx={{ fontSize: 40 }}
                    />
                    <Box>
                      <Typography variant="h6">
                        {data.data.overall_status}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Last Updated: {format(new Date(data.data.assessment_time), 'PPpp')}
                      </Typography>
                    </Box>
                  </Stack>
                  <Chip
                    icon={<AssessmentIcon />}
                    label={data.data.hourly_activity_level}
                    color={getActivityLevelColor(data.data.hourly_activity_level)}
                  />
                </Stack>

                <Divider />

                {/* Key Metrics */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Stack spacing={1} alignItems="center">
                        <Typography variant="h4" color="primary">
                          {data.data.recent_client_access_count}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Recent Client Accesses
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Stack spacing={1} alignItems="center">
                        <Typography 
                          variant="h4" 
                          color={data.data.high_severity_alerts === 0 ? 'success.main' : 'error.main'}
                        >
                          {data.data.high_severity_alerts}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          High Severity Alerts
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        textAlign: 'center'
                      }}
                    >
                      <Stack spacing={1} alignItems="center">
                        <Typography 
                          variant="h4" 
                          color={getActivityLevelColor(data.data.hourly_activity_level)}
                        >
                          {data.data.hourly_activity_level}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Activity Level
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                {/* Immediate Concerns */}
                {data.data.immediate_concerns.length > 0 && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Immediate Attention Required
                      </Typography>
                      <Stack spacing={1}>
                        {data.data.immediate_concerns.map((concern, index) => (
                          <Alert
                            key={index}
                            severity="warning"
                            icon={<ReportProblemIcon />}
                            sx={{ '& .MuiAlert-message': { width: '100%' } }}
                          >
                            <Stack 
                              direction="row" 
                              justifyContent="space-between" 
                              alignItems="center"
                            >
                              <Typography variant="body2">
                                {concern}
                              </Typography>
                              <Chip
                                size="small"
                                label="Active"
                                color="warning"
                              />
                            </Stack>
                          </Alert>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}

                {/* All Clear Message */}
                {data.data.immediate_concerns.length === 0 && (
                  <Alert
                    severity="success"
                    icon={<DoneIcon />}
                  >
                    <Typography variant="body2">
                      No immediate security concerns detected. All systems operating within normal parameters.
                    </Typography>
                  </Alert>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

RealTimeSecurityAssessment.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    data: PropTypes.shape({
      assessment_time: PropTypes.string.isRequired,
      recent_client_access_count: PropTypes.number.isRequired,
      high_severity_alerts: PropTypes.number.isRequired,
      hourly_activity_level: PropTypes.string.isRequired,
      immediate_concerns: PropTypes.arrayOf(PropTypes.string).isRequired,
      overall_status: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export const SettingsSecurityReport = ({ agent }) => {
  const { securityReport, loading, error } = useSecurityReport(agent?.id);

  if (loading) {
    return (
      <Card 
        elevation={0}
        sx={{ 
          p: 2,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Stack spacing={2} alignItems="center">
          <LinearProgress sx={{ width: '100%' }} />
          <Typography>Loading security report...</Typography>
        </Stack>
      </Card>
    );
  }

  if (error || securityReport?.error) {
    return (
      <Alert severity="error">
        Error loading security report {error ?? ""}
      </Alert>
    );
  }

  if (!securityReport) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <AgentContext 
        agentId={securityReport.agent_id} 
        agentName={securityReport.agent_name} 
      />
      <Stack spacing={3}>
        <ReportContext 
          type={securityReport.report_type}
          context={securityReport.security_context}
          accountContext={securityReport.account_context}
          generatedBy={securityReport.generated_by}
        />
        <RealTimeSecurityAssessment data={securityReport.real_time_security_assessment} />
        <ReportOverview data={securityReport.report_overview} />
        <SecurityAnalysis data={securityReport.security_analysis} />
        <SecurityAlertsDetailed data={securityReport.security_alerts_detailed} />
        <ClientInteractionAnalysis data={securityReport.client_interaction_analysis} />
        <TopClientRelationships data={securityReport.top_accessed_clients} />
        <PerformanceAnalysis data={securityReport.performance_metrics} />
        <SummaryStats data={securityReport.summary_stats} />
        <ActivityBreakdown data={securityReport.activity_breakdown} />
        <BehavioralPatterns data={securityReport.access_patterns} />
        <ClientRelationshipAnalysis data={securityReport.client_access_details} />
        <BehavioralInsights data={securityReport.behavioral_insights} />
        <SuspiciousActivityTimeline data={securityReport.suspicious_activity_timeline} />
        <DetailedAccessSummary data={securityReport.detailed_access_summary} />
        <ReportMetadata data={securityReport.report_metadata} />
      </Stack>
    </Box>
  );
};

SettingsSecurityReport.propTypes = {
  agent: PropTypes.object.isRequired
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.string,
  tooltip: PropTypes.string,
  subValue: PropTypes.string,
  subLabel: PropTypes.string
};

ReportOverview.propTypes = {
  data: PropTypes.object.isRequired
};

SummaryStats.propTypes = {
  data: PropTypes.object.isRequired
};

AgentContext.propTypes = {
  agentId: PropTypes.string.isRequired,
  agentName: PropTypes.string.isRequired
};