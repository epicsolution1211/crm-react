import { useState } from "react";
import { toast } from "react-hot-toast";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";  

import { settingsApi } from "src/api/settings";
import { useTimezone } from "src/hooks/use-timezone";

export const ChatReminder = ({ open, onClose, anchorEl, clientId, ticketId }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [description, setDescription] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toUTCTime, combineDate } = useTimezone();

  const handleClose = () => {
    setSubmitted(false);
    setDescription(null);
    setDate(new Date());
    setTime(new Date());
    onClose();
  };

  const handleCreateReminder = async () => {
    setSubmitted(true);
    if (!description) return;
    setIsLoading(true);
    const newTime = combineDate(date, time);
    const utcTime = toUTCTime(newTime);
    try {
      const params = {
        time: utcTime,
        description,
        client_id: clientId,
      };
      if (ticketId) {
        params["ticket_id"] = ticketId;
      }
      await settingsApi.createReminder(params);
      toast.success("Reminder successfully created!");
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      disableScrollLock
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { width: 380 } }}
    >
      <Stack
        direction="column"
        spacing={3}
        sx={{ p: 3 }}>
        <Stack py={2}
          direction="row"
          justifyContent="center">
          <Typography variant="h6">Create Reminder</Typography>
        </Stack>
        <Stack>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography
                variant="h7"
                px={1}>
                Date
              </Typography>
              <DatePicker
                format="yyyy-MM-dd"
                label="Reminder Time"
                value={date ? new Date(date) : new Date()}
                onChange={(val) => setDate(val)}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography
                variant="h7"
                px={1}>
                Time
              </Typography>
              <TimePicker
                format="h:mm a"
                label="Reminder Time"
                value={time ? new Date(time) : new Date()}
                onChange={(val) => setTime(val)}
              />
            </Stack>
            <Stack spacing={1}>
              <Typography
                variant="h7"
                px={1}>
                Description
              </Typography>
              <TextField
                label="Description"
                value={description}
                onChange={(event) => setDescription(event?.target?.value)}
                required
                error={submitted && !description}
                helperText={submitted && !description ? 'Description is required' : ''}
              />
            </Stack>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 2,
                px: 3,
              }}
              gap={3}
            >
              <LoadingButton
                variant="contained"
                onClick={handleCreateReminder}
                loading={isLoading}
                disabled={isLoading}
              >
                Create
              </LoadingButton>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={handleClose}>
                Cancel
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Popover>
  );
};
