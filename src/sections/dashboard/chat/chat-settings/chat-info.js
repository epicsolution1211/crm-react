import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/system";
import { useTheme } from "@mui/material";

import { conversationApi } from "src/api/conversation";
import { getAPIUrl } from "src/config";
import { Iconify } from 'src/components/iconify';

export const ChatAvatar = ({ conversationId, avatar: initAvatar, access, getConversationList = () => {} }) => {
  const theme = useTheme();
  const avatarRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (initAvatar) {
      setAvatarPreview(initAvatar);
    }
  }, [initAvatar]);

  const handleChangeAvatar = useCallback(async (event) => {
    try {
      const file = event?.target?.files[0];
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);

      const request = new FormData();
      request.append("file", file);
      await conversationApi.updateConversation(conversationId, request);
      toast.success("Conversation avatar successfully updated!");
      setTimeout(() => {
        getConversationList();
      }, 1000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update avatar");
      console.error("error: ", error);
    }
  }, [conversationId, getConversationList]);

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={avatarPreview ? avatarPreview?.includes('http') ? avatarPreview : `${getAPIUrl()}/${avatarPreview}` : ""}
          sx={{
            height: 120,
            width: 120,
            boxShadow: theme.shadows[2],
          }}
        >
          <Iconify icon="mage:file-2" width={48} />
        </Avatar>

        {access && (
          <Button
            onClick={() => avatarRef?.current?.click()}
            sx={{
              position: "absolute",
              top: "60px",
              left: "60px",
              transform: "translate(-50%, -50%)",
              background: alpha(theme.palette.common.black, 0.8),
              color: theme.palette.common.white,
              borderRadius: "8px",
              padding: "8px 16px",
              minWidth: "auto",
              opacity: 0,
              transition: "all 0.2s ease",
              border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
              "&:hover": {
                background: alpha(theme.palette.common.black, 0.9),
                opacity: 1,
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              },
            }}
          >
            <input
              ref={avatarRef}
              type="file"
              onChange={handleChangeAvatar}
              accept="image/*"
              hidden
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="famicons:camera-outline" width={24} />
              <Typography
                variant="body2"
                sx={{ 
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Change
              </Typography>
            </Stack>
          </Button>
        )}
      </Box>

      {access && (
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mt: 2,
            color: theme.palette.text.secondary,
            fontWeight: 400,
          }}
        >
          Click to change avatar
        </Typography>
      )}
    </Box>
  );
};
