import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";
import {useCallback} from "react";
import Button from "@mui/material/Button";

export const SettingsMiniChatOfflineNotice = (props) => {
  const { offlineNotice, setOfflineNotice, handleUpdateOfflineNotice, handleEnabledChange, enabled } = props;

  const handleChangeMessage = useCallback((e) => {
    setOfflineNotice(e.target.value);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Show an offline notice for your user</Typography>
          <Stack
            spacing={3}
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 3 }}
          >
            <Stack spacing={1}>
              <Typography
                gutterBottom
                variant="subtitle1"
              >
                Offline notice status
              </Typography>
            </Stack>
            <Switch
              checked={enabled}
              color="primary"
              edge="start"
              name="welcome_message"
              onChange={handleEnabledChange}
              value={enabled}
            />
          </Stack>
          <Stack
            spacing={2}
            alignItems="center"
            direction="row"
          >
            <TextField
              sx={{ mt: 3, width: 300, flexGrow: 1 }}
              label="Write a message"
              multiline
              value={offlineNotice}
              onChange={handleChangeMessage}
              disabled={!enabled}
            />
            <Button
              color="inherit"
              size="small"
              onClick={handleUpdateOfflineNotice}
              disabled={!enabled}
            >
              Save
            </Button>
          </Stack>
      </Stack>
    </Stack>
  )
};

SettingsMiniChatOfflineNotice.propTypes = {
  offlineNotice: PropTypes.string,
  setOfflineNotice: PropTypes.func,
  handleUpdateOfflineNotice: PropTypes.func,
  enabled: PropTypes.bool,
  handleEnabledChange: PropTypes.bool,
}
