import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";

export const SettingsMiniChatRating = (props) => {
  const { enabled, handleEnabledChange } = props;

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Ask to rate the conversation</Typography>
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
                Rating status
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
          <Typography sx={{ mt: 3 }}>Whenever agent closes a conversation, system will ask customers for a rating and a few comments on their experience.</Typography>
      </Stack>
    </Stack>
  )
};

SettingsMiniChatRating.propTypes = {
  enabled: PropTypes.bool,
  handleEnabledChange: PropTypes.func,
}
