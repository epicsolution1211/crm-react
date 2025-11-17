import { memo } from 'react';

import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { Chart } from "src/components/chart";
import { useAreaChartOptions, useRadialChartOptions } from '../hooks';
import { Divider } from '@mui/material';


const AreaChart = memo(({ series, height = 120 }) => {
  const areaChartOptions = useAreaChartOptions();
  return (
    <Chart
      height={height}
      options={areaChartOptions}
      series={series}
      type="area"
    />
  );
});

const RadialChart = memo(({ series, height = 190 }) => {
  const radialChartOptions = useRadialChartOptions();
  return (
    <Chart
      height={height}
      options={radialChartOptions}
      series={series}
      type="radialBar"
    />
  );
});

const StatRow = memo(({ primaryLabel, secondaryLabel, primaryValue, secondaryValue, chart }) => (
  <Grid 
    container 
    columnSpacing={4}
    sx={{
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Grid xs={4}>
      <Stack alignItems="flex-start" spacing={1}>
        <Typography variant="subtitle1" color='text.secondary'>{primaryLabel}</Typography>
        {secondaryLabel && (
          <Typography variant="subtitle1" color='text.secondary'>{secondaryLabel}</Typography>
        )}
      </Stack>
    </Grid>
    <Grid xs={4}>
      <Stack alignItems="flex-start" spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          {typeof primaryValue === 'number' ? `$${primaryValue.toFixed(2)}` : primaryValue}
        </Typography>
        {secondaryValue !== undefined && (
          <Typography variant="subtitle1" fontWeight={600}>
            {secondaryValue}
          </Typography>
        )}
      </Stack>
    </Grid>
    <Grid xs={4}>
      {chart}
    </Grid>
  </Grid>
));

export const LeaderboardAnalytics = memo(({
  chartSeries = [],
  totalDeposit = 0,
  totalDepositCount = 0,
  totalGoal = 0,
  remainingGoal = 0,
  totalPercentage = 0,
  totalNetDeposit = 0,
  totalNetDepositChart = [],
  totalWithdraw = 0,
  totalWithdrawChart = [],
  totalWithdrawCount = 0,
}) => {
  return (
    <Card sx={{ p: 3, pb: 1, width: 1 }}>
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
        Analytics
      </Typography>

      <Stack divider={<Divider sx={{ borderStyle: 'dashed' }} />} gap={0.2}>
        <StatRow
          primaryLabel="Total Deposit"
          secondaryLabel="Total Count"
          primaryValue={totalDeposit}
          secondaryValue={totalDepositCount}
          chart={<AreaChart series={chartSeries} />}
        />

        <StatRow
          primaryLabel="Total Goal"
          secondaryLabel="Remaining Goal"
          primaryValue={totalGoal}
          secondaryValue={remainingGoal}
          chart={<RadialChart series={[totalPercentage]} />}
        />

        <StatRow
          primaryLabel="Total Net Deposit"
          primaryValue={totalNetDeposit}
          chart={<AreaChart series={totalNetDepositChart} />}
        />

        <StatRow
          primaryLabel="Total Withdrawal"
          secondaryLabel="Total Count"
          primaryValue={totalWithdraw}
          secondaryValue={totalWithdrawCount}
          chart={<AreaChart series={totalWithdrawChart} />}
        />
      </Stack>
    </Card>
  );
});
