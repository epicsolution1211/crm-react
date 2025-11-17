import { useMemo, useCallback, memo } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";

import { Iconify } from "src/components/iconify";
import { useGetDesks } from "src/api/settings";
import { useSettings } from "src/hooks/use-settings";
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";
import { useFullscreen } from "../hooks";

const FullscreenButton = memo(({ isExpanded, onClick }) => (
  <Tooltip title={isExpanded ? "Small Screen" : "Full Screen"}>
    <IconButton onClick={onClick}>
      <Iconify icon={isExpanded ? "ant-design:compress-outlined" : "ant-design:expand-outlined"}/>
    </IconButton>
  </Tooltip>
));

const SettingsButton = memo(({ onClick }) => (
  <Tooltip title="Leaderboard Setting">
    <IconButton onClick={onClick}>
      <SvgIcon>
        <SettingIcon />
      </SvgIcon>
    </IconButton>
  </Tooltip>
));

const DateTimeControls = memo(({ 
  startDate, 
  setStartDate, 
  startTime, 
  setStartTime, 
  endDate, 
  setEndDate, 
  endTime, 
  setEndTime 
}) => (
  <Stack
    alignItems="center"
    sx={{
      flexDirection: { xs: "column", sm: "row" },
      width: { lg: "auto", xs: 1 },
      gap: { xs: 1, sm: 2 },
    }}
  >
    <Stack direction="row" gap={1} alignItems="center">
      <DatePicker
        format="dd/MM/yyyy"
        label="Start Date"
        onChange={setStartDate}
        sx={{ width: { xs: 1, md: "auto" } }}
        value={startDate}
        slotProps={{ textField: { size: "small" } }}
      />
      <TimePicker
        format="h:mm a"
        label="Start Time"
        sx={{ my: 1 / 2 }}
        value={startTime ? new Date(startTime) : new Date()}
        onChange={setStartTime}
        slotProps={{ textField: { size: "small" } }}
      />
    </Stack>
    <Stack direction="row" gap={1} alignItems="center">
      <DatePicker
        format="dd/MM/yyyy"
        label="End Date"
        onChange={setEndDate}
        sx={{ width: { xs: 1, md: "auto" } }}
        value={endDate}
        slotProps={{ textField: { size: "small" } }}
      />
      <TimePicker
        format="h:mm a"
        label="End Time"
        sx={{ my: 1 / 2 }}
        value={endTime ? new Date(endTime) : new Date()}
        onChange={setEndTime}
        slotProps={{ textField: { size: "small" } }}
      />
    </Stack>
  </Stack>
));

export const LeaderboardFilters = memo(({
  selectedDesk,
  setSelectedDesk,
  startDate,
  startTime,
  setStartTime,
  setStartDate,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  setSettingsOpen,
}) => {
  const settings = useSettings();
  const { desksFilteredByUser: desks } = useGetDesks();

  const { isExpanded, handleFullScreenOpen, handleFullScreenClose } = useFullscreen(settings);

  const handleDeskChange = useCallback((event, value) => {
    if (value) {
      setSelectedDesk(value);
    }
  }, [setSelectedDesk]);

  const selectedDeskValue = useMemo(() => (
    desks?.find((item) => item?.value === selectedDesk?.value) ?? {
      label: "",
      value: "",
    }
  ), [desks, selectedDesk?.value]);

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      px={1}
      width={1}
      sx={{ flexDirection: { xl: "row", xs: "column" } }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4px",
          width: { xl: "auto", xs: 1 },
        }}
      >
        <Autocomplete
          sx={{ width: { xs: "auto", md: 260 }, flexGrow: { xs: 1, xl: 0 } }}
          options={desks ?? []}
          value={selectedDeskValue}
          onChange={handleDeskChange}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <Box key={option.label} value={option.label} {...props}>
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              hiddenLabel
              placeholder="Select a desk"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <Typography variant='subtitle2' color='text.secondary' pb={0.25} px={0.2}> 
                    Desk:
                  </Typography>
                ),
              }}
            />
          )}
        />
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ display: { xl: "none", xs: "block" } }}
        >
          <SettingsButton onClick={() => setSettingsOpen(true)} />
          <FullscreenButton 
            isExpanded={isExpanded} 
            onClick={isExpanded ? handleFullScreenClose : handleFullScreenOpen} 
          />
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="end" gap={1}>
        <DateTimeControls
          startDate={startDate}
          setStartDate={setStartDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endDate={endDate}
          setEndDate={setEndDate}
          endTime={endTime}
          setEndTime={setEndTime}
        />

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ display: { xl: "flex", xs: "none" } }}
        >
          <SettingsButton onClick={() => setSettingsOpen(true)} />
          <FullscreenButton 
            isExpanded={isExpanded} 
            onClick={isExpanded ? handleFullScreenClose : handleFullScreenOpen} 
          />
        </Stack>
      </Stack>
    </Stack>
  );
});
