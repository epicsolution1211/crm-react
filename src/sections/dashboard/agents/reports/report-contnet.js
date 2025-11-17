
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

const SkeletonField = () => (
  <Stack>
    <Skeleton variant="text" width={100} height={20} />
    <Skeleton variant="text" width={120} height={24} />
  </Stack>
);

const SkeletonSection = ({ fieldCount = 5 }) => (
  <Stack spacing={1}>
    <Skeleton variant="text" width={150} height={32} />
    <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap">
      {Array.from({ length: fieldCount }).map((_, index) => (
        <SkeletonField key={index} />
      ))}
    </Stack>
  </Stack>
);

export const ReportContent = ({ dailyReport, isLoading }) => {
  if (isLoading) {
    return (
      <Card sx={{ p: 4 }}>
        <Stack spacing={3} divider={<Divider flexItem />}>
          {/* Agent Skeleton */}
          <SkeletonSection fieldCount={5} />
          
          {/* Overview Skeleton */}
          <SkeletonSection fieldCount={5} />
          
          {/* Time Tracking Skeleton */}
          <SkeletonSection fieldCount={6} />
          
          {/* Hourly Breakdown Skeleton */}
          <Stack spacing={1}>
            <Skeleton variant="text" width={150} height={32} />
            <Stack 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: 'repeat(4, 1fr)', 
                  sm: 'repeat(6, 1fr)', 
                  md: 'repeat(6, 1fr)', 
                  lg: 'repeat(12, 1fr)', 
                  xl: 'repeat(12, 1fr)',
                  xxl: 'repeat(24, 1fr)' 
                }, 
                gap: 1, 
                pt: 1,
              }}
            >
              {Array.from({ length: 24 }).map((_, index) => (
                <Skeleton 
                  key={index} 
                  variant="rectangular" 
                  height={70} 
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Stack>
          </Stack>
          
          {/* Productivity Skeleton */}
          <SkeletonSection fieldCount={6} />
        </Stack>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={3} divider={<Divider flexItem />}>
        {/* Agent */}
        <Stack spacing={2}>
          <Typography variant="h6">Agent</Typography>
          <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap">
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Name</Typography>
              <Typography>{dailyReport?.agent?.name ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Role</Typography>
              <Typography>{dailyReport?.agent?.role ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">On Duty</Typography>
              <Typography sx={{ color: dailyReport?.agent?.on_duty == true ? 'success.main' : dailyReport?.agent?.on_duty == false ? 'error.main' : 'text.primary' }}>
                {dailyReport?.agent?.on_duty == true  ? 'Online'  : dailyReport?.agent?.on_duty == false ? 'Offline' : '-'}
              </Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Report Date</Typography>
              <Typography>{dailyReport?.report_date ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Timezone</Typography>
              <Typography>{dailyReport?.timezone ?? '-'}</Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Activity Overview */}
        <Stack spacing={1}>
          <Typography variant="h6">Overview</Typography>
          <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap" alignItems="center">
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Total Requests</Typography>
              <Typography>{dailyReport?.overview?.total_requests ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Total Active Time</Typography>
              <Typography>
                {dailyReport?.overview?.total_active_hours ?? 0}h {dailyReport?.overview?.total_active_minutes ?? 0}m
              </Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Activity Score</Typography>
              <Typography>{dailyReport?.overview?.activity_score ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Classification</Typography>
              <Typography>
                {dailyReport?.overview?.status_emoji ?? ''} 
                {dailyReport?.overview?.day_classification ?? '-'}
              </Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Summary</Typography>
              <Typography>{dailyReport?.overview?.summary ?? '-'}</Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Time Tracking */}
        <Stack spacing={1}>
          <Typography variant="h6">Time Tracking</Typography>
          <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap">
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">First Activity</Typography>
              <Typography>{dailyReport?.time_tracking?.first_activity ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Last Activity</Typography>
              <Typography>{dailyReport?.time_tracking?.last_activity ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Work Span (h)</Typography>
              <Typography>{dailyReport?.time_tracking?.work_span_hours ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Active Time</Typography>
              <Typography>
                {dailyReport?.time_tracking?.actual_active_hours ?? 0}h {dailyReport?.time_tracking?.actual_active_minutes ?? 0}m
              </Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Idle Time (min)</Typography>
              <Typography>{dailyReport?.time_tracking?.idle_time_minutes ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Efficiency (%)</Typography>
              <Typography>{dailyReport?.time_tracking?.efficiency_percentage ?? '-'}</Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Hourly Breakdown */}
        <Stack spacing={1}>
          <Typography variant="h6">Hourly Breakdown</Typography>
          <Stack 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: 'repeat(4, 1fr)', 
                sm: 'repeat(6, 1fr)', 
                md: 'repeat(6, 1fr)', 
                lg: 'repeat(12, 1fr)', 
                xl: 'repeat(12, 1fr)' ,
                xxl: 'repeat(24, 1fr)' 
              }, 
              gap: 1, 
              overflowX: 'auto',
              pt: 1,
            }}>
            {dailyReport?.hourly_breakdown?.map((hour) => (
              <Stack
                key={hour.hour}
                alignItems="center"
                spacing={0.25}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  color: (theme) => theme.palette.getContrastText(hour.color),
                  backgroundColor: hour.color,
                }}
              >
                <Typography fontSize={11}>{hour.local_time}</Typography>
                <Typography fontWeight={600} fontSize={15}>{hour.requests}</Typography>
                <Typography fontSize={11} sx={{ textTransform: 'capitalize', textAlign: 'center' }}>{hour.status?.replace('_', ' ') ?? '-'}</Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
        
        {/* Productivity Metrics */}
        <Stack spacing={1}>
          <Typography variant="h6">Productivity</Typography>
          <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap">
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Avg Requests/hr</Typography>
              <Typography>{dailyReport?.productivity?.avg_requests_per_hour ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Avg Requests/Active hr</Typography>
              <Typography>{dailyReport?.productivity?.avg_requests_per_active_hour ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Peak Hour</Typography>
              <Typography>{dailyReport?.productivity?.peak_hour_time ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Peak Requests</Typography>
              <Typography>{dailyReport?.productivity?.peak_requests ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Consistency Score</Typography>
              <Typography>{dailyReport?.productivity?.consistency_score ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Rating</Typography>
              <Typography>
                {dailyReport?.productivity?.rating_emoji ?? ''} {dailyReport?.productivity?.rating ?? '-'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Work Patterns */}
        <Stack spacing={1}>
          <Typography variant="h6">Work Patterns</Typography>
          <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap">
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Working Hours</Typography>
              <Typography>{dailyReport?.work_patterns?.working_hours ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Sessions</Typography>
              <Typography>{dailyReport?.work_patterns?.total_work_sessions ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Longest Session (h)</Typography>
              <Typography>{dailyReport?.work_patterns?.longest_session_hours ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Avg Session Length (h)</Typography>
              <Typography>{dailyReport?.work_patterns?.avg_session_length ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Continuous Hours</Typography>
              <Typography>{dailyReport?.work_patterns?.continuous_hours ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Breaks</Typography>
              {dailyReport?.work_patterns?.breaks?.length > 0 && (
                <Stack direction="row" columnGap={1} rowGap={1} flexWrap="wrap">{dailyReport?.work_patterns?.breaks?.map((brk, index) => (
                <Typography key={brk.time}>
                  {index === dailyReport?.work_patterns?.breaks?.length - 1
                    ? `${brk.time} - ${brk.duration_hours}h`
                    : `${brk.time} - ${brk.duration_hours}h, `}
                  </Typography>
                )) ?? '-'}</Stack>
              )}
              {dailyReport?.work_patterns?.breaks?.length === 0 && (
                <Typography>No breaks</Typography>
              )}
            </Stack>
          </Stack>
        </Stack>

        {/* Intensity Distribution */}
        <Stack spacing={1}>
          <Typography variant="h6">Intensity Distribution</Typography>
          <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap">
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">High Intensity Hours</Typography>
              <Typography>{dailyReport?.intensity_distribution?.high_intensity_hours ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Low Intensity Hours</Typography>
              <Typography>{dailyReport?.intensity_distribution?.low_intensity_hours ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Offline Hours</Typography>
              <Typography>{dailyReport?.intensity_distribution?.offline_hours ?? '-'}</Typography>
            </Stack>
          </Stack>
        </Stack>

        {/* Comparisons & Trends */}
        {dailyReport?.comparisons && (
          <Stack spacing={1}>
            <Typography variant="h6">Comparisons</Typography>
            <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap">
              <Stack>
                <Typography color="text.secondary" variant="subtitle2">Vs Yesterday</Typography>
                <Typography>{dailyReport?.comparisons?.vs_yesterday ?? '-'}</Typography>
              </Stack>
              <Stack>
                <Typography color="text.secondary" variant="subtitle2">Vs 7 Day Avg</Typography>
                <Typography>{dailyReport?.comparisons?.vs_7day_average ?? '-'}</Typography>
              </Stack>
              <Stack>
                <Typography color="text.secondary" variant="subtitle2">Yesterday's Requests</Typography>
                <Typography>{dailyReport?.comparisons?.yesterday_requests ?? '-'}</Typography>
              </Stack>
              <Stack>
                <Typography color="text.secondary" variant="subtitle2">7 Day Avg</Typography>
                <Typography>{dailyReport?.comparisons?.seven_day_average ?? '-'}</Typography>
              </Stack>
              <Stack>
                <Typography color="text.secondary" variant="subtitle2">Trend</Typography>
                <Typography>{dailyReport?.comparisons?.trend_emoji ?? ''} {dailyReport?.comparisons?.trend ?? '-'}</Typography>
              </Stack>
            </Stack>
          </Stack>
        )}

        {/* Insights */}
        {dailyReport?.insights && (
        <Stack spacing={1}>
          <Typography variant="h6">Insights</Typography>

          <Stack direction="row" columnGap={5} rowGap={1} flexWrap="wrap">
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Burnout Risk</Typography>
              <Typography sx={{ textTransform: 'capitalize' }}>{dailyReport?.insights?.health_indicators?.burnout_risk ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Work Balance</Typography>
              <Typography sx={{ textTransform: 'capitalize' }}>{dailyReport?.insights?.health_indicators?.work_balance ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Recommendation</Typography>
              <Typography>{dailyReport?.insights?.health_indicators?.recommendation ?? '-'}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Summary</Typography>
              <Typography>{dailyReport?.insights?.summary ?? '-'}</Typography>
            </Stack>
          </Stack>
          {dailyReport?.insights?.strengths?.length > 0 && (
            <Stack>
              <Typography color="text.secondary" variant="subtitle2">Strengths</Typography>
              <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                {dailyReport?.insights?.strengths?.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </Stack>
          )}
          <Stack>
            <Typography color="text.secondary" variant="subtitle2">Suggestions</Typography>
            {dailyReport?.insights?.suggestions?.length ? (
              <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
                {dailyReport?.insights?.suggestions.map((sg, idx) => (
                  <li key={idx}>{sg}</li>
                ))}
              </ul>
            ) : (
              <Typography color="text.disabled" fontStyle="italic" fontSize={13}>No suggestions</Typography>
            )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};
