import { useState } from "react";

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
import SettingIcon from "src/icons/untitled-ui/duocolor/setting";

const FullscreenButton = () => (
  <Tooltip title="Full Screen">
    <IconButton>
      <Iconify icon="ant-design:expand-outlined"/>
    </IconButton>
  </Tooltip>
);

const SettingsButton = () => (
  <Tooltip title="Leaderboard Setting">
    <IconButton>
      <SvgIcon>
        <SettingIcon />
      </SvgIcon>
    </IconButton>
  </Tooltip>
);

const DateTimeControls = () => (
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
        value={new Date()}
        sx={{ width: { xs: 1, md: "auto" } }}
        slotProps={{ textField: { size: "small" } }}
      />
      <TimePicker
        format="h:mm a"
        label="Start Time"
        value={new Date()}
        sx={{ my: 1 / 2 }}
        slotProps={{ textField: { size: "small" } }}
      />
    </Stack>
    <Stack direction="row" gap={1} alignItems="center">
      <DatePicker
        format="dd/MM/yyyy"
        label="End Date"
        value={new Date()}
        sx={{ width: { xs: 1, md: "auto" } }}
        slotProps={{ textField: { size: "small" } }}
      />
      <TimePicker
        format="h:mm a"
        label="End Time"
        sx={{ my: 1 / 2 }}
        value={new Date()}
        slotProps={{ textField: { size: "small" } }}
      />
    </Stack>
  </Stack>
);

export const LeaderboardFilters = ({ desks = [] }) => {
  const [selectedDesk, setSelectedDesk] = useState(desks[0]);

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
          value={selectedDesk}
          onChange={(event, value) => setSelectedDesk(value)}
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
          <SettingsButton />
          <FullscreenButton />
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="end" gap={1}>
        <DateTimeControls />

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ display: { xl: "flex", xs: "none" } }}
        >
          <SettingsButton />
          <FullscreenButton />
        </Stack>
      </Stack>
    </Stack>
  );
};
