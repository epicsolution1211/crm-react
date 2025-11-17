import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import PropTypes from "prop-types";

export const SettingsMiniChatTicketPriority = (props) => {
  const { enabled, handleEnabledChange } = props;

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Online clients in Mini Chat have higher priority</Typography>
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
                Ticket priority
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
      </Stack>
    </Stack>
  )
};

SettingsMiniChatTicketPriority.propTypes = {
  enabled: PropTypes.bool,
  handleEnabledChange: PropTypes.func,
}
