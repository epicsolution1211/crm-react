import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Stack from "@mui/material/Stack";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";
import Box from "@mui/material/Box";
import { Iconify } from "src/components/iconify";
import { usePopover } from "src/hooks/use-popover";
import { useTimezone } from "src/hooks/use-timezone";

export const FilterDateTime = ({
  label,
  isRange = false,
  setFilter = () => {},
  setFilter2 = () => {},
  subLabel1,
  subLabel2,
  labelFontSize = 14,
}) => {
  const popover = usePopover();
  const { toUTCTime } = useTimezone();

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [date2, setDate2] = useState(null);
  const [time2, setTime2] = useState(null);

  useEffect(() => {
    const date = new Date();
    const endDate = new Date();
    date.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    setDate(date);
    setTime(date);
    setDate2(endDate);
    setTime2(endDate);
  }, []);

  return (
    <>
      <Button
        color="inherit"
        endIcon={<Iconify icon="icon-park-outline:down" width={20} />}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{ px: 0, py: 0 }}
      >
        <Typography fontSize={labelFontSize} fontWeight="600" noWrap>
          {label ? label?.toUpperCase() : ""}
        </Typography>
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ 
          style: { width: 300 },
          sx: { 
            backgroundColor: 'background.paper',
            borderRadius: 1,
          }
        }}
      >
        <Box 
          sx={{ 
            p: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              color: 'text.secondary',
              mb: 1.5,
              px: 0.5
            }}
          >
            Presets
          </Typography>
          <Box
            sx={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  color: 'primary.light',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)'
                },
                py: 1,
              }}
              onClick={() => {
                const start = startOfDay(new Date());
                const end = endOfDay(new Date());
                setDate(start);
                setTime(start);
                setDate2(end);
                setTime2(end);
                
                const startResult = `${format(start, "yyyy-MM-dd")} ${format(start, "HH:mm")}`;
                const endResult = `${format(end, "yyyy-MM-dd")} ${format(end, "HH:mm")}`;
                setFilter(toUTCTime(startResult));
                if (setFilter2) setFilter2(toUTCTime(endResult));
                popover.handleClose();
              }}
            >
              Today
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  color: 'primary.light',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)'
                },
                py: 1,
              }}
              onClick={() => {
                const yesterday = subDays(new Date(), 1);
                const start = startOfDay(yesterday);
                const end = endOfDay(yesterday);
                setDate(start);
                setTime(start);
                setDate2(end);
                setTime2(end);
                
                const startResult = `${format(start, "yyyy-MM-dd")} ${format(start, "HH:mm")}`;
                const endResult = `${format(end, "yyyy-MM-dd")} ${format(end, "HH:mm")}`;
                setFilter(toUTCTime(startResult));
                if (setFilter2) setFilter2(endResult);
                popover.handleClose();
              }}
            >
              Yesterday
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  color: 'primary.light',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)'
                },
                py: 1,
              }}
              onClick={() => {
                const start = startOfWeek(new Date(), { weekStartsOn: 1 });
                const end = endOfWeek(new Date(), { weekStartsOn: 1 });
                setDate(start);
                setTime(start);
                setDate2(end);
                setTime2(end);
                
                const startResult = `${format(start, "yyyy-MM-dd")} ${format(start, "HH:mm")}`;
                const endResult = `${format(end, "yyyy-MM-dd")} ${format(end, "HH:mm")}`;
                setFilter(toUTCTime(startResult));
                if (setFilter2) setFilter2(toUTCTime(endResult));
                popover.handleClose();
              }}
            >
              Current Week
            </Button>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  color: 'primary.light',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)'
                },
                py: 1,
              }}
              onClick={() => {
                const start = startOfMonth(new Date());
                const end = endOfMonth(new Date());
                setDate(start);
                setTime(start);
                setDate2(end);
                setTime2(end);
                
                const startResult = `${format(start, "yyyy-MM-dd")} ${format(start, "HH:mm")}`;
                const endResult = `${format(end, "yyyy-MM-dd")} ${format(end, "HH:mm")}`;
                setFilter(toUTCTime(startResult));
                if (setFilter2) setFilter2(toUTCTime(endResult));
                popover.handleClose();
              }}
            >
              Current Month
            </Button>
          </Box>
        </Box>
        <Stack spacing={1}></Stack>
        <Stack sx={{ px: 2, py: 1 }} direction="row">
          <Stack gap={1}>
            <DatePicker
              format="yyyy-MM-dd"
              label={
                subLabel1
                  ? subLabel1
                    ? `${subLabel1} Date`
                    : ""
                  : `${label} Date`
              }
              value={date ? new Date(date) : new Date()}
              onChange={(val) => setDate(val)}
            />
            <TimePicker
              format="h:mm a"
              label={
                subLabel1
                  ? subLabel1
                    ? `${subLabel1} Time`
                    : ""
                  : `${label} Time`
              }
              value={time ? new Date(time) : new Date()}
              onChange={(val) => setTime(val)}
            />
          </Stack>
          <Stack
            direction={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={2}
          >
            <IconButton
              sx={{ ml: 1 }}
              color="primary"
              onClick={() => {
                const result = `${format(date, "yyyy-MM-dd")} ${format(
                  time,
                  "HH:mm"
                )}`;
                setFilter(toUTCTime(result));
              }}
            >
              <CheckIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        {isRange ? (
          <Stack sx={{ px: 2, py: 1 }} direction="row">
            <Stack gap={1}>
              <DatePicker
                format="yyyy-MM-dd"
                label={subLabel2 ? `${subLabel2} Date` : ""}
                value={date2 ? new Date(date2) : new Date()}
                onChange={(val) => setDate2(val)}
              />
              <TimePicker
                format="h:mm a"
                label={subLabel2 ? `${subLabel2} Time` : ""}
                value={time2 ? new Date(time2) : new Date()}
                onChange={(val) => setTime2(val)}
              />
            </Stack>
            <Stack
              direction={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={2}
            >
              <IconButton
                sx={{ ml: 1 }}
                color="primary"
                onClick={() => {
                  const result = `${format(date2, "yyyy-MM-dd")} ${format(
                    time2,
                    "HH:mm"
                  )}`;
                  setFilter2(toUTCTime(result));
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        ) : null}
      </Menu>
    </>
  );
};
