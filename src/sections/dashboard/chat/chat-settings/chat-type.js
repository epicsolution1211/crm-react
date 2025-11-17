import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useState } from "react";
import toast from "react-hot-toast";

import { Iconify } from "src/components/iconify";
import { conversationApi } from "src/api/conversation";

export const ChatType = ({
  conversation = {},
  getConversationList = { getConversationList },
  access,
  isClientChat = false,
}) => {
  const [conversationType, setConversationType] = useState(
    conversation?.public
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChatTypeChange = async (e) => {
    const newValue = e?.target?.value;
    const previousValue = conversationType;

    setConversationType(newValue);
    setIsUpdating(true);

    try {
      await conversationApi.updateConversation(conversation?.id, {
        public: newValue,
      });
      await getConversationList();

      toast.success("Conversation type successfully updated!");
    } catch (error) {
      console.error("error: ", error);
      setConversationType(previousValue);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center" spacing={2}>
        <Iconify icon="fluent:chat-lock-20-regular" />
        <Typography variant="subtitle1">Conversation type</Typography>
      </Stack>

      {access && !isClientChat ? (
        <Select
          value={conversationType}
          onChange={(e) => handleChatTypeChange(e)}
          disabled={isUpdating}
        >
          <MenuItem value={false}>Private</MenuItem>
          <MenuItem value={true}>Public</MenuItem>
        </Select>
      ) : (
        <Typography variant="h6">
          {
            { true: "Public", false: "Private" }[
              conversationType ? "true" : "false"
            ]
          }
        </Typography>
      )}
    </Stack>
  );
};
