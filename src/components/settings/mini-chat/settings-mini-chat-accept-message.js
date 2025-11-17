import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import PropTypes from "prop-types";

export const SettingsMiniChatAcceptMessage = (props) => {
  const { enabled, handleEnabledChange, team, teams, handleUpdateTeam } = props;

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Accept new message</Typography>
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
                Chat input status
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
            <Select
              value={team}
              fullWidth
              onChange={handleUpdateTeam}
              disabled={!enabled}
            >
              <MenuItem value="0">
                General
              </MenuItem>
              {
                teams.map(t => (
                  <MenuItem key={t.team.id} value={t.team.id}>
                    {t.team.name}
                  </MenuItem>
                ))
              }
            </Select>
          </Stack>
      </Stack>
    </Stack>
  )
};

SettingsMiniChatAcceptMessage.propTypes = {
  enabled: PropTypes.bool,
  handleEnabledChange: PropTypes.func,
  team: PropTypes.string,
  setTeam: PropTypes.func,
  handleUpdateTeam: PropTypes.func,
}
