import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import {useCallback} from "react";
import Button from "@mui/material/Button";

export const SettingsMiniChatNotice = (props) => {
  const { notice, setNotice, handleUpdateNotice, handleEnabledChange, enabled } = props;

  const handleChangeMessage = useCallback((e) => {
    setNotice(e.target.value);
  }, []);

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Show a special notice in your Mini Chat</Typography>
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
                Notice status
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
              value={notice}
              onChange={handleChangeMessage}
              disabled={!enabled}
            />
            <Button
              color="inherit"
              size="small"
              onClick={handleUpdateNotice}
              disabled={!enabled}
            >
              Save
            </Button>
          </Stack>
      </Stack>
    </Stack>
  )
};

SettingsMiniChatNotice.propTypes = {
  notice: PropTypes.string,
  setNotice: PropTypes.func,
  handleUpdateNotice: PropTypes.func,
  enabled: PropTypes.bool,
  handleEnabledChange: PropTypes.bool,
}
