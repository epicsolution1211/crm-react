import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import PropTypes from "prop-types";

export const SettingsMiniChatAvailable = (props) => {
  const { enabled, handleEnabledChange, replyTime, handleUpdateReplyTime } = props;

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
          <Typography variant="h6">Share your reply time</Typography>
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
                Reply time is enabled
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
            sx={{ mt: 3 }}
          >
            <RadioGroup value={replyTime} onChange={handleUpdateReplyTime}>
              <FormControlLabel disabled={!enabled} value="1" control={<Radio />} label="In a few minutes" />
              <FormControlLabel disabled={!enabled} value="2" control={<Radio />} label="In a few hours" />
              <FormControlLabel disabled={!enabled} value="3" control={<Radio />} label="Within one working day" />
              <FormControlLabel disabled={!enabled} value="4" control={<Radio />} label="Dynamic reply time. Currently: As soon as possible" />
            </RadioGroup>
          </Stack>
      </Stack>
    </Stack>
  )
};

SettingsMiniChatAvailable.propTypes = {
  enabled: PropTypes.bool,
  handleEnabledChange: PropTypes.func,
}
