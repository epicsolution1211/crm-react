import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { useCallback } from "react";
import { SettingsEmailNotificationTable } from "./settings-email-notification-table";

export const SettingsMiniChatEmailNotification = (props) => {
  const { members, handleUpdateEmailNotification } = props;

  const handleChangeNotificationStatus = useCallback((accountId, e) => {
    handleUpdateEmailNotification({ accountId, ticket_email: e.target.checked });
  }, [handleUpdateEmailNotification]);

  return (
    <Stack spacing={3}>
      <Stack spacing={4} sx={{ p: 2 }}>
        <Typography variant="h6">Receive email of clients request from Mini Chat in case your agents are offline</Typography>
        <SettingsEmailNotificationTable
          count={10}
          items={members}
          page={1}
          rowsPerPage={10}
          handleChangeNotificationStatus={handleChangeNotificationStatus}
        />
      </Stack>
    </Stack>
  )
};

SettingsMiniChatEmailNotification.propTypes = {
  members: PropTypes.array,
  handleUpdateEmailNotification: PropTypes.func,
}
