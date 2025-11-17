import { useCallback, useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LoadingButton } from "@mui/lab";
import { paths } from "src/paths";
import { Iconify } from "src/components/iconify";
import { useTimezone } from "src/hooks/use-timezone";

export const EditReminderModal = (props) => {
  const {
    open,
    onClose,
    onUpdateReminder,
    onDeleteReminder,
    reminder = {},
    isLoading = false,
    deleteLoading = false,
  } = props;

  const { toUTCTime, combineDate } = useTimezone();

  const [description, setDescription] = useState(null);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  useEffect(() => {
    if (reminder) {
      setDescription(reminder.description);
      setDate(new Date(reminder?.time?.split(".")[0]));
      setTime(new Date(reminder?.time?.split(".")[0]));
    }
  }, [reminder]);

  const handleUpdate = useCallback(() => {
    const newTime = combineDate(date, time);
    const utcTime = toUTCTime(newTime);
    onUpdateReminder({ time: utcTime, description });

  }, [time, date, description]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Container maxWidth="sm" sx={{ p: 3 }}>
        <Stack direction="column" spacing={3}>
          <Stack py={2} direction="row" justifyContent="center">
            <Typography variant="h5">Update Reminder</Typography>
          </Stack>
          <Stack>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Stack spacing={1}>
                    <Typography variant="h7" px={1}>
                      Date
                    </Typography>
                    <DatePicker
                      format="yyyy-MM-dd"
                      label="Reminder Time"
                      value={date ? new Date(date) : new Date()}
                      onChange={(val) => setDate(val)}
                    />
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Stack spacing={1}>
                    <Typography variant="h7" px={1}>
                      Time
                    </Typography>
                    <TimePicker
                      format="h:mm a"
                      label="Reminder Time"
                      value={time ? new Date(time) : new Date()}
                      onChange={(val) => setTime(val)}
                    />
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack spacing={1}>
                    <Typography variant="h7" px={1}>
                      Description
                    </Typography>
                    <TextField
                      label="Description"
                      value={description}
                      onChange={(event) => setDescription(event?.target?.value)}
                    />
                  </Stack>
                </Grid>
                {reminder?.client_name && (
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Client
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        pl={0.5}
                        sx={{
                          cursor: "pointer",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          backgroundColor: "background.paper",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "action.hover",
                            borderColor: "primary.main",
                            transform: "translateY(-1px)",
                            boxShadow: 1,
                          },
                        }}
                        onClick={() => {
                          const clientUrl = `${paths.dashboard.customers.index}/${reminder?.client_id}`;
                          window.open(clientUrl, "_blank");
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {reminder?.client_name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            flex: 1,
                          }}
                        >
                          {reminder?.client_name}
                        </Typography>
                        <Iconify
                          icon="eva:external-link-fill"
                          width={16}
                          sx={{ color: "text.secondary" }}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                )}
                {reminder?.account_name && (
                  <Grid xs={12}>
                    <Stack spacing={1}>
                      <Typography variant="h7" px={1}>
                        Agent
                      </Typography>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        pl={0.5}
                        sx={{
                          cursor: "pointer",
                          p: 1.5,
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider",
                          backgroundColor: "background.paper",
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            backgroundColor: "action.hover",
                            borderColor: "primary.main",
                            transform: "translateY(-1px)",
                            boxShadow: 1,
                          },
                        }}
                        onClick={() => {
                          const agentUrl = paths.dashboard.members.access.replace(":memberId", reminder?.account_id);
                          window.open(agentUrl, "_blank");
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "secondary.main",
                            color: "secondary.contrastText",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {reminder?.account_name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            flex: 1,
                          }}
                        >
                          {reminder?.account_name}
                        </Typography>
                        <Iconify
                          icon="eva:external-link-fill"
                          width={16}
                          sx={{ color: "text.secondary" }}
                        />
                      </Stack>
                    </Stack>
                  </Grid>
                )}
              </Grid>
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
                  onClick={handleUpdate}
                  loading={isLoading}
                  disabled={!time}
                >
                  Update
                </LoadingButton>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
                <LoadingButton 
                  variant="outlined" 
                  color="error" 
                  onClick={onDeleteReminder} 
                  loading={deleteLoading}
                  disabled={deleteLoading}
                >
                  Delete
                </LoadingButton>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
};
