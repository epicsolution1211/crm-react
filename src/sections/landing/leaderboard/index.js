import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";

import { LeaderboardAnalytics } from "./widgets/leaderboard-analytics";
import { LeaderboardEvents } from "./widgets/leaderboard-events";
import { LeaderboardFilters } from "./widgets/leaderboard-filters";
import { LeaderboardTable } from "./widgets/leaderboard-table";
import { mockedData } from "./mocks";

export const Leaderboard = () => {
  return (
    <Stack direction='column' gap={2} width={1}>
      <LeaderboardFilters desks={mockedData?.desks}/>

      <Grid container spacing={2} width={1} margin={0}>
        <Grid xs={12} xl={8}>
          <LeaderboardTable tableData={mockedData?.agents_list}/>
        </Grid>
        <Grid
          xs={12}
          xl={4}
          sx={{
            display: 'flex',
            flexDirection: { xl: 'column', lg: 'row', xs: 'column' },
            gap: 2,
            width: 1,
          }}
        >
          <LeaderboardAnalytics 
            chartSeries={mockedData?.total_deposit_chart}
            totalDepositCount={mockedData?.total_deposit_count}
            totalDeposit={mockedData?.total_deposit}
            totalGoal={mockedData?.total_goal}
            remainingGoal={mockedData?.remaining_goal}
            totalPercentage={mockedData?.complete_percentage}
          />
          <LeaderboardEvents
            events={mockedData?.events}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
