import { useMemo, useState } from "react";

import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";

import { useGetLeaderboard } from "src/api/reports";
import { useTimezone } from "src/hooks/use-timezone";

import { LeaderboardTable } from "./widgets/leaderboard-table";
import { LeaderboardEvents } from "./widgets/leaderboard-events";
import { LeaderboardFilters } from "./widgets/leaderboard-filters";
import { LeaderboardSettings } from "./widgets/leaderboard-settings";
import { LeaderboardAnalytics } from "./widgets/leaderboard-analytics";

export const Leaderboard = () => {
  const { toUTCTime } = useTimezone();
  
  const [selectedDesk, setSelectedDesk] = useState();
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('leaderboard_start_time');
    return saved ? new Date(saved) : new Date(new Date().setHours(0, 0, 0, 0));
  });
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(() => {
    const saved = localStorage.getItem('leaderboard_end_time');
    return saved ? new Date(saved) : new Date(new Date().setHours(23, 59, 59, 999));
  });
  const [includeFtd, setIncludeFtd] = useState(() => {
    const saved = localStorage.getItem('leaderboard_include_ftd');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [includeFtdEvents, setIncludeFtdEvents] = useState(() => {
    const saved = localStorage.getItem('leaderboard_include_ftd_events');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [reportBasedOn, setReportBasedOn] = useState(() => {
    const saved = localStorage.getItem('leaderboard_report_based_on');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [isNewEvent, setIsNewEvent] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const startDateTime = useMemo(() => {
    const start = new Date(
      startDate.getFullYear(),
      startDate.getMonth(), 
      startDate.getDate(),
      startTime.getHours(),
      startTime.getMinutes(),
      startTime.getSeconds()
    );

    return toUTCTime(start);
  }, [startDate, startTime]);

  const endDateTime = useMemo(() => {
    const end = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      endTime.getHours(), 
      endTime.getMinutes(),
      endTime.getSeconds()
    );
    return toUTCTime(end);
  }, [endDate, endTime]);

  const detectNewEvent = (events, desk) => {
    const lastEventKey = `desk_${desk}_event`;
    const lastEvent = localStorage.getItem(lastEventKey);

    if (!events?.length) return;

    if (lastEvent) {
      if (lastEvent == events?.[0]?.id) {
        setIsNewEvent(false);
        return null;
      } else {
        setIsNewEvent(true);
        localStorage.setItem(lastEventKey, events?.[0]?.id);
      }
    } else {
      setIsNewEvent(false);
      localStorage.setItem(lastEventKey, events?.[0]?.id);
    }
  };

  const { leaderboardInfo, isLoading } = useGetLeaderboard(
    { 
      desk_id: selectedDesk?.value, 
      start_time: startDateTime, 
      end_time: endDateTime,
      include_ftd: includeFtd,
      include_ftd_events: includeFtdEvents,
      approved_at: reportBasedOn
    }, 
    { refreshInterval: 3000, onSuccess: ({ data }) => detectNewEvent(data?.events, selectedDesk?.value) }
  );

  const handleIncludeFtdChange = (value) => {
    setIncludeFtd(value);
    localStorage.setItem('leaderboard_include_ftd', JSON.stringify(value));
  };

  const handleIncludeFtdEventsChange = (value) => {
    setIncludeFtdEvents(value);
    localStorage.setItem('leaderboard_include_ftd_events', JSON.stringify(value));
  };

  const handleReportBasedOnChange = (value) => {
    setReportBasedOn(value);
    localStorage.setItem('leaderboard_report_based_on', JSON.stringify(value));
  };

  const handleStartTimeChange = (value) => {
    setStartTime(value);
    localStorage.setItem('leaderboard_start_time', value.toISOString());
  };

  const handleEndTimeChange = (value) => {
    setEndTime(value);
    localStorage.setItem('leaderboard_end_time', value.toISOString());
  };
  
  return (
    <Stack direction='column' gap={2} width={1}>
      <Stack 
        alignItems="center" 
        direction="row" 
        sx={{ gap: 4 }}
      >
        <LeaderboardFilters 
          startTime={startTime} 
          setStartTime={handleStartTimeChange} 
          endTime={endTime} 
          setEndTime={handleEndTimeChange} 
          startDate={startDate} 
          endDate={endDate} 
          setStartDate={setStartDate} 
          setEndDate={setEndDate} 
          selectedDesk={selectedDesk} 
          setSelectedDesk={setSelectedDesk}
          setSettingsOpen={setSettingsOpen}   
        />
      </Stack>

      <Grid container spacing={2} width={1} margin={0}>
        <Grid xs={12} xl={8}>
          <LeaderboardTable
            selectedDesk={selectedDesk}
            setSelectedDesk={setSelectedDesk}
            tableData={leaderboardInfo?.ageents_list}
            isLoading={isLoading}
          />
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
            chartSeries={[{ data: leaderboardInfo?.total_deposit_chart ?? [] }]}
            totalNetDeposit={leaderboardInfo?.total_net_deposit}
            totalNetDepositChart={[{ data: leaderboardInfo?.total_net_deposit_chart ?? []}]}
            totalDepositCount={leaderboardInfo?.total_deposit_count}
            totalDeposit={leaderboardInfo?.total_deposit}
            totalWithdraw={leaderboardInfo?.total_withdraw}
            totalWithdrawChart={[{ data: leaderboardInfo?.total_withdraw_chart ?? []}]}
            totalWithdrawCount={leaderboardInfo?.total_withdraw_count}
            totalGoal={leaderboardInfo?.total_goal}
            remainingGoal={leaderboardInfo?.remaining_goal}
            totalPercentage={leaderboardInfo?.complete_percentage ?? 0}
          />
          <LeaderboardEvents
            events={leaderboardInfo?.events}
            isLoading={isLoading}
            isNewEvent={isNewEvent}
            setIsNewEvent={setIsNewEvent}
            soundEnabled={leaderboardInfo?.leader_sound_enable}
            leaderSound={leaderboardInfo?.leader_sound}
          />
        </Grid>
      </Grid>

      <LeaderboardSettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        soundEnabled={leaderboardInfo?.leader_sound_enabled}
        file={leaderboardInfo?.leader_sound}
        totalGoal={leaderboardInfo?.total_goal}
        includeFtd={includeFtd}
        onIncludeFtdChange={handleIncludeFtdChange}
        includeFtdEvents={includeFtdEvents}
        onIncludeFtdEventsChange={handleIncludeFtdEventsChange}
        reportBasedOn={reportBasedOn}
        onReportBasedOnChange={handleReportBasedOnChange}
      />
    </Stack>
  );
};
