import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import {useCallback} from "react";
import Button from "@mui/material/Button";

export const SettingsMiniChatWelcome = (props) => {
  const { message, setMessage, handleUpdateMessage, handleEnabledChange, enabled } = props;

  const handleChangeMessage = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
          <Typography variant="h6">Set your welcome message</Typography>
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
                Welcome message status
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
              value={message}
              onChange={handleChangeMessage}
              disabled={!enabled}
            />
            <Button
              color="inherit"
              size="small"
              onClick={handleUpdateMessage}
              disabled={!enabled}
            >
              Save
            </Button>
          </Stack>
      </Stack>
    </Stack>
  )
};

SettingsMiniChatWelcome.propTypes = {
  message: PropTypes.string,
  setMessage: PropTypes.func,
  handleUpdateMessage: PropTypes.func,
}
