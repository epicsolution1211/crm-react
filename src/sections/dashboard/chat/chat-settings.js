import { useMemo } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { ChatAdmins } from "./chat-settings/chat-admins";
import { ChatAutoDelete } from "./chat-settings/chat-auto-delete";
import { ChatAvatar } from "./chat-settings/chat-info";
import { ChatDefaultAccess } from "./chat-settings/chat-default-access";
import { ChatMembers } from "./chat-settings/chat-members";
import { ChatName } from "./chat-settings/chat-name";
import { ChatNotifications } from "./chat-settings/chat-notifications";
import { ChatType } from "./chat-settings/chat-type";
import { Iconify } from "src/components/iconify";
import { Scrollbar } from "src/components/scrollbar";
import { useAuth } from "src/hooks/use-auth";

export const ChatSettings = ({
  open,
  onClose,
  conversationId,
  participants = [],
  conversation = {},
  handleOpenInviteDrawer = () => { },
  handleOpenAdminsDrawer = () => { },
  handleOpenAdminAccessDrawer = () => { },
  handleOpenAutoDeleteModal = () => { },
  handleOpenDefaultAccessDrawer = () => { },
  onParticipantsGet = () => { },
  isClientChat = false,
  getConversationList = () => { },
  isDefaultTicket = false,
  ...other
}) => {

  const theme = useTheme();
  const { user } = useAuth();
  const currentMember = useMemo(() => {
    if (user && participants?.length > 0) {
      return participants?.find((p) => p?.account_id === user?.id);
    }
  }, [participants, user]);

  return (
    <Drawer
      disableScrollLock
      anchor="right"
      onClose={onClose}
      open={open}
      ModalProps={{
        BackdropProps: {
          invisible: true,
        },
      }}
      PaperProps={{
        elevation: 24,
        sx: {
          maxWidth: "100%",
          width: 480,
          background: theme.palette.background.default,
        },
      }}
      {...other}
    >
      <Scrollbar
        sx={{
          height: "100%",
          "& .simplebar-content": {
            height: "100%",
          },
          "& .simplebar-scrollbar:before": {
            background: "var(--nav-scrollbar-color)",
          },
        }}
      >
        <Stack sx={{ height: "100%" }}>
          <Box
            sx={{
              background: theme.palette.background.paper,
              borderBottom: `1px solid ${theme.palette.divider}`,
              p: 3,
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Chat Settings
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    background: theme.palette.action.hover,
                  },
                }}
              >
                <Iconify icon="iconamoon:close" width={24} />
              </IconButton>
            </Stack>
          </Box>

          <Stack sx={{ p: 4, flex: 1 }} spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Chat Information
              </Typography>
              
              <Stack spacing={3}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <ChatAvatar
                    conversationId={conversationId}
                    getConversationList={getConversationList}
                    avatar={conversation?.avatar}
                    access={
                      (currentMember?.acc_edit_avatar || currentMember?.owner) ??
                      false
                    }
                  />
                </Box>
                
                <ChatName
                  name={conversation?.name}
                  conversationId={conversationId}
                  getConversationList={getConversationList}
                  access={
                    (currentMember?.acc_edit_name || currentMember?.owner) ??
                    false
                  }
                />
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Chat Settings
              </Typography>
              
              <Stack spacing={3}>
                <ChatType
                  getConversationList={getConversationList}
                  conversation={conversation}
                  isClientChat={isClientChat}
                  access={
                    (currentMember?.acc_edit_public || currentMember?.owner) ??
                    false
                  }
                />
                
                {!isClientChat && (
                  <ChatNotifications conversation={conversation} getConversationList={getConversationList} />
                )}
                
                {currentMember?.acc_edit_delete_duration || currentMember?.owner ? (
                  <ChatAutoDelete
                    conversation={{}}
                    handleOpenAutoDelete={handleOpenAutoDeleteModal}
                  />
                ) : null}
                {!isDefaultTicket && (currentMember?.acc_edit_members_access || currentMember?.owner) ? (
                  <ChatAdmins
                    count={
                      isDefaultTicket && isClientChat 
                        ? participants?.filter((p) => !p?.client_id)?.length 
                        : !isDefaultTicket && isClientChat 
                        ? participants?.filter((p) => p?.acc_edit_members_access || p?.owner)?.length
                        : participants?.filter((p) => p?.acc_edit_members_access || p?.owner)?.length
                    }
                    handleOpenAdminsDrawer={handleOpenAdminsDrawer}
                  />
                ) : null}

                {!isDefaultTicket && (currentMember?.acc_edit_members_access || currentMember?.owner) ? (
                  <ChatDefaultAccess
                    conversation={{}}
                    handleOpenDefaultAccess={handleOpenDefaultAccessDrawer}
                  />
                ) : null}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.shadows[1],
                flex: 1,
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Members
              </Typography>
              
              <ChatMembers
                members={participants}
                handleOpenInviteDrawer={handleOpenInviteDrawer}
                handleOpenAdminAccessDrawer={handleOpenAdminAccessDrawer}
                onParticipantsGet={onParticipantsGet}
                adminAccess={(currentMember?.acc_edit_members_access || currentMember?.owner) ?? false}
                inviteAccess={(currentMember?.acc_add_member || currentMember?.owner) ?? false}
              />
            </Paper>
          </Stack>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};
