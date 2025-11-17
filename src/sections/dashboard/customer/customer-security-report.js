// React imports
import { useCallback, useEffect, useMemo, useState } from 'react';

// MUI Core imports
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from "@mui/system/Unstable_Grid/Grid";
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from "@mui/material/styles";

// MUI Lab imports
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

// MUI Icon imports
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Alert from '@mui/material/Alert';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import HistoryIcon from '@mui/icons-material/History';
import HubIcon from '@mui/icons-material/Hub';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SecurityIcon from '@mui/icons-material/Security';
import SecurityUpdateWarningIcon from '@mui/icons-material/SecurityUpdateWarning';
import TimelineIcon from '@mui/icons-material/Timeline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import WarningIcon from '@mui/icons-material/Warning';

// Recharts imports
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// API imports
import { customersApi } from 'src/api/customers';

const useSecurityReport = (customerId) => {
  const [securityReport, setSecurityReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSecurityReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customersApi.getClientSecurityReport({
        id: customerId,
        type: "client",
        readable_dates: true,
        include_explanations: true,
      });
      setSecurityReport(response?.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    getSecurityReport();
  }, [getSecurityReport]);

  return { securityReport, loading, error, getSecurityReport };
};

const MetricCard = ({ title, value, icon: Icon, color = 'primary', tooltip }) => {
  return (
    <Card sx={{ height: '100%', border: '1px dashed', borderColor: 'divider' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              backgroundColor: `${color}.lighter`,
              borderRadius: 1,
              p: 1,
              display: 'flex'
            }}
          >
            <Icon sx={{ color: `${color}.main` }} />
          </Box>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
              {tooltip && (
                <Tooltip title={tooltip}>
                  <IconButton size="small">
                    <InfoIcon fontSize="small" sx={{ color: 'primary.main' }}/>
                  </IconButton>
                </Tooltip>
              )}
            </Typography>
            <Typography variant="h5">{value}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const RiskIndicator = ({ indicators }) => {
  return (
    <Card>
      <CardHeader 
        title="Risk Indicators" 
        avatar={<WarningIcon color="warning" />}
      />
      <CardContent>
        <Stack spacing={2}>
          {indicators.map((indicator, index) => (
            <Alert 
              key={index} 
              severity={indicator.indicator.toLowerCase().includes('high') ? 'warning' : 'info'}
              sx={{ bgcolor: 'background.paper', border: '1px dashed', borderColor: indicator.indicator.toLowerCase().includes('high') ? 'warning.main' : 'info.main'}}
            >
              <Typography variant="subtitle2">{indicator.indicator}</Typography>
              <Typography variant="body2" color="text.secondary">
                {indicator.explanation}
              </Typography>
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const AccessDistributionChart = ({ data }) => {
  const theme = useTheme();
  const colors = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];

  const chartData = [
    { name: 'Champions', value: data?.champions?.count || 0 },
    { name: 'Loyal', value: data?.loyal_customers?.count || 0 },
    { name: 'Potential', value: data?.potential_loyalists?.count || 0 },
    { name: 'New', value: data?.new_customers?.count || 0 }
  ];

  return (
    <Card>
      <CardHeader title="Access Distribution" />
      <CardContent>
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Stack spacing={2} mt={2}>
          {chartData.map((item, index) => (
            <Stack
              key={item.name}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: 0.5,
                    bgcolor: colors[index]
                  }}
                />
                <Typography variant="body2">{item.name}</Typography>
              </Stack>
              <Typography variant="subtitle2">{item.value}</Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const TopAccessingAccounts = ({ accounts }) => {
  return (
    <Card>
      <CardHeader 
        title="Top Accessing Accounts" 
        avatar={<GroupIcon color="primary" />}
      />
      <CardContent>
        <Stack spacing={3}>
          {accounts.map((account) => (
            <Box key={account.account_id}>
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2">
                  {account.agent_name}
                </Typography>
                <Typography 
                  variant="subtitle2" 
                  color={account.risk_score === 'High' ? 'error.main' : 'success.main'}
                >
                  {account.risk_score}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Access Count
                  </Typography>
                  <Typography variant="body2">
                    {account.access_count}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body2">
                    {account.user_category}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={account.percentage_of_total} 
                  sx={{ height: 8, borderRadius: 1 }}
                />
                <Typography variant="caption" color="text.secondary" align="right">
                  {account.percentage_of_total.toFixed(1)}% of total access
                </Typography>
              </Stack>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const SecurityOverview = ({ report_overview, executive_summary }) => {

  const overviewItems = useMemo(() => [
    {
      title: "Total Accounts",
      value: executive_summary.key_metrics.total_unique_accounts,
      icon: GroupIcon,
      tooltip: "Number of unique accounts that accessed this client"
    },
    {
      title: "Total Interactions", 
      value: executive_summary.key_metrics.total_interactions,
      icon: AccessTimeIcon,
      color: "success",
      tooltip: "Total number of access sessions"
    },
    {
      title: "Active Accounts (30d)",
      value: executive_summary.key_metrics.active_accounts_30_days,
      icon: GroupIcon,
      color: "info",
      tooltip: "Number of accounts active in the last 30 days"
    },
    {
      title: "Client Health Score",
      value: `${executive_summary.key_metrics.client_health_score}%`,
      icon: VpnLockIcon,
      color: executive_summary.key_metrics.client_health_score > 80 ? 'success' : 'warning',
      tooltip: "Overall health score based on various security metrics"
    }
  ], [executive_summary.key_metrics]);

  return (
    <Card sx={{ pt: 3 }}>
      <CardHeader
        avatar={<SecurityIcon color="primary" />}
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {report_overview?.title ?? "Security Overview"}
          </Typography>
        }
        subheader={report_overview.description}
      />
      <CardContent>
        <Alert severity="info" sx={{ mb: 3, bgcolor: 'background.paper', border: '1px dashed', borderColor: 'info.main' }}>
          <Typography variant="subtitle2">Key Findings</Typography>
          <Box component="ul" sx={{ mt: 1, mb: 0, pl: 1 }}>
            {report_overview.key_findings.map((finding, index) => (
              <li key={index}>
                <Typography variant="body2">{finding}</Typography>
              </li>
            ))}
          </Box>
        </Alert>
        
        <Grid container spacing={3}>
          {overviewItems.map((item, index) => (
            <Grid xs={12} md={6} lg={3} key={index}>
              <MetricCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                color={item.color}  
                tooltip={item.tooltip}
              />
            </Grid> 
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const RealTimeSecurityStatus = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Real Time Security Status
          </Typography>
        }
        avatar={<VpnLockIcon color="primary" />}
        subheader={`Last updated: ${data.assessment_time}`}
      />
      <CardContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={6} md={3}>
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h4" color="success.main">
                {data.recent_activity_count}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Recent Activities
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={6} md={3}>
            <Stack alignItems="center" spacing={1}>
              <Typography 
                variant="h4" 
                color={data.high_risk_accounts > 0 ? 'error' : 'success'}
              >
                {data.high_risk_accounts}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                High Risk Accounts
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={6} md={3}>
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h4" color="info.main">
                {data.unique_recent_ips}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Unique Recent IPs
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={6} md={3}>
            <Stack alignItems="center" spacing={1}>
              <Typography 
                variant="h4" 
                color={data.overall_risk_level === 'High' ? 'error.main' : 
                      data.overall_risk_level === 'Medium' ? 'warning.main' : 'success.main'}
              >
                {data.overall_risk_level}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Overall Risk Level
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        {data.security_alerts.length > 0 && (
          <Alert severity="error" sx={{ mt: 2, bgcolor: 'background.paper', border: '1px dashed', borderColor: 'error.main' }}>
            <Stack spacing={1}>
              {data.security_alerts.map((alert, index) => (
                <Typography key={index} variant="body2">
                  {alert}
                </Typography>
              ))}
            </Stack>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const StrategicInsights = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Strategic Insights
          </Typography>
        }
        subheader="Business Impact & Recommendations"
        avatar={<SecurityIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Business Impact</Typography>
              <Stack spacing={1}>
                {Object.entries(data.business_impact).map(([key, value]) => (
                  <Stack 
                    key={key} 
                    direction="row" 
                    justifyContent="space-between"
                    sx={{ 
                      p: 1.5, 
                      bgcolor: 'background.neutral',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>
          <Grid xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Strategic Insights</Typography>
              <Stack spacing={1}>
                {Object.entries(data.strategic_insights).map(([key, value]) => (
                  <Stack 
                    key={key} 
                    direction="row" 
                    justifyContent="space-between"
                    sx={{ 
                      p: 1.5, 
                      bgcolor: 'background.neutral',
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const IPSecurityAnalysis = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title="IP Security Analysis" 
        avatar={<VpnLockIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={4}>
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h4" color="error.main">
                {data.high_risk_ips}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                High Risk IPs
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={4}>
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h4" color="warning.main">
                {data.medium_risk_ips}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Medium Risk IPs
              </Typography>
            </Stack>
          </Grid>
          <Grid xs={4}>
            <Stack alignItems="center" spacing={1}>
              <Typography variant="h4" color="success.main">
                {data.low_risk_ips}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Low Risk IPs
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2}>
          {Object.entries(data.ip_details).map(([ip, details]) => (
            <Box
              key={ip}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.neutral'
              }}
            >
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2">{ip}</Typography>
                  <Typography 
                    variant="subtitle2"
                    color={
                      details.risk_level === 'High' ? 'error.main' :
                      details.risk_level === 'Medium' ? 'warning.main' :
                      'success.main'
                    }
                  >
                    {details.risk_level} Risk
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Accounts: {details.account_count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Accesses: {details.total_accesses}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const ActivityAnalysis = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Activity Analysis
          </Typography>
        }
        subheader="Temporal Activity Patterns"
        avatar={<TimelineIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={3}>
          {Object.entries(data.time_periods).map(([period, stats]) => (
            <Grid xs={12} sm={6} key={period}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.neutral'
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {stats.title}
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Active Accounts
                    </Typography>
                    <Typography variant="body2">
                      {stats.accounts_accessed}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total Accesses
                    </Typography>
                    <Typography variant="body2">
                      {stats.total_accesses}
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.percentage_of_total_accounts} 
                    sx={{ height: 6, borderRadius: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {stats.activity_level} Activity Level ({stats.percentage_of_total_accounts}% of accounts)
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const AccessPatterns = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {data?.title ?? "Access Patterns"}
          </Typography>
        }
        subheader={data.description}
        avatar={<AssessmentIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">Access Frequency</Typography>
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Peak Hour</Typography>
                    <Typography variant="body2">{data.insights.peak_access_hour.value}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Average Access</Typography>
                    <Typography variant="body2">
                      {data.insights.access_frequency_distribution.value.average.toFixed(1)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Maximum Access</Typography>
                    <Typography variant="body2">
                      {data.insights.access_frequency_distribution.value.max}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid xs={12} md={6}>
            <Stack spacing={2}>
              <Typography variant="subtitle1">User Distribution</Typography>
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
                <Stack spacing={1}>
                  {Object.entries(data.insights.accounts_by_access_range.value).map(([type, count]) => (
                    <Stack key={type} direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Typography>
                      <Typography variant="body2">{count}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const PerformanceMetrics = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {data?.title ?? "Performance Metrics"}
          </Typography>
        }
        subheader={data.description}
        avatar={<TrendingUpIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={3}>
          {Object.entries(data.engagement_metrics).map(([key, metric]) => (
            <Grid xs={12} sm={6} md={3} key={key}>
              <Box
                sx={{
                  p: 2,
                  height: '100%',
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography 
                  variant="h4" 
                  color="primary"
                  sx={{ mb: 1 }}
                >
                  {typeof metric.value === 'number' ? metric.value.toFixed(2) : metric.value}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ mt: 'auto' }}
                >
                  {metric.explanation}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const BehavioralInsights = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {data?.title ?? "Behavioral Insights"}
          </Typography>
        }
        subheader={data.description}
        avatar={<PersonIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={3}>
          {Object.entries(data.analysis).map(([category, analysis]) => (
            <Grid xs={12} md={6} key={category}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor: 'background.neutral'
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Typography>
                {typeof analysis.value === 'object' ? (
                  <Stack spacing={1}>
                    {Object.entries(analysis.value).map(([key, value]) => (
                      <Stack key={key} direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </Typography>
                        <Typography variant="body2">
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">
                    {analysis.value}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {analysis.explanation}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const ReportMetadata = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title="Report Information"
        avatar={<ScheduleIcon color="primary" />}
        action={
          <Typography variant="caption" color="text.secondary">
            Version {data.report_version}
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Alert severity="info" sx={{ mb: 2, bgcolor: 'background.paper', border: '1px dashed', borderColor: 'info.main' }}>
              <Typography variant="subtitle2">Analytics Models Used</Typography>
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                {data.analytics_models_used.map((model, index) => (
                  <li key={index}>
                    <Typography variant="body2">{model}</Typography>
                  </li>
                ))}
              </Box>
            </Alert>
          </Grid>
          <Grid xs={12} sm={6}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">Usage Recommendations</Typography>
              {Object.entries(data.usage_recommendations).map(([period, recommendation]) => (
                <Box
                  key={period}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'background.neutral'
                  }}
                >
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {period.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Typography>
                  <Typography variant="body2">
                    {recommendation}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Grid>
          <Grid xs={12} sm={6}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">Report Details</Typography>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Generated At
                  </Typography>
                  <Typography variant="body2">
                    {new Date(data.generation_time_ms).toLocaleString()}
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
                    Next Review
                  </Typography>
                  <Typography variant="body2">
                    {data.next_recommended_review}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const AccountAccessDetails = ({ data }) => {
  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {data?.title ?? "Account Access Details"}
          </Typography>
        }
        subheader={data.description}
        avatar={<PersonIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader 
                title="Most Active Account"
                subheader={`${data.key_accounts.most_active_account.percentage_of_total_accesses}% of total activity`}
              />
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {data.key_accounts.most_active_account.agent_name.charAt(0)}
                    </Avatar>
                    <Stack>
                      <Typography variant="subtitle2">
                        {data.key_accounts.most_active_account.agent_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {data.key_accounts.most_active_account.account_id}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Access Count</Typography>
                      <Typography variant="body2">{data.key_accounts.most_active_account.access_count}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">First Access</Typography>
                      <Typography variant="body2">{data.key_accounts.most_active_account.first_access}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Last Access</Typography>
                      <Typography variant="body2">{data.key_accounts.most_active_account.last_access}</Typography>
                    </Stack>
                  </Stack>
                  <Alert severity="info" sx={{ bgcolor: 'background.paper', border: '1px dashed', borderColor: 'info.main' }}>
                    <Typography variant="caption">
                      {data.key_accounts.most_active_account.explanation}
                    </Typography>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card variant="outlined">
              <CardHeader 
                title="Least Active Account"
                subheader="Minimal engagement patterns"
              />
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      {data.key_accounts.least_active_account.agent_name.charAt(0)}
                    </Avatar>
                    <Stack>
                      <Typography variant="subtitle2">
                        {data.key_accounts.least_active_account.agent_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {data.key_accounts.least_active_account.account_id}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider />
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Access Count</Typography>
                      <Typography variant="body2">{data.key_accounts.least_active_account.access_count}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">First Access</Typography>
                      <Typography variant="body2">{data.key_accounts.least_active_account.first_access}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Last Access</Typography>
                      <Typography variant="body2">{data.key_accounts.least_active_account.last_access}</Typography>
                    </Stack>
                  </Stack>
                  <Alert severity="warning" sx={{ bgcolor: 'background.paper', border: '1px dashed', borderColor: 'warning.main' }}>
                    <Typography variant="caption">
                      {data.key_accounts.least_active_account.explanation}
                    </Typography>
                  </Alert>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const AdvancedAnalytics = ({ data }) => {
  if (!data) {
    return null;
  }

  const behavioralSegmentation = data.behavioral_segmentation || {};
  const competitiveAnalysis = data.competitive_analysis || {};
  const qualityMetrics = data.quality_metrics?.engagement_quality || {};

  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {data?.title ?? "Advanced Analytics"}
          </Typography>
        }
        subheader={data.description}
        avatar={<AccountTreeIcon color="primary" />}
      />
      <CardContent>
        <Stack 
          direction={{ xs: 'column', lg: 'row' }}
          spacing={3}
        >
          <Box flex={1}>
            <Card variant="outlined">
              <CardHeader title="Behavioral Segmentation" />
              <CardContent>
                <Stack spacing={2}>
                  {Object.entries(behavioralSegmentation).map(([segment, details]) => (
                    <Box
                      key={segment}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.neutral'
                      }}
                    >
                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle2">
                            {segment.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Typography>
                          <Typography 
                            variant="subtitle2" 
                            color="primary"
                          >
                            {details?.percentage || 0}%
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body2" color="text.secondary">
                            Count: {details?.count || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Avg: {details?.avg_accesses || 0}
                          </Typography>
                        </Stack>
                        {details?.top_accounts && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Top Accounts: {details.top_accounts.join(', ')}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Box>
          <Box flex={1}>
            <Card variant="outlined">
              <CardHeader title="Competitive Analysis" />
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Market Concentration
                    </Typography>
                    <Stack spacing={1}>
                      {(competitiveAnalysis.market_leaders || []).map((leader) => (
                        <Stack
                          key={leader.account_id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="body2">
                            Account {leader.account_id}
                          </Typography>
                          <Box sx={{ width: '60%' }}>
                            <LinearProgress
                              variant="determinate"
                              value={leader.share || 0}
                              sx={{
                                height: 8,
                                borderRadius: 1,
                                bgcolor: 'background.neutral',
                                '& .MuiLinearProgress-bar': {
                                  borderRadius: 1
                                }
                              }}
                            />
                          </Box>
                          <Typography variant="body2">
                            {(leader.share || 0).toFixed(1)}%
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Quality Metrics
                    </Typography>
                    <Stack 
                      direction="row" 
                      flexWrap="wrap" 
                      sx={{ gap: 2 }}
                    >
                      {Object.entries(qualityMetrics).map(([metric, value]) => (
                        <Box
                          key={metric}
                          sx={{
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: 'background.neutral',
                            flex: '1 1 calc(50% - 8px)',
                            minWidth: 140,
                            textAlign: 'center'
                          }}
                        >
                          <Typography variant="h4" color="primary">
                            {typeof value === 'number' ? value.toFixed(2) : value || 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const ReportContext = ({ type, context, generatedBy }) => {
  return (
    <Card>
      <CardHeader 
        title="Report Context"
        avatar={<DescriptionIcon color="primary" />}
      />
      <CardContent sx={{ pt: 0 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={4}>
            <Box
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 1,
                bgcolor: 'background.neutral',
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
          <Grid xs={12} sm={4}>
            <Box
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 1,
                bgcolor: 'background.neutral',
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
          <Grid xs={12} sm={4}>
            <Box
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 1,
                bgcolor: 'background.neutral',
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

const DetailedAccessHistory = ({ data }) => {
  if (!data) return null;

  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {data?.title ?? "Detailed Access History"}
          </Typography>
        }
        subheader={data.description}
        avatar={<HistoryIcon color="primary" />}
      />
      <CardContent>
        <Timeline position="alternate">
          {Object.entries(data.data || {}).map(([accountId, accessData]) => (
            <TimelineItem key={accountId}>
              <TimelineSeparator>
                <TimelineDot color={accessData.access_count > 10 ? "primary" : "grey"} />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: accessData.access_count > 10 ? "primary.main" : "white" }}>
                        {accessData.agent_name?.charAt(0) || 'U'}
                      </Avatar>
                      <Typography variant="subtitle2">
                        {accessData.agent_name}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          Access Count
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          {accessData.access_count}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          First Access
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          {accessData.first_access_readable}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          Last Access
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          {accessData.last_access_readable}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">
                          Last IP
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                          {accessData.last_ip}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Card>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};

const SuspiciousActivityAnalysis = ({ data }) => {
  if (!data) return null;

  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {data?.title ?? "Suspicious Activity Analysis"}
          </Typography>
        }
        subheader={data.description}
        avatar={<SecurityUpdateWarningIcon color="primary" />}
      />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Accounts Analyzed: {data.accounts_analyzed}
        </Typography>
        <Grid container spacing={3}>
          {(data.data || []).map((account) => (
            <Grid xs={12} md={6} key={account.account_id}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar 
                          sx={{ 
                            bgcolor: account.risk_level === 'High Risk' ? 'error.main' : 
                                  account.risk_level === 'Medium Risk' ? 'warning.main' : 
                                  'success.main'
                          }}
                        >
                          {account.agent_name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {account.agent_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {account.account_id}
                          </Typography>
                        </Box>
                      </Stack>
                      <Chip 
                        label={account.risk_level}
                        color={
                          account.risk_level === 'High Risk' ? 'error' :
                          account.risk_level === 'Medium Risk' ? 'warning' :
                          'success'
                        }
                        size="small"
                      />
                    </Stack>
                    <Divider />
                    <Stack spacing={1}>
                      {Object.entries(account.suspicious_activity).map(([key, value]) => (
                        <Stack key={key} direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </Typography>
                          <Typography variant="body2">
                            {value}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

const AccountContextInfo = ({ context }) => {
  if (!context) return null;

  return (
    <Box sx={{ position: 'absolute', top: 20, right: 16, zIndex: 1 }}>
      <Chip
        icon={<PersonIcon color="primary" />}
        label={`Account Context: ${context}`}
        variant="outlined"
        sx={{
          color: 'text.primary',
          borderColor: 'primary.main',
          '& .MuiChip-icon': {
            color: 'primary.main'
          }
        }}
      />
    </Box>
  );
};

const AccountAccessSummaries = ({ data }) => {
  if (!data) return null;

  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {data?.title ?? "Account Access Summaries"}
          </Typography>
        }
        subheader={data.description}
        avatar={<HubIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={3}>
          {data.data.map((account) => (
            <Grid xs={12} lg={6} key={account.account_id}>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={2}>
                    {/* Account Header */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {account.agent_name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">
                          {account.agent_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {account.account_id} • Total Clients: {account.total_clients_accessed}
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider />

                    {/* Client Access Summary */}
                    <Box sx={{ 
                      maxHeight: 400, 
                      overflow: 'auto',
                      '&::-webkit-scrollbar': {
                        width: 8,
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'background.default'
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'primary.main',
                        borderRadius: 2
                      }
                    }}>
                      <Stack spacing={2}>
                        {Object.entries(account.summary_data).map(([clientId, access]) => (
                          <Box
                            key={clientId}
                            sx={{
                              p: 1.5,
                              borderRadius: 1,
                              bgcolor: 'background.neutral'
                            }}
                          >
                            <Stack spacing={1}>
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2">
                                  Client ID: {clientId}
                                </Typography>
                                <Chip 
                                  label={`${access.access_count} accesses`}
                                  size="small"
                                  color={access.access_count > 20 ? "primary" : "info"}
                                />
                              </Stack>
                              
                              <Stack spacing={0.5}>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="caption" color="text.secondary">
                                    First Access
                                  </Typography>
                                  <Typography variant="caption">
                                    {access.first_access_readable}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="caption" color="text.secondary">
                                    Last Access
                                  </Typography>
                                  <Typography variant="caption">
                                    {access.last_access_readable}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="caption" color="text.secondary">
                                    Last IP
                                  </Typography>
                                  <Typography variant="caption">
                                    {access.last_ip}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Box>
                        ))}
                      </Stack>
                    </Box>

                    {/* Summary Footer */}
                    <Box sx={{ pt: 1 }}>
                      <Alert severity="info" sx={{ bgcolor: 'background.paper', border: '1px dashed', borderColor: 'info.main' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption">
                            Total Access Events
                          </Typography>
                          <Typography variant="subtitle2">
                            {Object.values(account.summary_data).reduce((sum, client) => sum + client.access_count, 0)}
                          </Typography>
                        </Stack>
                      </Alert>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export const CustomerSecurityReport = ({ customerId }) => {
  const { securityReport, loading, error } = useSecurityReport(customerId);

  if (loading) {
    return (
      <Card sx={{ p: 2 }}>
        <Stack spacing={2} alignItems="center">
          <LinearProgress sx={{ width: '100%' }} />
          <Typography>Loading security report...</Typography>
        </Stack>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading security report: {error}
      </Alert>
    );
  }

  if (!securityReport) {
    return null;
  }

  if (securityReport?.error) {
    return (
      <Alert severity="error">
        {securityReport?.error} : Client id {securityReport?.client_id}
      </Alert>
    );
  }

  const {
    report_overview,
    executive_summary,
    security_analysis,
    behavioral_segmentation,
    all_accessing_accounts,
    activity_analysis,
    access_patterns,
    account_access_details,
    behavioral_insights,
    performance_metrics,
    advanced_analytics,
    report_metadata,
    report_type,
    security_context,
    account_context,
    generated_by,
    detailed_access_history,
    suspicious_activity_analysis,
    account_access_summaries,
  } = securityReport;

  return (
    <Box sx={{ position: 'relative' }}>
      <AccountContextInfo context={account_context} />
      <Stack spacing={3}>

        <SecurityOverview report_overview={report_overview} executive_summary={executive_summary} />

        <RealTimeSecurityStatus data={securityReport.real_time_security_alerts.data} />

        <Stack 
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
        >
          <Box flex={1}>
            <RiskIndicator indicators={security_analysis.risk_indicators} />
          </Box>
          <Box flex={1}>
            <AccessDistributionChart data={behavioral_segmentation} />
          </Box>
        </Stack>

        <StrategicInsights data={executive_summary} />
        
        <Stack 
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
        >
          <Box flex={7}>
            <TopAccessingAccounts accounts={all_accessing_accounts.accounts} />
          </Box>
          <Box flex={5}>
            <IPSecurityAnalysis data={security_analysis.ip_security_analysis.value} />
          </Box>
        </Stack>

        <ActivityAnalysis data={activity_analysis} />
        
        <Stack 
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
        >
          <Box flex={1}>
            <AccessPatterns data={access_patterns} />
          </Box>
          <Box flex={1}>
            <BehavioralInsights data={behavioral_insights} />
          </Box>
        </Stack>
        
        <PerformanceMetrics data={performance_metrics} />
        
        <ReportMetadata data={report_metadata} />

        <ReportContext 
          type={report_type}
          context={security_context}
          generatedBy={generated_by}
        />
        
        <AccountAccessDetails data={account_access_details} />
        
        <AdvancedAnalytics data={advanced_analytics} />

        <DetailedAccessHistory data={detailed_access_history} />

        <SuspiciousActivityAnalysis data={suspicious_activity_analysis} />

        <AccountAccessSummaries data={account_access_summaries} />
      </Stack>
    </Box>
  );
};
