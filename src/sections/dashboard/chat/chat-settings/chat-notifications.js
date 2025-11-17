import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";

import { Iconify } from 'src/components/iconify';
import { conversationApi } from "src/api/conversation";

export const ChatNotifications = ({
  conversation,
  getConversationList = () => {},
}) => {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    if (conversation) {
      setNotificationEnabled(conversation?.sent_notification);
    }
  }, [conversation]);

  const handleNotificationChange = async (e) => {
    try {
      setNotificationEnabled(e?.target?.checked);
      await conversationApi.updateConversation(conversation?.id, {
        sent_notification: e?.target?.checked,
      });

      toast.success("Notifications status successfully updated!");
      setTimeout(() => {
        getConversationList();
      }, 1000);
    } catch (error) {
      console.error("error: ", error);
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Iconify icon="mage:notification-bell" />
        <Typography variant="subtitle1">Notifications</Typography>
      </Stack>

      <Switch checked={notificationEnabled} onChange={handleNotificationChange} />
    </Stack>
  )
}