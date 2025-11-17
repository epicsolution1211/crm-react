import { useMemo, useState } from "react";
import { format } from 'date-fns';

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";

import { useGetAgentDailyReportById } from "src/hooks/swr/use-agents";
import { ReportContent } from "src/sections/dashboard/agents/reports/report-contnet";
import { timezoneList } from 'src/utils/functions';

export const ActivityHeatmap = ({ agent }) => {
  const [isIncludingComparisons, setIsIncludingComparisons] = useState(false);
  const [isIncludingInsights, setIsIncludingInsights] = useState(false);
  const [date, setDate] = useState(undefined);
  const [timezone, setTimezone] = useState(undefined);

  const filterOptions = useMemo(() => {
    return {
      include_comparisons: isIncludingComparisons,
      include_insights: isIncludingInsights,
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
      timezone,
    }
  }, [isIncludingComparisons, isIncludingInsights, date, timezone]);

  const { dailyReport: dailyReportById, isLoading: isLoadingById } = useGetAgentDailyReportById(agent?.id, filterOptions);

  return (
    <Stack gap={2} pb={4}>
      <Stack sx={{ flexDirection: { xs: "column", md: "row" }, alignItems: "start", justifyContent: "end", gap: 1 }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent={{ xs: "start", md: "end" }} alignItems="center" gap={0.5}>
          <Stack direction="row" justifyContent="center"  alignItems="center" gap={0.5} width={{ xs: 1, md: "auto" }}>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Typography variant="subtitle1">Comparisons</Typography>
              <Switch
                checked={isIncludingComparisons}
                onChange={() => setIsIncludingComparisons(!isIncludingComparisons)}
              />
            </Stack>
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Typography variant="subtitle1">Insights</Typography>
              <Switch
                checked={isIncludingInsights}
                onChange={() => setIsIncludingInsights(!isIncludingInsights)}
              />
            </Stack>
          </Stack>
          <Stack direction={{ xs: "column", md: "row" }} alignItems="center" gap={2} width={{ xs: 1, md: "auto" }}>
            <DatePicker
              format="dd/MM/yyyy"
              label="Date"
              onChange={(val) => setDate(val)}
              value={date}
              slotProps={{ textField: { size: "medium", InputLabelProps: { shrink: true }, sx: { width: { xs: 1, md: 250 } } } }}
            />
            <Autocomplete
              options={timezoneList}
              value={timezoneList.find(tz => tz.value === timezone) || null}
              onChange={(event, value) => setTimezone(value ? value.value : undefined)}
              autoHighlight
              sx={{ minWidth: { xs: 1, md: 250 } }}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li"
                  sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                  {...props}>
                  {option.label}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select timezone"
                  inputProps={{
                    ...params.inputProps,
                  }}
                />
              )}
            />
          </Stack>
        </Stack>
      </Stack>
      <ReportContent dailyReport={dailyReportById} isLoading={isLoadingById} />
    </Stack>
  );
};
